import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import type { DomainEventType } from "./constants/event-types";

@Injectable()
export class EventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<TPayload extends Record<string, unknown>>(
    eventType: DomainEventType,
    payload: TPayload,
  ): void {
    this.eventEmitter.emit(eventType, payload);
  }
}
