import { Publisher, Subjects, OrderCancelledEvent } from "@chello12/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
