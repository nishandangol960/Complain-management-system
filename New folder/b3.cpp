#include <stdio.h>
#include <ctype.h>
#include <string.h>

// Function with arguments but no return value
void properCase(char name[]) {
    int i;

    // Convert first character to uppercase
    if (name[0] != '\0') {
        name[0] = toupper(name[0]);
    }

    // Convert remaining characters
    for (i = 1; name[i] != '\0'; i++) {
        if (name[i - 1] == ' ') {
            name[i] = toupper(name[i]);   // first letter after space
        } else {
            name[i] = tolower(name[i]);   // other letters
        }
    }

    printf("Proper Case Name: %s\n", name);
}

int main() {
    char name[100];

    printf("Enter friend's name (in any case): ");
    fgets(name, sizeof(name), stdin);

    // Remove newline character
    name[strcspn(name, "\n")] = '\0';

    properCase(name);  // passing argument

    return 0;
}