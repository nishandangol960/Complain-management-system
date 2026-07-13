#include <stdio.h>

int main() {
    FILE *fp;
    char name[50];
    int age;
    float salary;

    fp = fopen("employee.txt", "w");

    printf("Enter name, age, salary:\n");
    scanf("%s %d %f", name, &age, &salary);

    fprintf(fp, "%s %d %.2f\n", name, age, salary);

    fclose(fp);

    printf("Data written to file successfully.\n");

    return 0;
}