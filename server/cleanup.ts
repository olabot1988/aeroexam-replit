import { storage } from "./storage";

export class CleanupService {
  private intervalId: NodeJS.Timeout | null = null;
  
  start() {
    // Run cleanup every 24 hours (24 * 60 * 60 * 1000 ms)
    this.intervalId = setInterval(async () => {
      try {
        const deletedCount = await storage.cleanupOldExamSessions();
        if (deletedCount > 0) {
          console.log(`[CleanupService] Removed ${deletedCount} uncompleted exam sessions older than 7 days`);
        }
      } catch (error) {
        console.error("[CleanupService] Error during cleanup:", error);
      }
    }, 24 * 60 * 60 * 1000);
    
    console.log("[CleanupService] Started - running cleanup every 24 hours");
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[CleanupService] Stopped");
    }
  }
  
  // Manual cleanup trigger
  async runCleanup(): Promise<number> {
    try {
      const deletedCount = await storage.cleanupOldExamSessions();
      console.log(`[CleanupService] Manual cleanup completed - removed ${deletedCount} uncompleted exam sessions`);
      return deletedCount;
    } catch (error) {
      console.error("[CleanupService] Error during manual cleanup:", error);
      throw error;
    }
  }
}

export const cleanupService = new CleanupService();