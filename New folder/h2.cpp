#include <stdio.h>

int main() {
    FILE *fp;
    int n, i;
    char name[50];
    float marks;

    fp = fopen("students.txt", "w");

    printf("Enter number of students: ");
    scanf("%d", &n);

    for(i = 0; i < n; i++) {
        printf("Enter name and marks:\n");
        scanf("%s %f", name, &marks);
        fprintf(fp, "%s %.2f\n", name, marks);
    }

    fclose(fp);

    fp = fopen("students.txt", "r");

    printf("\nStudent Records:\n");
    while(fscanf(fp, "%s %f", name, &marks) != EOF) {
        printf("%s %.2f\n", name, marks);
    }

    fclose(fp);

    return 0;
}