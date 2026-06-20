module.exports = {
  apps: [
    {
      name: 'redis',
      script: 'redis-server',
      args: '--port 6379',
      interpreter: 'none',
      watch: false
    },
    {
      name: 'chromadb',
      script: 'chroma',
      args: 'run --path /tmp/chroma --port 8000',
      interpreter: 'none',
      watch: false
    },
    {
      name: 'backend-server',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        REDIS_URL: 'redis://localhost:6379',
        CHROMA_URL: 'http://localhost:8000'
      },
      watch: ['backend'],
      ignore_watch: ['node_modules', 'logs'],
      watch_delay: 1000
    },
    {
      name: 'worker-queue',
      script: './workers/queueWorker.js',
      instances: 2,  // Multiple workers for parallel processing
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        REDIS_URL: 'redis://localhost:6379'
      },
      watch: false
    },
    {
      name: 'order-queue',
      script: './workers/orderWorker.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        REDIS_URL: 'redis://localhost:6379'
      },
      watch: false
    }
  ]
};