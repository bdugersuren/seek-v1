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
import { QuizService } from "./quiz.service";
import { CreateQuizDto, UpdateQuizDto } from "./dto/quiz.dto";
import { actorFrom } from "./question-workflow";
@Controller("assessment/quizzes")
export class QuizController {
  constructor(private readonly service: QuizService) {}
  @Post() create(@Body() dto: CreateQuizDto, @Req() req: any) {
    return this.service.create({ ...dto, createdBy: actorFrom(req).id });
  }
  @Get() list(@Query() query: any, @Req() req: any) {
    return this.service.findAll(
      query.assessmentContextId,
      req.assessmentAllowedIds,
      query,
      actorFrom(req),
    );
  }
  @Get(":id") get(
    @Param("id") id: string,
    @Query("revisionId") revisionId: string,
    @Req() req: any,
  ) {
    return this.service.findOne(id, actorFrom(req), revisionId);
  }
  @Put(":id") update(
    @Param("id") id: string,
    @Body() dto: UpdateQuizDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, actorFrom(req));
  }
  @Post(":id/revisions") revision(
    @Param("id") id: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.service.newRevision(id, dto, actorFrom(req));
  }
  @Post(":id/preview") preview(
    @Param("id") id: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.service.preview(id, dto, actorFrom(req));
  }
  @Post(":id/workflow") workflow(
    @Param("id") id: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.service.transition(id, dto, actorFrom(req));
  }
  @Get(":id/workflow") async events(@Param("id") id: string, @Req() req: any) {
    return (await this.service.findOne(id, actorFrom(req))).workflow;
  }
  @Delete(":id") remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
