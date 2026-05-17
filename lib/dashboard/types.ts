export type DashboardBooking = {
  id: string;
  serviceId: string;
  serviceName?: string;
  price: number;
  userId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  address: string;
  phone: string;
  notes: string | null;
  addOnIds: string[];
  distanceKm: number;
  pricing: {
    base: number;
    urgency: number;
    distance: number;
    addons: number;
    total: number;
  };
  createdAt: string;
};

export type DashboardInvoice = {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: "unpaid" | "paid" | "void";
  issuedAt: string;
  booking: {
    id: string;
    serviceId: string;
    serviceName?: string;
    date: string;
    time: string;
    pricing: {
      base: number;
      urgency: number;
      distance: number;
      addons: number;
      total: number;
    };
  };
};

export type DashboardStats = {
  totalBookings: number;
  completedServices: number;
  upcomingJobs: number;
  totalSpent: number;
};
