#!/bin/bash
XDG_RUNTIME_DIR=/run/user/1000 WAYLAND_DISPLAY="wayland-1" swww img -o DP-2 $(find -L /home/cory/Pictures/background_rotate -type f | shuf -n 1)
