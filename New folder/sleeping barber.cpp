#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define CHAIRS 3
#define CUSTOMERS 5

sem_t waiting;   // Available chairs
sem_t barber;    // Barber ready

void* customer(void* arg) {
    int id = *(int*)arg;
    if(sem_trywait(&waiting) == 0) { // Sit if chair available
        printf("Customer %d is waiting.\n", id);
        sem_post(&barber);           // Wake barber
    } else {
        printf("Customer %d left (no chairs).\n", id);
    }
    return NULL;
}

void* barber_func(void* arg) {
    while(1) {
        sem_wait(&barber);           // Wait for customer
        sem_post(&waiting);          // Customer leaves chair
        printf("Barber is cutting hair.\n");
        sleep(2);                    // Time to cut hair
    }
}

int main() {
    pthread_t b, c[CUSTOMERS];
    int ids[CUSTOMERS];

    sem_init(&waiting, 0, CHAIRS);
    sem_init(&barber, 0, 0);

    pthread_create(&b, NULL, barber_func, NULL);

    for(int i=0;i<CUSTOMERS;i++){
        ids[i]=i+1;
        sleep(1);
        pthread_create(&c[i], NULL, customer, &ids[i]);
    }

    pthread_join(b, NULL);
    for(int i=0;i<CUSTOMERS;i++) pthread_join(c[i], NULL);
}

