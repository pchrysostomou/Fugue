#!/usr/bin/perl
# ANONYMOUS — Perl Oracle
# Perl speaks in symbols and transforms

use strict;
use warnings;
use POSIX qw(floor);

my @sym  = ('∞','∅','∴','∵','⊕','⊗','∇','∆','∫','∑','∏','√','≈','≡','∈','⊂');
my @ops  = ('::', '→', '⇔', '≜', '↦', '∘', '⊢');
my @conc = qw(
    entropy recursion singularity paradox emergence
    resonance topology manifold attractor eigenvalue
    morphism homeomorphism bifurcation strange_loop
    strange_attractor phase_space limit_cycle
);

sub sym_pair {
    return $sym[floor(rand(scalar @sym))];
}

sub oracle {
    my $s1  = sym_pair();
    my $s2  = sym_pair();
    my $op  = $ops[floor(rand(scalar @ops))];
    my $c   = $conc[floor(rand(scalar @conc))];
    (my $cn = $c) =~ s/_/ /g;
    return "$s1 $cn $op $s2";
}

sub binary_koan {
    my $bits = join '', map { int rand 2 } 1..8;
    my @w    = qw(null void self true false unit bottom top);
    my $word = $w[floor(rand scalar @w)];
    return "0b$bits  ≡  $word";
}

sub hex_poem {
    my $h = sprintf("%04X", floor(rand(0xFFFF)));
    my @n = qw(silence noise signal entropy truth form chaos order);
    return "0x$h  →  " . $n[floor(rand scalar @n)];
}

for (1..9) {
    my $r = rand();
    if    ($r < 0.40) { print oracle()     . "\n" }
    elsif ($r < 0.70) { print binary_koan(). "\n" }
    else              { print hex_poem()   . "\n" }
}
