#!/usr/bin/env bash

swayidle -w \
    timeout 600 'hyprctl dispatch dpms off' \
    resume 'hyprctl dispatch dpms on' \
    timeout 1800 'systemctl suspend' \
    resume 'hyprctl dispatch dpms on' \
