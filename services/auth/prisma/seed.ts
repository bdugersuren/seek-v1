import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL ERROR: Seeding is disabled in production mode!");
    process.exit(1);
  }

  const rounds = parseInt(process.env.AUTH_PASSWORD_HASH_ROUNDS || "10", 10);

  const developerAccounts = [
    {
      email: process.env.AUTH_TEST_EMAIL || "tester@seek.local",
      password: process.env.AUTH_TEST_PASSWORD || "TestPassword123!",
    },
    {
      email: process.env.AUTH_SUPERADMIN_EMAIL || "superadmin@lms.local",
      password:
        process.env.AUTH_SUPERADMIN_PASSWORD ||
        process.env.AUTH_TEST_PASSWORD ||
        "TestPassword123!",
    },
  ];

  const uniqueAccounts = new Map(
    developerAccounts.map(({ email, password }) => [
      email.trim().toLowerCase(),
      password,
    ]),
  );

  for (const [email, rawPassword] of uniqueAccounts) {
    const hashedPassword = await bcrypt.hash(rawPassword, rounds);

    console.log(`Seeding developer account: ${email}...`);

    const user = await prisma.userAccount.upsert({
      where: { email },
      update: { status: "ACTIVE" },
      create: {
        email,
        status: "ACTIVE",
      },
    });

    const existingCredential = await prisma.credential.findFirst({
      where: {
        userAccountId: user.id,
        type: "PASSWORD",
      },
    });

    if (existingCredential) {
      await prisma.credential.update({
        where: { id: existingCredential.id },
        data: { value: hashedPassword },
      });
    } else {
      await prisma.credential.create({
        data: {
          userAccountId: user.id,
          type: "PASSWORD",
          value: hashedPassword,
        },
      });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
