import React, {Component, Fragment} from "react";
import ModalTitle from "../decoration/modalTitle";
import {TransactionHelper, Aes} from "peerplaysjs-lib";
import Form from "../../form/form";
import Close from "../decoration/close";
import Submit from "../decoration/submit";
import Input from "../../form/input";
import SelectHeader from "../../selectHeader";
import Textarea from "../../form/textarea";
import {getDefaultFee} from "../../../../actions/forms/getDefaultFee";
import {getAccountData, getBasicAsset, getStore} from "../../../../actions/store";
import {trxBuilder} from "../../../../actions/forms/trxBuilder";
import {dbApi} from "../../../../actions/nodes";
import {clearLayout} from "../../../../dispatch";
import { utils } from "../../../../utils";
import Translate from "react-translate-component";

const issueAction = async (data, result) => {
    const {accountData, loginData} = getStore();

    const {to, assetWithSupply, issueAmount, password, keyType} = data;

    const issue_to_account = await dbApi('get_account_by_name', [to]).then(e => e);
    const fromAccount = await dbApi('get_account_by_name', [accountData.name]);
  

    const asset_to_issue = {
        amount: assetWithSupply.addPrecision(false, issueAmount),
        asset_id: assetWithSupply.id
    };

    const trx = {
        type: 'asset_issue',
        params: {
            fee: getDefaultFee(),
            issuer: accountData.id,
            asset_to_issue,
            issue_to_account: issue_to_account.id
        }
    };

    let activeKey = '';

    if(keyType === 'password') {
        activeKey = loginData.formPrivateKey(password, 'active');
    } else if(keyType === 'active') {
        activeKey = loginData.formPrivateKey(password);
    } else if(keyType === 'whaleVault') {
        activeKey = {whaleVaultInfo:{keyType:"active", account: accountData.name}}
    }

    const memo = data.memo;
    let memoFromPublic, memoToPublic;
    if (memo) {
        memoFromPublic = fromAccount.options.memo_key;
        memoToPublic = issue_to_account.options.memo_key;
    }

    let memoObject;
    if (memo && memoFromPublic && memoToPublic) {   
        memoObject = {
            from: memoFromPublic,
            to: memoToPublic,
            nonce: 0,
            message: Buffer.isBuffer(memo) ? memo : Buffer.concat([Buffer.alloc(4), Buffer.from(memo.toString('utf-8'), 'utf-8')])
        };
        
    }

    trx.params['memo'] = memoObject

    try {
        const trxResult = await trxBuilder([trx], [activeKey]);
        if(trxResult){
            result.success = true;
            result.callbackData = trxResult;
        }
        return result;
    } catch(e) {
        result.transactionError = e.message.toLowerCase().split(":")[0].replace(/\s+/g,"_");
        return result;
    }   

};

class IssueAsset extends Component {

    state = {
        defaultData: false
    };

    componentDidMount(){
        const {password, assetWithSupply, maxSupply, keyType} = this.props;
        const currentSupply = assetWithSupply.setPrecision();
        const assetSymbol = assetWithSupply.symbol;
        const basicAssetSymbol = getBasicAsset().symbol;
        const remainToIssue = maxSupply - currentSupply;
        this.setState({
            defaultData: {
                keyType,
                password,
                basicAssetSymbol,
                currentSupply,
                maxSupply,
                remainToIssue,
                assetSymbol,
                assetWithSupply
            }
        })
    }

    handleResult = () => clearLayout();

    render(){
        const tag = 'issueAsset';
        const defaultData = this.state.defaultData;

        if(!defaultData) return <span />;

        return(
            <Fragment>
                <ModalTitle tag={tag} />
                <Form
                    type="asset_issue"
                    requiredFields={['to', 'issueAmount']}
                    defaultData={defaultData}
                    action={issueAction}
                    handleResult={this.handleResult}
                >
                    {form => {
                        const {data, errors, transactionError} = form.state;
                        const assetSymbol = data.assetSymbol;

                        return(
                            <Fragment>
                                <Input
                                    id="modalSendTo"
                                    name="to"
                                    onChange={form.handleChange}
                                    error={errors}
                                    value={data}
                                />
                                <div className="form__row">
                                    <Input
                                        name="issueAmount"
                                        type="number"
                                        onChange={form.handleChange}
                                        error={errors}
                                        value={data}
                                        style={{flex: 3}}
                                        commentParams={{
                                            remainToIssue: data.remainToIssue,
                                            symbol: assetSymbol
                                        }}
                                        comment
                                        onKeyPress={(e) => {
                                            if (!utils.isNumberKey(e)) {
                                              e.preventDefault();
                                            }
                                        }}
                                    />
                                    <SelectHeader
                                        text={assetSymbol}
                                        className="with-bg"
                                        style={{flex: 1}}
                                    />
                                </div>
                                <Textarea
                                    id="modalSendMemo"
                                    name="memo"
                                    comment={true}
                                    onChange={form.handleChange}
                                    error={errors}
                                    value={data}
                                />
                                <div>
                                    <Translate className="" content={"field.labels.fee"} />{data.fee || 0} {data.basicAssetSymbol}
                                </div>
                                <div>
                                    {transactionError && transactionError !== "" ? 
                                        <span className="clr--negative">
                                            <Translate className="" content={`errors.${transactionError}`} />
                                        </span> 
                                        : ""}
                                </div>
                                <div className="modal__bottom">
                                    <Close />
                                    <Submit tag="send" />
                                </div>
                            </Fragment>
                        )
                    }}
                </Form>
            </Fragment>
        )
    }
}

export default IssueAsset