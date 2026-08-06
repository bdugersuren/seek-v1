import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { CreateQuestionDto, UpdateQuestionDto } from "./dto/question.dto";

@Controller("assessment/questions")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() dto: CreateQuestionDto) {
    return await this.questionService.create(dto);
  }

  @Get()
  async findAll(
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("search") search?: string,
    @Query("ownerUserId") ownerUserId?: string
  ) {
    return await this.questionService.findAll({ status, type, search, ownerUserId });
  }

  @Get("metadata/topics")
  async getTopics() {
    return await this.questionService.getTopics();
  }

  @Get("metadata/difficulty-levels")
  async getDifficultyLevels() {
    return await this.questionService.getDifficultyLevels();
  }

  @Get("metadata/cognitive-levels")
  async getCognitiveLevels() {
    return await this.questionService.getCognitiveLevels();
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
  async getAudienceLevels() {
    return await this.questionService.getAudienceLevels();
  }

  @Post("metadata/audience-levels")
  async createAudienceLevel(@Body() dto: any) {
    return await this.questionService.createAudienceLevel(dto);
  }

  @Put("metadata/audience-levels/:id")
  async updateAudienceLevel(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateAudienceLevel(id, dto);
  }

  @Delete("metadata/audience-levels/:id")
  async deleteAudienceLevel(@Param("id") id: string) {
    return await this.questionService.deleteAudienceLevel(id);
  }

  // AudienceType endpoints
  @Get("metadata/audience-types")
  async getAudienceTypes() {
    return await this.questionService.getAudienceTypes();
  }

  @Post("metadata/audience-types")
  async createAudienceType(@Body() dto: any) {
    return await this.questionService.createAudienceType(dto);
  }

  @Put("metadata/audience-types/:id")
  async updateAudienceType(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateAudienceType(id, dto);
  }

  @Delete("metadata/audience-types/:id")
  async deleteAudienceType(@Param("id") id: string) {
    return await this.questionService.deleteAudienceType(id);
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
  async createCognitiveLevel(@Body() dto: any) {
    return await this.questionService.createCognitiveLevel(dto);
  }

  @Put("metadata/cognitive-levels/:id")
  async updateCognitiveLevel(@Param("id") id: string, @Body() dto: any) {
    return await this.questionService.updateCognitiveLevel(id, dto);
  }

  @Delete("metadata/cognitive-levels/:id")
  async deleteCognitiveLevel(@Param("id") id: string) {
    return await this.questionService.deleteCognitiveLevel(id);
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
    @Body() dto: any
  ) {
    return await this.questionService.updateDbData(modelName, id, dto);
  }

  @Delete("db/:modelName/:id")
  async deleteDbData(@Param("modelName") modelName: string, @Param("id") id: string) {
    return await this.questionService.deleteDbData(modelName, id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.questionService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateQuestionDto) {
    return await this.questionService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.questionService.remove(id);
  }
}
