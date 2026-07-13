#include <stdio.h>

struct Employee {
    char name[50];
    int id;
    float salary;
};

int main() {
    struct Employee e[3];
    int i, maxIndex = 0;

    printf("Enter details of 3 employees:\n");
    for(i = 0; i < 3; i++) {
        scanf("%s %d %f", e[i].name, &e[i].id, &e[i].salary);
    }

    for(i = 1; i < 3; i++) {
        if(e[i].salary > e[maxIndex].salary) {
            maxIndex = i;
        }
    }

    printf("\nEmployee with highest salary:\n");
    printf("Name: %s\nID: %d\nSalary: %.2f\n",
           e[maxIndex].name, e[maxIndex].id, e[maxIndex].salary);

    return 0;
}