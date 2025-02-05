import { createClient } from "redis"

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 11634,
    },
})

const connectRedis =  () => {

    client.on("error", (err) => console.log("Redis Client Error", err))
    client.connect().then(() => {
    console.log('Redis Connected!');
})
}

export  {
    connectRedis,
    client
}
