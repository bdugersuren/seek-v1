"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  Icons,
  Input,
  PageContainer,
  PageTitle,
  Select,
  Stack,
  Text,
  useDialog,
  useToast,
} from "@seek/ui";
import { authFetch } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

interface UserAccount {
  id: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string | null;
  isPhoneVerified: boolean;
  status: string;
  createdAt: string;
  roles: string[];
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

const AVAILABLE_ROLES = [
  { value: "SUPER_ADMIN", label: "SUPER_ADMIN (Супер Админ)" },
  { value: "ORGANIZATION_ADMIN", label: "ORGANIZATION_ADMIN (Байгууллагын Админ)" },
  { value: "ASSESSOR", label: "ASSESSOR (Асуулагч/Даалгавар боловсруулагч)" },
  { value: "VIEWER", label: "VIEWER (Хүний Нөөц / Харах эрх)" },
  { value: "TESTER", label: "TESTER (Тестер)" },
  { value: "CANDIDATE", label: "CANDIDATE (Үнэлүүлэгч/Хэрэглэгч)" },
];

export default function SuperAdminUsersPage() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Шүүлтүүрүүд
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Засварлаж буй хэрэглэгч (Role солих modal/inline удирдлагад)
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Хэрэглэгчийн аккаунтуудыг татах
      const usersRes = await authFetch(`${API_BASE}/v1/auth/admin/users`);
      if (!usersRes.ok) throw new Error("Хэрэглэгчдийн мэдээллийг татаж чадсангүй.");
      const usersData: UserAccount[] = await usersRes.json();

      // 2. Хэрэглэгчдийн профайлыг татах (Batch request)
      const userIds = usersData.map((u) => u.id);
      if (userIds.length > 0) {
        const profilesRes = await authFetch(`${API_BASE}/v1/profile/admin/profiles/by-ids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds }),
        });
        
        if (profilesRes.ok) {
          const profilesData: any[] = await profilesRes.json();
          const profileMap = new Map(profilesData.map((p) => [p.userId, p]));
          
          // Data join хийх
          const joinedUsers = usersData.map((user) => {
            const profile = profileMap.get(user.id);
            return {
              ...user,
              displayName: profile?.displayName || null,
              firstName: profile?.firstName || null,
              lastName: profile?.lastName || null,
            };
          });
          setUsers(joinedUsers);
          setLoading(false);
          return;
        }
      }
      
      setUsers(usersData);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Системээс мэдээллийг ачаалахад алдаа гарлаа.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Хэрэглэгчийг идэвхгүй / идэвхтэй болгох
  const handleToggleStatus = (user: UserAccount) => {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const statusText = nextStatus === "ACTIVE" ? "идэвхжүүлэх" : "идэвхгүй болгох";

    showDialog({
      title: `Хэрэглэгчийг ${statusText} үү?`,
      description: `${user.email} хаягтай хэрэглэгчийг ${statusText}-дээ итгэлтэй байна уу?`,
      confirmLabel: nextStatus === "ACTIVE" ? "Идэвхжүүлэх" : "Идэвхгүй болгох",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          const res = await authFetch(`${API_BASE}/v1/auth/admin/users/${user.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus }),
          });

          if (!res.ok) throw new Error("Статус өөрчилж чадсангүй.");
          
          showToast(`Хэрэглэгчийг амжилттай ${nextStatus === "ACTIVE" ? "идэвхжүүллээ" : "идэвхгүй болголоо"}.`, "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || "Үйлдэл амжилтгүй боллоо.", "danger");
        }
      },
    });
  };

  // Хэрэглэгчийн дүр (role) өөрчлөх
  const handleSaveRole = async (userId: string) => {
    if (!selectedNewRole) return;
    try {
      const res = await authFetch(`${API_BASE}/v1/auth/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: selectedNewRole }),
      });

      if (!res.ok) throw new Error("Дүр өөрчилж чадсангүй.");

      showToast("Хэрэглэгчийн дүрийг амжилттай шинэчиллээ.", "success");
      setEditingUserId(null);
      setSelectedNewRole("");
      loadData();
    } catch (err: any) {
      showToast(err.message || "Дүр өөрчлөхөд алдаа гарлаа.", "danger");
    }
  };

  // Хэрэглэгчийг устгах
  const handleDeleteUser = (user: UserAccount) => {
    showDialog({
      title: "Хэрэглэгчийг устгах уу?",
      description: `${user.email} хаягтай хэрэглэгчийг системээс бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй.`,
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          const res = await authFetch(`${API_BASE}/v1/auth/admin/users/${user.id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Хэрэглэгчийг устгаж чадсангүй.");

          showToast("Хэрэглэгчийг системээс амжилттай устгалаа.", "success");
          loadData();
        } catch (err: any) {
          showToast(err.message || "Устгаж чадсангүй.", "danger");
        }
      },
    });
  };

  // Шүүгдсэн хэрэглэгчид
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search Query
      const search = searchQuery.toLowerCase().trim();
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const matchesSearch =
        !search ||
        user.email.toLowerCase().includes(search) ||
        (user.phoneNumber && user.phoneNumber.includes(search)) ||
        fullName.includes(search) ||
        (user.displayName && user.displayName.toLowerCase().includes(search));

      // 2. Role Filter
      const matchesRole =
        selectedRole === "ALL" || user.roles.includes(selectedRole);

      // 3. Status Filter
      const matchesStatus =
        selectedStatus === "ALL" || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          title="Хэрэглэгчийн Удирдлага"
          subtitle="Системд бүртгэгдсэн бүх хэрэглэгчийн мэдээлэл, дүр болон статусыг удирдах."
        />
        <div className="flex items-center gap-seek-2">
          <Badge variant="secondary">Super Admin</Badge>
          <Badge>Нийт: {users.length}</Badge>
        </div>
      </div>

      {/* Шүүлтүүрүүд */}
      <Card className="p-seek-4">
        <div className="grid grid-cols-1 gap-seek-4 md:grid-cols-3">
          <Input
            placeholder="Имэйл, нэр эсвэл утсаар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: "ALL", label: "Бүх дүрүүд" },
              ...AVAILABLE_ROLES,
            ]}
          />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: "ALL", label: "Бүх төлөвүүд" },
              { value: "ACTIVE", label: "Идэвхтэй" },
              { value: "INACTIVE", label: "Идэвхгүй" },
            ]}
          />
        </div>
      </Card>

      {/* Хэрэглэгчийн жагсаалт */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-seek-12 text-center">
            <Text variant="muted" className="animate-pulse">
              Хэрэглэгчдийн мэдээллийг ачаалж байна...
            </Text>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-seek-12 text-center">
            <Text variant="muted">Хайлтын илэрц олдсонгүй.</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted-background/40">
                  <th className="p-seek-3 font-semibold text-foreground">Хэрэглэгч</th>
                  <th className="p-seek-3 font-semibold text-foreground">Имэйл / Утас</th>
                  <th className="p-seek-3 font-semibold text-foreground">Дүр (Role)</th>
                  <th className="p-seek-3 font-semibold text-foreground">Төлөв (Status)</th>
                  <th className="p-seek-3 font-semibold text-foreground">Бүртгүүлсэн огноо</th>
                  <th className="p-seek-3 font-semibold text-foreground text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isEditing = editingUserId === user.id;
                  const fullName =
                    user.firstName || user.lastName
                      ? `${user.lastName || ""} ${user.firstName || ""}`
                      : user.displayName || "-";

                  return (
                    <tr key={user.id} className="border-b border-border hover:bg-muted-background/20 transition-colors">
                      <td className="p-seek-3 font-medium text-foreground">
                        <div>
                          <p className="font-semibold">{fullName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">ID: {user.id}</p>
                        </div>
                      </td>
                      <td className="p-seek-3 text-foreground">
                        <div>
                          <p>{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.phoneNumber || "-"}</p>
                        </div>
                      </td>
                      <td className="p-seek-3">
                        {isEditing ? (
                          <div className="flex items-center gap-seek-2">
                            <Select
                              value={selectedNewRole}
                              onChange={(e) => setSelectedNewRole(e.target.value)}
                              options={AVAILABLE_ROLES.map((r) => ({
                                value: r.value,
                                label: r.value,
                              }))}
                              className="w-40 text-xs py-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveRole(user.id)}
                              disabled={!selectedNewRole}
                            >
                              Хадгалах
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setEditingUserId(null);
                                setSelectedNewRole("");
                              }}
                            >
                              Болих
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((r) => (
                              <Badge
                                key={r}
                                variant={r === "SUPER_ADMIN" ? "success" : "secondary"}
                                className="text-[10px]"
                              >
                                {r}
                              </Badge>
                            ))}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-6 w-6 p-0 min-w-0"
                              onClick={() => {
                                setEditingUserId(user.id);
                                setSelectedNewRole(user.roles[0] || "");
                              }}
                            >
                              <Icons.Settings size={12} />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="p-seek-3">
                        <Badge variant={user.status === "ACTIVE" ? "success" : "danger"}>
                          {user.status === "ACTIVE" ? "Идэвхтэй" : "Идэвхгүй"}
                        </Badge>
                      </td>
                      <td className="p-seek-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-seek-3 text-right">
                        <div className="flex items-center justify-end gap-seek-2">
                          <Button
                            size="sm"
                            variant={user.status === "ACTIVE" ? "secondary" : "primary"}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === "ACTIVE" ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-danger hover:bg-danger/10"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Устгах
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
