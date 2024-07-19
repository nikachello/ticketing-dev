import { Publisher, OrderCreatedEvent, Subjects } from "@chello12/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
