import cron from "node-cron";
import * as FollowUpService from "../services/followup.service";

export const initBackgroundJobs = () => {
  // Run every 5 minutes to check for due follow-ups and send reminders
  cron.schedule("*/5 * * * *", async () => {
    try {
      const count = await FollowUpService.runDueReminders();
      if (count > 0) {
        console.log(`[Follow-Up Reminder Job] Triggered reminders for ${count} due follow-ups`);
      }
    } catch (error) {
      console.error("[Follow-Up Reminder Job] Error:", error);
    }
  });

  console.log("✓ Background jobs initialized (follow-up reminders every 5 min)");
};
