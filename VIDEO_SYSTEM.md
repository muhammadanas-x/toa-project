# Video Display System - How It Works

## 🎬 Complete Flow: From Text to Video Display

### Step 1: User Asks Question
```
User: "create a graph of f(x) = x^2"
  ↓
Frontend ChatWindow
```

### Step 2: Generate Manim Code
```
Frontend → Next.js API (/api/chat) → Flask (/process)
  ↓
Python Pipeline:
  1. Search RAG (Pinecone)
  2. Generate code (Ollama)
  3. Return code to frontend
  ↓
Frontend displays code + "🎬 Render Video" button
```

### Step 3: User Clicks Render Button
```
User clicks "🎬 Render Video"
  ↓
Frontend → Next.js API (/api/render) → Flask (/visualize)
  ↓
manim_renderer.py:
  1. Extract Scene class name
  2. Save code to temp file
  3. Run: python -m manim -ql temp.py SceneName
  4. Find generated MP4 in renders/videos/
  5. Return video_url: "/video/SceneName.mp4"
```

### Step 4: Display Video
```
Frontend receives video_url
  ↓
Creates new message with video_url
  ↓
<video> element fetches from:
  http://localhost:5000/video/SceneName.mp4
  ↓
Flask serves video file
  ↓
Video plays in chat! 🎉
```

## 📁 File Structure

```
python-backend/
├── app.py                     # Flask server
│   ├── POST /process         # Generate code
│   ├── POST /visualize       # Render video
│   └── GET /video/<filename> # Serve video
├── manim_renderer.py         # Rendering logic
└── renders/
    └── videos/
        └── 480p15/
            └── SceneName.mp4  # Generated videos

my-app/
├── app/api/
│   ├── chat/route.js         # Code generation API
│   └── render/route.js       # Video rendering API
└── components/
    ├── ChatInterface.jsx     # Main chat container
    └── ChatWindow.jsx        # Messages + Video player
```

## 🎯 Key Features

### Backend (Flask):
- **Video Serving**: `/video/<filename>` endpoint serves MP4 files
- **CORS Enabled**: Allows frontend to fetch videos
- **Security**: Prevents directory traversal attacks
- **Auto-cleanup**: Keeps only last 10 videos

### Frontend (React):
- **Native Video Player**: Uses HTML5 `<video>` tag
- **Auto-play**: Videos play automatically when rendered
- **Responsive**: Scales to fit chat window
- **Loading States**: Shows "typing" indicator during render
- **Error Handling**: Displays friendly error messages

## 🚀 Usage Example

1. **Ask Question**:
   ```
   User: "show me the sine wave function"
   ```

2. **See Generated Code**:
   ```python
   from manim import *
   
   class SineWave(Scene):
       def construct(self):
           axes = Axes(...)
           sine = axes.plot(lambda x: np.sin(x))
           self.play(Create(sine))
   ```

3. **Click "🎬 Render Video"**

4. **Watch Video** appears in chat:
   - Embedded video player
   - Play/pause controls
   - Loop enabled
   - Auto-play

## 🔧 Technical Details

### Video Format:
- **Codec**: H.264
- **Container**: MP4
- **Quality Options**:
  - `l` (low): 480p, 15fps (~10-30s render)
  - `m` (medium): 720p, 30fps (~30-60s render)
  - `h` (high): 1080p, 60fps (~1-3min render)

### Video URL Pattern:
```
http://localhost:5000/video/SceneName.mp4
```

### CORS Headers:
```python
CORS(app)  # Enables all origins in development
```

## 🎨 Styling

Video container has:
- Cyan border (`rgba(0, 255, 255, 0.3)`)
- Glow effect (`box-shadow`)
- Rounded corners
- Max width: 600px
- Responsive design

## 💡 Future Enhancements

- [ ] Download button for videos
- [ ] Video gallery page
- [ ] Thumbnail previews
- [ ] Progress bar during rendering
- [ ] Quality selector in UI
- [ ] Share videos via URL
- [ ] Cloud storage integration
