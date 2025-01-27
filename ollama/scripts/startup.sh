# Start the Ollama server in the background
echo "Starting Ollama server..."
ollama serve &

# Check if OLLAMA_MODEL is set
if [ -z "$OLLAMA_MODEL" ]; then
  echo "OLLAMA_MODEL is not set in the environment. Exiting."
  exit 1
fi

# Check if OLLAMA_COOLDOWN is set, and default to 10 if not
COOLDOWN_TIME=${OLLAMA_COOLDOWN_IN_SECONDS:-10}

# Wait for the Ollama server to start, using the cooldown time
echo "Waiting for Ollama server to start for $COOLDOWN_TIME seconds..."
sleep $COOLDOWN_TIME

# Pull the specified model
echo "Pulling model: $OLLAMA_MODEL"
ollama pull "$OLLAMA_MODEL"

# Wait for the Ollama server process to keep the container running
wait
