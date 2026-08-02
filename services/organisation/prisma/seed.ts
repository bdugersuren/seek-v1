const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

async function upsertOrganisation(data: {
  id: string;
  code: string;
  name: string;
  type: string;
  parentId?: string;
  regionId?: string;
  districtId?: string;
}) {
  return prisma.organisation.upsert({
    where: { code: data.code },
    update: data,
    create: data,
  });
}

async function main() {
  await upsertOrganisation({
    id: "org-seek-platform",
    code: "SEEK",
    name: "seek.mn Platform",
    type: "PLATFORM",
  });
  await upsertOrganisation({
    id: "org-demo",
    code: "DEMO",
    name: "Demo Organisation",
    type: "COMPANY",
    regionId: "ulaanbaatar",
    districtId: "sukhbaatar",
  });
  await upsertOrganisation({
    id: "org-education-innovation",
    code: "EDU-INNOVATION",
    name: "Боловсрол Инноваци ХХК",
    type: "COMPANY",
    regionId: "ulaanbaatar",
    districtId: "sukhbaatar",
  });
  await upsertOrganisation({
    id: "org-shine-mongol",
    code: "SHINE-MONGOL",
    name: "Шинэ Монгол сургууль",
    type: "SCHOOL",
    regionId: "ulaanbaatar",
    districtId: "bayanzurkh",
  });
  await upsertOrganisation({
    id: "org-ireedui-college",
    code: "IREEDUI",
    name: "Ирээдүй коллеж",
    type: "COLLEGE",
    regionId: "ulaanbaatar",
  });
  await upsertOrganisation({
    id: "org-education-teshvin",
    code: "EDU-TESHVIN",
    name: "Боловсрол тешвин ТББ",
    type: "NGO",
  });

  await prisma.organisationUnit.upsert({
    where: {
      organisationId_code: {
        organisationId: "org-education-innovation",
        code: "TRAINING",
      },
    },
    update: { name: "Сургалтын хэлтэс", type: "DEPARTMENT" },
    create: {
      organisationId: "org-education-innovation",
      code: "TRAINING",
      name: "Сургалтын хэлтэс",
      type: "DEPARTMENT",
    },
  });

  await prisma.organisationUnit.upsert({
    where: {
      organisationId_code: {
        organisationId: "org-shine-mongol",
        code: "MATH",
      },
    },
    update: { name: "Математикийн тэнхим", type: "DEPARTMENT" },
    create: {
      organisationId: "org-shine-mongol",
      code: "MATH",
      name: "Математикийн тэнхим",
      type: "DEPARTMENT",
    },
  });

  console.log("Organisation mock seed completed.");
}

main()
  .catch((error) => {
    console.error("Organisation seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
