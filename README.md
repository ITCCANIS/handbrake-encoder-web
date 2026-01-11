# HandBrake Video Encoder Web App

A Next.js web application for encoding videos using HandBrake on a local server. Upload videos through your browser, select encoding settings, and download the encoded files.

## Features

- 🎥 Upload video files via browser
- ⚙️ Multiple encoding presets (H.264 and H.265)
- 📥 Direct download of encoded files
- 🧹 Automatic cleanup of uploaded files after encoding
- 🐳 Fully Dockerized for easy deployment
- 🏠 Runs completely locally on your home server

## Encoding Presets

- **H.264 Normal Quality**: x264 codec, RF 23
- **H.264 High Quality**: x264 codec, RF 20
- **H.265 Normal Quality**: x265 codec, RF 25
- **H.265 High Quality**: x265 codec, RF 22

## Requirements

- Docker and Docker Compose (for Docker deployment)
- OR Node.js 20+ and HandBrakeCLI installed locally (for manual deployment)

## Quick Start with Docker

1. Clone or download this project
2. Navigate to the project directory
3. Build and run with Docker Compose:

```bash
docker-compose up -d
```

4. Access the application at `http://localhost:3000`

To stop the application:

```bash
docker-compose down
```

## Manual Installation (Without Docker)

### Prerequisites

Install HandBrakeCLI on your system:

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install handbrake-cli
```

**Linux (Alpine):**
```bash
apk add handbrake
```

**macOS:**
```bash
brew install handbrake
```

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create required directories:
```bash
mkdir -p uploads output
```

3. Run in development mode:
```bash
npm run dev
```

4. Or build and run in production mode:
```bash
npm run build
npm start
```

5. Access the application at `http://localhost:3000`

## Usage

1. Open the web interface in your browser
2. Click "Choose File" and select a video file from your computer
3. Select an encoding preset from the dropdown menu
4. Click "Encode Video" to start the encoding process
5. Wait for the encoding to complete (status will be displayed)
6. Click "Download Encoded Video" to download your encoded file

## Project Structure

```
handbrake-project/
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # File upload endpoint
│   │   ├── encode/route.ts      # Video encoding endpoint
│   │   └── download/route.ts    # File download endpoint
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main UI page
├── lib/
│   └── presets.ts               # Encoding presets configuration
├── uploads/                     # Temporary upload directory
├── output/                      # Encoded files directory
├── Dockerfile                   # Docker image configuration
├── docker-compose.yml           # Docker Compose configuration
├── package.json                 # Node.js dependencies
├── tsconfig.json                # TypeScript configuration
└── next.config.js               # Next.js configuration
```

## API Endpoints

### POST /api/upload
Upload a video file to the server.

**Request:** FormData with `file` field

**Response:**
```json
{
  "success": true,
  "filename": "1234567890_video.mp4",
  "filepath": "/path/to/uploads/1234567890_video.mp4"
}
```

### POST /api/encode
Encode an uploaded video file.

**Request:**
```json
{
  "filename": "1234567890_video.mp4",
  "preset": "h264_normal"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Encoding completed successfully",
  "outputFilename": "encoded_1234567890_video.mp4",
  "downloadUrl": "/api/download?file=encoded_1234567890_video.mp4"
}
```

### GET /api/download?file=<filename>
Download an encoded video file.

**Response:** Video file (video/mp4)

## Configuration

### Adding Custom Presets

Edit `lib/presets.ts` to add or modify encoding presets:

```typescript
export const ENCODING_PRESETS: Record<string, EncodingPreset> = {
  my_preset: {
    name: 'My Custom Preset',
    codec: 'x264',
    quality: 'RF 20',
    args: ['-e', 'x264', '-q', '20', '-B', '192'],
  },
  // ... more presets
};
```

### Docker Volumes

The Docker setup uses volumes for persistent storage:
- `./uploads`: Temporary storage for uploaded files
- `./output`: Storage for encoded files

## Security Notes

- This application is designed for local network use only
- No authentication is implemented
- File upload size limits should be configured based on your needs
- Consider adding authentication if exposing to a wider network

## Troubleshooting

### HandBrakeCLI not found
Ensure HandBrakeCLI is installed and in your system PATH. Test with:
```bash
HandBrakeCLI --version
```

### Permission errors with uploads/output directories
Ensure the directories exist and have proper permissions:
```bash
mkdir -p uploads output
chmod 755 uploads output
```

### Docker build fails
Make sure Docker is running and you have sufficient disk space:
```bash
docker system prune -a
```

## License

This project is provided as-is for personal use. HandBrake is licensed under GPL v2.

## Support

For issues with:
- HandBrakeCLI: Visit https://handbrake.fr/
- Next.js: Visit https://nextjs.org/docs
