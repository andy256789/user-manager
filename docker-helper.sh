#!/bin/bash

# Docker Helper Script for User Manager Backend

set -e

DOCKER_IMAGE="user-manager-backend"
CONTAINER_NAME="user-manager-backend-dev"

case $1 in
  "build")
    echo "🔨 Building Nx project..."
    npx nx build manager-backend
    echo "🐳 Building Docker image..."
    docker build -t $DOCKER_IMAGE -f apps/manager-backend/Dockerfile .
    echo "✅ Build complete!"
    ;;
    
  "run")
    echo "🚀 Running Docker container..."
    docker run -d --name $CONTAINER_NAME -p 3000:3000 $DOCKER_IMAGE
    echo "✅ Container started! Application available at http://localhost:3000"
    ;;
    
  "stop")
    echo "🛑 Stopping container..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    echo "✅ Container stopped!"
    ;;
    
  "logs")
    echo "📋 Showing container logs..."
    docker logs -f $CONTAINER_NAME
    ;;
    
  "clean")
    echo "🧹 Cleaning up containers and images..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    docker rmi $DOCKER_IMAGE 2>/dev/null || true
    echo "✅ Cleanup complete!"
    ;;
    
  "compose-up")
    echo "🐳 Starting with Docker Compose..."
    docker-compose up -d
    echo "✅ Services started!"
    ;;
    
  "compose-down")
    echo "🛑 Stopping Docker Compose services..."
    docker-compose down
    echo "✅ Services stopped!"
    ;;
    
  *)
    echo "Usage: $0 {build|run|stop|logs|clean|compose-up|compose-down}"
    echo ""
    echo "Commands:"
    echo "  build        - Build Nx project and Docker image"
    echo "  run          - Run Docker container"
    echo "  stop         - Stop and remove container"
    echo "  logs         - Show container logs"
    echo "  clean        - Clean up containers and images"
    echo "  compose-up   - Start services with Docker Compose"
    echo "  compose-down - Stop Docker Compose services"
    exit 1
    ;;
esac
