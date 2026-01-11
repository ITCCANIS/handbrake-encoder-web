export interface EncodingJob {
  id: string;
  filename: string;
  preset: string;
  status: 'uploading' | 'queued' | 'encoding' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  error?: string;
  outputFilename?: string;
  downloadUrl?: string;
  startTime: number;
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
}

export const jobManager = new JobManager();
