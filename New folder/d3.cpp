#include <stdio.h>

// Function to calculate sum (passing arguments, returning value)
int arraySum(int arr[], int n) {
    int i, sum = 0;

    for (i = 0; i < n; i++) {
        sum = sum + arr[i];
    }

    return sum;
}

int main() {
    int arr[100], n, i, result;

    printf("Enter the size of array: ");
    scanf("%d", &n);

    printf("Enter %d elements:\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    result = arraySum(arr, n);

    printf("Sum of array elements = %d\n", result);

    return 0;
}