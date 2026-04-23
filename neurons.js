#!/usr/bin/env node
// ANONYMOUS — Node.js Neural Pattern Engine
// Simulates a small recurrent neural network, reports activation state

'use strict';

const N_NODES = 16;
const N_EDGES = 28;

const sigmoid = x => 1 / (1 + Math.exp(-x));
const tanh    = x => Math.tanh(x);

// Build a random weight matrix
function buildNetwork(seed) {
  const rng = (() => {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xFFFFFFFF;
    };
  })();

  const nodes = Array.from({ length: N_NODES }, (_, i) => ({
    id:        i,
    value:     rng() * 2 - 1,
    bias:      rng() * 0.4 - 0.2,
    threshold: rng() * 0.4 + 0.3,
    type:      i < 4 ? 'input' : i < 12 ? 'hidden' : 'output',
  }));

  const edges = [];
  const tried = new Set();
  let attempts = 0;
  while (edges.length < N_EDGES && attempts < 500) {
    attempts++;
    const from = Math.floor(rng() * N_NODES);
    const to   = Math.floor(rng() * N_NODES);
    const key  = `${from}-${to}`;
    if (from !== to && !tried.has(key)) {
      tried.add(key);
      edges.push({ from, to, weight: rng() * 2 - 1 });
    }
  }

  return { nodes, edges };
}

// Propagate signal for `steps` iterations
function propagate(net, steps = 6) {
  let { nodes, edges } = net;
  nodes = nodes.map(n => ({ ...n }));

  for (let s = 0; s < steps; s++) {
    const acc = new Array(N_NODES).fill(0);
    edges.forEach(e => { acc[e.to] += nodes[e.from].value * e.weight; });
    nodes = nodes.map((n, i) => ({
      ...n,
      value: tanh(acc[i] + n.bias),
    }));
  }

  const active = nodes.filter(n => Math.abs(n.value) > n.threshold).map(n => n.id);
  const entropy = -nodes.reduce((s, n) => {
    const p = (n.value + 1) / 2;          // map [-1,1] → [0,1]
    return s + (p > 1e-9 ? p * Math.log2(p) : 0);
  }, 0);

  return {
    final_state:       nodes.map(n => Math.round(n.value * 1000) / 1000),
    activation_pattern: active,
    entropy:           Math.round(entropy * 1000) / 1000,
    fired:             active.length,
    inhibited:         N_NODES - active.length,
  };
}

const seed = Date.now() % 0xFFFFFFFF;
const net  = buildNetwork(seed);
const out  = propagate(net);

process.stdout.write(JSON.stringify(out) + '\n');
