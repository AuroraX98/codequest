#include <stdio.h>
int main(void) {
    int ch = fgetc(stdin);
    if (ch == EOF && !ferror(stdin)) {
        printf("%d\n", feof(stdin) != 0);
    }
    return 0;
}
