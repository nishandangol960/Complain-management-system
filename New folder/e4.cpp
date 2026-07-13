#include <stdio.h>

// Recursive function to find sum of array
int sumArray(int arr[], int n) {
    // Base case
    if (n <= 0)
        return 0;

    // Recursive case
    return arr[n - 1] + sumArray(arr, n - 1);
}

int main() {
    int n, i;

    printf("Enter size of array: ");
    scanf("%d", &n);

    int arr[n];

    printf("Enter %d elements:\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int sum = sumArray(arr, n);

    printf("Sum of array elements = %d\n", sum);

    return 0;
}