import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { buildHandBrakeArgs, EncodingOptions } from '@/lib/presets';
import { jobManager } from '@/lib/jobManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, options, jobId } = body;

    if (!filename || !options || !jobId) {
      return NextResponse.json(
        { error: 'Missing filename, options, or jobId' },
        { status: 400 }
      );
    }

    const encodingOptions = options as EncodingOptions;

    // Create job
    const job = jobManager.createJob(jobId, filename, encodingOptions.encoder);
    job.status = 'encoding';
    jobManager.addLog(jobId, 'Starting encoding process...');

    // Set up paths
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const outputDir = path.join(process.cwd(), 'output');
    const inputPath = path.join(uploadsDir, filename);
    
    // Check if input file exists
    if (!existsSync(inputPath)) {
      jobManager.updateJob(jobId, { status: 'failed', error: 'Input file not found' });
      return NextResponse.json(
        { error: 'Input file not found' },
        { status: 404 }
      );
    }

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Generate output filename
    const timestamp = Date.now();
    const baseName = path.parse(filename).name;
    const outputFilename = `encoded_${timestamp}_${baseName}.${encodingOptions.format}`;
    const outputPath = path.join(outputDir, outputFilename);

    // Build HandBrakeCLI arguments
    const handbrakeArgs = buildHandBrakeArgs(encodingOptions, inputPath, outputPath);
    
    jobManager.addLog(jobId, `Input: ${filename}`);
    jobManager.addLog(jobId, `Encoder: ${encodingOptions.encoder}`);
    jobManager.addLog(jobId, `Quality: RF ${encodingOptions.quality}`);
    jobManager.addLog(jobId, `Output: ${outputFilename}`);
    jobManager.addLog(jobId, `Command: HandBrakeCLI ${handbrakeArgs.join(' ')}`);

    // Start encoding in background
    setImmediate(() => {
      const handbrake = spawn('HandBrakeCLI', handbrakeArgs);
      
      handbrake.stdout.on('data', (data) => {
        const output = data.toString();
        jobManager.addLog(jobId, output.trim());
        
        // Parse progress from HandBrake output
        const progressMatch = output.match(/Encoding: task \d+ of \d+, (\d+\.\d+) %/);
        if (progressMatch) {
          const progress = parseFloat(progressMatch[1]);
          jobManager.updateJob(jobId, { progress });
        }
      });

      handbrake.stderr.on('data', (data) => {
        const output = data.toString();
        jobManager.addLog(jobId, `[STDERR] ${output.trim()}`);
      });

      handbrake.on('close', async (code) => {
        if (code === 0) {
          jobManager.addLog(jobId, 'Encoding completed successfully!');
          jobManager.updateJob(jobId, {
            status: 'completed',
            progress: 100,
            outputFilename,
            downloadUrl: `/api/download?file=${outputFilename}`,
          });
        } else {
          jobManager.addLog(jobId, `Encoding failed with code ${code}`);
          jobManager.updateJob(jobId, {
            status: 'failed',
            error: `HandBrake exited with code ${code}`,
          });
        }

        // Clean up uploaded file
        try {
          await unlink(inputPath);
          jobManager.addLog(jobId, 'Cleaned up uploaded file');
        } catch (unlinkError) {
          jobManager.addLog(jobId, 'Failed to delete uploaded file');
        }
      });
    });

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Encoding started',
    });
  } catch (error: any) {
    console.error('Encode error:', error);
    return NextResponse.json(
      { error: 'Failed to start encoding', details: error.message },
      { status: 500 }
    );
  }
}
