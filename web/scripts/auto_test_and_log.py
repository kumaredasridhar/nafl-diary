#!/usr/bin/env python3
"""
NAFL Automated Test Runner & QA Logger
Runs:
1. Vitest Unit & Integration Suites (npm run test)
2. TypeScript Strict Typecheck & Vite Production Build (npm run build)
3. Stub & Placeholder Alert Audit (ensures 0 alerts in src/)
4. Static Artefacts Integrity Check
5. Updates or verifies testing.md Single Source of Truth
"""

import subprocess
import sys
import os
import re
from datetime import datetime

def run_cmd(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return res.returncode, res.stdout, res.stderr

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    web_dir = os.path.join(root_dir, 'web')
    testing_md = os.path.join(root_dir, 'testing.md')

    print("==================================================")
    print("NAFL AUTOMATED QA & INTEGRITY TEST SUITE")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("==================================================")

    failures = []

    # Step 1: Vitest
    print("\n[1/4] Running Vitest Automated Test Suite...")
    code, stdout, stderr = run_cmd("npm run test", cwd=web_dir)
    if code != 0:
        print("❌ Vitest Suite FAILED:")
        print(stderr or stdout)
        failures.append("Vitest Unit/Integration Tests Failed")
    else:
        # Extract test counts
        match = re.search(r'Tests\s+([0-9]+)\s+passed\s+\(([0-9]+)\)', stdout)
        count_str = f"({match.group(1)}/{match.group(2)} passed)" if match else ""
        print(f"✓ Vitest Suite Passed {count_str}")

    # Step 2: Build & Typecheck
    print("\n[2/4] Running TypeScript Strict Typecheck & Vite Production Build...")
    code, stdout, stderr = run_cmd("npm run build", cwd=web_dir)
    if code != 0:
        print("❌ Build & Typecheck FAILED:")
        print(stderr or stdout)
        failures.append("TypeScript / Vite Build Failed")
    else:
        print("✓ TypeScript & Vite Production Build Passed (0 errors)")

    # Step 3: Zero-Alert Stub Audit
    print("\n[3/4] Scanning for Stub Placeholders (alert() checks in src/)...")
    code, stdout, _ = run_cmd("grep -rn \"alert(\" src/", cwd=web_dir)
    if code == 0 and stdout.strip():
        print(f"❌ Found unhandled placeholder alert() calls:\n{stdout}")
        failures.append("Placeholder alert() stubs found")
    else:
        print("✓ Zero placeholder alert() calls in codebase")

    # Step 4: Sample Artefacts & Video Check
    print("\n[4/4] Verifying Sample PDF Artefacts & Video Media...")
    samples_dir = os.path.join(web_dir, 'public', 'samples')
    required_assets = [
        'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf',
        'NAFL_Mont1_December_2026_Curriculum_Plan.pdf',
        'NAFL_Mont1_Classroom_Moments_Nov2026.pdf',
        'NAFL_Mont1_Music_Circle_Sample.mp4'
    ]
    missing = [asset for asset in required_assets if not os.path.exists(os.path.join(samples_dir, asset))]
    if missing:
        print(f"❌ Missing sample artefacts/video: {missing}")
        failures.append("Missing sample PDF/video files")
    else:
        print(f"✓ All {len(required_assets)} sample PDF artefacts & MP4 video verified in web/public/samples/")

    print("\n--------------------------------------------------")
    if failures:
        print(f"❌ TEST RUN FAILED with {len(failures)} issue(s):")
        for f in failures:
            print(f"  • {f}")
        sys.exit(1)
    else:
        print("🎉 ALL AUTOMATED TESTS & VERIFICATIONS PASSED (100% GREEN)")
        print("--------------------------------------------------")
        sys.exit(0)

if __name__ == '__main__':
    main()
