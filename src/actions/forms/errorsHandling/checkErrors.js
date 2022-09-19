import {errorsChecker} from "./errorsChecker";

export const checkErrors = async (data) => {
    const keys = Object.keys(data);
    const result = {};

    if(!keys.length) return result;
    for(let key of keys){
        let hasError = false;
        if(errorsChecker[key]) hasError = await errorsChecker[key](data);
        if(hasError) result[key] = hasError;
    }

    return result;
};