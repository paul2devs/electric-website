export type AdminOverview = {
  metrics: {
    totalRevenue: number;
    totalBookings: number;
    pendingJobs: number;
    completedJobs: number;
    activeTechnicians: number;
  };
  activity: Array<{
    id: string;
    status: string;
    createdAt: string;
    serviceId: string;
  }>;
};

export type AdminBooking = {
  id: string;
  userId: string;
  serviceId: string;
  technicianId: string | null;
  date: string;
  time: string;
  status: string;
  address: string;
  phone: string;
  notes: string | null;
  price: number;
  baseAmount: number;
  urgencyFee: number;
  distanceFee: number;
  addonsFee: number;
  distanceKm: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  service: {
    id: string;
    name: string;
    category: string;
  };
  technician: {
    id: string;
    name: string;
  } | null;
};

export type AdminServiceRow = {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  category: string;
  basePrice: number;
  duration: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  bookingsCount: number;
};

export type AdminTechnician = {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  status: "available" | "busy" | "offline";
  activeJobs: number;
};

export type AdminFeedbackStatus = "new" | "read" | "archived";

export type AdminFeedback = {
  id: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  message: string;
  status: AdminFeedbackStatus;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
};

export type AdminAnalytics = {
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; value: number }>;
  popularServices: Array<{ serviceId: string; name: string; count: number }>;
  peakBookingTimes: Array<{ time: string; count: number }>;
};
