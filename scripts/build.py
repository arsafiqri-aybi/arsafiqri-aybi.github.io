#!/usr/bin/env python3
"""Compatibility wrapper for the canonical Node static generator."""
import subprocess
from pathlib import Path
subprocess.run(['node', str(Path(__file__).with_name('build.mjs'))], check=True)
