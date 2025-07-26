# Docker Helper Script for User Manager Backend (PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("build", "run", "stop", "logs", "clean", "compose-up", "compose-down")]
    [string]$Command
)

$DOCKER_IMAGE = "user-manager-backend"
$CONTAINER_NAME = "user-manager-backend-dev"

switch ($Command) {
    "build" {
        Write-Host "🔨 Building Nx project..." -ForegroundColor Yellow
        npx nx build manager-backend
        Write-Host "🐳 Building Docker image..." -ForegroundColor Yellow
        docker build -t $DOCKER_IMAGE -f apps/manager-backend/Dockerfile .
        Write-Host "✅ Build complete!" -ForegroundColor Green
    }
    
    "run" {
        Write-Host "🚀 Running Docker container..." -ForegroundColor Yellow
        docker run -d --name $CONTAINER_NAME -p 3000:3000 $DOCKER_IMAGE
        Write-Host "✅ Container started! Application available at http://localhost:3000" -ForegroundColor Green
    }
    
    "stop" {
        Write-Host "🛑 Stopping container..." -ForegroundColor Yellow
        try { docker stop $CONTAINER_NAME 2>$null } catch { }
        try { docker rm $CONTAINER_NAME 2>$null } catch { }
        Write-Host "✅ Container stopped!" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "📋 Showing container logs..." -ForegroundColor Yellow
        docker logs -f $CONTAINER_NAME
    }
    
    "clean" {
        Write-Host "🧹 Cleaning up containers and images..." -ForegroundColor Yellow
        try { docker stop $CONTAINER_NAME 2>$null } catch { }
        try { docker rm $CONTAINER_NAME 2>$null } catch { }
        try { docker rmi $DOCKER_IMAGE 2>$null } catch { }
        Write-Host "✅ Cleanup complete!" -ForegroundColor Green
    }
    
    "compose-up" {
        Write-Host "🐳 Starting with Docker Compose..." -ForegroundColor Yellow
        docker-compose up -d
        Write-Host "✅ Services started!" -ForegroundColor Green
    }
    
    "compose-down" {
        Write-Host "🛑 Stopping Docker Compose services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
}

# Usage information
if ($Command -eq $null) {
    Write-Host @"
Usage: .\docker-helper.ps1 -Command <command>

Commands:
  build        - Build Nx project and Docker image
  run          - Run Docker container
  stop         - Stop and remove container
  logs         - Show container logs
  clean        - Clean up containers and images
  compose-up   - Start services with Docker Compose
  compose-down - Stop Docker Compose services

Examples:
  .\docker-helper.ps1 -Command build
  .\docker-helper.ps1 -Command run
"@
}
