#include <stdio.h>
#include <ctype.h>
#include <string.h>

// Function with no arguments and no return value
void properCase() {
    char name[100];
    int i;

    printf("Enter friend's name (in any case): ");
    fgets(name, sizeof(name), stdin);

    // Remove newline if present
    name[strcspn(name, "\n")] = '\0';

    // Convert first character to uppercase
    if (name[0] != '\0') {
        name[0] = toupper(name[0]);
    }

    // Convert rest of the characters
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
    properCase();  // function call
    return 0;
}