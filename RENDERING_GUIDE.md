# Manim Video Rendering Setup

## 🎬 How It Works

1. User types a math question in chat
2. Backend generates Manim code using RAG + LLM
3. User clicks "🎬 Render Video" button
4. Backend runs `manim` CLI to render the code
5. MP4 video is saved locally in `renders/` folder

## 📋 Prerequisites

### Install Manim

**Windows (with Chocolatey):**
```bash
choco install manimce
```

**Or with pip:**
```bash
pip install manim
```

**Verify installation:**
```bash
manim --version
```

You should see something like: `Manim Community v0.18.0`

### Install LaTeX (Required for Manim)

Manim needs LaTeX for rendering math formulas.

**Windows:**
```bash
choco install miktex
```

**Or download:** https://miktex.org/download

## 🚀 Usage

### 1. Start the Backend (if not running)
```bash
cd python-backend
python app.py
```

### 2. Start the Frontend (if not running)
```bash
cd my-app
npm run dev
```

### 3. Generate and Render

1. Go to http://localhost:3000/chat
2. Type a math question (e.g., "graph f(x) = x^2 + 1")
3. Wait for code generation
4. Click **"🎬 Render Video"** button
5. Video will be rendered and saved in `python-backend/renders/videos/`

## 🎥 API Endpoints

### POST /visualize
Render Manim code to MP4

**Request:**
```json
{
  "code": "from manim import *\n\nclass MyScene(Scene):\n    def construct(self):\n        ...",
  "quality": "l"  // "l" (low), "m" (medium), "h" (high)
}
```

**Response:**
```json
{
  "success": true,
  "video_path": "renders/videos/1080p60/MyScene.mp4",
  "scene_name": "MyScene",
  "message": "Video rendered successfully!"
}
```

### POST /render-and-download
Render and directly download the MP4 file

## ⚙️ Configuration

### Quality Settings

- **`l` (low)**: 480p, 15fps - Fast rendering (~10-30 seconds)
- **`m` (medium)**: 720p, 30fps - Balanced (~30-60 seconds)
- **`h` (high)**: 1080p, 60fps - Best quality (~1-3 minutes)

### Output Location

Videos are saved in:
```
python-backend/
  └── renders/
      └── videos/
          └── 480p15/    (or 720p30, 1080p60)
              └── SceneName.mp4
```

### Automatic Cleanup

The system automatically keeps only the last 10 rendered videos to save disk space.

## 🐛 Troubleshooting

### "manim: command not found"
- Make sure Manim is installed: `pip install manim`
- Restart your terminal

### "LaTeX Error"
- Install MiKTeX or TeX Live
- Restart after installation

### "Rendering timeout"
- Complex animations may take longer
- Consider using lower quality (`l`) for testing
- Increase timeout in `manim_renderer.py` if needed

### "Scene class not found"
- Make sure your generated code has a class that inherits from `Scene`
- Check the class name extraction in the error logs

## 📁 File Structure

```
python-backend/
├── app.py                  # Main Flask server
├── pipeline_2.py          # Code generation pipeline
├── manim_renderer.py      # Video rendering logic
└── renders/               # Rendered videos (auto-created)
    └── videos/
        └── 480p15/
            └── *.mp4
```

## 🎯 Next Steps

- **View Videos**: Add video player to chat interface
- **Download**: Implement download button for rendered videos
- **Gallery**: Create a gallery page to view all rendered videos
- **Streaming**: Stream rendering progress to frontend
- **Cloud**: Deploy with cloud storage for videos

## 💡 Tips

1. Start with low quality (`l`) for testing
2. Keep animations under 30 seconds for faster rendering
3. Use the "Render Video" button only after code generation completes
4. Check `python-backend/renders/videos/` to find your rendered videos
