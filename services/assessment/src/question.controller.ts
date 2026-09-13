import { questionBank } from "./question-bank";
import { PrismaService } from "./prisma.service";
import { CognitiveService } from "./cognitive.service";
import { CognitiveFrameworkInput, CognitiveLevelInput } from "./dto/cognitive.dto";
import { AudienceService } from "./audience.service";
import { AudienceTypeInput, AudienceLevelInput } from "./dto/audience.dto";
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
  ForbiddenException,
} from "@nestjs/common";
import { actorFrom, decorateQuestion } from "./question-workflow";
import { QuestionService } from "./question.service";
import { CreateQuestionDto, UpdateQuestionDto } from "./dto/question.dto";

@Controller("assessment/questions")
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly db: PrismaService,
    private readonly audienceService: AudienceService,
    private readonly cognitiveService: CognitiveService,
  ) {}

  @Post()
  async create(@Body() dto: CreateQuestionDto, @Req() req: any) {
    return await this.questionService.create({...dto,ownerUserId:actorFrom(req).id});
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("search") search?: string,
    @Query("ownerUserId") ownerUserId?: string,
    @Query("assessmentContextId") assessmentContextId?: string,
  ) {
    if(req.query.bank==='true') {
      const result=await questionBank(this.db,req.query,req.assessmentAllowedIds);
      let statistics:any=null;
      try {
        const secret=process.env.CANDIDATE_INTERNAL_SECRET;
        if(secret && result.items.length){
          const response=await fetch(`${process.env.EXECUTION_SERVICE_URL || 'http://execution:3090'}/execution/internal/question-statistics`,{method:'POST',headers:{'Content-Type':'application/json','x-candidate-internal-secret':secret},body:JSON.stringify({versionIds:result.items.map(q=>q.activeVersion.id)}),signal:AbortSignal.timeout(2000)});
          if(response.ok){const value=await response.json();if(value.schemaVersion===1)statistics=value;}
        }
      }catch { /* Unavailable statistics must not block the question bank. */ }
      return {...result,items:result.items.map(q=>({...decorateQuestion(q,actorFrom(req)),statistics:statistics?{...statistics.items.find((x:any)=>x.versionId===q.activeVersion.id),asOf:statistics.asOf}:null}))};
    }
    if(req.query.review==='true') {
      if(!actorFrom(req).roles.includes('SUPER_ADMIN'))throw new ForbiddenException();
      const result=await this.questionService.reviewQueue(req.query);
      return {...result,items:result.items.map(q=>decorateQuestion(q,actorFrom(req)))};
    }
    const rows = await this.questionService.findAll({
      status,
      type,
      search,
      ownerUserId,
      assessmentContextId,
    });
    return rows.map(q=>decorateQuestion(q,actorFrom(req)));
  }

  @Get("metadata/topics")
  async getTopics(@Query("assessmentContextId") assessmentContextId?: string) {
    return await this.questionService.getTopics(assessmentContextId);
  }

  @Get("metadata/difficulty-levels")
  async getDifficultyLevels() {
    return await this.questionService.getDifficultyLevels();
  }

  @Get("metadata/cognitive-levels")
  async getCognitiveLevels(@Query("cognitiveFrameworkId") id?: string) {
    return await this.cognitiveService.levels(id);
  }

  // AssessmentContext endpoints
  @Get("metadata/assessment-contexts")
  async getAssessmentContexts() {
    return await this.questionService.getAssessmentContexts();
  }

  @Post("metadata/assessment-contexts")
  async createAssessmentContext(@Body() dto: any) {
    return await this.questionService.createAssessmentContext(dto);
  }

  @Put("metadata/assessment-contexts/:id")
  async updateAssessmentContext(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateAssessmentContext(id, dto);
  }

  @Delete("metadata/assessment-contexts/:id")
  async deleteAssessmentContext(@Param("id") id: string) {
    return await this.questionService.deleteAssessmentContext(id);
  }

  // CognitiveFramework endpoints
  @Get("metadata/cognitive-frameworks")
  async getCognitiveFrameworks() {
    return await this.cognitiveService.frameworks();
  }

  @Post("metadata/cognitive-frameworks")
  createCognitiveFramework(@Body() dto: CognitiveFrameworkInput) { return this.cognitiveService.saveFramework(dto); }
  @Put("metadata/cognitive-frameworks/:id")
  updateCognitiveFramework(@Param("id") id: string, @Body() dto: CognitiveFrameworkInput) { return this.cognitiveService.saveFramework(dto, id); }
  @Delete("metadata/cognitive-frameworks/:id")
  deleteCognitiveFramework(@Param("id") id: string) { return this.cognitiveService.deleteFramework(id); }

  // DifficultyScale endpoints
  @Get("metadata/difficulty-scales")
  async getDifficultyScales() {
    return await this.questionService.getDifficultyScales();
  }

  @Post("metadata/difficulty-scales")
  async createDifficultyScale(@Body() dto: any) {
    return await this.questionService.createDifficultyScale(dto);
  }

  @Put("metadata/difficulty-scales/:id")
  async updateDifficultyScale(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateDifficultyScale(id, dto);
  }

  @Delete("metadata/difficulty-scales/:id")
  async deleteDifficultyScale(@Param("id") id: string) {
    return await this.questionService.deleteDifficultyScale(id);
  }

  // CompetenceFramework endpoints
  @Get("metadata/competence-frameworks")
  async getCompetenceFrameworks() {
    return await this.questionService.getCompetenceFrameworks();
  }

  @Post("metadata/competence-frameworks")
  async createCompetenceFramework(@Body() dto: any) {
    return await this.questionService.createCompetenceFramework(dto);
  }

  @Put("metadata/competence-frameworks/:id")
  async updateCompetenceFramework(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateCompetenceFramework(id, dto);
  }

  @Delete("metadata/competence-frameworks/:id")
  async deleteCompetenceFramework(@Param("id") id: string) {
    return await this.questionService.deleteCompetenceFramework(id);
  }

  // CompetenceType endpoints
  @Get("metadata/competence-types")
  async getCompetenceTypes() {
    return await this.questionService.getCompetenceTypes();
  }

  @Post("metadata/competence-types")
  async createCompetenceType(@Body() dto: any) {
    return await this.questionService.createCompetenceType(dto);
  }

  @Put("metadata/competence-types/:id")
  async updateCompetenceType(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateCompetenceType(id, dto);
  }

  @Delete("metadata/competence-types/:id")
  async deleteCompetenceType(@Param("id") id: string) {
    return await this.questionService.deleteCompetenceType(id);
  }

  // AudienceLevel endpoints
  @Get("metadata/audience-levels")
  async getAudienceLevels(@Query("audienceTypeId") typeId?: string) {
    return await this.audienceService.levels(typeId);
  }

  @Post("metadata/audience-levels")
  async createAudienceLevel(@Body() dto: AudienceLevelInput) {
    return await this.audienceService.saveLevel(dto);
  }

  @Put("metadata/audience-levels/:id")
  async updateAudienceLevel(
    @Param("id") id: string,
    @Body() dto: AudienceLevelInput,
  ) {
    return await this.audienceService.saveLevel(dto, id);
  }

  @Delete("metadata/audience-levels/:id")
  async deleteAudienceLevel(@Param("id") id: string) {
    return await this.audienceService.deleteLevel(id);
  }

  // AudienceType endpoints
  @Get("metadata/audience-types")
  async getAudienceTypes() {
    return await this.audienceService.types();
  }

  @Post("metadata/audience-types")
  async createAudienceType(@Body() dto: AudienceTypeInput) {
    return await this.audienceService.saveType(dto);
  }

  @Put("metadata/audience-types/:id")
  async updateAudienceType(
    @Param("id") id: string,
    @Body() dto: AudienceTypeInput,
  ) {
    return await this.audienceService.saveType(dto, id);
  }

  @Delete("metadata/audience-types/:id")
  async deleteAudienceType(@Param("id") id: string) {
    return await this.audienceService.deleteType(id);
  }

  // Topics CRUD endpoints
  @Post("metadata/topics")
  async createTopic(@Body() dto: any) {
    return await this.questionService.createTopic(dto);
  }

  @Put("metadata/topics/:id")
  async updateTopic(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateTopic(id, dto);
  }

  @Delete("metadata/topics/:id")
  async deleteTopic(@Param("id") id: string) {
    return await this.questionService.deleteTopic(id);
  }

  // Difficulty Levels CRUD endpoints
  @Post("metadata/difficulty-levels")
  async createDifficultyLevel(@Body() dto: any) {
    return await this.questionService.createDifficultyLevel(dto);
  }

  @Put("metadata/difficulty-levels/:id")
  async updateDifficultyLevel(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateDifficultyLevel(id, dto);
  }

  @Delete("metadata/difficulty-levels/:id")
  async deleteDifficultyLevel(@Param("id") id: string) {
    return await this.questionService.deleteDifficultyLevel(id);
  }

  // Cognitive Levels CRUD endpoints
  @Post("metadata/cognitive-levels")
  async createCognitiveLevel(@Body() dto: CognitiveLevelInput) {
    return await this.cognitiveService.saveLevel(dto);
  }

  @Put("metadata/cognitive-levels/:id")
  async updateCognitiveLevel(@Param("id") id: string, @Body() dto: CognitiveLevelInput) {
    return await this.cognitiveService.saveLevel(dto, id);
  }

  @Delete("metadata/cognitive-levels/:id")
  async deleteCognitiveLevel(@Param("id") id: string) {
    return await this.cognitiveService.deleteLevel(id);
  }

  // Dynamic Database Explorer endpoints
  @Get("db/tables")
  async getDbTables() {
    return await this.questionService.getDbTables();
  }

  @Get("db/:modelName")
  async getDbData(@Param("modelName") modelName: string) {
    return await this.questionService.getDbData(modelName);
  }

  @Post("db/:modelName")
  async createDbData(@Param("modelName") modelName: string, @Body() dto: any) {
    return await this.questionService.createDbData(modelName, dto);
  }

  @Put("db/:modelName/:id")
  async updateDbData(
    @Param("modelName") modelName: string,
    @Param("id") id: string,
    @Body() dto: any,
  ) {
    return await this.questionService.updateDbData(modelName, id, dto);
  }

  @Delete("db/:modelName/:id")
  async deleteDbData(
    @Param("modelName") modelName: string,
    @Param("id") id: string,
  ) {
    return await this.questionService.deleteDbData(modelName, id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req:any) {
    return decorateQuestion(await this.questionService.findOne(id),actorFrom(req));
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateQuestionDto, @Req() req:any) {
    return await this.questionService.update(id, {...dto,ownerUserId:actorFrom(req).id});
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.questionService.remove(id);
  }
}
