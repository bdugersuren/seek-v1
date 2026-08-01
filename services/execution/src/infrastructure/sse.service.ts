import { Injectable } from "@nestjs/common";
import { Subject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

export interface SseEvent {
  attemptId: string;
  type: string;
  data: any;
}

// Custom interface matching NestJS MessageEvent spec
export interface SseMessageEvent {
  data: string | object;
  type?: string;
  id?: string;
  retry?: number;
}

@Injectable()
export class SseService {
  private readonly event$ = new Subject<SseEvent>();

  subscribe(attemptId: string): Observable<SseMessageEvent> {
    return this.event$.asObservable().pipe(
      filter((event) => event.attemptId === attemptId),
      map((event) => ({
        data: event.data,
        type: event.type,
      })),
    );
  }

  emitUnlock(attemptId: string, unlockKey: string) {
    this.event$.next({
      attemptId,
      type: "unlock",
      data: { unlockKey },
    });
  }
}
