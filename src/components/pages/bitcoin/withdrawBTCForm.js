import React, {Component,  Fragment} from "react";
import {  getAccountData, getBasicAsset } from "../../../actions/store";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {transfer} from "../../../actions/forms"
import { utils } from "../../../utils";
import { updateAccountAndLoginData } from "../../../actions/account";
import { dbApi } from "../../../actions/nodes";
import counterpart from "counterpart";

class WithdrawBTCForm extends Component {
    state = {
        sended: false,
        defaultData: false,
		assets: false
    };

    componentDidMount() {
		dbApi('list_assets', ['', 100]).then(assets => {
            this.setState({assets})
        })
        const user = getAccountData();
        const startAsset = 'BTC';
        const basicAsset = getBasicAsset().symbol;
        const defaultData = {
            from: user.name,
            quantityAsset: startAsset,
            fee: 0,
            feeAsset: basicAsset,
            quantity: 0,
            memo: '',
            to: 'son-account'
        };

        this.setState({ defaultData });
    }

    handleTransfer = (data) => {
        const context = this;
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));

		updateAccountAndLoginData();
    };


    render() {
        const {sended, defaultData, assets} = this.state;

        if (!defaultData) return <span/>;
		return (
			<div className="card__content">
				<Form
					type={'transfer'}
					className="form form--btc form--btc__widget"
					defaultData={defaultData}
					requiredFields={['to', 'quantity']}
					action={transfer}
					handleResult={this.handleTransfer}
					needPassword
					keyType="active"
				>
				{
					form => {
						const {errors, data, transactionError} = form.state;

						return (
							<Fragment>
								<div className="input__row">
									<Input
										wrapperStyle={{"display": "none"}}
										name="from"
										onChange={form.handleChange}
										error={errors}
										value={data}
										disabled
									/>
									<Input
										labelTag="field.labels.withdrawAmount"
										name="quantity"
										type="number"
										onChange={form.handleChange}
										error={errors}
										value={data}
										onKeyPress={(e) => {
											if (!utils.isNumberKey(e)) {
											  e.preventDefault();
											}
										}}
										precision={assets && assets.find(asset => asset.symbol === data.quantityAsset).precision}
									/>
								</div>
								<div className="input__row">
									<Input
										wrapperStyle={{"display": "none"}}
										name="to"
										disabled
										onChange={form.handleChange}
										error={errors}
										value={data}
									/>
									
									<Input
										wrapperStyle={{"display": "none"}}
										name="quantityAsset"
										disabled
										onChange={form.handleChange}
										error={errors}
										value={data}
									/>
								</div>
								<div className="info__row">
									{sended && <span className="clr--positive">{counterpart.translate(`success.transCompleted`)}</span> }
									{transactionError && transactionError !== "" ? 
										<span className="clr--negative">
											<span>{counterpart.translate(`errors.${transactionError}`)}</span>
										</span> 
									: "" }
									<span>
										<span>{counterpart.translate(`field.labels.fee`)}</span>
										{data.fee} {data.feeAsset}
									</span>
								</div>
								<div className="btn__row">
									<button className="btn-round btn-round--buy" type="submit">{counterpart.translate(`buttons.withdraw`)}</button>
								</div>
							</Fragment>
						)
					}
				}
				</Form>
			</div>
		)
	};
}

export default WithdrawBTCForm;