import { Injectable, Logger } from "@nestjs/common";
import { ContactDto } from "./dto/contact.dto";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async sendContactMessage(contactDto: ContactDto) {
    this.logger.log(
      `Contact message received from ${contactDto.email}: ${contactDto.subject}`
    );

    // TODO: Implement email sending or queue for later
    // For now, we'll just log the message
    // In production, you would:
    // 1. Send email using a service like SendGrid, AWS SES, etc.
    // 2. Or queue the message using a job queue (Bull, BullMQ, etc.)
    // 3. Or store in database for admin review

    const messageData = {
      name: contactDto.name,
      email: contactDto.email,
      phone: contactDto.phone || "Not provided",
      subject: contactDto.subject,
      message: contactDto.message,
      receivedAt: new Date().toISOString(),
    };

    this.logger.debug("Contact message data:", messageData);

    // Return success response
    // In a real implementation, you would return the result of email sending
    return {
      success: true,
      message: "Your message has been received. We'll get back to you soon!",
      timestamp: new Date().toISOString(),
    };
  }
}
