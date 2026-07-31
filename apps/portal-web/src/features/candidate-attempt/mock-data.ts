import type { CandidateAttempt } from "./types";

export const mockCandidateAttempt: CandidateAttempt = {
  id: "mock-attempt-001",
  assessmentTitle: "cvbcv",
  candidateName: "Candidate",
  durationMinutes: 7,
  remainingMinutes: 4,
  questions: [
    {
      id: "q1",
      code: "Q1",
      prompt:
        "$\\frac{2}{3} \\times \\frac{3}{4}$ үйлдлийг гүйцэтгэхэд хамгийн хялбар хэлбэрт шилжүүлнэ үү.",
      instruction: "Нэгийг сонгоно уу",
      type: "single_choice",
      points: 2,
      options: [
        { id: "a", label: "$\\frac{1}{2}$" },
        { id: "b", label: "$\\frac{6}{12}$" },
        { id: "c", label: "$\\frac{8}{9}$" },
        { id: "d", label: "$\\frac{5}{7}$" },
      ],
    },
    {
      id: "q2",
      code: "Q2",
      prompt:
        "$x = 2$, $y = 3$ үед утга нь эерэг байх илэрхийллүүдийг бүгдийг сонго.",
      instruction: "Нийт хамаарах хариултыг сонгоно уу",
      type: "multiple_choice",
      points: 2,
      options: [
        { id: "a", label: "$3x - y$" },
        { id: "b", label: "$y^2 - 4x$" },
        { id: "c", label: "$2x - 2y$" },
        { id: "d", label: "$x - y$" },
      ],
    },
    {
      id: "q3",
      code: "Q3",
      prompt:
        "Үйлдлийн чанар/хуулиудын илэрхийллийг тэдгээрийн нэр томьёотой зөв тохируулна уу.",
      instruction: "Хосолсон зүйлийг тааруулна уу",
      type: "matching",
      points: 6,
      pairs: [
        { id: "a", prompt: "$a + b = b + a$" },
        { id: "b", prompt: "$(a + b) + c = a + (b + c)$" },
        { id: "c", prompt: "$a \\times (b + c) = a \\times b + a \\times c$" },
      ],
      matchOptions: [
        { id: "swap", label: "Нэмэхийн байр солих хууль" },
        { id: "group", label: "Нэмэхийн бүлэглэх хууль" },
        { id: "distribute", label: "Үржихийн нэмэхэд тархах хууль" },
      ],
    },
    {
      id: "q4",
      code: "Q4",
      prompt:
        "Дараах бутархайнуудыг багаас нь ихсэх (өсөх) дарааллаар эрэмбэлнэ үү.",
      instruction: "Зөв дарааллаар байрлуулна уу",
      type: "ordering",
      points: 4,
      options: [
        { id: "a", label: "$\\frac{1}{8}$" },
        { id: "b", label: "$\\frac{1}{2}$" },
        { id: "c", label: "$\\frac{1}{4}$" },
        { id: "d", label: "$\\frac{3}{4}$" },
      ],
    },
    {
      id: "q5",
      code: "Q5",
      prompt: "$0.25$ бутархайтай тэнцүү энгийн бутархайг сонгоно уу.",
      instruction: "Нэгийг сонгоно уу",
      type: "single_choice",
      points: 2,
      options: [
        { id: "a", label: "$\\frac{1}{2}$" },
        { id: "b", label: "$\\frac{1}{3}$" },
        { id: "c", label: "$\\frac{1}{4}$" },
        { id: "d", label: "$\\frac{2}{5}$" },
      ],
    },
    {
      id: "q6",
      code: "Q6",
      prompt:
        "$\\frac{3}{5}$ бутархайг хуваарь нь $15$ байх бутархай болгон өргөтгөвөл хүртвэрт нь бичнэ.",
      instruction: "Хоосон зайг бөглөнө үү",
      type: "fill_blank",
      points: 3,
    },
    {
      id: "q7",
      code: "Q7",
      prompt:
        "Дараах энгийн ба аравтын бутархай хосууд хоорондоо тэнцүү эсэхийг тэмдэглэ.",
      instruction: "Зөв хариултыг сонгоно уу",
      type: "matrix",
      points: 3,
      rows: [
        { id: "a", label: "$\\frac{3}{10}$ ба $0.3$" },
        { id: "b", label: "$\\frac{1}{4}$ ба $0.25$" },
        { id: "c", label: "$\\frac{2}{5}$ ба $0.4$" },
      ],
      columns: [
        { id: "equal", label: "Тэнцүү" },
        { id: "not_equal", label: "Тэнцүү биш" },
      ],
    },
    {
      id: "q8",
      code: "Q8",
      prompt:
        "$\\frac{7}{8}$ бутархайг аравтын бутархай болгон хувиргахад гарах тоон хариуг бичнэ үү.",
      instruction: "Зөвхөн тоон утга оруулна уу",
      type: "numeric",
      points: 3,
      minValue: 0,
      maxValue: 1,
      unit: "утга",
      media: [
        {
          id: "media-q8-image",
          type: "image",
          title: "Бутархайн дүрслэл",
          url: "https://placehold.co/640x260/eef2ff/1e293b?text=Fraction+visual",
          description:
            "Production үед энэ хэсэгт бодит зураг эсвэл diagram render хийнэ.",
        },
      ],
    },
    {
      id: "q9",
      code: "Q9",
      prompt:
        "Би шинэ мэдлэгийг бодит нөхцөлд ашиглаж чадна гэж өөрийгөө үнэлнэ.",
      instruction: "Likert шкал дээр өөрт хамгийн тохирох түвшинг сонгоно уу",
      type: "likert",
      points: 5,
      options: [
        { id: "1", label: "Огт санал нийлэхгүй" },
        { id: "2", label: "Санал нийлэхгүй" },
        { id: "3", label: "Дунд зэрэг" },
        { id: "4", label: "Санал нийлнэ" },
        { id: "5", label: "Бүрэн санал нийлнэ" },
      ],
      media: [
        {
          id: "media-q9-audio",
          type: "audio",
          title: "Зааварчилгааны аудио",
          url: "/mock/audio/likert-instruction.mp3",
          description: "Аудио attachment preview.",
        },
      ],
    },
    {
      id: "q10",
      code: "Q10",
      prompt:
        "Та багийн гишүүн deadline ойртсон үед ажлаа дуусгаагүй байгааг анзаарлаа. Хамгийн оновчтой үйлдлийг сонгоно уу.",
      instruction: "SJT: тухайн нөхцөлд хамгийн зохистой хариуг сонгоно уу",
      type: "sjt",
      points: 6,
      options: [
        {
          id: "a",
          label: "Асуудлыг үл тоож, өөрийн ажлыг дуусгахад бүрэн төвлөрөх.",
        },
        {
          id: "b",
          label:
            "Нөхцөл байдлыг асууж тодруулаад, шаардлагатай дэмжлэг болон risk-ийг багт ил тод хэлэлцэх.",
        },
        {
          id: "c",
          label:
            "Удирдлагад шууд гомдол гаргаж, багийн гишүүнийг солих санал тавих.",
        },
        {
          id: "d",
          label: "Тухайн хүний ажлыг зөвшөөрөлгүй өөрөө хийж дуусгах.",
        },
      ],
      media: [
        {
          id: "media-q10-video",
          type: "video",
          title: "Нөхцөл байдлын богино видео",
          url: "/mock/video/sjt-scenario.mp4",
          description: "SJT scenario video attachment preview.",
        },
      ],
    },
    {
      id: "q11",
      code: "Q11",
      prompt: "Доорх кейсийг уншаад багц асуултуудад хариулна уу.",
      instruction: "Кейсэд суурилсан багц даалгавар",
      type: "case_bundle",
      points: 12,
      caseText:
        "Сургууль улирлын үнэлгээний үр дүнгээр математикийн суурь чадвар сул сурагчдад нэмэлт дэмжлэг үзүүлэхээр төлөвлөж байна. Тайланд 8-р ангийн сурагчдын 42% нь бутархайн үйлдэл дээр алдаа гаргасан гэж дурджээ.",
      caseItems: [
        {
          id: "case-1",
          prompt: "Энэ кейсийн хамгийн гол асуудал юу вэ?",
          type: "single_choice",
          options: [
            { id: "a", label: "Тайлангийн format буруу байна." },
            {
              id: "b",
              label:
                "Бутархайн үйлдлийн суурь чадварт targeted intervention хэрэгтэй байна.",
            },
            { id: "c", label: "Бүх хичээлийг зогсоох шаардлагатай." },
          ],
        },
        {
          id: "case-2",
          prompt:
            "Энэ мэдээлэлд тулгуурлан авах эхний арга хэмжээг товч бичнэ үү.",
          type: "short_text",
        },
      ],
      media: [
        {
          id: "media-q11-file",
          type: "file",
          title: "Үнэлгээний тайлан.pdf",
          url: "/mock/files/assessment-report.pdf",
          description: "PDF/file attachment preview.",
        },
      ],
    },
    {
      id: "q12",
      code: "Q12",
      prompt:
        "Чадамжийн үнэлгээний үр дүнг ашиглан суралцагчийн хөгжлийн төлөвлөгөө боловсруулах аргачлалаа тайлбарлана уу.",
      instruction: "Бичгийн шалгалт: бүтэцтэй, үндэслэлтэй хариулт бичнэ үү",
      type: "essay",
      points: 15,
      media: [
        {
          id: "media-q12-file",
          type: "file",
          title: "Rubric.docx",
          url: "/mock/files/essay-rubric.docx",
          description: "Бичгийн шалгалтын rubric attachment preview.",
        },
      ],
    },
  ],
};
