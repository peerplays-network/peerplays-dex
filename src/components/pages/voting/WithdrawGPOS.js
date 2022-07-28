import { Card, CardActions, CardContent } from '@material-ui/core';
import React, { useState } from 'react';
import NumericInput from 'react-numeric-input';
import Translate from 'react-translate-component';
import { getPassword, trxBuilder } from '../../../actions/forms';
import { dbApi } from '../../../actions/nodes';
import { getBasicAsset, getStore, getFees } from '../../../actions/store';
import { localeFromStorage } from '../../../actions/locale/localeFromStorage';
import { utils } from '../../../utils';

const WithdrawGPOS = (props) => {
	const { loginData, accountData } = getStore();
	const { symbol_id, precision, symbol, totalGpos, availableGpos, getAssets } = props;
	const [withdrawAmount, setWithdrawAmount] = useState(0);
	const [fee, setFee] = useState(0);
	const [sended, setSended] = useState(false);
	const [withdrawDisabled, setWithdrawDisabled] = useState(false);
	const [changes, setChanges] = useState(false);
	const [language, setLanguage] = useState( localeFromStorage() )
	const [error, setError] = useState("");

	const accBalance = accountData.assets && accountData.assets.length > 0 && accountData.assets.find(asset => asset.id === getBasicAsset().id) ? 
		accountData.assets.find(asset => asset.id === getBasicAsset().id).amount / (10 ** getBasicAsset().precision) : 0;

	const SubmitGposWithdrawal = () => {
		setWithdrawDisabled(true)
		const begin_timestamp = new Date().toISOString().replace('Z', '');
		dbApi('get_vesting_balances', [
			accountData.id
		]).then((balances) => {
			const gposBalances = balances.filter(balance => balance.balance_type == 'gpos'); 
			const trx = {
				type: 'vesting_balance_withdraw',
				params: {
					fee: {
						amount: 0,
						asset_id: symbol_id
					},
					vesting_balance: gposBalances[0].id,
					owner: accountData.id,
					amount: {
						amount: withdrawAmount * (10 ** precision),
						asset_id: symbol_id
					},
				}
			};
			getPassword((password, keyType) => {
				let activeKey = '';
				if(keyType === 'password') {
					activeKey = loginData.formPrivateKey(password, 'active');
				} else if(keyType === 'active') {
					activeKey = loginData.formPrivateKey(password);
				} else if(keyType === 'whaleVault') {
					activeKey = {whaleVaultInfo:{keyType:"active", account: accountData.name}}
				}
				
				trxBuilder([trx], [activeKey]).then(() => {
					getAssets();
					setWithdrawAmount(0);
					setWithdrawDisabled(false);
				}).catch(e => {
					setError(e.message.split(":")[0].replace(/\s+/g,"_"))
					setTimeout(() => setError(""), 5000)
					setWithdrawDisabled(false)
				});
			}, 'active');
		}).catch(e => {
			setWithdrawDisabled(false)
		})
	}

	const handlChange = (value)=>{
		setWithdrawAmount(value)
			if(value > 0){
				setFee(getFees().vesting_balance_withdraw.fee/(10 ** getBasicAsset().precision))
			}else{
				setFee(0)
			}
		
	}


	return (
		<Card mode="widget" >
			<div className="card__title" style={{ paddingTop:"20px" , borderTopLeftRadius:"10px" , borderTopRightRadius:"10px"}}>
			<Translate content={"voting.powerDown"} />
			</div>
			<CardContent >
				<div style={{ marginBottom: 12 }}>
					<div style={{ display: "inline-block", width: "50%" }}>
						<div style={{ background: "#f0f0f0", margin: 4, padding: 12 }}>
						<Translate content={"voting.openGpos"} />: <strong >{totalGpos} {symbol}</strong>
						</div>
					</div>
					<div style={{ display: "inline-block", width: "50%" }}>
						<div style={{ background: "#f0f0f0", margin: 4, padding: 12 }}>
						<Translate content={"voting.availableGpos"} />:<strong> {availableGpos} {symbol}</strong>
						</div>
					</div>
					</div>

				<Translate style={{ fontWeight:"bold",margin:"10px",display:"block"}} content='withdraw.title' />
				<div className='input-cus-style'>
				<NumericInput
					strict={true}
					style={{ color: "#f0f0f0" }}
					mobile
					type="number"
					className="field__input form-control cpointer"
					min={0}
					max={accBalance > getFees().vesting_balance_withdraw.fee/(10 ** getBasicAsset().precision) ? availableGpos  : 0}
					precision={getBasicAsset().precision}
					onChange={(value) => handlChange(value)}
					value={withdrawAmount}
					onKeyPress={(e) => {
						if (!utils.isNumberKey(e)) {
						  e.preventDefault();
						}
					}}
				/>
				</div>
				<div style={{ marginTop: 12, color: "#ff444a", display: ( changes &&(availableGpos == undefined || availableGpos == null || availableGpos <= 0) ) ? "block" : "none" }}>
					<Translate  className="" content={"voting.noGpos"} />
				</div>
				<div style={{ marginTop: 12, color: "#ff444a", display: (changes &&(withdrawAmount == undefined || withdrawAmount == null || withdrawAmount <= 0)) ? "block" : "none" }}>
					<Translate  className="" content={"errors.withdrawError"} /> 
				</div>
				<div style={{ marginTop: 12 }}  className="input-cus-style">
				<div style={{padding:"0 10px"}}>
				{/* <Translate  className="" content={"voting.newGpos"} /> : <strong style={{padding:"0 10px"}}>{totalGpos - withdrawAmount} {symbol}</strong> */}
				</div>
				</div>
			</CardContent>
			<div className="info__row margin">
			<span><Translate className="" content={"tableHead.fee"} />: {fee} {getBasicAsset().symbol}</span>
			{sended && <span className="clr--positive"><Translate content={"voting.trans"} /></span>}
			{error && <span className="clr--negative"><Translate content={`errors.${error}`} /></span>}
		  </div>
			<CardActions style={{justifyContent:"end"}} >
				<button disabled={withdrawDisabled} className="btn-round btn-round--buy " onClick={() => {(availableGpos <= 0 || withdrawAmount <= 0) ? setChanges(true) : SubmitGposWithdrawal()}}><Translate className="" content={"voting.Withdraw"} /></button>
			</CardActions>
		</Card>
	)
};


export default WithdrawGPOS;