#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    pid_t pid = fork(); // create child process

    if(pid > 0) {
        // Parent process
        printf("Parent PID: %d, child PID: %d\n", getpid(), pid);
        printf("Child becomes zombie for 10 seconds...\n");
        sleep(10); // Parent sleeps without calling wait()
        // After sleep, parent can reap child using wait() if needed
    }
    else if(pid == 0) {
        // Child process
        printf("Child PID: %d exiting...\n", getpid());
        exit(0); // Child exits immediately
    }
    else {
        printf("Fork failed.\n");
        return 1;
    }

    return 0;
}

