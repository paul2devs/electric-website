export type BookingFlowInit = {
  serviceId?: string;
  projectSlug?: string;
  inspiredBy?: string;
};

export function normalizeBookingFlowInit(
  init?: BookingFlowInit | string,
): BookingFlowInit {
  if (typeof init === "string") {
    return { serviceId: init };
  }
  return init ?? {};
}
