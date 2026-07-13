#include <stdio.h>
#include <ctype.h>

// Function to convert name into proper case
char* properCase() {
    static char name[100];
    int i = 0;

    printf("Enter your friend's name: ");
    fgets(name, sizeof(name), stdin);

    // Convert first character to uppercase
    if (name[0] != '\0') {
        name[0] = toupper(name[0]);
    }

    // Convert remaining characters
    for (i = 1; name[i] != '\0'; i++) {
        if (name[i - 1] == ' ') {
            name[i] = toupper(name[i]);
        } else {
            name[i] = tolower(name[i]);
        }
    }

    return name;
}

int main() {
    char *result;

    result = properCase();
    printf("Proper Case Name: %s", result);

    return 0;
}