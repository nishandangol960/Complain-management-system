#include <stdio.h>

struct Student {
    int roll;
    char fname[20], lname[20];
};

int main() {
    struct Student s[10], temp;
    int i, j;

    printf("Enter details of 10 students:\n");
    for(i = 0; i < 10; i++) {
        scanf("%d %s %s", &s[i].roll, s[i].fname, s[i].lname);
    }

    // Sorting by roll number
    for(i = 0; i < 9; i++) {
        for(j = i + 1; j < 10; j++) {
            if(s[i].roll > s[j].roll) {
                temp = s[i];
                s[i] = s[j];
                s[j] = temp;
            }
        }
    }

    printf("\nSorted Records:\n");
    for(i = 0; i < 10; i++) {
        printf("%d %s %s\n", s[i].roll, s[i].fname, s[i].lname);
    }

    return 0;
}