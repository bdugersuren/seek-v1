import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException, UnauthorizedException, NestInterceptor, CallHandler, Controller, Get, Post, Delete, Param, Body, Req } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { PrismaService } from './prisma.service';

@Injectable()
export class ContextAccessGuard implements CanActivate {
  constructor(private readonly db: PrismaService) {}
  async canActivate(execution: ExecutionContext) {
    const req = execution.switchToHttp().getRequest();
    const path = req.path.replace(/\/$/, '');
    if (!path.startsWith('/assessment/') || path === '/assessment/catalog' || path.startsWith('/assessment/catalog/')) return true;
    if (path.startsWith('/assessment/candidate/')) return true; // CandidateController enforces its own candidate/admin/internal guards.
    const userId = req.headers['x-user-id'];
    const roles = String(req.headers['x-user-roles'] || '').split(',');
    if (!userId || typeof userId !== 'string') throw new UnauthorizedException();
    if (roles.includes('SUPER_ADMIN')) return true;
    if (!roles.includes('ASSESSOR')) throw new ForbiddenException();
    const grants = await this.db.assessorContextGrant.findMany({where:{userId, context:{isActive:true}},include:{context:true}});
    const contexts = grants.map(g=>g.context);
    const ids = contexts.map(c=>c.id);
    const deny = () => { throw new ForbiddenException('Context access is not assigned'); };
    const contextId = req.query.assessmentContextId;
    if (contextId !== undefined && (typeof contextId !== 'string' || !ids.includes(contextId))) deny();
    const scope = contextId ? [contextId] : ids;
    const metadata = path.match(/^\/assessment\/questions\/metadata\/([a-z-]+)$/);
    if (metadata) {
      if (req.method !== 'GET') deny();
      const cs = contexts.filter(c=>scope.includes(c.id));
      const pick = (key: string) => cs.map(c=>c[key]).filter(Boolean);
      let rows: {id:string}[];
      switch(metadata[1]) {
        case 'assessment-contexts': rows=cs; break;
        case 'audience-types': rows=await this.db.audienceType.findMany({where:{id:{in:pick('audienceTypeId')},isActive:true},select:{id:true}});break;
        case 'audience-levels': rows=await this.db.audienceLevel.findMany({where:{audienceTypeId:{in:pick('audienceTypeId')},isActive:true},select:{id:true}});break;
        case 'topics': rows=await this.db.topic.findMany({where:{assessmentContextId:{in:scope},isActive:true},select:{id:true}});break;
        case 'difficulty-scales': rows=await this.db.difficultyScale.findMany({where:{id:{in:pick('difficultyScaleId')},isActive:true},select:{id:true}});break;
        case 'difficulty-levels': rows=await this.db.difficultyLevel.findMany({where:{difficultyScaleId:{in:pick('difficultyScaleId')},isActive:true},select:{id:true}});break;
        case 'cognitive-frameworks': rows=await this.db.cognitiveFramework.findMany({where:{id:{in:pick('cognitiveFrameworkId')},isActive:true},select:{id:true}});break;
        case 'cognitive-levels': rows=await this.db.cognitiveLevel.findMany({where:{cognitiveFrameworkId:{in:pick('cognitiveFrameworkId')},isActive:true},select:{id:true}});break;
        case 'competence-frameworks': rows=await this.db.competenceFramework.findMany({where:{id:{in:pick('competenceFrameworkId')},isActive:true},select:{id:true}});break;
        case 'competence-types': rows=await this.db.competenceType.findMany({where:{competenceFrameworkId:{in:pick('competenceFrameworkId')},isActive:true},select:{id:true}});break;
        default: return deny();
      }
      req.assessmentAllowedIds = new Set(rows.map(r=>r.id));
      return true;
    }
    const candidates = path === '/assessment/blueprints/candidates';
    if(candidates){if(req.method!=='GET'||!contextId)return deny();return true;}
    const preview = path === '/assessment/blueprints/preview';
    const duplicate = path.match(/^\/assessment\/blueprints\/([^/]+)\/duplicate$/);
    const quizSub = path.match(/^\/assessment\/quizzes\/([^/]+)\/(revisions|preview)$/);
    const resourcePath = quizSub ? '/assessment/quizzes/'+quizSub[1] : preview ? '/assessment/blueprints' : duplicate ? '/assessment/blueprints/'+duplicate[1] : path;
    const resource = resourcePath.match(/^\/assessment\/(questions|blueprints|quizzes)(?:\/([^/]+))?(?:\/(workflow))?$/);
    if (!resource || !['GET','POST','PUT','DELETE'].includes(req.method)) return deny();
    const [,kind,id,workflow]=resource;
    const questions = await this.db.question.findMany({where:{ownerUserId:userId,deletedAt:null,AND:[{OR:[{assessmentContextId:{in:scope}},{assessmentContextId:null,classifications:{some:{assessmentContextId:{in:scope}}}}]},{classifications:{every:{assessmentContextId:{in:ids}}}}]},select:{id:true}});
    const qids=questions.map(q=>q.id);
    const templates=await this.db.quizTemplate.findMany({where:{createdBy:userId,assessmentContextId:{in:scope}},select:{id:true,assessmentContextId:true}});
    const tids=templates.map(t=>t.id);
    const quizzes=await this.db.quiz.findMany({where:{createdBy:userId,templateId:{in:tids},revisions:{every:{assessmentContextId:{in:ids}}}},select:{id:true}});
    const allowed=kind==='questions'?qids:kind==='blueprints'?tids:quizzes.map(q=>q.id);
    if (id && !allowed.includes(id)) return deny();
    if ((preview || duplicate) && req.method !== 'POST') return deny();
    if (duplicate) return true;
    if (quizSub && req.method!=='POST') return deny();
    if (req.method==='GET') {
      if(kind==='questions') req.query.ownerUserId=userId;
      if (!id) req.assessmentAllowedIds=new Set(allowed);
      return true;
    }
    if (req.method==='DELETE') { if (!id || workflow) return deny(); return true; }
    const body=req.body;
    if (!body || typeof body!=='object' || Array.isArray(body)) throw new BadRequestException();
    body.ownerUserId=userId;body.createdBy=userId;body.actorUserId=userId;
    if (workflow) {
      if (req.method!=='POST' || !(kind==='quizzes'?['approval_requested','withdraw','reopen']:['approval_requested','resubmitted','withdraw']).includes(body.action)) return deny();
      if(kind==='blueprints') throw new BadRequestException('Blueprint нь автомат бэлэн эсэхийн шалгалттай.');
      if(kind==='questions' && body.action!=='withdraw' && !await this.db.topicQuestionClassification.count({where:{questionId:id}})) throw new BadRequestException('Батлуулахын өмнө сэдэв, хүндрэлийн болон танин мэдэхүйн түвшнийг сонгоно уу.');
      return true;
    }
    if ((!id && req.method!=='POST') || (id && req.method!==(quizSub?'POST':'PUT'))) return deny();
    if (kind==='questions') {
      body.visibilityScope='PRIVATE';
      if (body.parentId && !qids.includes(body.parentId)) return deny();
      const existing = id ? await this.db.question.findUnique({where:{id},select:{assessmentContextId:true,versions:{orderBy:{versionNumber:'desc'},take:1,select:{versionStatus:true}}}}) : null;
      if(body.assessmentContextId!==undefined && (typeof body.assessmentContextId!=='string'||!ids.includes(body.assessmentContextId))) return deny();
      if(existing && body.assessmentContextId!==undefined && body.assessmentContextId!==existing.assessmentContextId) return deny();
      const draftContext = existing?.assessmentContextId || body.assessmentContextId;
      if (!id && !draftContext && (!Array.isArray(body.topicMappings)||!body.topicMappings.length)) throw new BadRequestException('Ноорог үүсгэх контекстээ сонгоно уу.');
      if (body.topicMappings!==undefined) {
        if (!Array.isArray(body.topicMappings)) throw new BadRequestException('Invalid topic mappings');
        if (!body.topicMappings.length && (!draftContext || (existing && existing.versions[0]?.versionStatus!=='DRAFT'))) throw new BadRequestException('Сэдвийн ангилал шаардлагатай.');
        for(const m of body.topicMappings) {
          if (!m || typeof m!=='object') throw new BadRequestException('Invalid topic mapping');
          const topic=await this.db.topic.findUnique({where:{id:String(m.topicId)}});
          if (!topic || !topic.isActive || !topic.assessmentContextId || !ids.includes(topic.assessmentContextId)) return deny();
          if(draftContext && topic.assessmentContextId!==draftContext) return deny();
          const c=contexts.find(c=>c.id===topic.assessmentContextId)!;
          if (m.assessmentContextId && m.assessmentContextId!==c.id) return deny();
          m.assessmentContextId=c.id;
          const d=await this.db.difficultyLevel.findFirst({where:{difficultyScaleId:c.difficultyScaleId,isActive:true,OR:[{id:String(m.difficulty)},{code:{equals:String(m.difficulty),mode:'insensitive'}}]}});
          if(!d) throw new BadRequestException('Difficulty level does not belong to the context');
          m.difficulty=d.id;
          const levels=await this.db.cognitiveLevel.findMany({where:{cognitiveFrameworkId:c.cognitiveFrameworkId,isActive:true}});
          if(Array.isArray(m.cognitiveLevels)&&m.cognitiveLevels.length) {
            for(const l of m.cognitiveLevels) if(!levels.some(x=>x.id===l.cognitiveLevelId)||!Number.isFinite(Number(l.weight??1))||Number(l.weight??1)<0) throw new BadRequestException('Invalid cognitive level');
            m.bloomLevel=m.cognitiveLevels[0].cognitiveLevelId;
          } else {
            const l=levels.find(l=>l.id===m.bloomLevel||l.code.toLowerCase()===String(m.bloomLevel).toLowerCase());
            if(!l) throw new BadRequestException('Cognitive level does not belong to the context');m.bloomLevel=l.id;
          }
          if(m.competencies!==undefined && !Array.isArray(m.competencies)) throw new BadRequestException('Invalid competencies');
          for(const x of m.competencies||[]) if(!await this.db.competenceType.findFirst({where:{id:String(x.competenceId),competenceFrameworkId:c.competenceFrameworkId,isActive:true}})) throw new BadRequestException('Competence does not belong to the context');
        }
      }
    } else if(kind==='blueprints') {
      const c=body.assessmentContextId || templates.find(t=>t.id===id)?.assessmentContextId;
      if(!c||!ids.includes(c)) return deny();
      if(id&&c!==templates.find(t=>t.id===id)?.assessmentContextId) return deny();
      body.assessmentContextId=c;
      if(body.sections!==undefined) {
        if(!Array.isArray(body.sections)) throw new BadRequestException('Invalid sections');
        const oldLinks=id?await this.db.sectionQuestion.findMany({where:{section:{templateId:id}},select:{questionId:true}}):[];
        for(const section of body.sections) {
          if(!section || typeof section!=='object' || Array.isArray(section)) throw new BadRequestException('Invalid section');
          if(!Array.isArray(section.selectedQuestionIds)) throw new BadRequestException('Question selection required');
          for(const qid of section.selectedQuestionIds) if(!oldLinks.some(x=>x.questionId===qid)&&(!qids.includes(qid)||!await this.db.topicQuestionClassification.findFirst({where:{questionId:qid,assessmentContextId:c}}))) return deny();
        }
      }
    } else {
      if(!id&&!tids.includes(body.blueprintId)) return deny();
      const templateId=id?(await this.db.quiz.findUnique({where:{id},select:{templateId:true}}))?.templateId:body.blueprintId;
      const selected=await this.db.sectionQuestion.findMany({where:{section:{templateId}},select:{questionId:true}});
      if(body.questionOverrides!==undefined&&!Array.isArray(body.questionOverrides)) throw new BadRequestException('Invalid overrides');
      for(const o of body.questionOverrides||[]) { if(!o || typeof o!=='object') throw new BadRequestException('Invalid override'); if(!qids.includes(o.questionId)) return deny(); } // Shared resolver validates fixed/rule membership.
    }
    return true;
  }
}
@Injectable()
export class ContextAccessFilter implements NestInterceptor {
  intercept(context: ExecutionContext,next:CallHandler) {
    const ids=context.switchToHttp().getRequest().assessmentAllowedIds as Set<string>|undefined;
    return next.handle().pipe(map(data=>ids&&Array.isArray(data)?data.filter(row=>ids.has(row.id)):data));
  }
}
@Controller('assessment/context-access')
export class ContextAccessController {
  constructor(private readonly db:PrismaService) {}
  @Get(':contextId')
  list(@Param('contextId') contextId:string) { return this.db.assessorContextGrant.findMany({where:{contextId},orderBy:{createdAt:'asc'}}); }
  @Post(':contextId')
  async grant(@Param('contextId') contextId:string,@Body() body:{userId:string},@Req() req:any) {
    if(typeof body?.userId!=='string'||!body.userId) throw new BadRequestException('User required');
    if(!await this.db.assessmentContext.findUnique({where:{id:contextId}})) throw new BadRequestException('Context not found');
    // Verify the target account via auth using the administrator's authenticated token.
    const response=await fetch((process.env.INTERNAL_GATEWAY_URL||'http://gateway:3010')+'/api/v1/auth/admin/users',{headers:{authorization:req.headers.authorization||''},signal:AbortSignal.timeout(10000)});
    if(!response.ok) throw new BadRequestException('Unable to validate target user');
    const users=await response.json() as {id:string;status:string;roles:string[]}[];
    const user=users.find(u=>u.id===body.userId);
    if(!user||user.status!=='ACTIVE'||!user.roles.includes('ASSESSOR')) throw new BadRequestException('Active ASSESSOR account required');
    return this.db.assessorContextGrant.upsert({where:{contextId_userId:{contextId,userId:body.userId}},update:{},create:{contextId,userId:body.userId,assignedBy:req.headers['x-user-id']}});
  }
  @Delete(':contextId/:userId')
  async revoke(@Param('contextId') contextId:string,@Param('userId') userId:string) { await this.db.assessorContextGrant.deleteMany({where:{contextId,userId}});return {ok:true}; }
}
