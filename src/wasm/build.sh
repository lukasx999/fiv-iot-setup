#!/usr/bin/env bash
set -euxo pipefail

# emcc cube.c raylib/src/libraylib.web.a -O3 -Wall -Wextra -I./raylib/src -s USE_GLFW=3 -s ASYNCIFY -DPLATFORM_WEB --shell-file ./raylib/src/minshell.html -o cube.html
# emcc cube.c ./raylib/lib/libraylib.a -O3 -Wall -Wextra -I./raylib/include -s USE_GLFW=3 -s ASYNCIFY -DPLATFORM_WEB --shell-file ./raylib_git/src/minshell.html -o cube.html
emcc cube.c ./raylib/lib/libraylib.a -O3 -Wall -Wextra -I./raylib/include -s USE_GLFW=3 -s ASYNCIFY -DPLATFORM_WEB --shell-file ./minshell.html -o cube.html

# emcc cube.c raylib/src/libraylib.web.a -I./raylib/src -L./raylib/src -lglfw -lrt -ldl -lX11 -o cube.html --shell-file ./raylib/src/minshell.html -DPLATFORM_WEB

# cc cube.c -Wall -Wextra -ggdb -std=c11 -pedantic -o out -lraylib -lm
