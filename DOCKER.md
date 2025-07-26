# User Manager - Docker Setup

This project has been configured with Docker support for easy deployment and development.

## 🐳 Docker Setup

### Prerequisites

- Docker installed on your system
- Docker Compose (optional, for database setup)

### Available Scripts

```bash
# Build and run Docker image
npm run docker:build

# Run Docker container
npm run docker:run

# Run with Docker Compose (includes PostgreSQL)
npm run docker:up

# Stop Docker Compose
npm run docker:down

# View Docker logs
npm run docker:logs
```

### Manual Docker Commands

```bash
# Build the application first
npx nx build manager-backend

# Build Docker image
docker build -t user-manager-backend -f apps/manager-backend/Dockerfile .

# Run the container
docker run -p 3000:3000 user-manager-backend

# Run with environment variables
docker run -p 3000:3000 -e NODE_ENV=production user-manager-backend
```

### Docker Compose Setup

The included `docker-compose.yml` provides:

- **manager-backend**: Your NestJS application
- **postgres**: PostgreSQL database for development

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Docker Files

- **`apps/manager-backend/Dockerfile`**: Multi-stage Docker build for the NestJS backend
- **`docker-compose.yml`**: Complete development environment with database
- **`.dockerignore`**: Optimizes build by excluding unnecessary files

### Environment Configuration

The Docker setup exposes the application on port 3000. You can configure:

- **PORT**: Application port (default: 3000)
- **NODE_ENV**: Environment mode (development/production)
- Database connection strings for PostgreSQL

### Nx Container Plugin

This project uses `@nx-tools/nx-container` for advanced Docker integration with Nx workflows.

### Database with Docker

When using `docker-compose up`, a PostgreSQL database is automatically started:

- **Host**: localhost
- **Port**: 5432
- **Database**: user_manager
- **Username**: postgres
- **Password**: postgres

### Production Deployment

For production deployment:

1. Build the optimized image:

   ```bash
   docker build -t user-manager-backend:prod -f apps/manager-backend/Dockerfile .
   ```

2. Run with production environment:

   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production user-manager-backend:prod
   ```

3. Or use with your orchestration platform (Kubernetes, Docker Swarm, etc.)
