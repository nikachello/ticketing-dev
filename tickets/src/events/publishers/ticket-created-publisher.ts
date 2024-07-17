import { Publisher, Subjects, TicketCreatedEvent } from "@chello12/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
