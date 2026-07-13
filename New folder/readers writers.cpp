#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t mutex, write_sem;
int read_count = 0;

void* reader(void* arg) {
    int id = *(int*)arg;
    while(1) {
        sem_wait(&mutex);
        read_count++;
        if(read_count == 1) sem_wait(&write_sem); // first reader blocks writers
        sem_post(&mutex);

        printf("Reader %d is reading.\n", id);
        sleep(1);

        sem_wait(&mutex);
        read_count--;
        if(read_count == 0) sem_post(&write_sem); // last reader releases writer
        sem_post(&mutex);

        sleep(1);
    }
}

void* writer(void* arg) {
    int id = *(int*)arg;
    while(1) {
        sem_wait(&write_sem);
        printf("Writer %d is writing.\n", id);
        sleep(2);
        sem_post(&write_sem);
        sleep(1);
    }
}

int main() {
    pthread_t r[3], w[2];
    int r_id[3] = {1,2,3};
    int w_id[2] = {1,2};

    sem_init(&mutex,0,1);
    sem_init(&write_sem,0,1);

    for(int i=0;i<3;i++) pthread_create(&r[i],NULL,reader,&r_id[i]);
    for(int i=0;i<2;i++) pthread_create(&w[i],NULL,writer,&w_id[i]);

    for(int i=0;i<3;i++) pthread_join(r[i],NULL);
    for(int i=0;i<2;i++) pthread_join(w[i],NULL);

    return 0;
}

