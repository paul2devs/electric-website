import { Controller, Get } from "@nestjs/common";

import { ServicesService, type ServiceWithAddOns } from "./services.service";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async list(): Promise<ServiceWithAddOns[]> {
    return this.servicesService.list();
  }
}
