export const sendFollowUpReminder = async (user: any, followUp: any) => {
  // placeholder for SMS / WhatsApp / Email integration
  // In production replace with provider integration (Twilio, AWS SNS, WhatsApp API, etc.)
  console.log(`Reminder -> user:${user?.email || user?._id} followUp:${followUp._id} target:${followUp.targetType}:${followUp.targetId}`);
};
