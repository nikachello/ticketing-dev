import { Publisher, Subjects, TicketUpdatedEvent } from "@chello12/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
