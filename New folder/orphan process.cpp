#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int main() {
    pid_t pid = fork(); // Create child process

    if(pid < 0) {
        printf("Fork failed.\n");
        return 1;
    }
    else if(pid == 0) {
        // Child process
        sleep(5); // Let parent terminate first
        printf("Child process running as orphan now. PID = %d, Parent PID = %d\n",
                getpid(), getppid());
    }
    else {
        // Parent process
        printf("Parent process exiting. PID = %d\n", getpid());
        exit(0); // Parent terminates immediately
    }

    return 0;
}

