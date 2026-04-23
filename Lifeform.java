// ANONYMOUS — Java Lifeform
// Conway's Game of Life + Langton's Ant — two kinds of emergent life

import java.util.*;
import java.nio.file.*;

public class Lifeform {

    // ── CONWAY'S LIFE ──────────────────────────────────────────
    static final int ROWS = 55, COLS = 90;
    static int[][] grid = new int[ROWS][COLS];

    static void randomize(Random rng) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                grid[r][c] = rng.nextDouble() < 0.22 ? 1 : 0;
    }

    static void seed(int sr, int sc, int[][] pat) {
        sr = Math.min(sr, ROWS - pat.length - 1);
        sc = Math.min(sc, COLS - pat[0].length - 1);
        for (int r = 0; r < pat.length; r++)
            for (int c = 0; c < pat[r].length; c++)
                grid[sr + r][sc + c] = pat[r][c];
    }

    static void stepLife() {
        int[][] next = new int[ROWS][COLS];
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++) {
                int n = 0;
                for (int dr = -1; dr <= 1; dr++)
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) continue;
                        n += grid[(r+dr+ROWS)%ROWS][(c+dc+COLS)%COLS];
                    }
                next[r][c] = grid[r][c] == 1 ? (n==2||n==3?1:0) : (n==3?1:0);
            }
        for (int r = 0; r < ROWS; r++) grid[r] = next[r];
    }

    static int countAlive() {
        int s = 0;
        for (int[] row : grid) for (int v : row) s += v;
        return s;
    }

    // ── LANGTON'S ANT ─────────────────────────────────────────
    static final int ANT_W = 80, ANT_H = 50;
    static boolean[] antGrid = new boolean[ANT_W * ANT_H];
    static int antX = ANT_W / 2, antY = ANT_H / 2, antDir = 0;
    // dir: 0=up, 1=right, 2=down, 3=left
    static List<int[]> antTrail = new ArrayList<>();

    static void stepAnt() {
        int idx = antY * ANT_W + antX;
        if (antGrid[idx]) {
            antDir = (antDir + 3) % 4;   // turn left
        } else {
            antDir = (antDir + 1) % 4;   // turn right
        }
        antGrid[idx] = !antGrid[idx];
        antTrail.add(new int[]{antX, antY, antGrid[idx] ? 1 : 0});
        if (antTrail.size() > 250) antTrail.remove(0);

        switch (antDir) {
            case 0: antY = (antY - 1 + ANT_H) % ANT_H; break;
            case 1: antX = (antX + 1) % ANT_W; break;
            case 2: antY = (antY + 1) % ANT_H; break;
            case 3: antX = (antX - 1 + ANT_W) % ANT_W; break;
        }
    }

    // ── PERSISTENCE ───────────────────────────────────────────
    static final Path STATE = Paths.get(System.getProperty("user.dir"), "life_state.dat");

    static boolean loadState() {
        try {
            byte[] b = Files.readAllBytes(STATE);
            int need = ROWS * COLS + ANT_W * ANT_H + 3;
            if (b.length < ROWS * COLS) return false;
            for (int r = 0; r < ROWS; r++)
                for (int c = 0; c < COLS; c++)
                    grid[r][c] = b[r * COLS + c] & 0xFF;
            // ant state
            int off = ROWS * COLS;
            if (b.length >= off + ANT_W * ANT_H + 3) {
                for (int i = 0; i < ANT_W * ANT_H; i++)
                    antGrid[i] = b[off + i] != 0;
                antX   = b[off + ANT_W * ANT_H]     & 0xFF;
                antY   = b[off + ANT_W * ANT_H + 1] & 0xFF;
                antDir = b[off + ANT_W * ANT_H + 2] & 0xFF;
            }
            return true;
        } catch (Exception e) { return false; }
    }

    static void saveState() {
        try {
            int size = ROWS * COLS + ANT_W * ANT_H + 3;
            byte[] b = new byte[size];
            for (int r = 0; r < ROWS; r++)
                for (int c = 0; c < COLS; c++)
                    b[r * COLS + c] = (byte) grid[r][c];
            int off = ROWS * COLS;
            for (int i = 0; i < ANT_W * ANT_H; i++)
                b[off + i] = antGrid[i] ? (byte)1 : 0;
            b[off + ANT_W * ANT_H]     = (byte) antX;
            b[off + ANT_W * ANT_H + 1] = (byte) antY;
            b[off + ANT_W * ANT_H + 2] = (byte) antDir;
            Files.write(STATE, b);
        } catch (Exception ignored) {}
    }

    // ── JSON ──────────────────────────────────────────────────
    static String toJSON() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"rows\":").append(ROWS)
          .append(",\"cols\":").append(COLS)
          .append(",\"alive\":").append(countAlive())
          .append(",\"grid\":[");
        for (int r = 0; r < ROWS; r++) {
            sb.append('[');
            for (int c = 0; c < COLS; c++) {
                if (c > 0) sb.append(',');
                sb.append(grid[r][c]);
            }
            sb.append(']');
            if (r < ROWS - 1) sb.append(',');
        }
        sb.append("],\"ant_w\":").append(ANT_W)
          .append(",\"ant_h\":").append(ANT_H)
          .append(",\"ant_trail\":[");
        for (int i = 0; i < antTrail.size(); i++) {
            if (i > 0) sb.append(',');
            int[] p = antTrail.get(i);
            sb.append('[').append(p[0]).append(',')
              .append(p[1]).append(',').append(p[2]).append(']');
        }
        sb.append("]}");
        return sb.toString();
    }

    public static void main(String[] args) {
        Random rng = new Random();
        boolean loaded = loadState();

        if (!loaded) {
            randomize(rng);
            int[][] glider = {{0,1,0},{0,0,1},{1,1,1}};
            int[][] rpento = {{0,1,1},{1,1,0},{0,1,0}};
            int[][] blinker = {{1,1,1}};
            for (int i = 0; i < 6; i++)
                seed(rng.nextInt(ROWS-5), rng.nextInt(COLS-5), glider);
            seed(rng.nextInt(ROWS-5), rng.nextInt(COLS-5), rpento);
            for (int i = 0; i < 8; i++)
                seed(rng.nextInt(ROWS-3), rng.nextInt(COLS-3), blinker);
            for (int i = 0; i < 40; i++) stepLife();
            // Warm up ant
            for (int i = 0; i < 2000; i++) stepAnt();
        } else {
            stepLife();
            for (int i = 0; i < 12; i++) stepAnt();
        }

        saveState();
        System.out.println(toJSON());
    }
}
