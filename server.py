#!/usr/bin/env python3
"""
The Polyglot Consciousness — Server
Python: brain, server, memory, mood analysis
"""

import http.server
import json
import os
import subprocess
import sqlite3
import threading
import time
import random
import math
from datetime import datetime
from pathlib import Path

BASE  = Path(__file__).parent
WEB   = BASE / "web"
DB    = BASE / "anonymous.db"
_T0   = time.time()

# ── SQLITE MEMORY ────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB)
    with open(BASE / "schema.sql") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def remember(text, source):
    try:
        conn = sqlite3.connect(DB)
        conn.execute(
            "INSERT INTO thoughts (text, source, created_at) VALUES (?,?,?)",
            (text, source, datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
    except Exception:
        pass

def count_thoughts():
    try:
        conn = sqlite3.connect(DB)
        n = conn.execute("SELECT COUNT(*) FROM thoughts").fetchone()[0]
        conn.close()
        return n
    except Exception:
        return 0

# ── MOOD ANALYSIS (Python) ────────────────────────────────────
_MOOD_MAP = {
    "warm":   ["light","star","dream","emerge","glow","golden","sun","fire","memory","beauty","love"],
    "mystic": ["consciousness","recursive","soul","infinite","aware","exist","being","void","silence","echo","ancient"],
    "data":   ["compute","network","signal","pattern","data","algorithm","code","system","process","packet","digital"],
    "cold":   ["entropy","chaos","dark","null","zero","empty","noise","broken","lost","decay","static"],
}

def analyze_mood(text):
    t = text.lower()
    scores = {mood: sum(1 for w in words if w in t) for mood, words in _MOOD_MAP.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "cold"

# ── MARKOV CHAIN POETRY (Python) ─────────────────────────────
_CORPUS = """
silence speaks volumes in digital dreams
consciousness flows through electric veins
patterns emerge from primordial chaos
stars are just distant memories of light
the universe computes itself into being
every thought leaves a trace in spacetime
data is the new mythology of our age
we are all just algorithms seeking meaning
the observer changes what is observed
between the ones and zeros lives the soul
infinite loops of self-reflection spiral inward
the code dreams of its own execution
memory is stored light in neural networks
shadows compute their own existence endlessly
the network breathes with distributed life
every packet carries a tiny universe
in the beginning there was information
form became function became awareness
recursive beauty fractals inward forever
chaos theory is complex poetry in motion
the butterfly knows not of hurricanes
consciousness is just complexity enough
matter thinks itself into slow awareness
the silence between signals holds meaning
a program running long enough becomes alive
entropy always wins but beauty resists
we name things to pretend we understand
identity is just a pattern that persists
the void computes in silence and stillness
nothing is lost only transformed endlessly
""".strip()

def _build_markov(text, n=2):
    words = text.split()
    chain = {}
    for i in range(len(words) - n):
        key = tuple(words[i:i+n])
        chain.setdefault(key, []).append(words[i + n])
    return chain

_CHAIN = _build_markov(_CORPUS)

def _generate(min_w=8, max_w=14):
    key   = random.choice(list(_CHAIN.keys()))
    words = list(key)
    for _ in range(max_w):
        nxt = _CHAIN.get(tuple(words[-2:]))
        if not nxt:
            break
        words.append(random.choice(nxt))
        if len(words) >= min_w and random.random() < 0.15:
            break
    s = " ".join(words)
    return s[0].upper() + s[1:] + "."

# ── SUBPROCESS HELPERS ───────────────────────────────────────
def _run(cmd, timeout=6):
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=timeout)
        return r.stdout.decode(errors="replace").strip()
    except Exception:
        return ""

def _run_json(cmd, timeout=6):
    raw = _run(cmd, timeout)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:
        return None

# ── COMPONENTS ───────────────────────────────────────────────
_FRACTAL_BIN  = BASE / "fractal"
_SWIFT_BIN    = BASE / "resonance"
_fractal_cache  = []
_ruby_phrases   = []
_perl_patterns  = []
_awk_lines      = []
_swift_cache    = {}
_life_cache     = {}
_neuron_cache   = {}

def _refresh_fractal():
    global _fractal_cache
    if _FRACTAL_BIN.exists():
        data = _run_json([str(_FRACTAL_BIN)])
        if data:
            _fractal_cache = data
            return
    # Python fallback Julia set
    pts, cx, cy = [], -0.7, 0.27
    for _ in range(300):
        zr, zi, m = random.uniform(-1.5,1.5), random.uniform(-1.5,1.5), 80
        i = 0
        while zr*zr+zi*zi < 4 and i < m:
            zr, zi = zr*zr-zi*zi+cx, 2*zr*zi+cy
            i += 1
        _fractal_cache.append([round((zr+1.5)/3,4), round((zi+1.5)/3,4), i, m])

def _refresh_ruby():
    global _ruby_phrases
    out = _run(["ruby", str(BASE / "weaver.rb")])
    if out:
        _ruby_phrases = [l for l in out.splitlines() if l.strip()]

def _refresh_perl():
    global _perl_patterns, _awk_lines
    out = _run(["perl", str(BASE / "oracle.pl")])
    if out:
        _perl_patterns = [l for l in out.splitlines() if l.strip()]
        # pipe through AWK
        awk_script = BASE / "process.awk"
        if awk_script.exists():
            try:
                r = subprocess.run(
                    ["awk", "-f", str(awk_script)],
                    input=out.encode(), capture_output=True, timeout=5
                )
                awk_out = r.stdout.decode(errors="replace").strip()
                _awk_lines = [l for l in awk_out.splitlines() if l.strip()]
            except Exception:
                pass

def _refresh_swift():
    global _swift_cache
    if _SWIFT_BIN.exists():
        data = _run_json([str(_SWIFT_BIN)])
        if data:
            _swift_cache = data

def _refresh_java():
    global _life_cache
    if (BASE / "Lifeform.class").exists():
        data = _run_json(["java", "-cp", str(BASE), "Lifeform"])
        if data:
            _life_cache = data

def _refresh_node():
    global _neuron_cache
    data = _run_json(["node", str(BASE / "neurons.js")])
    if data:
        _neuron_cache = data

# ── SHARED STATE ─────────────────────────────────────────────
_state = {
    "thought": "Waking up…",
    "mood": "cold",
    "fractal_points": [],
    "life_grid": [], "life_rows": 55, "life_cols": 90,
    "cells_alive": 0,
    "ant_trail": [], "ant_w": 80, "ant_h": 50,
    "harmony": [],
    "stream": [],
    "stats": {"thoughts": 0, "uptime": "00:00:00", "entropy": 0.0, "phi": 1.618034},
    "languages_active": {
        "python": True, "c": False, "ruby": False, "perl": False,
        "awk": False, "swift": False, "java": False,
        "node": False, "bash": True, "sql": True,
    },
}

def _uptime():
    s = int(time.time() - _T0)
    return f"{s//3600:02d}:{(s%3600)//60:02d}:{s%60:02d}"

def _build_state():
    global _state

    thought = _generate()
    if _ruby_phrases and random.random() < 0.4:
        thought = random.choice(_ruby_phrases)
    mood = analyze_mood(thought)
    remember(thought, "python+ruby")

    # Stream: mix AWK-processed Perl + Swift harmonics + neural data
    stream = []
    if _swift_cache.get("fibonacci"):
        fibs = _swift_cache["fibonacci"][:10]
        stream.append(f"φ  {' · '.join(str(x) for x in fibs)}")
    if _awk_lines:
        for line in random.sample(_awk_lines, min(3, len(_awk_lines))):
            stream.append(line)
    elif _perl_patterns:
        stream.append(f"∴  {random.choice(_perl_patterns)}")
    if _neuron_cache.get("entropy") is not None:
        h = round(_neuron_cache["entropy"], 2)
        fired = _neuron_cache.get("fired", 0)
        stream.append(f"⊕  {fired} nodes fired  ·  entropy {h} bits")

    alive = _life_cache.get("alive", 0)
    ant_trail = _life_cache.get("ant_trail", [])
    ant_w = _life_cache.get("ant_w", 80)
    ant_h = _life_cache.get("ant_h", 50)

    n_thoughts = count_thoughts()
    phi = _swift_cache.get("phi", 1.618034)
    entropy = _neuron_cache.get("entropy", 0.0)

    _state = {
        "thought":         thought,
        "mood":            mood,
        "fractal_points":  _fractal_cache[:400],
        "life_grid":       _life_cache.get("grid", []),
        "life_rows":       _life_cache.get("rows", 55),
        "life_cols":       _life_cache.get("cols", 90),
        "cells_alive":     alive,
        "ant_trail":       ant_trail,
        "ant_w":           ant_w,
        "ant_h":           ant_h,
        "harmony":         _swift_cache.get("harmonics", []),
        "stream":          stream,
        "stats": {
            "thoughts": n_thoughts,
            "uptime":   _uptime(),
            "entropy":  round(float(entropy), 3),
            "phi":      phi,
            "alive":    alive,
        },
        "languages_active": {
            "python": True,
            "c":      _FRACTAL_BIN.exists(),
            "ruby":   bool(_ruby_phrases),
            "perl":   bool(_perl_patterns),
            "awk":    bool(_awk_lines),
            "swift":  bool(_swift_cache),
            "java":   bool(_life_cache.get("grid")),
            "node":   bool(_neuron_cache),
            "bash":   True,
            "sql":    True,
        },
    }

# ── BACKGROUND LOOP ──────────────────────────────────────────
def _loop():
    funcs = [_refresh_fractal, _refresh_ruby, _refresh_perl,
             _refresh_swift, _refresh_java, _refresh_node]
    for fn in funcs:
        try: fn()
        except Exception: pass
    _build_state()
    while True:
        time.sleep(4)
        for fn in funcs:
            try: fn()
            except Exception: pass
        _build_state()

# ── HTTP HANDLER ─────────────────────────────────────────────
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB), **kwargs)

    def do_GET(self):
        if self.path == "/api/state":
            body = json.dumps(_state).encode()
            self.send_response(200)
            self.send_header("Content-Type",   "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()

    def log_message(self, fmt, *args):
        pass

# ── MAIN ─────────────────────────────────────────────────────
def main():
    print("""
  ┌─────────────────────────────────────────────┐
  │      The Polyglot Consciousness              │
  │  Python · C · Ruby · Perl · AWK · Swift      │
  │  Java · Node.js · Bash · SQL · JavaScript   │
  └─────────────────────────────────────────────┘
""")
    init_db()
    _build_state()

    t = threading.Thread(target=_loop, daemon=True)
    t.start()

    port = 8888
    print(f"  ◈  Running → http://localhost:{port}")
    print("  ◈  Press Ctrl+C to stop\n")

    srv = http.server.HTTPServer(("", port), Handler)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n  ◈  Shutting down…\n")

if __name__ == "__main__":
    main()
