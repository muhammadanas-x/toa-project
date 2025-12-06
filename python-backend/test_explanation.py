#!/usr/bin/env python3
"""Test the explain_manim_code function"""

from pipeline_2 import explain_manim_code

# Sample Manim code
sample_code = """
from manim import *

class MyScene(Scene):
    def construct(self):
        # Create a green arrow for f(x)
        arrow1 = Arrow(LEFT, RIGHT, color=GREEN)
        label1 = Text("f(x)", color=GREEN).next_to(arrow1, UP)
        
        # Create a red arrow for f(-x)
        arrow2 = Arrow(RIGHT, LEFT, color=RED)
        label2 = Text("f(-x)", color=RED).next_to(arrow2, DOWN)
        
        # Animate
        self.play(Create(arrow1), Write(label1))
        self.play(Create(arrow2), Write(label2))
        self.wait()
"""

user_request = "Show me the reflection of a function across the y-axis"

print("="*80)
print("Testing explain_manim_code function")
print("="*80)

explanation = explain_manim_code(sample_code, user_request)

print("\n" + "="*80)
print("FINAL EXPLANATION:")
print("="*80)
print(explanation)
print("="*80)
