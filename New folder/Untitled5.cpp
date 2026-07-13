#include <stdio.h>
#include <math.h>

// Function to find sum (passing arguments, returning value)
float sum(float a, float b) {
    return a + b;
}

// Function to find square root (passing argument, returning value)
float squareRoot(float num) {
    return sqrt(num);
}

int main() {
    float a, b, num, s, root;

    // Input for sum
    printf("Enter two numbers for sum: ");
    scanf("%f %f", &a, &b);

    s = sum(a, b);
    printf("Sum = %.2f\n", s);

    // Input for square root
    printf("Enter a number to find square root: ");
    scanf("%f", &num);

    root = squareRoot(num);
    printf("Square Root = %.2f\n", root);

    return 0;
}