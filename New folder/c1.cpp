#include <stdio.h>

// Function with no arguments and no return value
void reverseNumber() {
    int num, rev = 0, rem;

    printf("Enter a number: ");
    scanf("%d", &num);

    while (num != 0) {
        rem = num % 10;
        rev = rev * 10 + rem;
        num = num / 10;
    }

    printf("Reversed number = %d\n", rev);
}

int main() {
    reverseNumber();  // function call
    return 0;
}