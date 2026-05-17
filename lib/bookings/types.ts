export type ServiceAddOn = {
  id: string;
  name: string;
  price: number;
  serviceId: string;
};

export type BackendService = {
  id: string;
  name: string;
  slug?: string | null;
  imageUrl?: string | null;
  category: string;
  basePrice: number;
  duration: number;
  pricingType: string;
  createdAt: string;
  addOns: ServiceAddOn[];
};

export type PricingBreakdown = {
  base: number;
  urgency: number;
  distance: number;
  addons: number;
  total: number;
};

export type PricingResult = {
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  addOnIds: string[];
  distanceKm: number;
  breakdown: PricingBreakdown;
};

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export type BookingDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  mockDistanceKm: number;
};

export type BookingResult = {
  id: string;
  serviceId: string;
  serviceName?: string;
  userId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  address: string;
  phone: string;
  notes: string | null;
  addOnIds: string[];
  price: number;
  pricing: {
    base: number;
    urgency: number;
    distance: number;
    addons: number;
    total: number;
  };
  createdAt: string;
};
