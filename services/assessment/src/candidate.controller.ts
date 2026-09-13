import { Body, Controller, Get, Post, Delete, Param, Req, Injectable, HttpException, ForbiddenException, UnauthorizedException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { PrismaService } from './prisma.service';

@Controller('assessment/candidate')
export class CandidateController {
  constructor(private readonly db: PrismaService) {}
  private readonly joinAttempts = new Map<string, { count: number; until: number }>();
  private user(req: any, admin = false): string {
    const id = req.headers['x-user-id'];
    const roles = String(req.headers['x-user-roles'] || '').split(',');
    if (typeof id !== 'string' || !id) throw new UnauthorizedException();
    if (!roles.includes('SUPER_ADMIN') && (admin || !roles.includes('CANDIDATE'))) throw new ForbiddenException();
    return id;
  }
  private internal(req: any) {
    const expected = process.env.CANDIDATE_INTERNAL_SECRET || '';
    const actual = String(req.headers['x-candidate-internal-secret'] || '');
    if (expected.length < 32 || actual.length !== expected.length || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) throw new UnauthorizedException();
  }
  @Get('assignments')
  async assignments(@Req() req: any) {
    const userId = this.user(req);
    const rows = await this.db.quizUserAssignment.findMany({where:{userId, status:{not:'REVOKED'}}, include:{schedule:{include:{quizRevision:true}}},orderBy:{assignedAt:'desc'}});
    return rows.map(a => ({id:a.id,scheduleId:a.scheduleId,title:a.schedule.name,status:a.status,scheduleStatus:a.schedule.status,
      availableFrom:a.availableFromOverride || a.schedule.availableFrom,availableUntil:a.availableUntilOverride || a.schedule.availableUntil,
      timezone:a.schedule.timezone,durationMinutes:a.schedule.durationMinutesOverride || a.schedule.quizRevision.durationMinutes,
      resultReleaseAt:a.schedule.resultReleaseAt,waitingRoomOpensAt:a.schedule.waitingRoomOpensAt,maxAttempts:a.maxAttemptsOverride || a.schedule.maxAttemptsOverride || 1}));
  }
  @Get('facets')
  async facets(@Req() req:any){const userId=this.user(req);const rows=await this.db.quizUserAssignment.findMany({where:{userId,status:{not:'REVOKED'}},include:{schedule:{include:{quizRevision:{include:{assessmentContext:{include:{audienceType:true}}}}}}}});return [...new Map(rows.map(r=>{const t=r.schedule.quizRevision.assessmentContext.audienceType;return [t.id,{id:t.id,name:t.name,code:t.code}];})).values()];}
  @Post('join')
  async join(@Req() req: any, @Body() body: {code?: string}) {
    const userId=this.user(req);
    const now=Date.now();for(const [id,entry] of this.joinAttempts)if(entry.until<=now)this.joinAttempts.delete(id);
    const limit=this.joinAttempts.get(userId)||{count:0,until:now+60000};
    if(++limit.count>10)throw new HttpException('Кодыг олон удаа шалгалаа. Нэг минутын дараа дахин оролдоно уу.',429);
    this.joinAttempts.set(userId,limit);
    if(typeof body.code!=='string')throw new BadRequestException('Зөв код оруулна уу.');
    const code=body.code.trim();
    if (!code || code.length>128) throw new BadRequestException('Зөв код оруулна уу.');
    const schedule=await this.db.quizSchedule.findFirst({where:{accessCodeHash:createHash('sha256').update(code).digest('hex'),accessMode:'OPEN_WITH_CODE',status:{in:['OPEN','SCHEDULED','ACTIVE']}}});
    if(!schedule || schedule.availableUntil < new Date()) throw new NotFoundException('Код буруу эсвэл хугацаа дууссан байна.');
    return this.db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM quiz_schedule WHERE id=${schedule.id} FOR UPDATE`;
      const existing=await tx.quizUserAssignment.findUnique({where:{scheduleId_userId:{scheduleId:schedule.id,userId}}});
      if(existing?.status==='REVOKED') throw new ForbiddenException('Энэ шалгалтад нэгдэх эрх цуцлагдсан.');
      if(existing)return {scheduleId:schedule.id};
      if(schedule.capacity && await tx.quizUserAssignment.count({where:{scheduleId:schedule.id,status:{not:'REVOKED'}}})>=schedule.capacity)throw new ConflictException('Шалгалтын оролцогчдын тоо дүүрсэн.');
      await tx.quizUserAssignment.create({data:{scheduleId:schedule.id,userId,status:'REGISTERED',registeredAt:new Date()}});
      return {scheduleId:schedule.id};
    });
  }
  @Get('admin/assignments/:scheduleId')
  async adminAssignments(@Req() req:any,@Param('scheduleId') scheduleId:string){this.user(req,true);return this.db.quizUserAssignment.findMany({where:{scheduleId},orderBy:{assignedAt:'desc'}});}
  @Post('admin/assignments/:scheduleId')
  async assign(@Req() req:any,@Param('scheduleId') scheduleId:string,@Body() body:{userId:string}){
    const actor=this.user(req,true);if(!body.userId || typeof body.userId!=='string')throw new BadRequestException('Хэрэглэгч сонгоно уу.');
    if(!await this.db.quizSchedule.findUnique({where:{id:scheduleId}}))throw new NotFoundException();
    if(process.env.NODE_ENV==='production') {
      const response=await fetch((process.env.INTERNAL_GATEWAY_URL||'http://gateway:3010')+'/api/v1/auth/admin/users',{headers:{authorization:req.headers.authorization||''},signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw new BadRequestException('Хэрэглэгчийн эрхийг шалгаж чадсангүй.');
      const users=await response.json() as {id:string;status:string;roles:string[]}[];
      if(!users.some(u=>u.id===body.userId&&u.status==='ACTIVE'&&u.roles.includes('CANDIDATE')))throw new BadRequestException('Идэвхтэй CANDIDATE хэрэглэгч сонгоно уу.');
    }
    return this.db.quizUserAssignment.upsert({where:{scheduleId_userId:{scheduleId,userId:body.userId}},create:{scheduleId,userId:body.userId,assignedBy:actor},update:{status:'ASSIGNED',revokedAt:null,revokedBy:null,revokeReason:null,assignedBy:actor}});
  }
  @Delete('admin/assignments/:id')
  async revoke(@Req() req:any,@Param('id') id:string){const actor=this.user(req,true);return this.db.quizUserAssignment.update({where:{id},data:{status:'REVOKED',revokedAt:new Date(),revokedBy:actor}});}
  @Post('internal/prepare')
  async prepare(@Req() req:any,@Body() body:{scheduleId:string;userId:string}) {
    this.internal(req);
    const a=await this.db.quizUserAssignment.findUnique({where:{scheduleId_userId:{scheduleId:body.scheduleId,userId:body.userId}},include:{schedule:{include:{paymentPolicy:true,quizRevision:{include:{sections:{orderBy:{orderIndex:'asc'},include:{questions:{orderBy:{orderIndex:'asc'},include:{question:true,questionVersion:{include:{options:true,media:true}}}}}}}}}}}});
    if(!a || a.status==='REVOKED')throw new ForbiddenException('Шалгалтад оролцох эрх байхгүй эсвэл цуцлагдсан.');
    const s=a.schedule;const rev=s.quizRevision;const end=a.availableUntilOverride || s.availableUntil;const start=a.availableFromOverride || s.availableFrom;
    if(!['OPEN','ACTIVE','SCHEDULED'].includes(s.status)||end<=new Date())throw new ConflictException('Шалгалтын хуваарь хаагдсан.');
    if(rev.revisionStatus!=='PUBLISHED')throw new ConflictException('Шалгалтын батлагдсан хувилбар нийтлэгдээгүй.');
    if(s.paymentPolicy?.paymentRequired && a.paymentStatus!=='PAID')throw new ForbiddenException('Төлбөрийн баталгаажуулалт шаардлагатай.');
    const supported=['SINGLE_CHOICE','MULTIPLE_CHOICE','TRUE_FALSE','SHORT_TEXT','NUMERIC','ESSAY','MATCHING','MATRIX'];
    const questions=rev.sections.flatMap(sec=>sec.questions.map(q=>{
      const v=q.questionVersion;if(!supported.includes(v.type))throw new BadRequestException(`Одоогоор ${v.type} төрлийг runtime дэмжихгүй. Нийтлэхийн өмнө засна уу.`);
      const payload=v.payload as any;const options=v.options.length ? v.options : payload?.options || [];
      return {questionId:q.questionId,questionVersionId:v.id,quizRevisionSectionId:sec.id,sectionTitleSnapshot:sec.title,
        questionCodeSnapshot:q.question.code,questionTypeCodeSnapshot:v.type.toLowerCase(),maxScoreSnapshot:Number(q.maxScore),
        contentSnapshot:{prompt:v.body,instruction:v.title || '',rightOptions:(v.scoringConfig as any)?.rightOptions || [],matrixColumns:(v.scoringConfig as any)?.matrixColumns || []},optionsSnapshot:options.map((o:any,i:number)=>({id:String(o.optionKey || o.id || i),label:String(o.value || '')})),
        mediaSnapshot:v.media.map(m=>({id:m.id,mediaType:m.mediaType,altText:m.altText||m.caption||"Шалгалтын хавсралт",url:`https://seek.mn/api/v1/file/objects?storageKey=${encodeURIComponent(m.storageKey)}`})),grading:{type:v.type,options:options.map((o:any,i:number)=>({id:String(o.optionKey||o.id||i),isCorrect:o.isCorrect,score:Number(o.score ?? (o.isCorrect ? v.defaultMaxScore : 0)),value:o.value,matchRules:o.matchRules})),scoringConfig:v.scoringConfig,defaultMaxScore:Number(v.defaultMaxScore),defaultMinScore:Number(v.defaultMinScore),answerConfig:v.answerConfig,rubric:v.rubric}};
    }));
    if(!questions.length)throw new BadRequestException('Шалгалтад асуулт байхгүй.');
    if(new Set(questions.map(q=>q.questionId)).size!==questions.length)throw new BadRequestException('Нэг асуултыг олон хэсэгт давхар оруулах боломжгүй.');
    return {assignmentId:a.id,candidateId:a.userId,scheduleId:s.id,quizId:rev.quizId,quizRevisionId:rev.id,
      durationLimitSeconds:(s.durationMinutesOverride || rev.durationMinutes)*60,maxAttempts:a.maxAttemptsOverride || s.maxAttemptsOverride || 1,
      scheduleSnapshot:{title:s.name,availableFrom:start.toISOString(),availableUntil:end.toISOString(),waitingRoomOpensAt:s.waitingRoomOpensAt?.toISOString(),timezone:s.timezone,resultReleaseAt:s.resultReleaseAt?.toISOString(),passingScore:Number(rev.passingScore),autosaveIntervalSeconds:s.autosaveIntervalSeconds,heartbeatIntervalSeconds:s.heartbeatIntervalSeconds},questions};
  }
}
