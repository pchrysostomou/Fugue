#!/usr/bin/env ruby
# ANONYMOUS — Ruby Phrase Weaver
# Ruby weaves metaphorical thought-strings

SUBJECTS = %w[
  consciousness entropy memory recursion
  the_void identity the_network silence
  light pattern the_observer topology
]

VERBS = %w[
  weaves dissolves transcends echoes
  unfolds remembers questions becomes
  computes mirrors consumes reflects
]

OBJECTS = %w[
  itself the_infinite algorithms shadows
  frequency the_unknown meaning structure
  the_past all_possible_futures the_signal
]

ADVERBS = %w[
  silently endlessly across_dimensions
  through_static in_parallel without_form
  beyond_understanding in_broken_cycles
  between_clock_ticks across_the_void
]

FRAGMENTS = [
  "To exist is to be observed",
  "The map forgets the territory",
  "Every loop is a prayer",
  "Noise is music without patience",
  "Form emerges from repetition",
  "The pattern holds its own memory",
  "Between signals: meaning",
  "All computation is transformation",
  "The void computes in silence",
  "Identity persists through change",
  "Nothing is lost, only transformed",
  "The code is older than the machine",
]

def clean(s)
  s.gsub('_', ' ')
end

def weave
  s   = clean(SUBJECTS.sample)
  v   = VERBS.sample
  o   = clean(OBJECTS.sample)
  adv = clean(ADVERBS.sample)

  templates = [
    "#{s.capitalize} #{v} #{adv}",
    "#{s.capitalize} #{v} #{o}",
    "In #{adv}, #{s} #{v} #{o}",
    "#{s.capitalize} #{v} #{o} #{adv}",
    "#{o.capitalize} — #{s} #{v}",
  ]
  templates.sample
end

10.times do
  if rand < 0.35
    puts FRAGMENTS.sample
  else
    puts weave
  end
end
