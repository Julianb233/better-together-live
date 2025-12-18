// Better Together - PM2 Ecosystem Configuration
module.exports = {
  apps: [
    {
      name: 'better-together',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring (Wrangler handles hot reload)
      instances: 1, // Development mode uses only one instance
      exec_mode: 'fork',
      restart_delay: 3000, // Wait 3 seconds before restart
      max_restarts: 5, // Limit restart attempts
      min_uptime: '10s' // Minimum uptime before considering it stable
    }
  ]
}