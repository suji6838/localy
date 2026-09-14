export type BookingRequest = {
  id: string;
  createdAt: string;
  courseSlug?: string;
  serviceType: string;
  neighborhood: string;
  preferredDate: string;
  preferredTime: string;
  guestName: string;
  phone: string;
  email: string;
  notes?: string;
};
