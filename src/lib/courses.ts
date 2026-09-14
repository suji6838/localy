export type Neighborhood = "gangnam" | "seongsu" | "hongdae";

export const NEIGHBORHOODS: { id: Neighborhood; ko: string; en: string }[] = [
  { id: "gangnam", ko: "강남", en: "GANGNAM" },
  { id: "seongsu", ko: "성수", en: "SEONGSU" },
  { id: "hongdae", ko: "홍대", en: "HONGDAE" },
];

export type CourseCategory = "beginner" | "wedding" | "skincare";

export const CATEGORIES: { id: CourseCategory; ko: string; en: string }[] = [
  { id: "beginner", ko: "K-뷰티 입문", en: "First glow in Seoul" },
  { id: "wedding", ko: "웨딩 메이크업", en: "A polished Seoul look" },
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
    title: "웨딩 메이크업 코스",
    tagline: "A polished Seoul look",
    description:
      "특별한 날을 위한 맑고 섬세한 메이크업 영감을 모은 프리미엄 코스예요.",
    neighborhood: "gangnam",
    duration: "약 4시간",
    priceFrom: 259000,
    stops: [
      { name: "웨딩 헤어·메이크업 리허설", type: "Partner Business" },
      { name: "드레스 핏 스튜디오 촬영", type: "Local Creator" },
      { name: "네일 &핸드 케어", type: "Local Expert" },
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
