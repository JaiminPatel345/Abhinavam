import {client} from "./redis.js";

export const setEmailAndOtp = async (email, generatedOtp) => {
    try {
        const payload = {
            email: email,
            generatedOtp,
            wrongTry:0,
        }
        const response = await client.set(email, JSON.stringify(payload) , 'EX' , 60 * 5 );
        console.log('Reply from Redis:', response);
    }catch(error){
        console.log('Error to set in redis' + error)
    }
}

export const getEmailAndOtp = async (email) => {
    try {
        const response = await client.get(email);
        return  await JSON.parse(response);

    }catch (error) {
        console.log('Error in getEmailAndOtp' , error);
    }
}

export const removeEmailAndOtp = async (email) => {
    try {
        const response = await client.del(email);
    }catch (error) {
        console.log('Error in delEmailAndOtp' , error);

    }
}
