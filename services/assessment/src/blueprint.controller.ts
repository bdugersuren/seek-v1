import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BlueprintService } from "./blueprint.service";
import { CreateBlueprintDto, UpdateBlueprintDto } from "./dto/blueprint.dto";

@Controller("assessment/blueprints")
export class BlueprintController {
  constructor(private readonly blueprintService: BlueprintService) {}

  @Post()
  async create(@Body() dto: CreateBlueprintDto) {
    return await this.blueprintService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.blueprintService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.blueprintService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateBlueprintDto) {
    return await this.blueprintService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.blueprintService.remove(id);
  }
}
