import { ExpirationCompleteEvent, Publisher, Subjects } from "@chello12/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.expirationComplete = Subjects.expirationComplete;
}
