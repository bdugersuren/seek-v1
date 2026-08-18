import { Controller, Get, Headers } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

@Controller("assessment/catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async getCatalog(@Headers("x-user-id") userId?: string) {
    return await this.catalogService.getCatalog(userId);
  }
}
