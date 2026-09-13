import { AttemptOwnerGuard } from './attempt-owner.guard';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AttemptOwnerGuard', () => {
  const execution = { getSession: jest.fn() };
  const guard = new AttemptOwnerGuard(execution as any, {prepare: jest.fn()} as any);
  const context = (user: string | undefined, attemptId = 'attempt-1') => ({
    switchToHttp: () => ({getRequest: () => ({headers: {'x-user-id':user}, params:{attemptId}, body:{}, path:'/execution/session/attempt-1'})}),
  }) as ExecutionContext;
  it('rejects anonymous access before loading an attempt', async () => {
    execution.getSession.mockClear();
    await expect(guard.canActivate(context(undefined))).rejects.toBeInstanceOf(UnauthorizedException);
    expect(execution.getSession).not.toHaveBeenCalled();
  });
  it('rejects a different candidate even with a valid identity', async () => {
    execution.getSession.mockResolvedValue({session:{userId:'owner'}});
    await expect(guard.canActivate(context('other'))).rejects.toBeInstanceOf(ForbiddenException);
  });
  it('permits the attempt owner', async () => {
    execution.getSession.mockResolvedValue({session:{userId:'owner'}});
    await expect(guard.canActivate(context('owner'))).resolves.toBe(true);
  });
});
