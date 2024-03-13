#!/usr/bin/env bash

swayidle -w \
    timeout 300 'hyprctl dispatch dpms off' \
    resume 'hyprctl dispatch dpms on' \
    timeout 600 'systemctl suspend' \
    resume 'hyprctl dispatch dpms on' \
