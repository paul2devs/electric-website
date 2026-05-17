import { ServicesService, type ServiceWithAddOns } from "./services.service";
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    list(): Promise<ServiceWithAddOns[]>;
}
