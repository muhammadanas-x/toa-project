from manim import *

class Demo(Scene):
    def construct(self):
        axes = Axes(x_range=[-3, 3, 1], y_range=[0, 10, 2], x_length=8, y_length=6, axis_config={"color": BLUE})
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        self.play(Create(axes), Write(axes_labels))

        f_graph = axes.plot(lambda x: x**2 + 1, color=YELLOW)
        text_label = Text("f(x) = x^2 + 1").next_to(axes.c2p(2, 9), UR)
        self.play(Create(f_graph), Write(text_label))
        self.wait(1)

        identity_line = axes.plot(lambda x: x, color=WHITE)
        dashed_identity_line = DashedVMobject(identity_line, num_dashes=50)
        self.play(Create(dashed_identity_line))
        self.play(Transform(text_label, Text("y = x").next_to(axes.c2p(2, 2), UR)))
        self.wait(1)

        f_inv_graph = axes.plot(lambda x: np.sqrt(x-1), color=GREEN)
        self.play(Create(f_inv_graph))
        self.play(Transform(text_label, Text("f^-1(x)").next_to(axes.c2p(2, 1), DL)))
        self.wait(1)

        domain_rect = Rectangle(width=3, height=0.5, color=YELLOW, fill_opacity=0.3).move_to(axes.c2p(0, -0.25))
        range_rect = Rectangle(width=0.5, height=3, color=YELLOW, fill_opacity=0.3).move_to(axes.c2p(-0.25, 2))
        self.play(FadeIn(domain_rect), FadeIn(range_rect))
        self.play(Transform(text_label, Text("Domain and Range of f").next_to(axes.c2p(2, 9), UR)))
        self.wait(1)

        f_inv_domain_rect = Rectangle(width=0.5, height=3, color=GREEN, fill_opacity=0.3).move_to(axes.c2p(2, 2))
        f_inv_range_rect = Rectangle(width=3, height=0.5, color=GREEN, fill_opacity=0.3).move_to(axes.c2p(0, 1))
        self.play(FadeIn(f_inv_domain_rect), FadeIn(f_inv_range_rect))
        self.play(Transform(text_label, Text("Domain and Range of f^-1").next_to(axes.c2p(2, 9), UR)))
        self.wait(1)

        points_f = [(0,1),(1,2),(2,5)]
        for x,y in points_f:
            dot_f = Dot(axes.c2p(x,y), color=YELLOW)
            dot_f_inv = Dot(axes.c2p(y,x), color=GREEN)
            self.play(FadeIn(dot_f), FadeIn(dot_f_inv))
            arrow = Arrow(axes.c2p(x,y), axes.c2p(y,x), buff=0, color=WHITE)
            self.play(Create(arrow))
            self.play(Transform(text_label, Text(f"Point ({x},{y}) reflected").next_to(axes.c2p(2, 9), UR)))
            self.wait(0.5)

        self.play(Transform(text_label, Text("Function f(x) highlighted").next_to(axes.c2p(2, 9), UR)))
        self.wait(1)
        self.play(Transform(text_label, Text("Domain updated").next_to(axes.c2p(2, 9), UR)))
        self.wait(1)