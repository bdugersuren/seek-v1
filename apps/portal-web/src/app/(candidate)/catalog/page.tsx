"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Icons,
  Input,
  PageContainer,
  Text,
  useToast,
  useDialog,
} from "@seek/ui";
import { fetchAudienceTypes } from "@/features/assessor-workspace/api";
import { createAssessmentRuntimeUrl } from "@/features/assessment-runtime/url";
import { createCatalogAttempt } from "@/features/catalog/attempts";
import { readCatalogCart, saveCatalogCart } from "@/features/catalog/cart";
import { checkAssessmentEnrollmentGate } from "@/features/profile/api";
import { listCatalogAssessments } from "@/features/catalog/api";
import type { CatalogAssessment } from "@/features/catalog/types";

type ViewMode = "card" | "table";
type AccessTypeFilter = "all" | "free" | "paid" | "targeted" | "open_access";

export default function CatalogPage() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [query, setQuery] = useState("");
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [selectedAudienceTypeId, setSelectedAudienceTypeId] = useState<string>("all");
  
  // Assessments state loaded from Database
  const [assessments, setAssessments] = useState<CatalogAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sidebar Filters
  const [accessFilter, setAccessFilter] = useState<AccessTypeFilter>("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [certificateFilter, setCertificateFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(200000);
  
  const [sort, setSort] = useState("duration_desc");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [cartItems, setCartItems] = useState<CatalogAssessment[]>([]);
  const [startingAssessmentId, setStartingAssessmentId] = useState<string | null>(null);
  
  // Mobile UI States
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await listCatalogAssessments();
      setAssessments(data || []);
    } catch (err) {
      console.error("Failed to load catalog assessments from database", err);
      showToast("Үнэлгээний жагсаалтыг баазаас уншиж чадсангүй.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCartItems(readCatalogCart());
    loadAssessments();
    
    // Load Audience Types dynamically from database
    async function loadAudienceTypes() {
      try {
        const types = await fetchAudienceTypes();
        setAudienceTypes(types || []);
      } catch (err) {
        console.error("Failed to load audience types for filters", err);
      }
    }
    loadAudienceTypes();
  }, []);

  const filteredAssessments = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return assessments
      .filter((assessment) => {
        const matchesSearch =
          !searchText ||
          assessment.title.toLowerCase().includes(searchText) ||
          assessment.description.toLowerCase().includes(searchText);

        const matchesAudience =
          selectedAudienceTypeId === "all" || assessment.audienceTypeId === selectedAudienceTypeId;

        // Access Type Filter mapping
        let matchesAccess = true;
        if (accessFilter !== "all") {
          if (accessFilter === "free") matchesAccess = assessment.price === 0 && assessment.accessType === "free";
          else if (accessFilter === "paid") matchesAccess = assessment.price > 0 && assessment.accessType === "paid";
          else if (accessFilter === "targeted") matchesAccess = assessment.accessType === "targeted";
          else if (accessFilter === "open_access") matchesAccess = assessment.accessType === "free" || assessment.accessType === "paid";
        }

        // Price Slider Filter
        const matchesPrice = assessment.price <= priceRange;

        return matchesSearch && matchesAudience && matchesAccess && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "duration_desc") {
          return b.durationMinutes - a.durationMinutes;
        }
        if (sort === "duration_asc") {
          return a.durationMinutes - b.durationMinutes;
        }
        if (sort === "price_low") {
          return a.price - b.price;
        }
        if (sort === "price_high") {
          return b.price - a.price;
        }
        return 0;
      });
  }, [assessments, selectedAudienceTypeId, accessFilter, priceRange, query, sort]);

  const resetFilters = () => {
    setQuery("");
    setAccessFilter("all");
    setDurationFilter("all");
    setTypeFilter("all");
    setCertificateFilter("all");
    setPriceRange(200000);
    setSelectedAudienceTypeId("all");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (accessFilter !== "all") count++;
    if (durationFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (certificateFilter !== "all") count++;
    if (priceRange < 200000) count++;
    return count;
  }, [accessFilter, durationFilter, typeFilter, certificateFilter, priceRange]);

  const addToCartAndRedirect = (assessment: CatalogAssessment) => {
    const currentCart = readCatalogCart();
    const exists = currentCart.some((item) => item.id === assessment.id);
    if (!exists) {
      saveCatalogCart([...currentCart, assessment]);
    }
    window.location.href = "/cart";
  };

  const openScheduleOrStart = async (assessment: CatalogAssessment) => {
    if (startingAssessmentId) return;

    // Show Confirmation Dialog with Rich UI components
    showDialog({
      title: assessment.title,
      confirmLabel: "Шалгалт өгөх",
      cancelLabel: "Болих",
      description: (
        <div className="space-y-4">
          <p className="text-slate-500 text-xs leading-relaxed">{assessment.description}</p>
          
          <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-3 my-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Icons.Dashboard size={14} className="text-slate-400" />
              <span>Хугацаа: <strong>{assessment.durationMinutes} мин</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Menu size={14} className="text-slate-400" />
              <span>Асуулт: <strong>{assessment.questionCount} асуулт</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Settings size={14} className="text-slate-400" />
              <span>Нийт оноо: <strong>{assessment.totalPoints || 100} оноо</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Warning size={14} className="text-slate-400" />
              <span>Босго оноо: <strong>{assessment.passingPercent || 60}%</strong></span>
            </div>
          </div>
          
          {assessment.scheduledStartsAt && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[11px] text-blue-700 leading-normal">
              <p className="font-bold mb-1">Шалгалтын товчилсон цаг:</p>
              <p>Эхлэх: {new Date(assessment.scheduledStartsAt).toLocaleString()}</p>
              <p>Дуусах: {new Date(assessment.scheduledEndsAt || "").toLocaleString()}</p>
            </div>
          )}
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-[11px] text-amber-800 leading-normal">
            <p className="font-bold mb-0.5">⚠️ Санамж:</p>
            <p>Шалгалтыг эхлүүлсэн тохиолдолд оролдлого идэвхжиж, цаг тоологдож эхэлнэ. Дундаас нь зогсоох боломжгүй.</p>
          </div>
        </div>
      ),
      onConfirm: async () => {
        setStartingAssessmentId(assessment.id);
        
        try {
          const gate = await checkAssessmentEnrollmentGate(assessment);
          if (!gate.allowed) {
            setStartingAssessmentId(null);
            showToast("Энэ үнэлгээнд одоогоор орох боломжгүй байна. Та шаардлагуудыг хангасан эсэхээ шалгана уу.", "warning");
            return;
          }

          const attempt = await createCatalogAttempt({
            assessmentId: assessment.id,
            idempotencyKey: typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}`,
          });

          window.location.href = createAssessmentRuntimeUrl(attempt.waitingUrl);
        } catch (error) {
          showToast("Үнэлгээг эхлүүлэхэд алдаа гарлаа. Дахин оролдоно уу.", "danger");
          setStartingAssessmentId(null);
        }
      }
    });
  };

  // Helper icons mapped to audience codes
  const getAudienceIcon = (code: string) => {
    if (code === "civil-servant") return <Icons.Settings className="h-4 w-4 mr-2" />;
    if (code === "student") return <Icons.Warning className="h-4 w-4 mr-2" />; // Graduation Cap simulation
    return <Icons.Dashboard className="h-4 w-4 mr-2" />; // Professional / Executive
  };

  // Redirection handler for action buttons
  const renderActionButton = (assessment: CatalogAssessment) => {
    const isStarting = startingAssessmentId === assessment.id;
    const action = assessment.requiredAction || "START";

    if (action === "PAY") {
      return (
        <Button
          type="button"
          onClick={() => addToCartAndRedirect(assessment)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs py-2.5 rounded-seek-xl shadow-seek-xs transition-colors"
        >
          Худалдаж авах (₮{assessment.price.toLocaleString()})
        </Button>
      );
    }

    if (action === "EXPIRED") {
      return (
        <Button
          type="button"
          disabled
          className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-2.5 rounded-seek-xl cursor-not-allowed"
        >
          Хугацаа дууссан
        </Button>
      );
    }

    if (action === "WAIT") {
      return (
        <Button
          type="button"
          disabled
          className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-2.5 rounded-seek-xl cursor-not-allowed"
        >
          Эхлэх болоогүй
        </Button>
      );
    }

    if (action === "VIEW_RESULT") {
      return (
        <Button
          type="button"
          onClick={() => {
            if (assessment.lastAttemptId) {
              window.location.href = `/results/${assessment.lastAttemptId}`;
            } else {
              showToast("Оролдлогын дэлгэрэнгүй үр дүн олдсонгүй.", "warning");
            }
          }}
          className="w-full bg-slate-800 text-white hover:bg-slate-900 font-bold text-xs py-2.5 rounded-seek-xl shadow-seek-xs transition-colors"
        >
          Үр дүн харах
        </Button>
      );
    }

    // START / TAKE EXAM State
    return (
      <Button
        type="button"
        onClick={() => openScheduleOrStart(assessment)}
        disabled={isStarting}
        className="w-full bg-primary text-white hover:bg-primary-hover font-bold text-xs py-2.5 rounded-seek-xl shadow-seek-xs transition-colors"
      >
        {isStarting ? "Эхлүүлж байна..." : "Шалгалт өгөх"}
      </Button>
    );
  };

  return (
    <PageContainer className="max-w-none bg-slate-50/50 px-0 py-0">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] max-w-[1400px] mx-auto p-seek-6 gap-seek-6">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-seek-5 rounded-seek-xl border border-slate-200 bg-white p-seek-5 shadow-seek-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-seek-3">
            <h3 className="font-bold text-slate-900 text-sm">Шүүлтүүр</h3>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Цэвэрлэх
            </button>
          </div>

          {/* Checklist access type */}
          <div className="space-y-seek-2">
            <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">Төлбөрийн хэлбэр</Text>
            <div className="space-y-seek-2 pt-1">
              {[
                { value: "all", label: "Бүгд" },
                { value: "free", label: "Төлбөргүй" },
                { value: "paid", label: "Төлбөртэй" },
                { value: "targeted", label: "Зорилтот" },
                { value: "open_access", label: "Нээлттэй" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-seek-3 text-xs text-slate-600 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={accessFilter === opt.value}
                    onChange={() => setAccessFilter(opt.value as AccessTypeFilter)}
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration dropdown */}
          <div className="space-y-seek-1.5">
            <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">Хугацаа</Text>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full rounded-seek-md border border-slate-200 bg-white px-seek-3 py-seek-2.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
            >
              <option value="all">Хугацаагүй</option>
              <option value="60">60 минутаас бага</option>
              <option value="120">120 минутаас бага</option>
            </select>
          </div>

          {/* Type dropdown */}
          <div className="space-y-seek-1.5">
            <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">Төрөл</Text>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-seek-md border border-slate-200 bg-white px-seek-3 py-seek-2.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
            >
              <option value="all">Бүгд</option>
              <option value="knowledge">Мэдлэг</option>
              <option value="skill">Ур чадвар</option>
            </select>
          </div>

          {/* Certificate dropdown */}
          <div className="space-y-seek-1.5">
            <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">Хэлбэр</Text>
            <select
              value={certificateFilter}
              onChange={(e) => setCertificateFilter(e.target.value)}
              className="w-full rounded-seek-md border border-slate-200 bg-white px-seek-3 py-seek-2.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
            >
              <option value="all">Сертификаттай</option>
              <option value="no">Сертификатгүй</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-seek-2.5">
            <div className="flex justify-between items-center text-xs">
              <Text className="font-bold text-slate-700 uppercase tracking-wider">Үнэ</Text>
              <span className="font-bold text-primary">₮0 - ₮{(priceRange / 1000).toFixed(0)}k+</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <Button type="button" className="w-full bg-primary text-white hover:bg-primary-hover font-semibold text-xs py-seek-3 rounded-seek-md shadow-seek-sm">
            Шүүх
          </Button>
        </aside>

        {/* Mobile slide-out Filters Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-modal lg:hidden flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
            <div className="relative w-80 bg-white h-full p-seek-6 space-y-seek-5 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-seek-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-seek-3">
                  <h3 className="font-bold text-slate-900 text-sm">Шүүлтүүр</h3>
                  <button type="button" onClick={resetFilters} className="text-xs text-primary font-semibold">
                    Цэвэрлэх
                  </button>
                </div>

                <div className="space-y-seek-2">
                  <Text className="text-xs font-bold text-slate-700 uppercase">Төлбөрийн хэлбэр</Text>
                  <div className="space-y-seek-2">
                    {["Бүх", "Төлбөргүй", "Төлбөртэй", "Зорилтот", "Нээлттэй"].map((opt) => (
                      <label key={opt} className="flex items-center gap-seek-3 text-xs text-slate-600 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessFilter === opt}
                          onChange={() => setAccessFilter(opt as AccessTypeFilter)}
                          className="rounded border-slate-300 text-primary"
                        />
                        <span className="capitalize">{opt.replace("_", " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-seek-1.5">
                  <Text className="text-xs font-bold text-slate-700 uppercase">Хугацаа</Text>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="w-full rounded-seek-md border border-slate-200 bg-white px-seek-3 py-2 text-xs"
                  >
                    <option value="all">Хугацаагүй</option>
                  </select>
                </div>

                <div className="space-y-seek-2">
                  <div className="flex justify-between items-center text-xs">
                    <Text className="font-bold text-slate-700 uppercase">Үнэ</Text>
                    <span className="font-bold text-primary">₮0 - ₮{(priceRange / 1000).toFixed(0)}k+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none accent-primary"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-primary text-white py-3 rounded-seek-md text-xs font-semibold"
              >
                Шүүлтүүр хэрэглэх
              </Button>
            </div>
          </div>
        )}

        {/* Right side Main Content */}
        <main className="space-y-seek-5">
          {/* Tabs bar and sorting bar */}
          <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-seek-4">
            
            {/* Horizontal audience tabs */}
            <div className="flex items-center gap-seek-2 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
              <button
                type="button"
                onClick={() => setSelectedAudienceTypeId("all")}
                className={`flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedAudienceTypeId === "all"
                    ? "bg-primary text-white shadow-seek-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Icons.Menu size={14} className="mr-1.5" />
                All
              </button>
              {audienceTypes.map((type) => {
                const isActive = selectedAudienceTypeId === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedAudienceTypeId(type.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-seek-sm"
                        : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {getAudienceIcon(type.code)}
                    {type.name}
                  </button>
                );
              })}
            </div>

            {/* Sorting, view mode and filters toggle (mobile) */}
            <div className="flex items-center justify-between sm:justify-end gap-seek-3">
              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-seek-md border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                <Icons.Settings size={14} />
                Шүүлтүүр {activeFiltersCount > 0 && <span className="bg-primary text-white rounded-full px-1.5 py-0.5 text-[9px] ml-1">{activeFiltersCount}</span>}
              </button>

              <div className="flex items-center gap-seek-3">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Эрэмбэ:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-seek-md border border-slate-200 bg-white px-seek-3 py-seek-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="duration_desc">Хугацаагаар буурах</option>
                  <option value="duration_asc">Хугацаагаар өсөх</option>
                  <option value="price_low">Үнэ багаас</option>
                  <option value="price_high">Үнэ ихээс</option>
                </select>

                {/* View Mode Toggle icons */}
                <div className="flex items-center gap-1 border border-slate-200 rounded-seek-md p-0.5 bg-white">
                  <button
                    type="button"
                    className={`p-1.5 rounded-seek-sm ${viewMode === "card" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                    onClick={() => setViewMode("card")}
                  >
                    <Icons.Dashboard size={14} />
                  </button>
                  <button
                    type="button"
                    className={`p-1.5 rounded-seek-sm ${viewMode === "table" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                    onClick={() => setViewMode("table")}
                  >
                    <Icons.Menu size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
            </div>
          ) : (
            <>
              <Text variant="muted" className="text-xs font-bold text-slate-500">
                Found {filteredAssessments.length} assessments
              </Text>

              {/* Cards Grid */}
              {filteredAssessments.length === 0 ? (
                <div className="rounded-seek-xl border border-dashed border-slate-200 p-seek-12 text-center bg-white shadow-seek-xs">
                  <Icons.Warning className="mx-auto h-12 w-12 text-slate-300 stroke-[1.2]" />
                  <Text className="mt-seek-4 text-base font-bold text-slate-800">Үнэлгээ олдсонгүй</Text>
                  <Text variant="muted" className="mt-1 text-xs">Та өөр түлхүүр үг эсвэл шүүлтүүр сонгож хайна уу.</Text>
                </div>
              ) : viewMode === "card" ? (
                <div className="grid gap-seek-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentNewCard
                      key={assessment.id}
                      assessment={assessment}
                      actionButton={renderActionButton(assessment)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-seek-3">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentListItem
                      key={assessment.id}
                      assessment={assessment}
                      actionButton={renderActionButton(assessment)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredAssessments.length > 0 && (
                <div className="flex justify-center items-center gap-1.5 pt-seek-4">
                  <button type="button" className="p-2 rounded-seek-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                    <Icons.ChevronLeft size={14} />
                  </button>
                  <button type="button" className="px-3.5 py-2 rounded-seek-md bg-primary text-white font-bold text-xs shadow-seek-sm">1</button>
                  <button type="button" className="px-3.5 py-2 rounded-seek-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs">2</button>
                  <button type="button" className="px-3.5 py-2 rounded-seek-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs">3</button>
                  <span className="text-slate-400 px-1">...</span>
                  <button type="button" className="px-3.5 py-2 rounded-seek-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs">6</button>
                  <button type="button" className="p-2 rounded-seek-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                    <Icons.ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </PageContainer>
  );
}

// Custom styled Assessment Card
function AssessmentNewCard({
  assessment,
  actionButton,
}: {
  assessment: CatalogAssessment;
  actionButton: React.ReactNode;
}) {
  const isFree = assessment.price === 0;
  const isTargeted = assessment.accessType === "targeted";

  // Badge mapping colors
  let badgeStyle = "bg-amber-100/70 text-amber-700"; // Төлбөртэй
  let badgeText = "ТӨЛБӨРТЭЙ";
  if (isFree) {
    badgeStyle = "bg-emerald-100/70 text-emerald-700";
    badgeText = "ТӨЛБӨРГҮЙ";
  } else if (isTargeted) {
    badgeStyle = "bg-blue-100/70 text-blue-700";
    badgeText = "ЗОРИЛТОТ";
  }

  // Get matching circle icon color & element
  const getCircleIcon = () => {
    let iconColor = "bg-amber-100/50 text-amber-600";
    let Icon = Icons.Warning;
    
    if (assessment.id.includes("math")) {
      iconColor = "bg-emerald-100/50 text-emerald-600";
      Icon = Icons.Warning;
    } else if (assessment.id.includes("institutional") || assessment.id.includes("civil")) {
      iconColor = "bg-blue-100/50 text-blue-600";
      Icon = Icons.Dashboard;
    } else if (assessment.id.includes("english")) {
      iconColor = "bg-emerald-100/50 text-emerald-600";
      Icon = Icons.Menu;
    } else if (assessment.id.includes("special")) {
      iconColor = "bg-blue-100/50 text-blue-600";
      Icon = Icons.Settings;
    }

    return (
      <div className={`p-4 rounded-full ${iconColor} flex items-center justify-center`}>
        <Icon className="h-6 w-6 stroke-[1.8]" />
      </div>
    );
  };

  return (
    <article className="overflow-hidden rounded-seek-2xl border border-slate-200/90 bg-white p-seek-6 hover:shadow-seek-md transition-all flex flex-col justify-between min-h-[360px] relative">
      <div className="space-y-seek-4">
        
        {/* Card Top badges */}
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-seek-md text-[10px] font-bold tracking-wider ${badgeStyle}`}>
            {badgeText}
          </span>
          <button type="button" className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600">
            <Icons.Settings className="h-4 w-4" /> {/* Bookmark simulation */}
          </button>
        </div>

        {/* Center Round Icon */}
        <div className="flex justify-center py-2">
          {getCircleIcon()}
        </div>

        {/* Title & Competency tags */}
        <div className="space-y-seek-2 text-center">
          <h4 className="font-bold text-slate-800 text-sm leading-tight hover:text-primary transition-colors line-clamp-1">
            {assessment.title}
          </h4>
          <div className="flex flex-wrap justify-center gap-seek-1.5">
            {assessment.competencyTags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Short description */}
        <Text variant="muted" className="text-seek-xxs leading-relaxed text-center line-clamp-2 text-slate-500 px-seek-1">
          {assessment.description}
        </Text>
      </div>

      {/* Card bottom details & action */}
      <div className="space-y-seek-4 pt-seek-4 mt-seek-4 border-t border-slate-100">
        
        {/* Clock, count details */}
        <div className="grid grid-cols-2 gap-seek-2 text-[10px] text-slate-500 font-bold">
          <div className="flex items-center gap-1">
            <Icons.Dashboard className="h-3.5 w-3.5 text-slate-400" />
            <span>{assessment.durationMinutes} мин</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Icons.Menu className="h-3.5 w-3.5 text-slate-400" />
            <span>{assessment.questionCount} асуулт</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>8.2k сурагч</span>
          </div>
          <div className="flex items-center justify-end font-extrabold text-xs">
            {isTargeted ? (
              <span className="text-blue-600">By Invite</span>
            ) : isFree ? (
              <span className="text-emerald-600">Үнэгүй</span>
            ) : (
              <span className="text-slate-800">₮{assessment.price.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Dynamic Action Button Rendered from Parent */}
        {actionButton}
      </div>
    </article>
  );
}

// Custom ListItem for horizontal / mobile list view
function AssessmentListItem({
  assessment,
  actionButton,
}: {
  assessment: CatalogAssessment;
  actionButton: React.ReactNode;
}) {
  const isFree = assessment.price === 0;
  const isTargeted = assessment.accessType === "targeted";

  let badgeStyle = "bg-amber-100/70 text-amber-700";
  let badgeText = "ТӨЛБӨРТЭЙ";
  if (isFree) {
    badgeStyle = "bg-emerald-100/70 text-emerald-700";
    badgeText = "ТӨЛБӨРГҮЙ";
  } else if (isTargeted) {
    badgeStyle = "bg-blue-100/70 text-blue-700";
    badgeText = "ЗОРИЛТОТ";
  }

  return (
    <article className="overflow-hidden rounded-seek-xl border border-slate-200 bg-white p-seek-4 hover:shadow-seek-sm transition-all flex flex-col md:flex-row md:items-center gap-seek-4">
      {/* Round Icon */}
      <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-slate-50 border border-slate-100">
        <Icons.Dashboard className="h-6 w-6 text-slate-500" />
      </div>

      {/* Main Details */}
      <div className="flex-1 space-y-seek-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-0.5 rounded-seek-md text-[9px] font-bold ${badgeStyle}`}>
            {badgeText}
          </span>
          <h4 className="font-bold text-slate-800 text-xs truncate">
            {assessment.title}
          </h4>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {assessment.competencyTags?.map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] text-slate-400 font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <Text variant="muted" className="text-[10px] leading-relaxed text-slate-500 line-clamp-1">
          {assessment.description}
        </Text>
      </div>

      {/* Meta Specs & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-seek-4 justify-between md:justify-end">
        <div className="text-[10px] text-slate-500 space-y-0.5 font-semibold">
          <div className="flex items-center gap-1.5">
            <Icons.Dashboard className="h-3 w-3 text-slate-400" />
            <span>{assessment.durationMinutes} мин · {assessment.questionCount} асуулт</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icons.Settings className="h-3 w-3 text-slate-400" />
            <span>8.2k сурагч · </span>
            {isTargeted ? (
              <span className="text-blue-600 font-extrabold">By Invite</span>
            ) : isFree ? (
              <span className="text-emerald-600 font-extrabold">Үнэгүй</span>
            ) : (
              <span className="text-slate-800 font-extrabold">₮{assessment.price.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="w-full sm:w-auto min-w-[120px]">
          {actionButton}
        </div>
      </div>
    </article>
  );
}
