// SMS Provider Abstraction Layer
// This allows easy integration with Twilio, AfriksTalking, or custom providers

export interface SMSProviderConfig {
  provider: "Twilio" | "AfriksTalking" | "Custom";
  apiKey?: string;
  apiSecret?: string;
  senderName?: string;
  accountSid?: string; // For Twilio
}

export interface SendSMSResult {
  success: boolean;
  messageId?: string;
  status: string;
  error?: string;
}

class SMSProvider {
  private config: SMSProviderConfig;

  constructor(config: SMSProviderConfig) {
    this.config = config;
  }

  async sendSMS(phone: string, message: string): Promise<SendSMSResult> {
    switch (this.config.provider) {
      case "Twilio":
        return this.sendViatwilio(phone, message);
      case "AfriksTalking":
        return this.sendViaAfriksTalking(phone, message);
      case "Custom":
      default:
        return this.sendViaCustom(phone, message);
    }
  }

  private async sendViatwilio(phone: string, message: string): Promise<SendSMSResult> {
    // Placeholder: Twilio implementation
    // In production, use: import twilio from 'twilio';
    // const client = twilio(this.config.accountSid, this.config.apiKey);
    // const result = await client.messages.create({...});

    console.log(`[Twilio] Sending SMS to ${phone}: ${message}`);
    return {
      success: true,
      messageId: `twilio_${Date.now()}`,
      status: "Sent",
    };
  }

  private async sendViaAfriksTalking(phone: string, message: string): Promise<SendSMSResult> {
    // Placeholder: AfriksTalking implementation
    // In production, use fetch or axios to call AfriksTalking API
    // const response = await fetch('https://api.sandbox.africastalking.com/version1/messaging', {...});

    console.log(`[AfriksTalking] Sending SMS to ${phone}: ${message}`);
    return {
      success: true,
      messageId: `afrikstalking_${Date.now()}`,
      status: "Sent",
    };
  }

  private async sendViaCustom(phone: string, message: string): Promise<SendSMSResult> {
    // Placeholder: Custom provider implementation
    console.log(`[Custom] Sending SMS to ${phone}: ${message}`);
    return {
      success: true,
      messageId: `custom_${Date.now()}`,
      status: "Sent",
    };
  }
}

export default SMSProvider;
