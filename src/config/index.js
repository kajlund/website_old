const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const dotenv = require('dotenv')

// Load environment variables BEFORE setting up config
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isTest = env === 'testing'
const port = parseInt(process.env.PORT, 10) || 3000

// Default Configuration
const baseConfig = {
  bind: typeof port === 'string' ? `Pipe ${port}` : `Port  ${port}`,
  env,
  isDev,
  isTest,
  port,
  db: {
    uri: process.env.MONGO_URI,
  },
  log: {
    enabled: true,
    level: isDev ? 'trace' : 'info',
    logPayload: false,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
}

// Check if config file for set environment exists
let envConfig = {}
const envConfigFile = path.join(process.cwd(), `${env}.js`)
if (fs.existsSync(envConfigFile)) {
  // eslint-disable-next-line global-require
  envConfig = require(envConfigFile)
}

// Merge configurations
const config = _.merge(baseConfig, envConfig)

module.exports = config
