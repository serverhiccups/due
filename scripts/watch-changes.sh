#!/bin/sh
cd /vagrant
while true; do
	deno --allow-read --allow-net index.js &
	PID=$!
	inotifywait -e modify -e move -e move_self -e create -e delete -r /vagrant/pub /vagrant/src
	kill $PID
done
