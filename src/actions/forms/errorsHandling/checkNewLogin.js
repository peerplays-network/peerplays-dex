import {dbApi} from "../../nodes";
import {ChainValidation} from "peerplaysjs-lib";

export const checkNewLogin = async ({newLogin}) => {
    if(!newLogin) return false;
    if (/^[A-Z]/.test(newLogin)) {
        return 'newAcc.noCapital';
    }

    const defaultErrors = ChainValidation.is_account_name_error(newLogin);

    let accErr = -1;
    let segmentErr = -1;

    if(defaultErrors){
        accErr = defaultErrors.indexOf('Account name should ');
        segmentErr = defaultErrors.indexOf('Each account segment should ');
    }
    if(accErr > -1) return defaultAccsErrs['accsErr'][defaultErrors.substr(19,)];
    if(segmentErr > -1) return defaultAccsErrs['segmentErr'][defaultErrors.substr(27,)];

    if(!ChainValidation.is_cheap_name(newLogin)) return 'newAcc.notCheap';

    const inUse = await dbApi('get_account_by_name', [newLogin]);

    if(inUse) return 'newAcc.inUse';

    return false;
};

const defaultAccsErrs = {
    accsErr: {
        ' not be empty.': 'required',
        ' be longer.': 'newAcc.longer',
        ' be shorter.': 'newAcc.shorter',
        ' start with a letter.': 'newAcc.firstLetter',
        ' have only letters, digits, or dashes.': 'newAcc.noSpecials',
        ' have only one dash in a row.': 'newAcc.oneDash',
        ' end with a letter or digit.': 'newAcc.lastSymbol',
        ' be longer': 'newAcc.longer'
    },
    segmentErr: {
        ' start with a letter.': 'newAccSegment.firstLetter',
        ' have only letters, digits, or dashes.': 'newAccSegment.noSpecials',
        ' have only one dash in a row.': 'newAccSegment.oneDash',
        ' end with a letter or digit.': 'newAccSegment.lastSymbol',
        ' be longer': 'newAcc.longer'
    }
};