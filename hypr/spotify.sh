#!/bin/sh

class=$(playerctl metadata --player=spotify --format '{{lc(status)}}')
icon=""

if [[ $class == "playing" ]]; then
  info=$(playerctl metadata --player=spotify --format '{{artist}} - {{title}}')
  if [[ ${#info} > 40 ]]; then
    info=$(echo $info | cut -c1-40)"..."
  fi
  text="<b>$info <span foreground='#1ED760'>$icon</span> </b>"
elif [[ $class == "paused" ]]; then
  text="<b><span foreground='#1ED760'>$icon</span> </b>"
elif [[ $class == "stopped" ]]; then
  text=""
fi

echo $text
