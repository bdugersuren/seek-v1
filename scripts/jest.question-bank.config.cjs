module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['/dist/'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/apps/portal-web/src/$1' },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: {
      target: 'ES2022', module: 'commonjs', jsx: 'react-jsx',
      esModuleInterop: true, experimentalDecorators: true, emitDecoratorMetadata: true,
      baseUrl: '.', paths: {'@/*': ['apps/portal-web/src/*']}, skipLibCheck: true,
    }}],
  },
  testMatch: [
    '<rootDir>/tests/question-bank-mapping.spec.ts',
    '<rootDir>/services/assessment/src/question-workflow.spec.ts',
    '<rootDir>/services/execution/src/grading.service.spec.ts',
    '<rootDir>/services/execution/src/attempt-owner.guard.spec.ts',
    '<rootDir>/services/execution/tests/**/*.spec.ts',
    '<rootDir>/services/gateway/src/**/*.spec.ts',
  ],
};
