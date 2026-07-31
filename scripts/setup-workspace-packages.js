const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

// 1. Get all package directories
const getWorkspacePackages = () => {
  const packages = [];
  const folders = ["apps", "services", "packages"];

  folders.forEach((folder) => {
    const folderPath = path.join(rootDir, folder);
    if (!fs.existsSync(folderPath)) return;

    const subfolders = fs.readdirSync(folderPath);
    subfolders.forEach((sub) => {
      const subPath = path.join(folderPath, sub);
      if (fs.statSync(subPath).isDirectory()) {
        const pkgJsonPath = path.join(subPath, "package.json");
        if (fs.existsSync(pkgJsonPath)) {
          packages.push({
            name: sub,
            type: folder, // 'apps', 'services', 'packages'
            dir: subPath,
            pkgJsonPath,
          });
        }
      }
    });
  });

  return packages;
};

const main = () => {
  const pkgs = getWorkspacePackages();
  console.log(`Found ${pkgs.length} workspace packages.`);

  pkgs.forEach((pkg) => {
    console.log(`Processing [${pkg.type}] ${pkg.name}...`);

    // --- Update package.json scripts ---
    const pkgJson = JSON.parse(fs.readFileSync(pkg.pkgJsonPath, "utf8"));

    // Initialize scripts if not exists
    pkgJson.scripts = pkgJson.scripts || {};

    if (pkg.type === "apps") {
      pkgJson.scripts.build = "next build";
      pkgJson.scripts.lint = "eslint . --max-warnings=0";
      pkgJson.scripts["lint:fix"] = "eslint . --fix";
      pkgJson.scripts.typecheck = "tsc --noEmit";
      pkgJson.scripts.test = "jest --passWithNoTests";
      pkgJson.scripts.clean = "rm -rf .next dist node_modules";
    } else if (pkg.type === "services") {
      pkgJson.scripts.build = "nest build";
      pkgJson.scripts.lint = 'eslint "src/**/*.ts" --max-warnings=0';
      pkgJson.scripts["lint:fix"] = 'eslint "src/**/*.ts" --fix';
      pkgJson.scripts.typecheck = "tsc --noEmit";
      pkgJson.scripts.test = "jest --passWithNoTests";
      pkgJson.scripts.clean = "rm -rf dist node_modules";
    } else if (pkg.type === "packages") {
      pkgJson.scripts.build = "tsc";
      pkgJson.scripts.lint = "eslint src --max-warnings=0";
      pkgJson.scripts["lint:fix"] = "eslint src --fix";
      pkgJson.scripts.typecheck = "tsc --noEmit";
      pkgJson.scripts.test = "jest --passWithNoTests";
      pkgJson.scripts.clean = "rm -rf dist node_modules";
    }

    fs.writeFileSync(
      pkg.pkgJsonPath,
      JSON.stringify(pkgJson, null, 2) + "\n",
      "utf8",
    );

    // --- Update tsconfig.json extends ---
    const tsconfigPath = path.join(pkg.dir, "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      let tsconfig = {};
      try {
        tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
      } catch (err) {
        // Simple regex fallback if there are comments in tsconfig
        let content = fs.readFileSync(tsconfigPath, "utf8");
        // strip comments
        content = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1");
        tsconfig = JSON.parse(content);
      }

      tsconfig.extends = "../../tsconfig.base.json";

      if (pkg.type === "services") {
        tsconfig.compilerOptions = tsconfig.compilerOptions || {};
        tsconfig.compilerOptions.declaration = false;
        tsconfig.compilerOptions.declarationMap = false;
      }

      // For NestJS services we keep their target/module configuration if they require it
      // For Next.js we keep allowJs, noEmit, jsx, etc.
      // We write it clean
      fs.writeFileSync(
        tsconfigPath,
        JSON.stringify(tsconfig, null, 2) + "\n",
        "utf8",
      );
    }

    // --- Create .dockerignore for services ---
    if (pkg.type === "services") {
      const dockerignorePath = path.join(pkg.dir, ".dockerignore");
      const dockerignoreContent = `node_modules
dist
.turbo
Dockerfile
docker-compose*
npm-debug.log
`;
      fs.writeFileSync(dockerignorePath, dockerignoreContent, "utf8");

      // --- Create jest.config.js for services ---
      const jestConfigPath = path.join(pkg.dir, "jest.config.js");
      const jestConfigContent = `const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts', '<rootDir>/src/**/*.spec.ts'],
};
`;
      fs.writeFileSync(jestConfigPath, jestConfigContent, "utf8");

      // --- Create / Update src/app.controller.ts for NestJS services ---
      const srcDir = path.join(pkg.dir, "src");
      if (fs.existsSync(srcDir)) {
        const controllerPath = path.join(srcDir, "app.controller.ts");
        const controllerContent = `import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "${pkg.name}",
    };
  }

  @Get("health/live")
  getLive() {
    return { status: "UP" };
  }

  @Get("health/ready")
  getReady() {
    return { status: "READY" };
  }
}
`;
        fs.writeFileSync(controllerPath, controllerContent, "utf8");
      }

      // --- Create / Update tests/app.spec.ts for NestJS services ---
      const testsDir = path.join(pkg.dir, "tests");
      if (!fs.existsSync(testsDir)) {
        fs.mkdirSync(testsDir);
      }
      const specPath = path.join(testsDir, "app.spec.ts");
      const specContent = `import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health checks', () => {
    it('should return health status', () => {
      const res = appController.getHealth();
      expect(res.status).toBe('OK');
      expect(res.service).toBe('${pkg.name}');
    });

    it('should return live status', () => {
      const res = appController.getLive();
      expect(res.status).toBe('UP');
    });

    it('should return ready status', () => {
      const res = appController.getReady();
      expect(res.status).toBe('READY');
    });
  });
});
`;
      fs.writeFileSync(specPath, specContent, "utf8");
    }

    // --- Create jest.config.js for Next.js apps ---
    if (pkg.type === "apps") {
      const jestConfigPath = path.join(pkg.dir, "jest.config.js");
      const jestConfigContent = `const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  passWithNoTests: true,
};

module.exports = createJestConfig(customJestConfig);
`;
      fs.writeFileSync(jestConfigPath, jestConfigContent, "utf8");
    }
  });

  console.log("Successfully completed workspace packages setup.");
};

main();
