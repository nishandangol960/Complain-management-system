#include <stdio.h>
#include <ctype.h>

int main() {
    FILE *fp;
    char ch;
    int lines = 0, words = 0, chars = 0;

    fp = fopen("text.txt", "r");

    while((ch = fgetc(fp)) != EOF) {
        chars++;

        if(ch == '\n')
            lines++;

        if(isspace(ch))
            words++;
    }

    words++; // last word

    printf("Lines = %d\nWords = %d\nCharacters = %d\n", lines, words, chars);

    fclose(fp);

    return 0;
}