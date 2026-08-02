const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

const orders = [
  {
    id: "pay-1",
    userId: "mock-candidate",
    scheduleId: "schedule-civil-service-2024",
    amount: "20000",
    currencyCode: "MNT",
    status: "PAID",
    provider: "Хаан банк",
    providerRef: "mock-khan-20240520",
    paidAt: new Date("2024-05-20T14:30:00.000Z"),
    metadata: {
      assessment: "Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ",
    },
  },
  {
    id: "pay-2",
    userId: "mock-candidate",
    scheduleId: "schedule-national-competency-2024",
    amount: "20000",
    currencyCode: "MNT",
    status: "PAID",
    provider: "Голомт банк",
    providerRef: "mock-golomt-20240410",
    paidAt: new Date("2024-04-10T09:15:00.000Z"),
    metadata: {
      assessment: "Орон даяарх сурагчдын чадамжийн үнэлгээ",
    },
  },
  {
    id: "pay-3",
    userId: "mock-candidate",
    scheduleId: "schedule-teacher-standard",
    amount: "20000",
    currencyCode: "MNT",
    status: "PENDING",
    provider: null,
    providerRef: null,
    paidAt: null,
    metadata: {
      assessment: "Багшийн хөгжлийн зэрэг тогтоох үнэлгээ",
    },
  },
];

async function main() {
  for (const order of orders) {
    await prisma.paymentOrder.upsert({
      where: { id: order.id },
      update: order,
      create: order,
    });

    await prisma.paymentTransaction.upsert({
      where: { id: `${order.id}-txn-1` },
      update: {
        provider: order.provider || "manual",
        providerRef: order.providerRef,
        type: order.status === "PAID" ? "PAYMENT" : "AUTHORIZATION",
        status: order.status,
        amount: order.amount,
        payload: order.metadata,
      },
      create: {
        id: `${order.id}-txn-1`,
        orderId: order.id,
        provider: order.provider || "manual",
        providerRef: order.providerRef,
        type: order.status === "PAID" ? "PAYMENT" : "AUTHORIZATION",
        status: order.status,
        amount: order.amount,
        payload: order.metadata,
      },
    });
  }

  console.log("Commerce mock seed completed.");
}

main()
  .catch((error) => {
    console.error("Commerce seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
