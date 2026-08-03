"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  PageContainer,
  Text,
  useDialog,
  useToast,
  Input,
} from "@seek/ui";
import {
  getCandidateProfile,
  updateCandidateProfile,
  getVerifications,
  submitVerification,
  getDocuments,
  addDocument,
  deleteDocument,
} from "@/features/profile/api";
import type {
  CandidateProfileResponse,
  ProfileVerificationResponse,
  ProfileDocumentResponse,
} from "@seek/contracts";

type ProfileTab =
  | "personal"
  | "verification"
  | "documents";

const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "personal", label: "Хувийн мэдээлэл" },
  { id: "verification", label: "Баталгаажуулалт" },
  { id: "documents", label: "Бичиг баримт" },
];

const statusLabels: Record<string, string> = {
  VERIFIED: "Баталгаажсан",
  SUBMITTED: "Хүсэлт илгээсэн",
  NOT_STARTED: "Хүсэлт өгөөгүй",
  REJECTED: "Татгалзсан",
  EXPIRED: "Хугацаа дууссан",
  IN_PROGRESS: "Хянагдаж байна",
};

const statusVariant: Record<
  string,
  "success" | "warning" | "secondary" | "danger"
> = {
  VERIFIED: "success",
  SUBMITTED: "warning",
  NOT_STARTED: "secondary",
  REJECTED: "danger",
  EXPIRED: "secondary",
  IN_PROGRESS: "warning",
};

const verificationTypes = [
  { id: "IDENTITY", title: "Хувийн мэдээлэл", description: "Иргэний үнэмлэх, төрсөн он сар өдөр зэрэг" },
  { id: "EMPLOYMENT", title: "Албан тушаал", description: "Одоогийн албан тушаалаа баталгаажуулах" },
  { id: "ORGANISATION", title: "Байгууллагын харьяалал", description: "Ажиллаж буй байгууллагаа баталгаажуулах" },
  { id: "EDUCATION", title: "Боловсролын зэрэг", description: "Диплом, зэрэг, сургуулийг баталгаажуулах" },
  { id: "ASSESSOR", title: "Мэргэжлийн үнэлгээ", description: "Мэргэжлийн үнэлэгчээр баталгаажуулах" },
];

export default function ProfilePage() {
  const { showDialog } = useDialog();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [profile, setProfile] = useState<CandidateProfileResponse | null>(null);
  const [verifications, setVerifications] = useState<ProfileVerificationResponse[]>([]);
  const [documents, setDocuments] = useState<ProfileDocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile Form State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editOrganisation, setEditOrganisation] = useState("");
  const [editBirthDate, setEditBirthDate] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPreferredLanguage, setEditPreferredLanguage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Add Document Form State
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("IDENTITY");
  const [savingDoc, setSavingDoc] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profData, verData, docData] = await Promise.all([
        getCandidateProfile(),
        getVerifications(),
        getDocuments(),
      ]);
      setProfile(profData);
      setVerifications(verData);
      setDocuments(docData);
    } catch (err) {
      showToast("Мэдээлэл уншихад алдаа гарлаа.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = () => {
    if (!profile) return;
    setEditDisplayName(profile.displayName || "");
    setEditFirstName(profile.firstName || "");
    setEditLastName(profile.lastName || "");
    setEditPhoneNumber(profile.phoneNumber || "");
    setEditOrganisation(profile.organisation || "");
    setEditBirthDate(profile.birthDate || "");
    setEditGender(profile.gender || "Эрэгтэй");
    setEditCountry(profile.country || "Монгол");
    setEditAddress(profile.address || "");
    setEditPreferredLanguage(profile.preferredLanguage || "mn");
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await updateCandidateProfile({
        displayName: editDisplayName,
        firstName: editFirstName,
        lastName: editLastName,
        phoneNumber: editPhoneNumber,
        organisation: editOrganisation,
        birthDate: editBirthDate || null,
        gender: editGender,
        country: editCountry,
        address: editAddress,
        preferredLanguage: editPreferredLanguage,
      });
      setProfile(updated);
      showToast("Профайл мэдээлэл хадгалагдлаа.", "success");
      setIsEditOpen(false);
      // Reload to ensure completion status updates
      loadData();
    } catch (err: any) {
      showToast(err.message || "Хадгалахад алдаа гарлаа.", "danger");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast("Баримтын нэрийг оруулна уу.", "warning");
      return;
    }
    setSavingDoc(true);
    try {
      const newDoc = await addDocument({
        type: docType,
        name: docName.endsWith(".pdf") ? docName : `${docName}.pdf`,
        storageKey: `docs/${Date.now()}_${docName}`,
        mimeType: "application/pdf",
        sizeBytes: 1024 * 1024 * 2, // 2MB placeholder
      });
      setDocuments(prev => [newDoc, ...prev]);
      showToast("Бичиг баримт нэмэгдлээ (Metadata).", "success");
      setIsDocOpen(false);
      setDocName("");
    } catch (err: any) {
      showToast(err.message || "Файл нэмэхэд алдаа гарлаа.", "danger");
    } finally {
      setSavingDoc(false);
    }
  };

  const handleDeleteDocument = (id: string, name: string) => {
    showDialog({
      title: "Баримт бичиг устгах уу?",
      description: `"${name}" файлыг устгахдаа итгэлтэй байна уу?`,
      confirmLabel: "Устгах",
      cancelLabel: "Буцах",
      onConfirm: async () => {
        try {
          await deleteDocument(id);
          setDocuments(prev => prev.filter(d => d.id !== id));
          showToast("Бичиг баримт устгагдлаа.", "success");
        } catch (err: any) {
          showToast(err.message || "Устгахад алдаа гарлаа.", "danger");
        }
      },
    });
  };

  const handleRequestVerification = (typeId: string, title: string) => {
    showDialog({
      title: `${title} баталгаажуулах уу?`,
      description: "Баталгаажуулах хүсэлтийг хянагч нар руу илгээнэ үү.",
      confirmLabel: "Хүсэлт илгээх",
      cancelLabel: "Буцах",
      onConfirm: async () => {
        try {
          const res = await submitVerification(typeId);
          setVerifications(prev => [res, ...prev]);
          showToast(`${title} хүсэлт амжилттай илгээгдлээ.`, "success");
        } catch (err: any) {
          showToast(err.message || "Хүсэлт илгээхэд алдаа гарлаа.", "danger");
        }
      },
    });
  };

  const getVerificationStatus = (typeId: string) => {
    const v = verifications.find(req => req.type === typeId);
    return v ? v.status : "NOT_STARTED";
  };

  const getVerificationReason = (typeId: string) => {
    const v = verifications.find(req => req.type === typeId);
    return v?.rejectedReason || null;
  };

  const completionLevel = useMemo(() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.displayName) score += 25;
    if (profile.phoneNumber) score += 25;
    if (profile.country) score += 25;
    if (profile.preferredLanguage) score += 25;
    return score;
  }, [profile]);

  if (loading) {
    return (
      <PageContainer className="py-12 text-center">
        <Text>Уншиж байна...</Text>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer className="py-12 text-center">
        <Text className="text-danger">Профайл мэдээлэл олдсонгүй.</Text>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-none bg-muted-background px-seek-4 py-seek-5 sm:px-seek-6">
      <div className="space-y-seek-5">
        <header className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">
              Миний профайл
            </h1>
            <Text variant="muted" className="mt-seek-2">
              Хувийн мэдээлэл, баталгаажуулалт, бичиг баримтаа удирдана.
            </Text>
          </div>
          <div className="flex flex-wrap gap-seek-2">
            <Button type="button" variant="outline" onClick={openEditModal}>
              Мэдээлэл засах
            </Button>
          </div>
        </header>

        <nav className="flex gap-seek-5 overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`shrink-0 border-b-2 px-seek-1 pb-seek-3 font-sans text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "personal" && (
          <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.85fr)]">
            <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
              <div className="flex flex-col gap-seek-5 md:flex-row md:items-start">
                <div className="relative h-28 w-28 shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 p-1">
                  <div className="grid h-full w-full place-items-center rounded-full bg-surface font-sans text-3xl font-bold text-primary">
                    {profile.displayName ? profile.displayName.substring(0, 2).toUpperCase() : "U"}
                  </div>
                  <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-xs">
                    ID
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-seek-3">
                    <h2 className="font-sans text-2xl font-bold text-foreground">
                      {profile.displayName || "Овог Нэр Оруулаагүй"}
                    </h2>
                    <Badge variant={profile.isComplete ? "success" : "warning"}>
                      {profile.isComplete ? "БҮРЭН" : "ДУТУУ"}
                    </Badge>
                  </div>
                  <Text variant="muted" className="mt-seek-1">
                    Сонгосон хэл: {profile.preferredLanguage === "mn" ? "Монгол" : "English"}
                  </Text>
                  <div className="mt-seek-5 grid grid-cols-1 gap-seek-3 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoTile
                      label="Овог нэр"
                      value={profile.displayName || "-"}
                    />
                    <InfoTile
                      label="Утасны дугаар"
                      value={profile.phoneNumber || "-"}
                      status={profile.phoneNumberVerifiedAt ? "VERIFIED" : "NOT_STARTED"}
                    />
                    <InfoTile
                      label="Байгууллага"
                      value={profile.organisation || "-"}
                    />
                  </div>
                </div>
              </div>

              <dl className="mt-seek-6 grid grid-cols-1 gap-x-seek-6 gap-y-seek-3 sm:grid-cols-2">
                <ProfileField label="Нэр" value={profile.firstName || "-"} />
                <ProfileField label="Овог" value={profile.lastName || "-"} />
                <ProfileField label="Хүйс" value={profile.gender || "-"} />
                <ProfileField label="Төрсөн огноо" value={profile.birthDate || "-"} />
                <ProfileField label="Амьдарч буй улс" value={profile.country || "-"} />
                <ProfileField label="Хаяг" value={profile.address || "-"} />
                <ProfileField label="Баталгаажсан огноо" value={profile.verifiedAt ? new Date(profile.verifiedAt).toLocaleDateString() : "-"} />
              </dl>

              {!profile.isComplete && (
                <div className="mt-seek-6 flex flex-col gap-seek-3 rounded-seek-md border border-primary/20 bg-primary/5 p-seek-4 sm:flex-row sm:items-center sm:justify-between">
                  <Text variant="muted" className="text-sm">
                    Шаардлагатай мэдээллүүд дутуу байна. Профайлаа бүрэн бөглөнө үү.
                  </Text>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openEditModal}
                  >
                    Профайл засах
                  </Button>
                </div>
              )}
            </section>

            <div className="space-y-seek-5">
              <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
                <h2 className="font-sans text-xl font-bold text-foreground">
                  Бөглөлтийн түвшин
                </h2>
                <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center">
                  <div
                    className="grid h-36 w-36 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(#22c55e 0 ${completionLevel}%, #e5e7eb ${completionLevel}% 100%)`,
                    }}
                  >
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-surface text-center">
                      <div>
                        <p className="font-sans text-3xl font-bold text-foreground">
                          {completionLevel}%
                        </p>
                        <Text variant="muted" className="text-xs">
                          Үндсэн талбар
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-seek-2 text-sm">
                    <LegendDot
                      color={profile.displayName ? "bg-success" : "bg-warning"}
                      label="Овог Нэр"
                    />
                    <LegendDot
                      color={profile.phoneNumber ? "bg-success" : "bg-warning"}
                      label="Утасны дугаар"
                    />
                    <LegendDot
                      color={profile.country ? "bg-success" : "bg-warning"}
                      label="Улс"
                    />
                    <LegendDot
                      color={profile.preferredLanguage ? "bg-success" : "bg-warning"}
                      label="Тааламжтай хэл"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === "verification" && (
          <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
            <h2 className="font-sans text-xl font-bold text-foreground">
              Баталгаажуулалт хийх хүсэлт
            </h2>
            <Text variant="muted" className="mt-seek-2 text-sm">
              Системийн итгэлийн түвшин нэмэгдүүлэхийн тулд доорх баталгаажуулалтуудыг хүсэлт гаргана уу.
            </Text>
            <div className="mt-seek-5 space-y-seek-4">
              {verificationTypes.map((item) => {
                const status = getVerificationStatus(item.id);
                const reason = getVerificationReason(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-seek-3 rounded-seek-md border border-border p-seek-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-sans text-sm font-bold text-foreground">
                        {item.title}
                      </p>
                      <Text variant="muted" className="text-xs">
                        {item.description}
                      </Text>
                      {reason && (
                        <p className="mt-seek-1 text-xs text-danger">
                          Татгалзсан шалтгаан: {reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-seek-3">
                      <Badge variant={statusVariant[status]}>
                        {statusLabels[status]}
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={status === "VERIFIED" || status === "SUBMITTED"}
                        onClick={() => handleRequestVerification(item.id, item.title)}
                      >
                        Хүсэлт илгээх
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "documents" && (
          <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
            <div className="flex flex-col gap-seek-3 border-b border-border px-seek-5 py-seek-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-sans text-xl font-bold text-foreground">
                  Бичиг баримт
                </h2>
                <Text variant="muted" className="mt-seek-1 text-sm">
                  Иргэний үнэмлэх, Диплом болон ажлын тодорхойлолт файлуудын метадата.
                </Text>
              </div>
              <Button type="button" onClick={() => setIsDocOpen(true)}>
                + Файл нэмэх
              </Button>
            </div>
            
            {documents.length === 0 ? (
              <div className="p-seek-6 text-center text-muted-foreground text-sm">
                Одоогоор файл бүртгэгдээгүй байна.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[48rem] border-collapse">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="px-seek-5 py-seek-3 font-medium">Нэр</th>
                      <th className="px-seek-5 py-seek-3 font-medium">Төрөл</th>
                      <th className="px-seek-5 py-seek-3 font-medium">Огноо</th>
                      <th className="px-seek-5 py-seek-3 font-medium">Хэмжээ</th>
                      <th className="px-seek-5 py-seek-3 font-medium">Төлөв</th>
                      <th className="px-seek-5 py-seek-3 font-medium">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-seek-5 py-seek-4 text-sm text-foreground font-semibold">
                          {doc.name}
                        </td>
                        <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                          {doc.type}
                        </td>
                        <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                          {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                        </td>
                        <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                          <Badge variant="success">{doc.status}</Badge>
                        </td>
                        <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id, doc.name)}
                          >
                            Устгах
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-lg">
            <h3 className="font-sans text-xl font-bold text-foreground mb-seek-4">
              Хувийн мэдээлэл засах
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-seek-4">
              <div className="grid grid-cols-1 gap-seek-4 sm:grid-cols-2">
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Дэлгэцийн нэр (Овог Нэр)*</span>
                  <Input value={editDisplayName} required onChange={e => setEditDisplayName(e.target.value)} />
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Утасны дугаар*</span>
                  <Input value={editPhoneNumber} required onChange={e => setEditPhoneNumber(e.target.value)} />
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Нэр</span>
                  <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} />
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Овог</span>
                  <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} />
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Хүйс</span>
                  <select
                    value={editGender}
                    className="flex h-10 w-full rounded-seek-md border border-input border-border bg-surface px-seek-3 py-seek-2 text-sm text-foreground focus:outline-none"
                    onChange={e => setEditGender(e.target.value)}
                  >
                    <option value="Эрэгтэй">Эрэгтэй</option>
                    <option value="Эмэгтэй">Эмэгтэй</option>
                  </select>
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Төрсөн огноо (YYYY-MM-DD)</span>
                  <Input type="date" value={editBirthDate} onChange={e => setEditBirthDate(e.target.value)} />
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Улс*</span>
                  <Input value={editCountry} required onChange={e => setEditCountry(e.target.value)} />
                </label>
                <label className="block space-y-seek-1">
                  <span className="text-xs font-semibold text-foreground">Сонгох хэл*</span>
                  <select
                    value={editPreferredLanguage}
                    className="flex h-10 w-full rounded-seek-md border border-input border-border bg-surface px-seek-3 py-seek-2 text-sm text-foreground focus:outline-none"
                    onChange={e => setEditPreferredLanguage(e.target.value)}
                  >
                    <option value="mn">Монгол хэл</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>
              <label className="block space-y-seek-1">
                <span className="text-xs font-semibold text-foreground">Ажиллаж буй байгууллага</span>
                <Input value={editOrganisation} onChange={e => setEditOrganisation(e.target.value)} />
              </label>
              <label className="block space-y-seek-1">
                <span className="text-xs font-semibold text-foreground">Хаяг</span>
                <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} />
              </label>
              <div className="flex justify-end gap-seek-2 mt-seek-6">
                <Button type="button" variant="outline" disabled={savingProfile} onClick={() => setIsEditOpen(false)}>
                  Болих
                </Button>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Хадгалж байна..." : "Хадгалах"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-lg">
            <h3 className="font-sans text-xl font-bold text-foreground mb-seek-2">
              Бичиг баримт оруулах
            </h3>
            <Text variant="muted" className="text-xs mb-seek-4">
              Файл хадгалах сан ажиллахгүй байна (Metadata ашиглаж байна)
            </Text>
            <form onSubmit={handleAddDocument} className="space-y-seek-4">
              <label className="block space-y-seek-1">
                <span className="text-xs font-semibold text-foreground">Баримтын нэр*</span>
                <Input value={docName} required placeholder="Жишээ: Иргэний үнэмлэх" onChange={e => setDocName(e.target.value)} />
              </label>
              <label className="block space-y-seek-1">
                <span className="text-xs font-semibold text-foreground">Баримтын төрөл*</span>
                <select
                  value={docType}
                  className="flex h-10 w-full rounded-seek-md border border-input border-border bg-surface px-seek-3 py-seek-2 text-sm text-foreground focus:outline-none"
                  onChange={e => setDocType(e.target.value)}
                >
                  <option value="IDENTITY">Хувийн мэдээлэл (Identity)</option>
                  <option value="EMPLOYMENT">Албан тушаал (Employment)</option>
                  <option value="ORGANISATION">Байгууллагын харьяалал (Organisation)</option>
                  <option value="EDUCATION">Боловсролын зэрэг (Education)</option>
                  <option value="ASSESSOR">Мэргэжлийн үнэлгээ (Assessor)</option>
                </select>
              </label>
              <div className="flex justify-end gap-seek-2 mt-seek-6">
                <Button type="button" variant="outline" disabled={savingDoc} onClick={() => setIsDocOpen(false)}>
                  Болих
                </Button>
                <Button type="submit" disabled={savingDoc}>
                  {savingDoc ? "Нэмж байна..." : "Файл нэмэх"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function InfoTile({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: string;
}) {
  return (
    <div className="rounded-seek-md border border-border bg-muted-background p-seek-3">
      <Text variant="muted" className="text-xs">
        {label}
      </Text>
      <p className="mt-seek-1 break-words font-sans text-sm font-semibold text-foreground">
        {value}
      </p>
      {status && (
        <Badge variant={statusVariant[status]} className="mt-seek-2">
          {statusLabels[status]}
        </Badge>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[11rem_minmax(0,1fr)] gap-seek-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-seek-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
