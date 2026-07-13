#include <stdio.h>

struct Student {
    char name[50];
    int roll;
    float marks;
};

int main() {
    FILE *fp;
    struct Student s;
    int n, i;

    fp = fopen("record.txt", "w");

    printf("Enter number of students: ");
    scanf("%d", &n);

    for(i = 0; i < n; i++) {
        printf("Enter name, roll, marks:\n");
        scanf("%s %d %f", s.name, &s.roll, &s.marks);
        fprintf(fp, "%s %d %.2f\n", s.name, s.roll, s.marks);
    }

    fclose(fp);

    fp = fopen("record.txt", "r");

    printf("\nStored Records:\n");
    while(fscanf(fp, "%s %d %f", s.name, &s.roll, &s.marks) != EOF) {
        printf("%s %d %.2f\n", s.name, s.roll, s.marks);
    }

    fclose(fp);

    return 0;
}