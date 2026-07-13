#include <stdio.h>

int main() {
    int num = 25;     // normal variable
    int *ptr;         // pointer variable

    ptr = &num;       // store address of num in pointer

    printf("Value of num = %d\n", num);
    printf("Address of num = %p\n", &num);

    printf("Pointer ptr stores address = %p\n", ptr);
    printf("Value at stored address (*ptr) = %d\n", *ptr);

    return 0;
}