#!/bin/bash
echo "Setting up environment..."
export PORT=${PORT:-3000}
echo "PORT is set to $PORT"

# Ensure port is available
echo "Checking if port $PORT is in use..."
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "Port $PORT is already in use!"
    kill -9 $(lsof -t -i:$PORT)
    echo "Killed process using port $PORT"
fi

echo "Environment setup complete." 