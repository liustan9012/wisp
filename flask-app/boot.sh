#!/bin/sh
while true; do
    flask db upgrade
    if [[ "$?" == "0" ]]; then
        break
    fi
    echo Upgrade command failed, retrying in 5 secs...
    sleep 5
done
# flask translate compile
flask create admin
exec gunicorn -b :5100 --access-logfile - --error-logfile - wispblog:app