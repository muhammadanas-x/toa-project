from manim import *

class Demo(Scene):
    def construct(self):
        # --- 1. Create axes ---
        axes = Axes(
            x_range=[-3, 5, 1],
            y_range=[-1, 9, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE},
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        self.play(Create(axes), Write(axes_labels))

        # --- 2. Draw the function f(x) = 2x + 1 ---
        f_graph = axes.plot(lambda x: 2*x + 1, color=YELLOW)
        text_label = Text("f(x) = 2x + 1").next_to(axes.c2p(4, 9), UR)
        self.play(Create(f_graph), Write(text_label))
        self.wait(1)

        # --- 3. Draw the line y = x ---
        identity_line = axes.plot(lambda x: x, color=WHITE)
        dashed_identity_line = DashedVMobject(identity_line, num_dashes=50)
        self.play(Create(dashed_identity_line))
        self.play(Transform(text_label, Text("y = x").next_to(axes.c2p(4, 4), UR)))
        self.wait(1)

        # --- 4. Draw the inverse function f^-1(x) = (x-1)/2 ---
        f_inv_graph = axes.plot(lambda x: (x - 1)/2, color=GREEN)
        self.play(Create(f_inv_graph))
        self.play(Transform(text_label, Text("f^-1(x)").next_to(axes.c2p(4, 2), DL)))
        self.wait(1)

        # --- 5. Highlight domain and range of f ---
        domain_rect = Rectangle(width=4, height=0.5, color=YELLOW, fill_opacity=0.3).move_to(axes.c2p(1, -0.25))
        range_rect = Rectangle(width=0.5, height=4, color=YELLOW, fill_opacity=0.3).move_to(axes.c2p(-0.25, 3))
        self.play(FadeIn(domain_rect), FadeIn(range_rect))
        self.play(Transform(text_label, Text("Domain and Range of 2x + 1").next_to(axes.c2p(4, 9), UR)))
        self.wait(1)

        # --- 6. Highlight domain and range of f^-1 ---
        f_inv_domain_rect = Rectangle(width=0.5, height=4, color=GREEN, fill_opacity=0.3).move_to(axes.c2p(3, 3))
        f_inv_range_rect = Rectangle(width=4, height=0.5, color=GREEN, fill_opacity=0.3).move_to(axes.c2p(1, 1))
        self.play(FadeIn(f_inv_domain_rect), FadeIn(f_inv_range_rect))
        self.play(Transform(text_label, Text("Domain and Range of f^-1").next_to(axes.c2p(4, 9), UR)))
        self.wait(1)

        # --- 7. Show a few points and reflection ---
        points_f = [(0, 1), (1, 3), (2, 5)]
        for x, y in points_f:
            dot_f = Dot(axes.c2p(x, y), color=YELLOW)
            dot_f_inv = Dot(axes.c2p(y, x), color=GREEN)
            self.play(FadeIn(dot_f), FadeIn(dot_f_inv))
            arrow = Arrow(axes.c2p(x, y), axes.c2p(y, x), buff=0, color=WHITE)
            self.play(Create(arrow))
            self.play(Transform(text_label, Text(f"Point ({x},{y}) reflected").next_to(axes.c2p(4, 9), UR)))
            self.wait(0.5)

        # --- 8. Example of updating text ---
        self.play(Transform(text_label, Text("Function f(x) highlighted").next_to(axes.c2p(4, 9), UR)))
        self.wait(1)
        self.play(Transform(text_label, Text("Domain updated").next_to(axes.c2p(4, 9), UR)))
        self.wait(1)