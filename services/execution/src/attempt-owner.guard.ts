import { CandidateAttemptService } from "./candidate-attempt.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExecutionService } from './execution.service';
@Injectable()
export class AttemptOwnerGuard implements CanActivate {
  constructor(private readonly execution: ExecutionService, private readonly candidateAttempts: CandidateAttemptService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.headers['x-user-id'];
    if (typeof userId !== 'string' || !userId) throw new UnauthorizedException();
    if (process.env.NODE_ENV === 'production' && req.path.includes('/mock-trigger-unlock/')) throw new NotFoundException();
    const attemptId = req.params.attemptId || req.body?.attemptId;
    if (attemptId) {
      const runtime = await this.execution.getSession(attemptId);
      if (runtime.session.userId !== userId) throw new ForbiddenException();
      if (req.method === 'POST' && req.path.includes('/start')) {
        const scheduleId = (runtime.session as any).scheduleId;
        if (scheduleId) await this.candidateAttempts.prepare(scheduleId, userId);
      }
    }
    return true;
  }
}
