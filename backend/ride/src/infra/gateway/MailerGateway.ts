export default interface MailerGateway {
  send: (subject: string, recipient: string, message: string) => Promise<void>
}

export class MailerGatewayConsole implements MailerGateway {
  async send(subject: string, recipient: string, message: string) {
    console.log(
      `Sending email to ${recipient} with subject ${subject} and message ${message}`,
    )
  }
}
