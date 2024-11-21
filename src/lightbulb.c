#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdbool.h>
#include <stdint.h>

#include <mosquitto.h>


typedef struct {

} State;




int main(void) {

    State state = {};
    struct mosquitto *client = mosquitto_new(NULL, true, &state);


    return EXIT_SUCCESS;

}
