#include <stdio.h>

struct Student {
    char name[50];
    float marks[3];
    float total, average;
};

int main() {
    struct Student s;
    int i;

    printf("Enter name: ");
    scanf("%s", s.name);

    printf("Enter marks of 3 subjects:\n");
    for(i = 0; i < 3; i++) {
        scanf("%f", &s.marks[i]);
    }

    s.total = 0;
    for(i = 0; i < 3; i++) {
        s.total += s.marks[i];
    }

    s.average = s.total / 3;

    printf("\nTotal = %.2f\nAverage = %.2f\n", s.total, s.average);

    return 0;
}
