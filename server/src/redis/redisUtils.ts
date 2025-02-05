import {client} from "./redis.js";
import {IRedisUtils} from "../types/redis.types.js";

export const setEmailAndOtp: IRedisUtils['setEmailAndOtp'] = async (email, generatedOtp) => {
    try {
        const payload = {
            email: email,
            generatedOtp,
            wrongTry: 0,
        }
        const response = await client.set(email, JSON.stringify(payload), {
            EX:60*10,
        });
        console.log('Reply from Redis:', response);
    } catch (error) {
        console.log('Error to set in redis' + error)
    }
}

export const getEmailAndOtp: IRedisUtils['getEmailAndOtp'] = async (email) => {
    try {
        const response = await client.get(email);
        return await JSON.parse(response as string);

    } catch (error) {
        console.log('Error in getEmailAndOtp', error);
    }
}

export const removeEmailAndOtp: IRedisUtils['removeEmailAndOtp'] = async (email) => {
    try {
        const response = await client.del(email);
    } catch (error) {
        console.log('Error in delEmailAndOtp', error);
    }
}
