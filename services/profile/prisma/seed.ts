const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.userProfile.upsert({
    where: { userId: "user-battuya" },
    update: {
      displayName: "Баттуяа Мөнхцэцэг",
      birthDate: new Date("1990-05-15T00:00:00.000Z"),
      metadata: {
        registryNumber: "U-2024-001245",
        email: "m.battuya@example.com",
        phone: "9922-1234",
        nationalId: "УБ90051532",
        gender: "Эмэгтэй",
        citizenship: "Монгол",
        country: "Монгол",
        education: "Магистр",
        profession: "Боловсрол судлаач",
        workArea: "Багш, Сургалтын менежмент",
        preferredRole: "Candidate, Assessor",
        verificationLevel: 45,
      },
    },
    create: {
      userId: "user-battuya",
      displayName: "Баттуяа Мөнхцэцэг",
      birthDate: new Date("1990-05-15T00:00:00.000Z"),
      metadata: {
        registryNumber: "U-2024-001245",
        email: "m.battuya@example.com",
        phone: "9922-1234",
        nationalId: "УБ90051532",
        gender: "Эмэгтэй",
        citizenship: "Монгол",
        country: "Монгол",
        education: "Магистр",
        profession: "Боловсрол судлаач",
        workArea: "Багш, Сургалтын менежмент",
        preferredRole: "Candidate, Assessor",
        verificationLevel: 45,
      },
    },
  });

  await prisma.profileLocation.deleteMany({ where: { profileId: profile.id } });
  await prisma.educationRecord.deleteMany({ where: { profileId: profile.id } });
  await prisma.workRecord.deleteMany({ where: { profileId: profile.id } });

  await prisma.profileLocation.create({
    data: {
      profileId: profile.id,
      regionId: "ulaanbaatar",
      districtId: "sukhbaatar",
      address: "Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо",
      isPrimary: true,
    },
  });

  await prisma.educationRecord.create({
    data: {
      profileId: profile.id,
      organizationId: "org-ireedui-college",
      schoolId: "org-ireedui-college",
      level: "Магистр",
      metadata: { document: "Диплом.pdf", status: "not_requested" },
    },
  });

  await prisma.workRecord.createMany({
    data: [
      {
        profileId: profile.id,
        organizationId: "org-education-innovation",
        positionTitle: "Сургалтын менежер",
        startedAt: new Date("2023-06-01T00:00:00.000Z"),
        metadata: { status: "active" },
      },
      {
        profileId: profile.id,
        organizationId: "org-shine-mongol",
        positionTitle: "Багш",
        startedAt: new Date("2018-09-01T00:00:00.000Z"),
        endedAt: new Date("2023-05-31T00:00:00.000Z"),
        metadata: { status: "expired" },
      },
      {
        profileId: profile.id,
        organizationId: "org-education-teshvin",
        positionTitle: "Сургалтын зохицуулагч",
        startedAt: new Date("2016-03-10T00:00:00.000Z"),
        endedAt: new Date("2018-08-31T00:00:00.000Z"),
        metadata: { status: "expired" },
      },
    ],
  });

  console.log("Profile mock seed completed.");
}

main()
  .catch((error) => {
    console.error("Profile seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
