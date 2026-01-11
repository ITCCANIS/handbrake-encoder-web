# 🎬 HandBrake Video Encoder Studio

A professional, self-hosted web application for video encoding powered by HandBrake CLI. Built with Next.js, this application provides a beautiful dark-themed interface with comprehensive encoding controls, real-time progress tracking, and live console logs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)
![HandBrake](https://img.shields.io/badge/HandBrake-CLI-orange)

## ✨ Features

### 🎨 Modern UI
- **Professional dark theme** with slate color scheme
- **Two-column responsive layout** for optimal workflow
- **Real-time progress bars** with percentage display
- **Live console logs** for detailed encoding feedback
- **Collapsible advanced settings** panel
- **Smooth animations** and transitions

### 🎥 Video Encoding
- **6 video codecs**: H.264 (x264), H.265 (x265), H.265 10-bit, VP9, MPEG-4, MPEG-2
- **Variable quality control** (RF 0-51 slider)
- **9 encoding speed presets**: Ultra Fast to Very Slow
- **Custom resolution** settings (width × height)
- **Frame rate control**: Auto, 23.976, 24, 25, 29.97, 30, 50, 60 fps
- **Deinterlace & Decomb** options
- **Denoise presets**: None, Light, Medium, Strong

### 🔊 Audio Encoding
- **8 audio codecs**: AAC, AC3, MP3, Opus, Vorbis, FLAC, plus passthrough modes
- **Adjustable bitrate**: 64-320 kbps

### 📦 Output Options
- **3 container formats**: MP4, MKV, WebM
- **Automatic file cleanup** after encoding
- **Direct download** of encoded files

### 🚀 Technical Features
- **Background encoding** (non-blocking)
- **Job management system** with status tracking
- **Real-time log streaming** from HandBrake
- **Progress parsing** from HandBrake output
- **Docker deployment** with single command
- **Persistent storage** with volume mounting

### 🚀 Technical Features
- **Background encoding** (non-blocking)
- **Job management system** with status tracking
- **Real-time log streaming** from HandBrake
- **Progress parsing** from HandBrake output
- **Docker deployment** with single command
- **Persistent storage** with volume mounting

## 📸 Screenshots

*Beautiful dark-themed interface with professional controls*

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ITCCANIS/handbrake-encoder-studio.git
   cd handbrake-encoder-studio
   ```

2. **Start the application**
   ```bash
   docker compose up -d
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

That's it! The application includes HandBrakeCLI pre-installed in the Docker image.

### Stop the application
```bash
docker compose down
```

## 🛠️ Manual Installation

### Prerequisites

- Node.js 20 or higher
- HandBrakeCLI installed on your system

#### Install HandBrakeCLI

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install handbrake-cli
```

**macOS (Homebrew):**
```bash
brew install handbrake
```

**Alpine Linux:**
```bash
apk add handbrake
```

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/ITCCANIS/handbrake-encoder-studio.git
   cd handbrake-encoder-studio
   npm install
   ```

2. **Create required directories**
   ```bash
   mkdir -p uploads output
   chmod 755 uploads output
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

4. **Or build and run in production**
   ```bash
   npm run build
   npm start
   ```

5. **Access at** `http://localhost:3000`

## 📖 Usage Guide

1. **Upload Video**: Click the upload area or drag and drop a video file
2. **Configure Encoding**:
   - Select video encoder (H.264, H.265, VP9, etc.)
   - Adjust quality using the RF slider (lower = better quality)
   - Choose encoding speed preset
   - Select output format (MP4, MKV, WebM)
3. **Advanced Settings** (optional):
   - Configure audio encoder and bitrate
   - Set custom resolution
   - Adjust frame rate
   - Enable deinterlace, decomb, or denoise filters
4. **Start Encoding**: Click the "Start Encoding" button
5. **Monitor Progress**: Watch real-time progress and view console logs
6. **Download**: Once complete, download your encoded video

## 🏗️ Project Structure

```
handbrake-encoder-studio/
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # File upload endpoint
│   │   ├── encode/route.ts      # Video encoding endpoint
│   │   ├── status/route.ts      # Job status polling endpoint
│   │   └── download/route.ts    # File download endpoint
│   ├── layout.tsx               # Root layout with styles
│   └── page.tsx                 # Main UI component
├── lib/
│   ├── presets.ts               # Encoding presets & options
│   └── jobManager.ts            # Job tracking system
├── uploads/                     # Temporary upload directory
├── output/                      # Encoded files directory
├── Dockerfile                   # Docker image configuration
├── docker-compose.yml           # Docker Compose configuration
├── package.json                 # Node.js dependencies
├── tsconfig.json                # TypeScript configuration
└── next.config.js               # Next.js configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
PORT=3000
NODE_ENV=production
```

### Custom Encoding Presets

Edit `lib/presets.ts` to add or modify encoding options:

```typescript
export const ENCODERS = [
  { value: 'x264', label: 'H.264 (x264)' },
  // Add your custom encoder
];
```

### Docker Configuration

Modify `docker-compose.yml` to change ports or volumes:

```yaml
services:
  handbrake-encoder:
    ports:
      - "3000:3000"  # Change the first port to use a different port
    volumes:
      - ./uploads:/app/uploads:rw
      - ./output:/app/output:rw
```

## 📡 API Endpoints

### POST `/api/upload`
Upload a video file to the server.

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "success": true,
  "filename": "1234567890_video.mp4",
  "filepath": "/path/to/uploads/1234567890_video.mp4"
}
```

### POST `/api/encode`
Start encoding a video with specified options.

**Request:**
```json
{
  "filename": "1234567890_video.mp4",
  "options": {
    "encoder": "x264",
    "quality": 23,
    "preset": "medium",
    "format": "mp4",
    "audioBitrate": 160,
    "audioEncoder": "av_aac"
  },
  "jobId": "job_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "job_1234567890",
  "message": "Encoding started"
}
```

### GET `/api/status?jobId=<jobId>`
Get the current status of an encoding job.

**Response:**
```json
{
  "id": "job_1234567890",
  "filename": "video.mp4",
  "status": "encoding",
  "progress": 45.2,
  "logs": ["Starting encoding...", "Encoding frame 100..."],
  "startTime": 1234567890000
}
```

### GET `/api/download?file=<filename>`
Download an encoded video file.

**Response:** Video file with appropriate headers

## 🐳 Docker Details

The Docker setup includes:
- **Base image**: Node.js 20 Alpine
- **HandBrakeCLI**: Pre-installed
- **Multi-stage build**: Optimized image size
- **Volume mounts**: Persistent storage for uploads/output
- **Non-root user**: Security best practices

### Build the image manually:
```bash
docker build -t handbrake-encoder .
```

### Run without Docker Compose:
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads:rw \
  -v $(pwd)/output:/app/output:rw \
  --name handbrake-encoder \
  handbrake-encoder
```

## 🔒 Security Considerations

- **Local network only**: This application is designed for local/private network use
- **No authentication**: Authentication is not implemented by default
- **File size limits**: Consider adding upload size limits based on your needs
- **Network exposure**: Do not expose directly to the internet without adding authentication and HTTPS
- **Path traversal protection**: Download endpoint includes basic path traversal prevention

For production use on public networks, consider adding:
- Authentication middleware (OAuth, JWT, etc.)
- HTTPS/TLS encryption
- Rate limiting
- File upload size restrictions
- User session management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

HandBrake is licensed under GPL v2. This project is a web interface for HandBrake and does not modify HandBrake itself.

## 🙏 Acknowledgments

- [HandBrake](https://handbrake.fr/) - The open-source video transcoder
- [Next.js](https://nextjs.org/) - The React framework
- [Docker](https://www.docker.com/) - Containerization platform

## 📧 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the HandBrake documentation for encoding-related questions

## 🗺️ Roadmap

- [ ] Queue system for multiple video encoding
- [ ] Preset templates save/load functionality
- [ ] Video preview before/after encoding
- [ ] Encoding statistics and history
- [ ] Email notifications on completion
- [ ] Multi-user support with authentication
- [ ] Batch processing capabilities
- [ ] Hardware acceleration support (NVENC, QSV)

## ⚡ Performance Tips

- Use **faster presets** for quicker encoding (but larger files)
- Use **H.265** for better compression (but slower encoding)
- **Lower RF values** = better quality but larger files
- **Hardware specs matter**: CPU-intensive process
- Consider **resolution downscaling** for faster encoding
- Use **audio passthrough** when possible to save processing time

---

**Made with ❤️ for the video encoding community**
