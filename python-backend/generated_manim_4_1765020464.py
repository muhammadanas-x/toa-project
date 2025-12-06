from manim import *
import numpy as np

class SqrtEvenDemo(Scene):
    def construct(self):
        axes = Axes(x_range=[-4, 4, 1], y_range=[0, 4, 1], x_length=8, y_length=5, tips=True)
        axes_labels = axes.get_axis_labels(x_label='x', y_label='f(x)')
        self.play(Create(axes), Write(axes_labels))
        self.wait(1)

        y_axis_line = axes.get_vertical_line(axes.c2p(0,0), color=YELLOW, stroke_width=2)
        x_axis_line = axes.get_horizontal_line(axes.c2p(0,0), color=YELLOW, stroke_width=2)
        self.play(Create(y_axis_line), Create(x_axis_line))
        self.wait(1)

        def f(x):
            return (x + 1)**2

        def f_negx(x):
            return f(-x)

        def neg_fx(x):
            return -f(x)

        graph_fx = axes.plot(f, color=BLUE, x_range=[-4, 4])
        graph_fx_label = axes.get_graph_label(graph_fx, label='g(x) = (x + 1)²')
        self.play(Create(graph_fx), Write(graph_fx_label))
        self.wait(1)

        graph_f_negx = axes.plot(f_negx, color=RED, x_range=[-4, 4])
        graph_f_negx_label = axes.get_graph_label(graph_f_negx, label='g(-x)', x_val=3)
        self.play(Create(graph_f_negx), Write(graph_f_negx_label))
        self.wait(1)

        graph_neg_fx = axes.plot(neg_fx, color=GREEN, x_range=[-4, 4])
        graph_neg_fx_label = axes.get_graph_label(graph_neg_fx, label='-g(x)', x_val=-3)
        self.play(Create(graph_neg_fx), Write(graph_neg_fx_label))
        self.wait(1)