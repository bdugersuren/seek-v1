const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

async function main() {
  await prisma.notificationTemplate.upsert({
    where: { code: "ASSESSMENT_INVITE" },
    update: {
      channel: "IN_APP",
      subject: "Шинэ зорилтот үнэлгээнд уригдлаа",
      body: "Танд шинэ зорилтот үнэлгээ оноогдлоо.",
      isActive: true,
    },
    create: {
      code: "ASSESSMENT_INVITE",
      channel: "IN_APP",
      subject: "Шинэ зорилтот үнэлгээнд уригдлаа",
      body: "Танд шинэ зорилтот үнэлгээ оноогдлоо.",
      isActive: true,
    },
  });

  await prisma.notificationTemplate.upsert({
    where: { code: "CERTIFICATE_READY" },
    update: {
      channel: "IN_APP",
      subject: "Сертификат бэлэн боллоо",
      body: "Таны сертификат татахад бэлэн боллоо.",
      isActive: true,
    },
    create: {
      code: "CERTIFICATE_READY",
      channel: "IN_APP",
      subject: "Сертификат бэлэн боллоо",
      body: "Таны сертификат татахад бэлэн боллоо.",
      isActive: true,
    },
  });

  await prisma.notificationDelivery.upsert({
    where: { id: "notif-1" },
    update: {
      recipientUserId: "mock-candidate",
      channel: "IN_APP",
      templateCode: "ASSESSMENT_INVITE",
      status: "UNREAD",
      payload: {
        title: "Шинэ зорилтот үнэлгээнд уригдлаа",
        body: "Төрийн албан хаагчийн дотоод үнэлгээ - 2024",
        time: "10 минутын өмнө",
      },
    },
    create: {
      id: "notif-1",
      recipientUserId: "mock-candidate",
      channel: "IN_APP",
      templateCode: "ASSESSMENT_INVITE",
      status: "UNREAD",
      payload: {
        title: "Шинэ зорилтот үнэлгээнд уригдлаа",
        body: "Төрийн албан хаагчийн дотоод үнэлгээ - 2024",
        time: "10 минутын өмнө",
      },
    },
  });

  await prisma.notificationDelivery.upsert({
    where: { id: "notif-2" },
    update: {
      recipientUserId: "mock-candidate",
      channel: "IN_APP",
      templateCode: "CERTIFICATE_READY",
      status: "READ",
      readAt: new Date("2024-05-21T00:00:00.000Z"),
      payload: {
        title: "Сертификат бэлэн боллоо",
        body: "Орон даяарх сурагчдын чадамжийн үнэлгээ",
        time: "Өчигдөр",
      },
    },
    create: {
      id: "notif-2",
      recipientUserId: "mock-candidate",
      channel: "IN_APP",
      templateCode: "CERTIFICATE_READY",
      status: "READ",
      readAt: new Date("2024-05-21T00:00:00.000Z"),
      payload: {
        title: "Сертификат бэлэн боллоо",
        body: "Орон даяарх сурагчдын чадамжийн үнэлгээ",
        time: "Өчигдөр",
      },
    },
  });

  console.log("Notification mock seed completed.");
}

main()
  .catch((error) => {
    console.error("Notification seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
