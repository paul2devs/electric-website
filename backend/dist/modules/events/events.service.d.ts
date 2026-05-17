import { EventEmitter2 } from "@nestjs/event-emitter";
import type { DomainEventType } from "./constants/event-types";
export declare class EventsService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emit<TPayload extends Record<string, unknown>>(eventType: DomainEventType, payload: TPayload): void;
}
