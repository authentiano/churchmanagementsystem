// Provider abstraction for extensible SMS/Email/WhatsApp integration

export interface SMSProvider {
  name: string;
  sendSMS(to: string, message: string, options?: any): Promise<{ id: string; status: string }>;
  checkBalance?(): Promise<{ balance: number; currency: string }>;
  getStatus?(messageId: string): Promise<{ status: string }>;
}

export interface EmailProvider {
  name: string;
  sendEmail(to: string | string[], subject: string, html: string, options?: any): Promise<{ id: string; status: string }>;
  trackOpen?(messageId: string): Promise<void>;
  trackClick?(messageId: string, url: string): Promise<void>;
}

export interface WhatsAppProvider {
  name: string;
  sendMessage(to: string, content: string, options?: any): Promise<{ id: string; status: string }>;
  sendTemplate?(to: string, templateName: string, params?: Record<string, string>): Promise<{ id: string; status: string }>;
  sendBroadcast?(to: string[], content: string): Promise<{ successCount: number; failureCount: number }>;
}

// Mock SMS Provider (for development/testing without real API)
export class MockSMSProvider implements SMSProvider {
  name = "mock-sms";

  async sendSMS(to: string, message: string): Promise<{ id: string; status: string }> {
    console.log(`[Mock SMS] To: ${to}, Message: ${message}`);
    return { id: `mock-${Date.now()}`, status: "sent" };
  }

  async checkBalance(): Promise<{ balance: number; currency: string }> {
    return { balance: 1000, currency: "USD" };
  }

  async getStatus(messageId: string): Promise<{ status: string }> {
    return { status: "delivered" };
  }
}

// Mock Email Provider (for development/testing without real API)
export class MockEmailProvider implements EmailProvider {
  name = "mock-email";

  async sendEmail(to: string | string[], subject: string, html: string): Promise<{ id: string; status: string }> {
    const recipients = Array.isArray(to) ? to.join(", ") : to;
    console.log(`[Mock Email] To: ${recipients}, Subject: ${subject}`);
    return { id: `mock-email-${Date.now()}`, status: "sent" };
  }

  async trackOpen(messageId: string): Promise<void> {
    console.log(`[Mock Email] Open tracked for ${messageId}`);
  }

  async trackClick(messageId: string, url: string): Promise<void> {
    console.log(`[Mock Email] Click tracked for ${messageId} -> ${url}`);
  }
}

// Mock WhatsApp Provider (for development/testing without real API)
export class MockWhatsAppProvider implements WhatsAppProvider {
  name = "mock-whatsapp";

  async sendMessage(to: string, content: string): Promise<{ id: string; status: string }> {
    console.log(`[Mock WhatsApp] To: ${to}, Message: ${content}`);
    return { id: `mock-wa-${Date.now()}`, status: "sent" };
  }

  async sendTemplate(to: string, templateName: string, params?: Record<string, string>): Promise<{ id: string; status: string }> {
    console.log(`[Mock WhatsApp] Template to ${to}: ${templateName}`, params);
    return { id: `mock-wa-template-${Date.now()}`, status: "sent" };
  }

  async sendBroadcast(to: string[], content: string): Promise<{ successCount: number; failureCount: number }> {
    console.log(`[Mock WhatsApp] Broadcast to ${to.length} recipients`);
    return { successCount: to.length, failureCount: 0 };
  }
}

// Provider Registry - manages provider instances
export class ProviderRegistry {
  private smsProviders: Map<string, SMSProvider> = new Map();
  private emailProviders: Map<string, EmailProvider> = new Map();
  private whatsappProviders: Map<string, WhatsAppProvider> = new Map();

  private defaultSmsProvider: string = "mock-sms";
  private defaultEmailProvider: string = "mock-email";
  private defaultWhatsAppProvider: string = "mock-whatsapp";

  constructor() {
    // Register mock providers by default
    this.registerSMSProvider(new MockSMSProvider());
    this.registerEmailProvider(new MockEmailProvider());
    this.registerWhatsAppProvider(new MockWhatsAppProvider());
  }

  // SMS Provider Management
  registerSMSProvider(provider: SMSProvider): void {
    this.smsProviders.set(provider.name, provider);
  }

  getSMSProvider(name?: string): SMSProvider {
    const providerName = name || this.defaultSmsProvider;
    const provider = this.smsProviders.get(providerName);
    if (!provider) throw new Error(`SMS Provider "${providerName}" not registered`);
    return provider;
  }

  setDefaultSMSProvider(name: string): void {
    if (!this.smsProviders.has(name)) throw new Error(`SMS Provider "${name}" not registered`);
    this.defaultSmsProvider = name;
  }

  // Email Provider Management
  registerEmailProvider(provider: EmailProvider): void {
    this.emailProviders.set(provider.name, provider);
  }

  getEmailProvider(name?: string): EmailProvider {
    const providerName = name || this.defaultEmailProvider;
    const provider = this.emailProviders.get(providerName);
    if (!provider) throw new Error(`Email Provider "${providerName}" not registered`);
    return provider;
  }

  setDefaultEmailProvider(name: string): void {
    if (!this.emailProviders.has(name)) throw new Error(`Email Provider "${name}" not registered`);
    this.defaultEmailProvider = name;
  }

  // WhatsApp Provider Management
  registerWhatsAppProvider(provider: WhatsAppProvider): void {
    this.whatsappProviders.set(provider.name, provider);
  }

  getWhatsAppProvider(name?: string): WhatsAppProvider {
    const providerName = name || this.defaultWhatsAppProvider;
    const provider = this.whatsappProviders.get(providerName);
    if (!provider) throw new Error(`WhatsApp Provider "${providerName}" not registered`);
    return provider;
  }

  setDefaultWhatsAppProvider(name: string): void {
    if (!this.whatsappProviders.has(name)) throw new Error(`WhatsApp Provider "${name}" not registered`);
    this.defaultWhatsAppProvider = name;
  }

  listSMSProviders(): string[] {
    return Array.from(this.smsProviders.keys());
  }

  listEmailProviders(): string[] {
    return Array.from(this.emailProviders.keys());
  }

  listWhatsAppProviders(): string[] {
    return Array.from(this.whatsappProviders.keys());
  }
}

// Global registry instance
export const providerRegistry = new ProviderRegistry();
