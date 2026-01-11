export interface EncodingPreset {
  name: string;
  codec: string;
  quality: string;
  args: string[];
}

export interface EncodingOptions {
  preset: string;
  encoder: string;
  quality: number;
  audioBitrate: number;
  audioEncoder: string;
  width?: number;
  height?: number;
  frameRate?: string;
  deinterlace: boolean;
  denoise?: string;
  decomb: boolean;
  subtitles?: string;
  format: string;
}

export const ENCODERS = [
  { value: 'x264', label: 'H.264 (x264)' },
  { value: 'x265', label: 'H.265 (x265)' },
  { value: 'x265_10bit', label: 'H.265 10-bit (x265_10bit)' },
  { value: 'VP9', label: 'VP9' },
  { value: 'mpeg4', label: 'MPEG-4' },
  { value: 'mpeg2', label: 'MPEG-2' },
];

export const AUDIO_ENCODERS = [
  { value: 'av_aac', label: 'AAC (avcodec)' },
  { value: 'copy:aac', label: 'AAC Passthrough' },
  { value: 'ac3', label: 'AC3' },
  { value: 'copy:ac3', label: 'AC3 Passthrough' },
  { value: 'mp3', label: 'MP3' },
  { value: 'opus', label: 'Opus' },
  { value: 'vorbis', label: 'Vorbis' },
  { value: 'flac24', label: 'FLAC 24-bit' },
];

export const FRAMERATES = [
  { value: 'auto', label: 'Same as source' },
  { value: '23.976', label: '23.976 fps' },
  { value: '24', label: '24 fps' },
  { value: '25', label: '25 fps' },
  { value: '29.97', label: '29.97 fps' },
  { value: '30', label: '30 fps' },
  { value: '50', label: '50 fps' },
  { value: '60', label: '60 fps' },
];

export const DENOISE_PRESETS = [
  { value: 'none', label: 'None' },
  { value: 'nlmeans=light', label: 'Light' },
  { value: 'nlmeans=medium', label: 'Medium' },
  { value: 'nlmeans=strong', label: 'Strong' },
];

export const OUTPUT_FORMATS = [
  { value: 'mp4', label: 'MP4' },
  { value: 'mkv', label: 'MKV (Matroska)' },
  { value: 'webm', label: 'WebM' },
];

export const QUICK_PRESETS = [
  { value: 'ultrafast', label: 'Ultra Fast' },
  { value: 'superfast', label: 'Super Fast' },
  { value: 'veryfast', label: 'Very Fast' },
  { value: 'faster', label: 'Faster' },
  { value: 'fast', label: 'Fast' },
  { value: 'medium', label: 'Medium' },
  { value: 'slow', label: 'Slow' },
  { value: 'slower', label: 'Slower' },
  { value: 'veryslow', label: 'Very Slow' },
];

export const ENCODING_PRESETS: Record<string, EncodingPreset> = {
  h264_normal: {
    name: 'H.264 Normal Quality',
    codec: 'x264',
    quality: 'RF 23',
    args: ['-e', 'x264', '-q', '23', '-B', '160'],
  },
  h264_high: {
    name: 'H.264 High Quality',
    codec: 'x264',
    quality: 'RF 20',
    args: ['-e', 'x264', '-q', '20', '-B', '192'],
  },
  h265_normal: {
    name: 'H.265 Normal Quality',
    codec: 'x265',
    quality: 'RF 25',
    args: ['-e', 'x265', '-q', '25', '-B', '160'],
  },
  h265_high: {
    name: 'H.265 High Quality',
    codec: 'x265',
    quality: 'RF 22',
    args: ['-e', 'x265', '-q', '22', '-B', '192'],
  },
};

export function buildHandBrakeArgs(options: EncodingOptions, inputPath: string, outputPath: string): string[] {
  const args: string[] = [
    '-i', inputPath,
    '-o', outputPath,
    '-e', options.encoder,
    '-q', options.quality.toString(),
    '-B', options.audioBitrate.toString(),
    '-E', options.audioEncoder,
    '-f', options.format,
  ];

  if (options.preset && options.preset !== 'medium') {
    args.push('--encoder-preset', options.preset);
  }

  if (options.width && options.height) {
    args.push('-w', options.width.toString(), '-l', options.height.toString());
  }

  if (options.frameRate && options.frameRate !== 'auto') {
    args.push('-r', options.frameRate);
  }

  if (options.deinterlace) {
    args.push('--deinterlace');
  }

  if (options.decomb) {
    args.push('--decomb');
  }

  if (options.denoise && options.denoise !== 'none') {
    args.push('--nlmeans', options.denoise.replace('nlmeans=', ''));
  }

  if (options.subtitles && options.subtitles !== 'none') {
    args.push('-s', options.subtitles);
  }

  args.push('--optimize');

  return args;
}

