import subprocess
import os
import tempfile
import shutil
from pathlib import Path
import re
import sys


def get_manim_executable():
    """Get the full path to the manim executable."""
    # First, try to get the Python from the virtual environment
    backend_dir = Path(__file__).parent
    venv_python = backend_dir / "venv" / "Scripts" / "python.exe"
    
    # If venv exists, use it
    if venv_python.exists():
        print(f"   Using venv Python: {venv_python}")
        return None  # Will use python -m manim with venv python
    
    # Otherwise, try to find manim in the current Python Scripts directory
    python_dir = Path(sys.executable).parent
    manim_paths = [
        python_dir / "Scripts" / "manim.exe",  # Windows
        python_dir / "Scripts" / "manim",
        python_dir / "manim.exe",
        python_dir / "manim",
        "manim",  # fallback to PATH
    ]
    
    for path in manim_paths:
        if isinstance(path, Path) and path.exists():
            return str(path)
    
    # If not found, try using python -m manim
    return None


def extract_scene_class_name(code):
    """Extract the Scene class name from Manim code."""
    # Look for class definitions that inherit from Scene
    pattern = r'class\s+(\w+)\s*\([^)]*Scene[^)]*\):'
    matches = re.findall(pattern, code)
    
    if matches:
        return matches[0]
    return None


def render_manim_scene(code, output_dir="renders", quality="l", preview=False):
    """
    Render Manim code and return the path to the generated MP4 file.
    
    Args:
        code (str): The Manim Python code to render
        output_dir (str): Directory to store rendered videos
        quality (str): Quality flag - 'l' (low), 'm' (medium), 'h' (high)
        preview (bool): Whether to open preview after rendering
    
    Returns:
        dict: Contains success status, video path, and any error messages
    """
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Extract the scene class name
        scene_name = extract_scene_class_name(code)
        if not scene_name:
            return {
                'success': False,
                'error': 'No Scene class found in the code',
                'video_path': None
            }
        
        # Create a timestamp-based unique identifier
        import time
        timestamp = int(time.time())
        unique_id = f"{scene_name}_{timestamp}"
        
        # Create a temporary file for the code with a consistent name
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8', prefix=unique_id) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name
        
        print(f"\n🎬 Rendering Manim scene: {scene_name}")
        print(f"   Quality: {quality}, Preview: {preview}")
        print(f"   Temp file: {temp_file_path}")
        
        # Get the correct Python executable (prefer venv)
        backend_dir = Path(__file__).parent
        venv_python = backend_dir / "venv" / "Scripts" / "python.exe"
        
        if venv_python.exists():
            python_exe = str(venv_python)
            print(f"   Using venv Python: {python_exe}")
        else:
            python_exe = sys.executable
            print(f"   Using system Python: {python_exe}")
        
        # Get manim executable
        manim_exe = get_manim_executable()
        
        # Build the manim command
        quality_flag = f"-q{quality}"  # -ql, -qm, -qh
        preview_flag = "--preview" if preview else ""
        
        if manim_exe:
            # Use direct manim executable
            command = [
                manim_exe,
                quality_flag,
                temp_file_path,
                scene_name,
                "--output_file", unique_id,  # Use unique name to avoid conflicts
                "--media_dir", output_dir
            ]
        else:
            # Use python -m manim as fallback
            command = [
                python_exe,  # Use the correct Python executable
                "-m",
                "manim",
                quality_flag,
                temp_file_path,
                scene_name,
                "--output_file", unique_id,  # Use unique name to avoid conflicts
                "--media_dir", output_dir
            ]
        
        if not preview:
            command.append("--disable_caching")
        
        print(f"   Command: {' '.join(command)}")
        print(f"\n{'='*80}")
        print(f"Starting Manim rendering...")
        print(f"{'='*80}\n")
        
        # Run manim command with real-time output
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout for complex animations
        )
        
        # Print Manim output for debugging
        if result.stdout:
            print(f"Manim STDOUT:\n{result.stdout}")
        if result.stderr:
            print(f"Manim STDERR:\n{result.stderr}")
        
        # Clean up temp file
        try:
            os.unlink(temp_file_path)
        except:
            pass
        
        if result.returncode != 0:
            print(f"❌ Manim rendering failed with return code {result.returncode}!")
            error_msg = result.stderr or result.stdout or "Unknown error"
            return {
                'success': False,
                'error': error_msg,
                'video_path': None
            }
        
        print(f"\n{'='*80}")
        print(f"Manim rendering completed successfully!")
        print(f"Searching for video file with ID: {unique_id}")
        print(f"{'='*80}\n")
        
        # Find the generated video file
        video_path = find_latest_video(output_dir, unique_id)
        
        if video_path and os.path.exists(video_path):
            print(f"✅ Video rendered successfully: {video_path}")
            file_size = os.path.getsize(video_path)
            print(f"   File size: {file_size / 1024:.2f} KB")
            return {
                'success': True,
                'video_path': video_path,
                'scene_name': scene_name,
                'unique_id': unique_id,
                'output': result.stdout
            }
        else:
            print(f"❌ Video file not found after rendering!")
            print(f"   Expected to find video matching: {unique_id}")
            print(f"   In directory: {output_dir}/videos")
            
            # List what files we actually have
            videos_dir = Path(output_dir) / "videos"
            if videos_dir.exists():
                all_videos = list(videos_dir.rglob("*.mp4"))
                print(f"   Found {len(all_videos)} video files:")
                for v in all_videos[:5]:  # Show first 5
                    print(f"     - {v}")
            
            return {
                'success': False,
                'error': 'Video file not found after rendering',
                'video_path': None,
                'output': result.stdout
            }
    
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': 'Rendering timeout (exceeded 2 minutes)',
            'video_path': None
        }
    except Exception as e:
        print(f"❌ Error rendering Manim scene: {e}")
        import traceback
        traceback.print_exc()
        return {
            'success': False,
            'error': str(e),
            'video_path': None
        }

def find_latest_video(output_dir, search_name):
    """Find the most recently created video file for a scene."""
    videos_dir = Path(output_dir) / "videos"
    
    # Search for mp4 files with the search name
    if videos_dir.exists():
        video_files = list(videos_dir.rglob(f"*{search_name}*.mp4"))
        # Exclude partial movie files
        video_files = [vf for vf in video_files if 'partial_movie_files' not in str(vf)]
        if video_files:
            # Return the most recently modified file
            latest_video = max(video_files, key=lambda p: p.stat().st_mtime)
            return str(latest_video)
    
    return None
    return None


def cleanup_old_renders(output_dir, keep_last_n=10):
    """Clean up old rendered videos to save space."""
    try:
        videos_dir = Path(output_dir) / "videos"
        if not videos_dir.exists():
            return
        
        # Find all mp4 files, excluding partial_movie_files
        video_files = []
        for video_file in videos_dir.rglob("*.mp4"):
            # Skip files in partial_movie_files directories
            if "partial_movie_files" in str(video_file):
                continue
            video_files.append(video_file)
        
        if len(video_files) > keep_last_n:
            # Sort by modification time (newest first)
            video_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
            
            # Delete older files and their parent directories
            for old_file in video_files[keep_last_n:]:
                try:
                    # Delete the video file
                    old_file.unlink()
                    print(f"🗑️ Deleted old render: {old_file}")
                    
                    # Try to remove empty parent directories (temp folder structure)
                    parent = old_file.parent
                    try:
                        if parent.exists() and not any(parent.iterdir()):
                            parent.rmdir()
                            print(f"🗑️ Removed empty directory: {parent}")
                            # Try to remove grandparent if also empty
                            grandparent = parent.parent
                            if grandparent != videos_dir and grandparent.exists() and not any(grandparent.iterdir()):
                                grandparent.rmdir()
                                print(f"🗑️ Removed empty directory: {grandparent}")
                    except:
                        pass  # Ignore errors removing empty dirs
                except Exception as e:
                    print(f"Warning: Could not delete {old_file}: {e}")
        
        # Separately clean up partial_movie_files directories ONLY (not their parents)
        partial_dirs = list(videos_dir.rglob("partial_movie_files"))
        for partial_dir in partial_dirs:
            try:
                import shutil
                if partial_dir.exists():
                    shutil.rmtree(partial_dir)
                    print(f"🗑️ Cleaned up partial files: {partial_dir}")
            except Exception as e:
                print(f"Warning: Could not delete partial directory {partial_dir}: {e}")
                
    except Exception as e:
        print(f"Warning: Failed to cleanup old renders: {e}")


if __name__ == "__main__":
    # Test with sample code
    test_code = """
from manim import *

class TestScene(Scene):
    def construct(self):
        text = Text("Hello, Manim!")
        self.play(Write(text))
        self.wait(1)
"""
    
    result = render_manim_scene(test_code, quality="l", preview=False)
    print(f"\nResult: {result}")
