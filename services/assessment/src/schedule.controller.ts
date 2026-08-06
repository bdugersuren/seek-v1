import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDto, UpdateScheduleDto } from "./dto/schedule.dto";

@Controller("assessment/schedules")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return await this.scheduleService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.scheduleService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.scheduleService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateScheduleDto) {
    return await this.scheduleService.update(id, dto);
  }

  @Post(":id/publish")
  async publish(@Param("id") id: string, @Body() body: { actorUserId: string }) {
    return await this.scheduleService.publish(id, body.actorUserId);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.scheduleService.remove(id);
  }
}
