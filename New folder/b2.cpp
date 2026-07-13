#include <stdio.h>
#include <math.h>

// Function with arguments but no return value
void calculate(float a, float b) {
    float sum, sqrtA, sqrtB;

    sum = a + b;
    sqrtA = sqrt(a);
    sqrtB = sqrt(b);

    printf("Sum of two numbers = %.2f\n", sum);
    printf("Square root of %.2f = %.2f\n", a, sqrtA);
    printf("Square root of %.2f = %.2f\n", b, sqrtB);
}

int main() {
    float num1, num2;

    printf("Enter two numbers: ");
    scanf("%f %f", &num1, &num2);

    calculate(num1, num2);  // passing arguments

    return 0;
}