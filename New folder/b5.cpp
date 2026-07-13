#include <stdio.h>

// Function with arguments but no return value
void fibonacci(int n) {
    int first = 0, second = 1, next, i;

    printf("Fibonacci Series:\n");

    for(i = 1; i <= n; i++) {
        printf("%d ", first);
        next = first + second;
        first = second;
        second = next;
    }
}

int main() {
    int n;

    printf("Enter number of terms: ");
    scanf("%d", &n);

    fibonacci(n);  // passing argument

    return 0;
}