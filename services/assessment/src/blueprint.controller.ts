import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { BlueprintService } from "./blueprint.service";
import { CreateBlueprintDto, UpdateBlueprintDto } from "./dto/blueprint.dto";

@Controller("assessment/blueprints")
export class BlueprintController {
  constructor(private readonly blueprintService: BlueprintService) {}

  @Post()
  async create(@Body() dto: CreateBlueprintDto, @Req() req: any) {
    return await this.blueprintService.create({
      ...dto,
      createdBy: req.headers["x-user-id"],
    });
  }

  @Get()
  async findAll(@Query() query: any, @Req() req: any) {
    return await this.blueprintService.findAll(
      query.assessmentContextId,
      req.assessmentAllowedIds,
      query,
    );
  }

  @Get("candidates")
  candidates(@Query() query: any, @Req() req: any) {
    return this.blueprintService.candidates(query, req.headers["x-user-id"]);
  }

  @Post("preview")
  preview(@Body() dto: any, @Req() req: any) {
    return this.blueprintService.preview(dto, req.headers["x-user-id"]);
  }

  @Post(":id/duplicate")
  duplicate(@Param("id") id: string, @Req() req: any) {
    return this.blueprintService.duplicate(id, req.headers["x-user-id"]);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.blueprintService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateBlueprintDto,
    @Req() req: any,
  ) {
    return await this.blueprintService.update(
      id,
      dto,
      req.headers["x-user-id"],
    );
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.blueprintService.remove(id);
  }
}
