#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define N 5 // Number of philosophers

sem_t forks[N];
pthread_t philosophers[N];

void* philosopher(void* num) {
    int id = *(int*)num;
    while (1) {
        printf("Philosopher %d is thinking.\n", id);
        sleep(1); // Thinking

        printf("Philosopher %d is hungry.\n", id);

        // Pick up forks (avoid deadlock: pick lower number first)
        int left = id;
        int right = (id + 1) % N;

        if (left < right) {
            sem_wait(&forks[left]);
            sem_wait(&forks[right]);
        } else {
            sem_wait(&forks[right]);
            sem_wait(&forks[left]);
        }

        printf("Philosopher %d is eating.\n", id);
        sleep(2); // Eating

        sem_post(&forks[left]);
        sem_post(&forks[right]);

        printf("Philosopher %d finished eating and put down forks.\n", id);
        sleep(1);
    }
    return NULL;
}

int main() {
    int i;
    int ids[N];

    // Initialize semaphores for forks
    for (i = 0; i < N; i++) {
        sem_init(&forks[i], 0, 1);
        ids[i] = i;
    }

    // Create philosopher threads
    for (i = 0; i < N; i++) {
        pthread_create(&philosophers[i], NULL, philosopher, &ids[i]);
    }

    // Wait for threads to finish (they won't in this infinite loop)
    for (i = 0; i < N; i++) {
        pthread_join(philosophers[i], NULL);
    }

    // Destroy semaphores
    for (i = 0; i < N; i++) {
        sem_destroy(&forks[i]);
    }

    return 0;
}

