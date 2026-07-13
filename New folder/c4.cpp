#include <stdio.h>

// Function to find max and min (no arguments, returns value via array)
void* findMaxMin() {
    static int arr[100];
    int n, i;
    int max, min;

    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter %d numbers:\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    max = arr[0];
    min = arr[0];

    for (i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
        if (arr[i] < min) {
            min = arr[i];
        }
    }

    printf("Maximum value = %d\n", max);
    printf("Minimum value = %d\n", min);

    return arr; // returning pointer (not used further)
}

int main() {
    findMaxMin();
    return 0;
}