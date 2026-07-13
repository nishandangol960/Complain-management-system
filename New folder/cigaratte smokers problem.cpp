#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <stdlib.h>

sem_t tobacco, paper, matches, agent;

void* smoker(void* arg) {
    int id = *(int*)arg; // 0 = tobacco, 1 = paper, 2 = matches
    sem_t* my_sem = (id==0)? &tobacco : (id==1)? &paper : &matches;

    while(1) {
        sem_wait(my_sem);
        printf("Smoker %d is making and smoking a cigarette.\n", id);
        sleep(1);
        sem_post(&agent);
    }
    return NULL;
}

void* agent_func(void* arg) {
    while(1) {
        sem_wait(&agent);
        int r = rand()%3;
        if(r==0) { printf("Agent puts paper & matches\n"); sem_post(&tobacco); }
        if(r==1) { printf("Agent puts tobacco & matches\n"); sem_post(&paper); }
        if(r==2) { printf("Agent puts tobacco & paper\n"); sem_post(&matches); }
        sleep(1);
    }
    return NULL;
}

int main() {
    pthread_t sm[3], ag;
    sem_init(&tobacco,0,0); sem_init(&paper,0,0); sem_init(&matches,0,0); sem_init(&agent,0,1);
    int ids[3]={0,1,2};

    for(int i=0;i<3;i++) pthread_create(&sm[i],NULL,smoker,&ids[i]);
    pthread_create(&ag,NULL,agent_func,NULL);

    for(int i=0;i<3;i++) pthread_join(sm[i],NULL);
    pthread_join(ag,NULL);
}


