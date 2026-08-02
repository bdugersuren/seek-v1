const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

const files = [
  {
    id: "doc-1",
    ownerUserId: "user-battuya",
    bucket: "seek-files",
    storageKey: "profiles/user-battuya/identity.pdf",
    fileName: "Иргэний үнэмлэх.pdf",
    mimeType: "application/pdf",
    status: "PENDING_REVIEW",
    metadata: {
      type: "Identity",
      uploadedAt: "2024-05-01",
      expiryDate: "2030-05-01",
      visibility: "reviewer",
    },
  },
  {
    id: "doc-2",
    ownerUserId: "user-battuya",
    bucket: "seek-files",
    storageKey: "profiles/user-battuya/diploma.pdf",
    fileName: "Диплом.pdf",
    mimeType: "application/pdf",
    status: "AVAILABLE",
    metadata: {
      type: "Education",
      uploadedAt: "2024-04-21",
      expiryDate: "Хугацаагүй",
      visibility: "private",
    },
  },
  {
    id: "doc-3",
    ownerUserId: "user-battuya",
    bucket: "seek-files",
    storageKey: "profiles/user-battuya/employment.docx",
    fileName: "Ажлын тодорхойлолт.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    status: "VERIFIED",
    metadata: {
      type: "Employment",
      uploadedAt: "2024-05-12",
      expiryDate: "2025-05-12",
      visibility: "organisation",
    },
  },
  {
    id: "media-risk-matrix",
    ownerUserId: "mock-assessor",
    bucket: "seek-files",
    storageKey: "question-bank/risk-matrix.xlsx",
    fileName: "risk-matrix.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    status: "AVAILABLE",
    metadata: { questionCode: "DG-12" },
  },
  {
    id: "media-case-brief",
    ownerUserId: "mock-assessor",
    bucket: "seek-files",
    storageKey: "question-bank/case-brief.mp4",
    fileName: "case-brief.mp4",
    mimeType: "video/mp4",
    status: "AVAILABLE",
    metadata: { questionCode: "CB-09" },
  },
];

async function main() {
  for (const file of files) {
    await prisma.storedFile.upsert({
      where: { id: file.id },
      update: file,
      create: file,
    });
  }

  console.log("File mock seed completed.");
}

main()
  .catch((error) => {
    console.error("File seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
