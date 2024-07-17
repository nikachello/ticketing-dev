import { Publisher, TicketCreatedEvent, Subjects } from "@chello12/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
