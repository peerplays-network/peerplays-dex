import React, {useState, useEffect} from "react";
import { Card } from "../../helpers/card";
import { CardHeader } from "../../helpers/cardHeader";
import Grid from '@material-ui/core/Grid';
import WithdrawBTCForm from './withdrawBTCForm';
import GenerateAddress from "./generateAddress";
import UpdateAddress from "./updateAddress";
import { getStore } from "../../../actions/store";
import counterpart from "counterpart";

function BitcoinTransactions() {
    const { accountData } = getStore();
    const [sidechainAccount, setSidechainAccount] = useState();
    const [sidechain, setSidechain] = useState('bitcoin');
    const [hasDepoAddress, setHasDepoAddress] = useState(false);

    useEffect(() => {
        if(accountData.sidechainAccounts){
            accountData.sidechainAccounts.filter(act => (act.sidechain == sidechain) ? setSidechainAccount(act): '');  
        }
        if(sidechainAccount && sidechainAccount.deposit_address != ''){
            setHasDepoAddress(true);
        }
    });

    return(
        <div className="container">
            <div className="page__header-wrapper">
                <h1 className="page__title">{counterpart.translate(`bitcoin.title`)}</h1>
            </div>
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={hasDepoAddress ? 6 : 12}>
                        <div className="graphs">
                            <Card mode={hasDepoAddress ? "widget__btc" : "btc-generate MuiGrid-root modal open MuiGrid-item MuiGrid-grid-xs-12"}>
                                <CardHeader title={hasDepoAddress ? `bitcoin.updateAddress.title` : 'bitcoin.generateAddress.title'} />
                                <div className="card__content"> 
                                    {hasDepoAddress ? 
                                        <UpdateAddress sidechainAccount={sidechainAccount} sidechain={sidechain}/> 
                                    :
                                        <GenerateAddress
                                            accountData={accountData} 
                                            sidechain={sidechain}/>
                                    }
                                </div>
                            </Card>
                        </div>
                    </Grid>
                    {hasDepoAddress &&
                        <Grid item xs={12} sm={6}>
                            <div className="graphs">
                                <Card mode="widget__btc">
                                    <CardHeader title={`bitcoin.withdraw.title`} />
                                    <WithdrawBTCForm accountData={accountData}/>
                                </Card>
                            </div>
                        </Grid>
                    }
                </Grid>
            </div>
        </div>
    );
}

export default BitcoinTransactions