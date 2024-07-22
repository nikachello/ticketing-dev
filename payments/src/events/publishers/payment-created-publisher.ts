import { Subjects, Publisher, PaymentCreatedEvent } from "@chello12/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
