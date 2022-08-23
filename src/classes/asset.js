import {getAssetById, getAssetBySymbol} from "../actions/assets";
import {roundNum} from "../actions/roundNum";

export class Asset {
    constructor({id = '', symbol = '', precision = 0, amount = 0}){
        this.id = id;
        this.amount = Number(amount);
        this.precision = Number(precision);
        this.symbol = symbol;
    }
    getDataById(){
        return getAssetById(this.id)
            .then(({precision, symbol}) => {
                this.precision = precision;
                this.symbol = symbol;
                return this;
            })
            .catch(console.error)
    }
    getDataBySymbol(){
        return getAssetBySymbol(this.symbol)
            .then(({id, precision}) => {
                this.id = id;
                this.precision = precision;
                return this;
            })
            .catch(console.error)
        }
        setPrecision(roundTo = false, amount = this.amount, precision = this.precision){
            const precisioned = amount / (10 ** precision);
            return roundTo ? roundNum(precisioned, precision) : precisioned;
        }
        addPrecision(roundTo = false, amount = this.amount, precision = this.precision){
            const precisioned = amount * (10 ** precision);
            return roundTo ? roundNum(precisioned) : precisioned;
        }
        calculatePrice(base, roundTo = 5){
            const price = this.setPrecision() / this.setPrecision(false, base.amount, base.precision);
            return roundNum(price, roundTo);
        }
        toString(amount = this.amount){
            return `${this.setPrecision(true, amount)} ${this.symbol}`
        }
    }