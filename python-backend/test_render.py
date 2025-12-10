from manim_renderer import render_manim_scene

test_code = """from manim import *

class CircleTest(Scene):
    def construct(self):
        circle = Circle(radius=2, color=RED)
        self.play(Create(circle))
        self.wait(1)
"""

print("="*80)
print("TESTING MANIM RENDERING")
print("="*80)

result = render_manim_scene(test_code, quality='l', preview=False)

print("\n" + "="*80)
if result['success']:
    print("✅ RENDERING SUCCESS!")
    print(f"Video path: {result['video_path']}")
else:
    print("❌ RENDERING FAILED!")
    print(f"Error: {result['error']}")
print("="*80)
