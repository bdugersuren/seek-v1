export const candidateAssessments = [
  {
    id: "civil-service-2024",
    title: "Төрийн албан хаагчийн дотоод үнэлгээ - 2024",
    status: "Идэвхтэй",
    dates: "2024.05.20 - 2024.05.27",
    duration: "90 минут",
    action: "Орох",
  },
  {
    id: "english-placement",
    title: "Англи хэлний түвшин тогтоох үнэлгээ",
    status: "Ирэх",
    dates: "2024.06.01 - 2024.06.10",
    duration: "50 минут",
    action: "Дэлгэрэнгүй",
  },
  {
    id: "digital-skills",
    title: "Дижитал ур чадварын үнэлгээ",
    status: "Дууссан",
    dates: "2024.04.01 - 2024.04.10",
    duration: "45 минут",
    action: "Үр дүн",
  },
];

export const candidateCertificates = [
  {
    id: "cert-1",
    title: "Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ",
    score: "92%",
    issuedAt: "2024.05.20",
    status: "Идэвхтэй",
    paid: true,
  },
  {
    id: "cert-2",
    title: "Орон даяарх сурагчдын чадамжийн үнэлгээ",
    score: "85%",
    issuedAt: "2024.04.10",
    status: "Идэвхтэй",
    paid: false,
  },
  {
    id: "cert-3",
    title: "Төрийн албан хаагчийн ёс зүйн үнэлгээ",
    score: "Хугацаа дууссан",
    issuedAt: "2023.01.20",
    status: "Дууссан",
    paid: false,
  },
];

export const candidatePayments = [
  {
    id: "pay-1",
    date: "2024.05.20 14:30",
    assessment: "Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ",
    amount: "20,000₮",
    status: "Амжилттай",
    method: "Хаан банк",
  },
  {
    id: "pay-2",
    date: "2024.04.10 09:15",
    assessment: "Орон даяарх сурагчдын чадамжийн үнэлгээ",
    amount: "20,000₮",
    status: "Амжилттай",
    method: "Голомт банк",
  },
  {
    id: "pay-3",
    date: "2024.05.22 12:10",
    assessment: "Багшийн хөгжлийн зэрэг тогтоох үнэлгээ",
    amount: "20,000₮",
    status: "Хүлээгдэж байна",
    method: "-",
  },
];

export const candidateGroups = [
  {
    id: "group-1",
    name: "Боловсрол Инноваци ХХК",
    role: "Оролцогч",
    members: 128,
    status: "Идэвхтэй",
  },
  {
    id: "group-2",
    name: "Шинэ Монгол сургууль",
    role: "Сурагчдын үнэлгээний бүлэг",
    members: 56,
    status: "Хүсэлт илгээсэн",
  },
];

export const candidateNotifications = [
  {
    id: "notif-1",
    title: "Шинэ зорилтот үнэлгээнд уригдлаа",
    body: "Төрийн албан хаагчийн дотоод үнэлгээ - 2024",
    time: "10 минутын өмнө",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Сертификат бэлэн боллоо",
    body: "Орон даяарх сурагчдын чадамжийн үнэлгээ",
    time: "Өчигдөр",
    unread: false,
  },
];
