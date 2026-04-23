#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  ANONYMOUS — Bash Orchestrator
#  The nervous system that wires everything together
# ═══════════════════════════════════════════════════════════

set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# ── colours ─────────────────────────────────────────────────
C='\033[0;36m'   # cyan
P='\033[0;35m'   # purple
G='\033[0;32m'   # green
Y='\033[1;33m'   # yellow
R='\033[0;31m'   # red
N='\033[0m'      # reset

ok()   { echo -e "    ${G}✓${N}  $*"; }
fail() { echo -e "    ${R}✗${N}  $* (continuing)"; }
step() { echo -e "\n  ${Y}◈${N}  $*"; }

echo -e "${P}"
cat << 'BANNER'
  ╔══════════════════════════════════════════════╗
  ║       The Polyglot Consciousness             ║
  ╠══════════════════════════════════════════════╣
  ║  Py · C · Ruby · Perl · Swift · Java         ║
  ║  Node.js · Bash · SQL · JavaScript · HTML    ║
  ╚══════════════════════════════════════════════╝
BANNER
echo -e "${N}"

# ── compile C fractal engine ─────────────────────────────────
step "Forging fractal engine  (C / gcc)"
if gcc fractal.c -o fractal -lm -O2 2>/dev/null; then
    ok "fractal engine ready"
else
    fail "C compilation failed"
fi

# ── compile Java lifeform ────────────────────────────────────
step "Awakening cellular automaton  (Java)"
if javac Lifeform.java 2>/dev/null; then
    ok "Lifeform.class compiled"
else
    fail "Java compilation failed"
fi

# ── compile Swift resonance ──────────────────────────────────
step "Tuning harmonic resonance  (Swift)"
if swiftc Resonance.swift -o resonance 2>/dev/null; then
    ok "resonance engine ready"
else
    fail "Swift compilation failed"
fi

# ── smoke-test Ruby ──────────────────────────────────────────
step "Weaving metaphors  (Ruby)"
if ruby weaver.rb >/dev/null 2>&1; then
    ok "Ruby weaver active"
else
    fail "Ruby not available"
fi

# ── smoke-test Perl ──────────────────────────────────────────
step "Consulting the oracle  (Perl)"
if perl oracle.pl >/dev/null 2>&1; then
    ok "Perl oracle ready"
else
    fail "Perl not available"
fi

# ── smoke-test Node.js ───────────────────────────────────────
step "Initialising neural network  (Node.js)"
if node neurons.js >/dev/null 2>&1; then
    ok "Neural network active"
else
    fail "Node.js not available"
fi

# ── log start event ──────────────────────────────────────────
echo ""
echo -e "  ${C}◈  All systems checked.${N}"
echo -e "  ${C}◈  SQL memory at anonymous.db${N}"
echo -e "  ${C}◈  Languages active: Bash · Python · C · Ruby · Perl · Swift · Java · Node.js · SQL${N}"
echo ""

# ── open browser after brief delay ──────────────────────────
(sleep 2 && open http://localhost:8888 2>/dev/null) &

# ── launch Python consciousness ──────────────────────────────
python3 server.py
