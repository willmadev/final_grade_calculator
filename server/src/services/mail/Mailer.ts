export default interface Mailer {
  send(to: string, subject: string, text: string): void;
}
