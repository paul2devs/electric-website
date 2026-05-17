export declare class CreateBookingDto {
    serviceId: string;
    date: string;
    time: string;
    phone: string;
    address: string;
    notes?: string;
    mockDistanceKm: number;
    addOnIds?: string[];
    quotedTotal: number;
    lockToken: string;
}
