from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys
import os
import time

# Import your pipeline functions
from pipeline_2 import manim_pipeline, save_code_to_file, explain_manim_code
from manim_renderer import render_manim_scene, cleanup_old_renders

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

@app.route('/process', methods=['POST'])
def process_message():
    """
    Process chat messages and generate Manim code
    """
    try:
        data = request.json
        message = data.get('message', '')
        chat_id = data.get('chat_id', '')
        
        print(f"\n{'='*80}")
        print(f"Received request for chat_id: {chat_id}")
        print(f"User message: {message}")
        print(f"{'='*80}\n")
        
        # Run your Manim pipeline
        start_time = time.time()
        generated_code = manim_pipeline(message)
        execution_time = time.time() - start_time
        
        if generated_code:
            # Don't save the file to avoid triggering Flask reload
            # The code is already returned to frontend and will be passed to renderer
            # filename = f"generated_manim_{chat_id}_{int(time.time())}.py"
            # save_code_to_file(generated_code, filename)
            
            return jsonify({
                'success': True,
                'response': f"Successfully generated Manim code based on your request!",
                'code': generated_code,
                'execution_time': round(execution_time, 2),
                'chat_id': chat_id
            })
        else:
            return jsonify({
                'success': False,
                'response': "Failed to generate Manim code. Please try rephrasing your request.",
                'error': 'Pipeline returned None'
            }), 500
    
    except Exception as e:
        print(f"Error in process_message: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e),
            'response': f"An error occurred: {str(e)}"
        }), 500


@app.route('/visualize', methods=['POST'])
def create_visualization():
    """
    Generate and render Manim visualization from code
    """
    try:
        data = request.json
        code = data.get('code', '')
        quality = data.get('quality', 'l')  # l, m, h
        user_request = data.get('user_request', 'visualization request')  # Get original user request
        
        if not code:
            return jsonify({
                'success': False,
                'error': 'No code provided'
            }), 400
        
        print(f"\n{'='*80}")
        print(f"Rendering Manim code...")
        print(f"{'='*80}\n")
        
        # Render the Manim scene
        render_result = render_manim_scene(code, quality=quality, preview=False)
        
        if render_result['success']:
            # Get the relative path from renders/videos/ directory
            video_path = render_result['video_path']
            
            # Verify the file exists before cleanup
            if not os.path.exists(video_path):
                print(f"⚠️ WARNING: Video file not found immediately after rendering: {video_path}")
            else:
                print(f"✅ Verified video exists at: {video_path}")
            
            # Convert to forward slashes and extract everything after 'videos/'
            video_path_normalized = video_path.replace('\\', '/')
            if 'videos/' in video_path_normalized:
                relative_path = video_path_normalized.split('videos/', 1)[1]
            else:
                relative_path = os.path.basename(video_path)
            
            video_url = f"/video/{relative_path}"
            
            # Clean up old renders AFTER we've confirmed the current video exists
            # Keep more videos to avoid accidental deletion
            cleanup_old_renders('renders', keep_last_n=20)
            
            # Generate explanation using Gemma 3:4b
            print(f"\n{'='*80}")
            print(f"Generating code explanation with Gemma 3:4b...")
            print(f"{'='*80}\n")
            
            explanation = explain_manim_code(code, user_request)
            
            return jsonify({
                'success': True,
                'video_path': render_result['video_path'],
                'video_url': video_url,
                'scene_name': render_result['scene_name'],
                'explanation': explanation,
                'message': 'Video rendered successfully!'
            })
        else:
            return jsonify({
                'success': False,
                'error': render_result['error']
            }), 500
    
    except Exception as e:
        print(f"Error in create_visualization: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/render-and-download', methods=['POST'])
def render_and_download():
    """
    Render Manim code and return the video file for download
    """
    try:
        data = request.json
        code = data.get('code', '')
        quality = data.get('quality', 'l')
        
        if not code:
            return jsonify({
                'success': False,
                'error': 'No code provided'
            }), 400
        
        # Render the scene
        render_result = render_manim_scene(code, quality=quality, preview=False)
        
        if render_result['success']:
            video_path = render_result['video_path']
            
            # Send the file
            return send_file(
                video_path,
                mimetype='video/mp4',
                as_attachment=True,
                download_name=f"{render_result['scene_name']}.mp4"
            )
        else:
            return jsonify({
                'success': False,
                'error': render_result['error']
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/execute', methods=['POST'])
def execute_script():
    """
    Execute specific Python scripts
    """
    try:
        data = request.json
        script_name = data.get('script_name', '')
        arguments = data.get('arguments', {})
        
        # Your script execution logic here
        # Import and run your existing Python modules
        
        return jsonify({
            'success': True,
            'output': 'Script executed successfully',
            'result': {},
            'execution_time': 0.5
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/video/<path:filename>', methods=['GET'])
def serve_video(filename):
    """
    Serve rendered video files with proper CORS headers
    """
    try:
        # Get the base directory
        base_dir = os.path.dirname(__file__)
        video_dir = os.path.join(base_dir, 'renders', 'videos')
        
        # Construct the full path (filename already contains subdirectories like tmpsz45xjty/480p15/ExponentialEvenDemo.mp4)
        video_path = os.path.join(video_dir, filename)
        
        # Normalize the path and ensure it's within video_dir (security)
        video_path = os.path.normpath(video_path)
        video_dir = os.path.normpath(video_dir)
        
        print(f"Looking for video at: {video_path}")
        
        if not video_path.startswith(video_dir):
            print(f"Security: Path traversal attempt blocked")
            return jsonify({
                'success': False,
                'error': 'Invalid path'
            }), 403
        
        if os.path.exists(video_path) and os.path.isfile(video_path):
            print(f"✅ Found video at: {video_path}")
            
            # Create response with proper headers
            response = send_file(
                video_path,
                mimetype='video/mp4',
                as_attachment=False,
                download_name=os.path.basename(video_path)
            )
            
            # Add CORS and caching headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Accept-Ranges'] = 'bytes'
            response.headers['Cache-Control'] = 'no-cache'
            
            return response
        
        print(f"❌ Video not found at: {video_path}")
        return jsonify({
            'success': False,
            'error': 'Video not found'
        }), 404
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'message': 'Python backend is running'
    })


if __name__ == '__main__':
    # Exclude generated files and renders from triggering reloads
    import os
    extra_files = []
    extra_dirs = ['generated', 'renders', 'generated_manim_*']
    
    app.run(
        debug=True, 
        host='0.0.0.0', 
        port=5000,
        extra_files=extra_files,
        use_reloader=True,
        reloader_type='watchdog'
    )
