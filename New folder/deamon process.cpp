#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() {
    pid_t pid;

    // Fork first time
    pid = fork();

    if(pid < 0) {
        exit(EXIT_FAILURE);
    }

    if(pid > 0) {
        // Parent process exits
        printf("Parent process exiting. Child becomes daemon.\n");
        exit(EXIT_SUCCESS);
    }

    // Child continues
    umask(0);           // Set file permissions
    setsid();           // Create new session
    chdir("/");         // Change working directory

    // Close standard file descriptors
    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);

    // Daemon process code
    while(1) {
        // Example task: write timestamp to a file every 5 seconds
        FILE *fp = fopen("/tmp/daemon_log.txt", "a");
        if(fp) {
            fprintf(fp, "Daemon is running. PID = %d\n", getpid());
            fclose(fp);
        }
        sleep(5);
    }

    return 0;
}

