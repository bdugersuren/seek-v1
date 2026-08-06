import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateQuizDto, UpdateQuizDto } from "./dto/quiz.dto";

@Controller("assessment/quizzes")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async create(@Body() dto: CreateQuizDto) {
    return await this.quizService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.quizService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.quizService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateQuizDto) {
    return await this.quizService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.quizService.remove(id);
  }
}
