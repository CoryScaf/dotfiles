#!/bin/sh

killall linux-wallpaperengine
/home/cory/projects/linux-wallpaperengine/build/linux-wallpaperengine --silent --screen-root=DP-1 3036895455 > /home/cory/wpe-stdout.txt 2> /home/cory/wpe-stderr.txt &
/home/cory/projects/linux-wallpaperengine/build/linux-wallpaperengine --silent --screen-root=DP-2 2026973019 &
/home/cory/projects/linux-wallpaperengine/build/linux-wallpaperengine --silent --screen-root=DP-3 3022080536 &
