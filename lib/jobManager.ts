export interface EncodingJob {
  id: string;
  filename: string;
  preset: string;
  status: 'uploading' | 'queued' | 'encoding' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  error?: string;
  outputFilename?: string;
  outputPath?: string;
  downloadUrl?: string;
  startTime: number;
  completionTime?: number;
}

class JobManager {
  private jobs: Map<string, EncodingJob> = new Map();

  createJob(id: string, filename: string, preset: string): EncodingJob {
    const job: EncodingJob = {
      id,
      filename,
      preset,
      status: 'queued',
      progress: 0,
      logs: [],
      startTime: Date.now(),
    };
    this.jobs.set(id, job);
    return job;
  }

  getJob(id: string): EncodingJob | undefined {
    return this.jobs.get(id);
  }

  updateJob(id: string, updates: Partial<EncodingJob>): void {
    const job = this.jobs.get(id);
    if (job) {
      Object.assign(job, updates);
      
      // If job just completed, set completion time and schedule cleanup
      if (updates.status === 'completed' && !job.completionTime) {
        job.completionTime = Date.now();
        this.scheduleCleanup(id);
      }
    }
  }

  addLog(id: string, log: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.logs.push(`[${new Date().toISOString()}] ${log}`);
    }
  }

  deleteJob(id: string): void {
    this.jobs.delete(id);
  }

  private scheduleCleanup(jobId: string): void {
    // Schedule cleanup after 10 minutes (600,000 ms)
    setTimeout(async () => {
      const job = this.jobs.get(jobId);
      if (job && job.status === 'completed' && job.outputPath) {
        try {
          const { unlink } = await import('fs/promises');
          await unlink(job.outputPath);
          this.addLog(jobId, 'Output file deleted after 10-minute expiration');
          console.log(`Deleted expired output file: ${job.outputPath}`);
        } catch (error) {
          console.error(`Failed to delete expired file: ${job.outputPath}`, error);
          this.addLog(jobId, 'Failed to delete expired output file');
        }
        this.deleteJob(jobId);
      }
    }, 10 * 60 * 1000);
  }
}

export const jobManager = new JobManager();
