const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL ERROR: Seeding is disabled in production mode!");
    process.exit(1);
  }

  const rounds = parseInt(process.env.AUTH_PASSWORD_HASH_ROUNDS || "10", 10);

  // 1. Дүрүүдийг үүсгэх
  const roles = [
    { name: "SUPER_ADMIN", description: "Technical Super Administrator" },
    { name: "ORGANIZATION_ADMIN", description: "Тухайн байгууллагын админ эрхтэй хэрэглэгч" },
    { name: "ASSESSOR", description: "Тест даалгавар боловсруулах үүрэгтэй " },
    { name: "VIEWER", description: "Тухайн байгууллагын хүний нөөц буюу бүртгэл хариуцсан ажилтай" },
    { name: "TESTER", description: "Хэвийн ажиллагааг шалгах үүрэгтэй" },
    { name: "CANDIDATE", description: "Үнэлүүлэгч " },
  ];

  console.log("Seeding system roles...");
  const roleDbMap = new Map();
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    roleDbMap.set(r.name, role.id);
  }

  // 2. Хэрэглэгчдийг тодорхойлох
  const developerAccounts = [
    {
      email: process.env.AUTH_TEST_EMAIL || "tester@seek.local",
      password: process.env.AUTH_TEST_PASSWORD || "TestPassword123!",
      phoneNumber: "99112233",
      assignedRoles: ["TESTER"],
    },
    {
      email: process.env.AUTH_SUPERADMIN_EMAIL || "superadmin@lms.local",
      password:
        process.env.AUTH_SUPERADMIN_PASSWORD ||
        process.env.AUTH_TEST_PASSWORD ||
        "TestPassword123!",
      phoneNumber: "88112233",
      assignedRoles: ["SUPER_ADMIN"],
    },
  ];

  const uniqueAccounts = new Map(
    developerAccounts.map((acc) => [
      acc.email.trim().toLowerCase(),
      acc,
    ]),
  );

  for (const [email, acc] of uniqueAccounts) {
    const hashedPassword = await bcrypt.hash(acc.password, rounds);

    console.log(`Seeding developer account: ${email}...`);

    const user = await prisma.userAccount.upsert({
      where: { email },
      update: { 
        status: "ACTIVE",
        phoneNumber: acc.phoneNumber,
        isPhoneVerified: true
      },
      create: {
        email,
        phoneNumber: acc.phoneNumber,
        isPhoneVerified: true,
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

    // Дүрүүдийг хэрэглэгчид оноох
    console.log(`Assigning roles to ${email}...`);
    for (const roleName of acc.assignedRoles) {
      const roleId = roleDbMap.get(roleName);
      if (roleId) {
        await prisma.userRole.upsert({
          where: {
            userAccountId_roleId: {
              userAccountId: user.id,
              roleId: roleId,
            },
          },
          update: {},
          create: {
            userAccountId: user.id,
            roleId: roleId,
          },
        });
      }
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
export {};
