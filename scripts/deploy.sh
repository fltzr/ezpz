#!/bin/bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'

printl() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

# Load environment variables
source .env

# Debugging information
printl "Starting deployment script..."
printl "Building Docker image: $IMAGE_NAME"
printl "Saving Docker image to tar file: $TAR_FILE"
printl "Copying tar file to remote host: $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

if [ -f "$TAR_FILE" ]; then
    rm "$TAR_FILE" && printl "Removed dangling tar file"
fi

docker build -t $IMAGE_NAME .
docker save $IMAGE_NAME > $TAR_FILE && printl "Successfully built and saved image to $TAR_FILE"

scp -i $REMOTE_KEY_PATH $TAR_FILE $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR && printl "Copied docker image to remote host"

ssh -i $REMOTE_KEY_PATH $REMOTE_USER@$REMOTE_HOST << EOF
    cd $REMOTE_DIR
    docker compose down
    docker load -i $TAR_FILE
    docker compose up -d
    rm $TAR_FILE
EOF

rm $TAR_FILE && printl "Removed $TAR_FILE"

printl "Deployment completed."