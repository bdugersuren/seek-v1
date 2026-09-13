import { Controller, Get, Post, Param, Body, Req, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AttemptOwnerGuard } from './attempt-owner.guard';
import { GradingService } from './grading.service';
@Controller('execution')
export class ResultsController {
 constructor(private readonly grading:GradingService){}
 private admin(req:any){if(!req.headers['x-user-id'])throw new UnauthorizedException();if(!String(req.headers['x-user-roles']||'').split(',').includes('SUPER_ADMIN'))throw new ForbiddenException();return req.headers['x-user-id'];}
 @Get('runtime/attempts/:attemptId/result') @UseGuards(AttemptOwnerGuard)
 result(@Param('attemptId') id:string){return this.grading.read(id);}
 @Get('admin/results') queue(@Req() req:any){this.admin(req);return this.grading.queue();}
 @Get('admin/results/:id') detail(@Req() req:any,@Param('id') id:string){this.admin(req);return this.grading.read(id,true);}
 @Post('admin/results/:id') review(@Req() req:any,@Param('id') id:string,@Body() body:any){return this.grading.review(id,this.admin(req),body);}
}
