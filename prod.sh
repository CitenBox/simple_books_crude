#!/bin/bash
unset d
unset u

state=${state:-up}

while getopts 'd' o; do 
    case $o in
        d) state=down ;;
        *) echo "Unknown flags used. -d for compose down, -u for compose up"
    esac
done

if [[ $state == up ]]; then
    docker compose -f compose.base.yml -f compose.prod.yml up -d --build --wait
    curl -I http://localhost:8080/               
    curl -I http://localhost:8080/api/health
    curl -I http://localhost:3001/ || echo "api not published (good)"
else
    docker compose -f compose.base.yml -f compose.prod.yml down --remove-orphans
fi