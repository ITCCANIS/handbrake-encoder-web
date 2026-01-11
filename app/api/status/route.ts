import { NextRequest, NextResponse } from 'next/server';
import { jobManager } from '@/lib/jobManager';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'No jobId provided' },
        { status: 400 }
      );
    }

    const job = jobManager.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json(
      { error: 'Failed to get job status' },
      { status: 500 }
    );
  }
}
