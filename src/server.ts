// Node Module
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

// Custom Module
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import {connectToDataBase, disconnectFromDatabase} from '@/lib/mongoose'

// Routes
import v1Route from '@/routes/v1'

// Types
import type { CorsOptions } from 'cors';

// Express initial
const app = express()

// Configure Cors options
const corsOpitions: CorsOptions = {
    origin(origin, callback) {
        if(config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS error ${origin} is not allowed by CORS`), false)
            console.log(`CORS error ${origin} is not allowed by CORS`)
        }
    }
}

// Appy Cors middleware
app.use(cors(corsOpitions))

// Enable Json request body parsing
app.use(express.json())

//  Habilita a análise do corpo da solicitação codificada por URL com o modo estendido
// `extended: true' permite objetos e matrizes avançados por meio da biblioteca querystring
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

// Enable response compression to reduce playload size and improve perfomance
app.use(compression({
    threshold: 1024
}))

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet())

// Apply rate limiting middleware to prevent excessive request and enhance security
app.use(limiter);


(async () => {
    try{
        await connectToDataBase()
        
        app.use('/api/v1', v1Route)
        
        app.listen(config.PORT, () => {
            console.log(`Server running: http://localhost:${config.PORT}`)
        })

    }catch (err) {
        console.log('Failed to start the server', err)
        
        if (config.NODE_ENV === 'production') {
             process.exit(1)
        }
    }
})()

const handleServerShutdown = async () => {
    try {
        await disconnectFromDatabase()
        console.log("Server SHUTDOW")
        process.exit(0)
    } catch (error) {
        console.log('Error during server shutdown', error)
    }
}

process.on('SIGTERM', handleServerShutdown)
process.on('SIGINT', handleServerShutdown)