import { Card, CardActions, CardContent } from '@material-ui/core';
import React, { useState } from 'react';
import NumericInput from 'react-numeric-input';
import Translate from 'react-translate-component';
import { getPassword, trxBuilder } from '../../../actions/forms';
import { dbApi } from '../../../actions/nodes';
import { getBasicAsset, getStore, getFees } from '../../../actions/store';
import { localeFromStorage } from '../../../actions/locale/localeFromStorage';

const WithdrawGPOS = (props) => {
	const { loginData, accountData } = getStore();
	const { symbol_id, precision, symbol, totalGpos, availableGpos, getAssets } = props;
	const [withdrawAmount, setWithdrawAmount] = useState(0);
	const [fee, setFee] = useState(0);
	const [sended, setSended] = useState(false);
	const [withdrawDisabled, setWithdrawDisabled] = useState(false);
	const [language, setLanguage] = useState( localeFromStorage() )

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
			getPassword(password => {
				const activeKey = loginData.formPrivateKey(password, 'active');
				trxBuilder([trx], [activeKey]).then(() => {
					getAssets();
					setWithdrawAmount(0);
					setWithdrawDisabled(false);
				}).catch(e => {
					setWithdrawDisabled(false)
				});
			});
		}).catch(e => {
			setWithdrawDisabled(false)
		})
	}

	const handlChange = (value)=>{
		setWithdrawAmount(value)
			setFee(getFees().vesting_balance_withdraw.fee/(10 ** getBasicAsset().precision))
		
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
					max={availableGpos - getFees().vesting_balance_withdraw.fee/(10 ** getBasicAsset().precision)}
					precision={getBasicAsset().precision}
					onChange={(value) => handlChange(value)}
					value={withdrawAmount}
				/>
				</div>
				<div style={{ marginTop: 12, color: "#ff444a", display: (availableGpos == undefined || availableGpos == null || availableGpos <= 0) ? "block" : "none" }}>
					<Translate  className="" content={"voting.noGpos"} />
				</div>
				<div style={{ marginTop: 12, color: "#ff444a", display: (withdrawAmount == undefined || withdrawAmount == null || withdrawAmount <= 0) ? "block" : "none" }}>
					<Translate  className="" content={"errors.withdrawError"} /> 
				</div>
				<div style={{ marginTop: 12 }}  className="input-cus-style">
				<div style={{padding:"0 10px"}}>
				<Translate  className="" content={"voting.newGpos"} /> : <strong style={{padding:"0 10px"}}>{totalGpos - withdrawAmount} {symbol}</strong>
				</div>
				</div>
			</CardContent>
			<div className="info__row">
			<span>Fee: {fee} TEST</span>
			{sended && <span className="clr--positive"><Translate content={"voting.trans"} /></span>}
		  </div>
			<CardActions style={{justifyContent:"end"}} >
				<button disabled={withdrawDisabled} className="btn-round btn-round--buy " onClick={() => {(availableGpos <= 0 || withdrawAmount <= 0) ? "" : SubmitGposWithdrawal()}}>Withdraw</button>
			</CardActions>
		</Card>
	)
};


export default WithdrawGPOS;