import { Injectable, ForbiddenException, ConflictException, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CryptoKMSService } from './infrastructure/crypto-kms.service';

@Injectable()
export class CandidateAttemptService {
  constructor(private readonly db:PrismaService, private readonly kms:CryptoKMSService){}
  async prepare(scheduleId:string,userId:string):Promise<any>{
    const secret=process.env.CANDIDATE_INTERNAL_SECRET;
    if(!secret || secret.length<32)throw new ServiceUnavailableException('Шалгалтын үйлчилгээ бэлтгэгдээгүй байна.');
    const response=await fetch(`${process.env.ASSESSMENT_SERVICE_URL || 'http://assessment:3070'}/assessment/candidate/internal/prepare`,{method:'POST',headers:{'Content-Type':'application/json','x-candidate-internal-secret':secret},body:JSON.stringify({scheduleId,userId}),signal:AbortSignal.timeout(10000)});
    const data=await response.json();
    if(!response.ok){if(response.status===403)throw new ForbiddenException(data.message);throw new ConflictException(data.message || 'Шалгалтын эрхийг шалгаж чадсангүй.');}
    return data;
  }
  async create(scheduleId:string,userId:string){
    if(typeof scheduleId!=='string'||!scheduleId)throw new BadRequestException('Шалгалт сонгоно уу.');
    const data=await this.prepare(scheduleId,userId);
    const row=await this.db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtext(${data.assignmentId}))`;
      const active=await tx.quizAttempt.findFirst({where:{assignmentId:data.assignmentId,candidateId:userId,status:{in:['CREATED','IN_PROGRESS']}},orderBy:{attemptNumber:'desc'}});
      if(active)return active;
      const count=await tx.quizAttempt.count({where:{assignmentId:data.assignmentId,candidateId:userId}});
      if(count>=data.maxAttempts)throw new ConflictException('Шалгалтын оролдлогын эрх дууссан.');
      const {questions,maxAttempts,...base}=data;
      return tx.quizAttempt.create({data:{...base,attemptNumber:count+1,status:'CREATED',
        proctoringPolicySnapshot:{requireFullscreen:false,warnOnVisibilityChange:true,warnOnWindowBlur:false,disableCopyPaste:false,disableContextMenu:false,maxWarningsBeforeLock:100,lockOnViolation:false},
        questions:{create:questions.map((q:any,index:number)=>{const {grading,...safe}=q;return {...safe,orderIndex:index+1,gradingConfigCipher:Buffer.from(JSON.stringify(this.kms.encrypt(JSON.stringify(grading))))};})},
        snapshot:{create:{answers:{},markedForReview:{},lastClientSequence:0,lastResponseServerVersion:0}},
      }});
    },{timeout:15000});
    return {attemptId:row.id,quizId:row.quizId,waitingUrl:`/waiting/${row.id}`,status:row.status==='IN_PROGRESS'?'active' as const:'waiting' as const};
  }
  async list(userId:string){return this.db.quizAttempt.findMany({where:{candidateId:userId},select:{id:true,scheduleId:true,status:true,createdAt:true,submittedAt:true,expiresAt:true,attemptNumber:true,scheduleSnapshot:true},orderBy:{createdAt:'desc'}});}
}
