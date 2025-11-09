#!/bin/bash
unset d
unset u

state=${state:-up}

while getopts 'd' o; do 
    case $o in
        d) state=down ;;
        *) echo "Unknown flags used. -d compose down, -u compose up"
    esac
done

if [[ $state == up ]]; then
    docker compose -f compose.base.yml -f compose.dev.yml up -d --build
else
    docker compose -f compose.base.yml -f compose.dev.yml down --remove-orphans
fi