#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

// Function to be executed by threads
void* print_message(void* arg) {
    char* message = (char*)arg;
    for(int i=0; i<5; i++) {
        printf("%s: iteration %d\n", message, i+1);
        sleep(1); // simulate some work
    }
    return NULL;
}

int main() {
    pthread_t thread1, thread2;

    // Create two threads
    pthread_create(&thread1, NULL, print_message, "Thread 1");
    pthread_create(&thread2, NULL, print_message, "Thread 2");

    // Wait for threads to finish
    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);

    printf("Both threads finished execution.\n");
    return 0;
}

