#include <stdio.h>

// Recursive function to find prime factors
void primeFactors(int n, int i) {
    // Base case
    if (n == 1)
        return;

    // If i divides n, print i and call recursively
    if (n % i == 0) {
        printf("%d ", i);
        primeFactors(n / i, i);  // keep dividing by same factor
    } else {
        primeFactors(n, i + 1);  // try next number
    }
}

int main() {
    int num;

    printf("Enter a number: ");
    scanf("%d", &num);

    printf("Prime factors: ");
    primeFactors(num, 2);

    return 0;
}