import * as convict from 'convict';

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['development', 'production', 'staging'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip:{
    doc: 'The IP address to bind.',
    format: String,
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  db: {
    host : {
        doc: 'Database host',
        format: '*',
        default: '127.0.0.1:27017',
        env: 'DB_MONGO_HOST',
    },
    name : {
        doc: 'Database name',
        format: '*',
        default: '',
        env: 'DB_NAME',
    },
    auth: {
        user:{
            doc: 'Database user',
            format: String,
            default: '',
            env: 'DB_USERNAME',
        }, 
        password: {
            doc: 'Database password',
            format: String,
            default: '',
            env: 'DB_PASSWORD',
        },
    },

  },
  baseUrl :{
    doc: 'Base URL for the application',
    format: String,
    default: 'http://localhost:3000',
    env: 'BASE_URL',
    arg: 'base-url',
  },
  basePath: {
    doc: 'Base path for the application',
    format: String,
    default: '',
  },
  jwtSecret:{
    doc: 'Secret key for JWT signing',
    format: String,
    default: 'secret-string'
  },
  saltRounds :{
    doc: 'Number of rounds for bcrypt hashing',
    format: Number,
    default: 10,
    env: 'SALT_ROUNDS',
    arg: 'salt-rounds',
  }
});