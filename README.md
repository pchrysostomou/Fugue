# Fugue

> *A fugue is a composition where independent voices weave together into something none of them could make alone.*

**Fugue** is a living, breathing polyglot system — eleven programming languages running simultaneously, each contributing something different, all feeding into a single real-time visual and audio experience that runs in your browser.

It generates poetry. It evolves cellular life. It computes fractals. It plays harmonics. It thinks.

There is no practical use. That is the point.

---

![Languages](https://img.shields.io/badge/languages-11-blueviolet)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Java](https://img.shields.io/badge/Java-11+-orange)
![Swift](https://img.shields.io/badge/Swift-5.9+-red)

---

## What You See

When you run Fugue, a browser opens to a full-screen dark canvas:

| Visual Element | What It Is | Language Behind It |
|---|---|---|
| **Purple cells** | Conway's Game of Life — cells that live, die, and reproduce by simple neighbour rules | Java |
| **Golden trail** | Langton's Ant — a virtual ant drawing complex patterns from two rules | Java |
| **Cyan particles** | 280 drifting nodes that attract each other and follow your mouse | JavaScript |
| **Pulsing rings** | Interference waves shaped by the Mandelbrot fractal | C |
| **Typed poetry** | AI-generated text using Markov chains on a curated corpus | Python + Ruby |
| **Colour shifts** | The system analyses each poem for emotional tone and changes the entire colour palette | Python |
| **Ambient sound** | Harmonic overtone series derived from the golden ratio φ | Swift |
| **Data stream** | Oracle symbols, binary koans, hex poems, neural entropy | Perl + AWK + Node.js |

### The Four Moods
The system automatically detects the emotional tone of each generated poem and transitions into one of four colour states:

- **COLD · ENTROPIC** — cyan/blue. Keywords: entropy, chaos, void, dark
- **WARM · EMERGENT** — amber/orange. Keywords: light, dream, star, emerge
- **MYSTIC · INFINITE** — deep purple. Keywords: consciousness, soul, infinite, silence
- **LOGIC · RECURSIVE** — green. Keywords: compute, network, pattern, algorithm

---

## Architecture

Fugue is **not** a single program. It is eleven programs, each written in a different language, communicating through a central Python server.

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│  JavaScript — Canvas2D animation engine                     │
│              Particle system · Life grid · Audio · Mood     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP polling every 3.5s
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Python Server                             │
│  HTTP server · Markov poetry · Mood analysis · SQLite       │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
  C     Ruby   Perl   AWK   Swift   Java  Node.js  SQL
Fractal Phrases Oracle Signal Harmonics Life Neural Memory
```

### Every Language's Role

| Language | File | What It Computes |
|---|---|---|
| **Bash** | `start.sh` | Orchestrates everything — compiles, links, launches |
| **Python** | `server.py` | HTTP server, Markov chain poetry, mood analysis, SQLite memory |
| **C** | `fractal.c` | Mandelbrot set sampling — 400 points per call at native speed |
| **Ruby** | `weaver.rb` | Metaphorical phrase templates, literary fragments |
| **Perl** | `oracle.pl` | Abstract symbol patterns, binary koans, hex poems |
| **AWK** | `process.awk` | Transforms Perl's raw output into formatted stream data |
| **Swift** | `Resonance.swift` | Fibonacci, Lucas numbers, phi-power series, harmonic frequencies |
| **Java** | `Lifeform.java` | Conway's Game of Life + Langton's Ant, persistent state between calls |
| **Node.js** | `neurons.js` | 16-node recurrent neural network, computes activation patterns and entropy |
| **SQL** | `schema.sql` | SQLite schema — every generated thought is stored permanently |
| **JavaScript** | `web/app.js` | Canvas rendering, Web Audio API, mouse interaction, mood transitions |

---

## Prerequisites

| Requirement | Check |
|---|---|
| Python 3.8+ | `python3 --version` |
| GCC or Clang | `gcc --version` |
| Java 11+ | `java --version` |
| Swift 5.9+ | `swiftc --version` |
| Ruby | `ruby --version` |
| Perl | `perl --version` |
| Node.js | `node --version` |
| AWK | built into macOS/Linux |

> **macOS**: All of the above are available via Xcode Command Line Tools (`xcode-select --install`) and Homebrew.
>
> **Linux**: Install `gcc`, `default-jdk`, `nodejs`, `ruby`, `perl` via your package manager. Swift requires a separate install from [swift.org](https://swift.org/download/).

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/fugue.git
cd fugue
```

No `npm install`. No `pip install`. No dependencies beyond the languages themselves.

---

## Running

```bash
chmod +x start.sh
./start.sh
```

The script will:
1. Compile `fractal.c` → `./fractal` (C)
2. Compile `Lifeform.java` → `Lifeform.class` (Java)
3. Compile `Resonance.swift` → `./resonance` (Swift)
4. Test Ruby, Perl, Node.js, AWK
5. Start the Python server on `http://localhost:8888`
6. Open your browser automatically

To stop: `Ctrl+C` in the terminal.

---

## Controls

| Action | Effect |
|---|---|
| **Click** anywhere | Burst of particles from click point + audio chord |
| **Move mouse** | Particles are attracted toward your cursor |
| **Press `D`** | Toggle the Decode Panel — explains every visual element live |
| **Click `?`** | Same as pressing D |

### The Decode Panel
Press `D` to open a side panel that explains in plain language what every element on screen is, which language produces it, and shows live statistics:
- Cells alive (Java)
- Thoughts born (Python, stored in SQL)
- Neural entropy in bits (Node.js)
- System uptime
- Current mood
- φ = 1.618034…

---

## Project Structure

```
fugue/
│
├── start.sh          # Bash — master orchestrator
├── server.py         # Python — brain, server, poet, memory
├── fractal.c         # C — Mandelbrot engine
├── weaver.rb         # Ruby — phrase weaver
├── oracle.pl         # Perl — symbol oracle
├── process.awk       # AWK — signal transformer
├── Resonance.swift   # Swift — golden ratio harmonics
├── Lifeform.java     # Java — Game of Life + Langton's Ant
├── neurons.js        # Node.js — neural network
├── schema.sql        # SQL — memory schema
│
├── web/
│   ├── index.html    # HTML5 — structure + decode panel
│   └── app.js        # JavaScript — everything you see and hear
│
├── anonymous.db      # SQLite — all generated thoughts (auto-created)
└── life_state.dat    # Binary — persistent Life + Ant state (auto-created)
```

---

## How the Poetry Works

Python uses a **Markov chain** trained on a hand-written corpus of 30 poetic sentences about consciousness, computation, entropy, and existence. It learns which words tend to follow which word pairs and generates new sentences that sound like they belong to the corpus but were never written by a human.

Ruby adds a second layer — template-based metaphorical phrases that are blended in randomly. The result is something between an AI and a poet.

Every generated thought is stored in SQLite (`anonymous.db`) with a timestamp and source. After a few hours of running, you have a personal archive of machine poetry.

---

## How the Sound Works

Swift computes the **harmonic overtone series** on A2 (110 Hz) using the golden ratio φ. These frequencies are sent to the browser, which uses the **Web Audio API** to play them as soft sine waves through an exponential envelope — attack 400ms, slow decay.

A separate ambient drone runs continuously on 55 Hz and 110 Hz (two octaves below concert A) — barely audible, more felt than heard.

**Audio requires a click to start** (browser autoplay policy). After your first click, it runs for as long as the page is open.

---

## How Conway's Life Works

The Game of Life is a cellular automaton invented by mathematician John Conway in 1970. A grid of cells follows two rules:

- A **live** cell with 2 or 3 neighbours survives
- A **dead** cell with exactly 3 neighbours becomes alive
- All other cells die or stay dead

From these two rules, complex patterns emerge — gliders that travel across the grid, oscillators that pulse, and stable structures that never change. Java runs this simulation and saves its state between calls, so the grid evolves continuously.

## How Langton's Ant Works

An ant lives on a grid and follows two rules:

- On a **white** cell: turn right, flip the cell black, move forward
- On a **black** cell: turn left, flip the cell white, move forward

For the first ~10,000 steps it creates chaotic patterns. Then suddenly it begins building a perfectly regular diagonal highway that extends forever. The golden trail you see is the last 250 steps of the ant's journey.

---

## Customisation

**Change the poetry corpus**: Edit the `_CORPUS` string in `server.py`. The Markov chain will learn from whatever you put there.

**Change the refresh rate**: Edit `setInterval(poll, 3500)` in `web/app.js`. Lower = faster updates, higher CPU.

**Change the particle count**: Edit `PARTICLE_N = 280` in `web/app.js`.

**Change the port**: Edit `port = 8888` in `server.py`.

**Add a new language**: Write a script that prints JSON or plain text to stdout, call it from `server.py` using `_run()` or `_run_json()`, add it to `_build_state()`, and add its key to `LANGS` in `app.js`.

---

## Why

Because most software is built to solve a problem.

This was built to see what happens when you let eleven languages talk to each other with no goal other than to be interesting.

---

## License

MIT — do whatever you want with it.
