#include <stdio.h>
#include <math.h>

// Function to find sum (no arguments, returns value)
float sum() {
    float a, b;
    printf("Enter two numbers for sum: ");
    scanf("%f %f", &a, &b);
    return (a + b);
}

// Function to find square root (no arguments, returns value)
float squareRoot() {
    float num;
    printf("Enter a number to find square root: ");
    scanf("%f", &num);
    return sqrt(num);
}

int main() {
    float s, root;

    s = sum();
    printf("Sum = %.2f\n", s);

    root = squareRoot();
    printf("Square Root = %.2f\n", root);

    return 0;
}