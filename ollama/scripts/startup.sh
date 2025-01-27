# Start the Ollama server in the background
echo "Starting Ollama server..."
ollama serve &

# Check if OLLAMA_MODEL is set
if [ -z "$OLLAMA_MODEL" ]; then
  echo "OLLAMA_MODEL is not set in the environment. Exiting."
  exit 1
fi

# Wait a bit to ensure the server has started
echo "Waiting for Ollama server to start..."
sleep 10

# Pull the specified model
echo "Pulling model: $OLLAMA_MODEL"
ollama pull "$OLLAMA_MODEL"

# Wait for the Ollama server process to keep the container running
wait