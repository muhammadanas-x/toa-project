from pipeline_2 import manim_pipeline
import sys

print("="*80)
print("TESTING MANIM PIPELINE")
print("="*80)

try:
    code = manim_pipeline('draw a circle')
    
    if code:
        print("\n" + "="*80)
        print("✅ PIPELINE SUCCESS!")
        print("="*80)
        print(f"Generated {len(code)} characters of code")
        sys.exit(0)
    else:
        print("\n" + "="*80)
        print("❌ PIPELINE FAILED - No code generated")
        print("="*80)
        sys.exit(1)
except Exception as e:
    print("\n" + "="*80)
    print(f"❌ PIPELINE ERROR: {e}")
    print("="*80)
    import traceback
    traceback.print_exc()
    sys.exit(1)
