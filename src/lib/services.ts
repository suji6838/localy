// 파트너 등록의 "전문 분야"와 예약의 "원하는 서비스"가 같은 값을 쓰도록 공유하는 목록.
// 두 폼이 같은 값을 쓰기 때문에 예약이 들어오면 카테고리로 파트너를 자동 매칭할 수 있음.
export const SERVICE_TYPES = [
  "헤어",
  "스킨케어",
  "메이크업",
  "네일",
  "왁싱·제모",
  "스파·마사지",
  "웨딩",
  "기타",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];
