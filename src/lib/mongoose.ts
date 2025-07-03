import mongoose from "mongoose";

import config from "@/config";

import type { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
    dbName : 'blogapi',
    appName: 'BlogApi', 
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
}

export const connectToDataBase = async (): Promise<void> => {
    if (!config.DB_MONGO) {
        throw new Error('MongoDb is not defined in the configuration.')
    }

    try {
        await mongoose.connect(config.DB_MONGO, clientOptions)

        console.log('Connected to the dataBase successfully.', {
            url: config.DB_MONGO,
            option: clientOptions
        })
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }

        console.log('Error connecting to the database', error)
    }
}

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect()

        console.log("Disconnected from the database successfully.", {
            url: config.DB_MONGO,
            option: clientOptions
        })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }

        console.log('Error disconnecting from the database.', error)
    }
}