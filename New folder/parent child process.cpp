#include <stdio.h>
#include <unistd.h>

int main() {
    int pid = fork(); // create child process

    if(pid == 0) {
        // Child process
        printf("Child process: PID = %d\n", getpid());
    } else {
        // Parent process
        printf("Parent process: PID = %d, Child PID = %d\n", getpid(), pid);
    }

    return 0;
}

