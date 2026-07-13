#include <stdio.h>

struct Book {
    char title[50];
    char author[50];
    float price;
};

int main() {
    struct Book b[5];
    int i;

    printf("Enter details of 5 books:\n");
    for(i = 0; i < 5; i++) {
        printf("\nBook %d:\n", i+1);
        scanf("%s %s %f", b[i].title, b[i].author, &b[i].price);
    }

    printf("\nBook Details:\n");
    for(i = 0; i < 5; i++) {
        printf("%s %s %.2f\n", b[i].title, b[i].author, b[i].price);
    }

    return 0;
}
