export type Neighborhood = "gangnam" | "seongsu" | "hongdae";

export const NEIGHBORHOODS: { id: Neighborhood; ko: string; en: string }[] = [
  { id: "gangnam", ko: "강남", en: "GANGNAM" },
  { id: "seongsu", ko: "성수", en: "SEONGSU" },
  { id: "hongdae", ko: "홍대", en: "HONGDAE" },
];

export type CourseCategory = "beginner" | "wedding" | "skincare";

export const CATEGORIES: { id: CourseCategory; ko: string; en: string }[] = [
  { id: "beginner", ko: "K-뷰티 입문", en: "First glow in Seoul" },
  { id: "wedding", ko: "메이크업", en: "A polished Seoul look" },
  { id: "skincare", ko: "웰니스 데이", en: "Slow beauty, deep rest" },
];

export type Course = {
  slug: string;
  category: CourseCategory;
  title: string;
  tagline: string;
  description: string;
  neighborhood: Neighborhood;
  duration: string;
  priceFrom: number;
  stops: { name: string; type: string }[];
};

export const COURSES: Course[] = [
  {
    slug: "k-beauty-first-glow",
    category: "beginner",
    title: "K-뷰티 입문 코스",
    tagline: "First glow in Seoul",
    description:
      "퍼스널 진단부터 K-뷰티 쇼핑까지, 서울의 뷰티 문화를 가볍게 만나보세요.",
    neighborhood: "seongsu",
    duration: "약 3시간",
    priceFrom: 89000,
    stops: [
      { name: "피부 퍼스널 진단", type: "Local Expert" },
      { name: "K-뷰티 편집숍 투어", type: "Local Creator" },
      { name: "시그니처 헤어 스타일링", type: "Partner Business" },
    ],
  },
  {
    slug: "wedding-ready-seoul",
    category: "wedding",
    title: "메이크업 코스",
    tagline: "A polished Seoul look",
    description:
      "특별한 날을 위한 맑고 섬세한 메이크업 영감을 모은 프리미엄 코스예요.",
    neighborhood: "gangnam",
    duration: "약 4시간",
    priceFrom: 259000,
    stops: [
      { name: "헤어 메이크업 리허설", type: "Partner Business" },
      { name: "네일 &핸드 케어", type: "Local Expert" },
      { name: "야외 &스튜디오 촬영", type: "Local Creator" },
    ],
  },
  {
    slug: "skincare-slow-day",
    category: "skincare",
    title: "웰니스 데이",
    tagline: "Slow beauty, deep rest",
    description:
      "내 피부를 살피고 편안하게 쉬어가는 케어 중심의 하루를 제안해요.",
    neighborhood: "hongdae",
    duration: "약 5시간",
    priceFrom: 149000,
    stops: [
      { name: "스킨케어", type: "Partner Business" },
      { name: "헤어스파케어", type: "Partner Business" },
      { name: "동네 산책 &티타임", type: "Local Creator" },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return COURSES.find((course) => course.slug === slug);
}

export function getCoursesByNeighborhood(neighborhood: Neighborhood) {
  return COURSES.filter((course) => course.neighborhood === neighborhood);
}

export function categoryLabel(category: CourseCategory) {
  return CATEGORIES.find((c) => c.id === category)?.ko ?? category;
}

export function neighborhoodLabel(neighborhood: Neighborhood) {
  return NEIGHBORHOODS.find((n) => n.id === neighborhood)?.ko ?? neighborhood;
}

// 코스는 카테고리별로 정해진 요일에만 진행된다 (0=일 1=월 2=화 3=수 4=목 5=금 6=토).
export const CATEGORY_WEEKDAYS: Record<CourseCategory, number[]> = {
  beginner: [1, 4], // 월·목
  wedding: [2, 5], // 화·금
  skincare: [3, 6], // 수·토
};

export function isValidCourseDate(category: CourseCategory, dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  return CATEGORY_WEEKDAYS[category].includes(date.getDay());
}

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** 오늘 이후로 해당 코스가 진행되는 다음 날짜 `count`개를 "YYYY-MM-DD" 문자열로 반환한다. */
export function nextAvailableDates(category: CourseCategory, count = 4): { value: string; label: string }[] {
  const weekdays = CATEGORY_WEEKDAYS[category];
  const dates: { value: string; label: string }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1); // 내일부터

  while (dates.length < count) {
    if (weekdays.includes(cursor.getDay())) {
      const value = cursor.toISOString().slice(0, 10);
      const label = `${cursor.getMonth() + 1}월 ${cursor.getDate()}일 (${WEEKDAY_KO[cursor.getDay()]})`;
      dates.push({ value, label });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}
