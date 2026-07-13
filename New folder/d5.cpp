#include <stdio.h>

struct Employee {
    char name[50];
    int age;
    float salary;
};

int main() {
    FILE *fp;
    struct Employee emp;
    int n, i;

    fp = fopen("employees.txt", "w");

    if (fp == NULL) {
        printf("Error opening file!\n");
        return 1;
    }

    printf("Enter number of employees: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        printf("\nEnter details of employee %d:\n", i + 1);

        printf("Name: ");
        scanf(" %[^\n]", emp.name);

        printf("Age: ");
        scanf("%d", &emp.age);

        printf("Salary: ");
        scanf("%f", &emp.salary);

        fprintf(fp, "Name: %s\nAge: %d\nSalary: %.2f\n\n",
                emp.name, emp.age, emp.salary);
    }

    fclose(fp);

    printf("\nEmployee data successfully saved to file.\n");

    return 0;
}