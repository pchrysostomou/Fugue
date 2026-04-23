#!/usr/bin/awk -f
# ANONYMOUS — AWK Signal Processor
# AWK: the silent transformer, reshapes every line it touches

BEGIN {
    n = 0
    split("signal noise void truth chaos order form entropy", labels, " ")
}

/^0b/ {
    val  = $1
    word = $NF
    printf "awk·bin  %s = %s\n", val, word
    n++
    next
}

/^0x/ {
    addr    = $1
    concept = $NF
    printf "awk·hex  %s : %s\n", addr, concept
    n++
    next
}

/[∞∅∴∵⊕⊗∇∆∫∑∏√≈≡∈⊂]/ {
    printf "awk·sym  %s\n", $0
    n++
    next
}

{
    printf "awk·raw  %s\n", $0
    n++
}

END {
    printf "awk·end  lines=%d\n", n
}
