#!/bin/sh

sleep 2
PATH=/home/cory/.bun/bin:$PATH /usr/local/bin/ags --config /home/cory/.config/ags/config.js 2>&1 > ~/ags-logs
