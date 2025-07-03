import dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ['http://docs.blog-api.codewithsadee.com'],
    DB_MONGO: process.env.DB_MONGO,
}

export default config;