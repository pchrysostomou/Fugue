/*
 * ANONYMOUS — Fractal Engine
 * C — raw speed, raw math
 *
 * Samples the Mandelbrot set across rotating zoom windows,
 * outputs a JSON array of [norm_x, norm_y, iter, max_iter] quads.
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

#define MAX_ITER  120
#define N_POINTS  400

/* Famous Mandelbrot interest points */
static const double CX[] = { -0.745428,  -0.761574, -0.5601,   0.0,     -1.7549 };
static const double CY[] = {  0.113009,   0.0,       0.6421,   0.0,      0.0    };
static const double ZM[] = {  0.05,       0.01,      0.04,     2.0,      0.01   };
#define N_REGIONS 5

static int mandelbrot(double cr, double ci, int max) {
    double zr = 0.0, zi = 0.0;
    int    k  = 0;
    while (zr*zr + zi*zi <= 4.0 && k < max) {
        double tmp = zr*zr - zi*zi + cr;
        zi = 2.0*zr*zi + ci;
        zr = tmp;
        k++;
    }
    return k;
}

int main(void) {
    srand((unsigned)time(NULL));

    /* Slowly rotate through regions based on time */
    int    reg  = (int)(time(NULL) / 8) % N_REGIONS;
    double cx   = CX[reg];
    double cy   = CY[reg];
    double zoom = ZM[reg];

    /* Add a slow continuous drift */
    double drift = (time(NULL) % 600) / 600.0 * 2.0 * 3.14159;
    cx += cos(drift) * zoom * 0.1;
    cy += sin(drift) * zoom * 0.1;

    putchar('[');
    for (int i = 0; i < N_POINTS; i++) {
        double real = cx + ((double)rand() / RAND_MAX - 0.5) * zoom * 2.2;
        double imag = cy + ((double)rand() / RAND_MAX - 0.5) * zoom * 2.2;

        int iter = mandelbrot(real, imag, MAX_ITER);

        /* Normalize to [0,1] */
        double px = (real - (cx - zoom * 1.1)) / (zoom * 2.2);
        double py = (imag - (cy - zoom * 1.1)) / (zoom * 2.2);

        if (i > 0) putchar(',');
        printf("[%.4f,%.4f,%d,%d]", px, py, iter, MAX_ITER);
    }
    puts("]");
    return 0;
}
