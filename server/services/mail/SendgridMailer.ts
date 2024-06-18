import sgMailer, { MailService } from "@sendgrid/mail";
import Mailer from "./Mailer";
import { config } from "../../src/config/env";

export default class SendgridMailer implements Mailer {
  private sg: MailService;
  from: string;

  constructor() {
    this.sg = sgMailer;
    this.sg.setApiKey(config.secrets.sendgrid);
    this.from = "Final Grade Calculator <no-reply@fgc.willma.me>";
  }

  async send(to: string, subject: string, html: string) {
    try {
      await this.sg.send({ from: this.from, to, subject, html });
    } catch (error) {
      console.log("Error sending email:", error);
      return false;
    }
    return true;
  }
}
