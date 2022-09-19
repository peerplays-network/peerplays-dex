import React, {Component, Fragment} from 'react';
import TitleWrapper from "../../helpers/titleWrapper";
import dataFetch from "../../helpers/dataFetch";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {formAssetData} from "../../../actions/assets";
import WarningMessage from "../../helpers/warningMessage";
import AccordeonItem from "../../helpers/accordeonItem";
import {dbApi} from "../../../actions/nodes";
import FieldWithHint from "../../helpers/form/fieldWithHint";
import DateField from "../../helpers/form/dateField";
import {additionalPermissions, defaultPermissions} from "../../../params/permissionsParams";
import SwitchersGroup from "../../helpers/form/switchersGroup";
import Switcher from "../../helpers/switcher";
import AccountUpdateList from "../../helpers/accountUpdateList";
import { utils } from '../../../utils';

const getDefaultFormData = async context => {
    const assetData = context.props.data;
    const smartData = Boolean(assetData.smartData);
    const {basicData, flags, permissions} = assetData;
    const {max_supply, core_exchange_rate, description, market_fee_percent, max_market_fee} = basicData.options;
    const asset = await formAssetData(basicData);
    const base = await formAssetData(core_exchange_rate.base);
    const {main, short_name, market, condition, expiry} = description ? JSON.parse(description) : {};
    const {
        feed_lifetime_sec,
        force_settlement_delay_sec,
        force_settlement_offset_percent,
        maximum_force_settlement_volume,
        minimum_feeds
    } = smartData ? assetData.smartData.options : {};

    const permissionsList = defaultPermissions.concat(additionalPermissions).filter(el => permissions.includes(el));

    const defaultFlags = {};
    const defPermissions = {};

    permissionsList.forEach(el => {
        defPermissions[el] = true;
        if(el !== 'charge_market_fee') defaultFlags[el] = flags.includes(el);
    });

    return {
        defaultData: {
            symbol: asset.symbol,
            decimal: asset.precision,
            maxSupply: asset.setPrecision(false, max_supply),
            exchangeQuote: asset.setPrecision(false, core_exchange_rate.quote.amount),
            exchangeBase: base.setPrecision(),
            backingAsset: base.symbol,
            description: main,
            shortName: short_name,
            pairingAsset: market,
            condition: condition,
            resolutionDate: expiry ? new Date(expiry) : false,
            smartCoin: smartData,
            predictionMarket: assetData.smartData ? assetData.smartData.is_prediction_market : false,
            permissions: defPermissions,
            flagMarketFee: flags.includes('charge_market_fee'),
            flags: defaultFlags,
            marketFee: market_fee_percent / 100,
            maxMarketFee: asset.setPrecision(false, max_market_fee),
            feedInMinutes: feed_lifetime_sec / 60,
            minNumberOfFeeds: minimum_feeds,
            forcedSettlementDelay: force_settlement_delay_sec / 60,
            forcedSettlementPercent: force_settlement_offset_percent / 100,
            forcedSettlementMaxVolume: maximum_force_settlement_volume / 100
        },
        permissionsList
    };
};

const getAssetsList = async (assetSymbol) => dbApi('list_assets', ['', 100])
    .then(result => {
      result = result.filter(e => e.symbol !== assetSymbol);
      return result.map(e => e.symbol);
  });

const updateAsset = async (data, result) => {
    console.log(data);
    return result;
};

const handleResult = () => console.log('asdasdasd');

const AssetUpdate = ({data}) => {
    const tag = 'assetUpdate';
    const {defaultData, permissionsList} = data;
    return (
        <Form
            requiredFields={['newAssetName', 'maxSupply', 'decimal', 'exchangeQuote', 'exchangeBase']}
            defaultData={defaultData}
            action={updateAsset}
            handleResult={handleResult}
        >
            {
                form => {

                    const {data, errors} = form.state;

                    return(
                        <Fragment>
                            <TitleWrapper title={`${tag}.primarySettings`} />
                            <div className="form__row">
                                <Input name="decimal" formData={form} style={{flex: 3}} disabled />
                                <Input name="maxSupply" formData={form} style={{flex: 5}} />
                            </div>
                            <TitleWrapper title={`${tag}.exchangeRate`} />
                            <div className="form__row">
                                <Input
                                    name="exchangeQuote"
                                    formData={form}
                                    commentParams={{
                                        number: (data.exchangeBase / data.exchangeQuote).toFixed(data.decimal) || 0,
                                        asset: data.newAssetName && `(${data.newAssetName})`,
                                        symbol: `${data.backingAsset}/${data.symbol || ''}`
                                    }}
                                    comment
                                />
                                <Input
                                    name="exchangeBase"
                                    labelParams={{asset: data.backingAsset}}
                                    formData={form}
                                />
                            </div>
                            <WarningMessage titleTag="assetUpdate.exchangeRateWarning" />
                            <AccordeonItem titleTag="assetUpdate.description">
                                <Input
                                    name="description"
                                    formData={form}
                                />
                                <div className="form__row">
                                    <Input
                                        name="shortName"
                                        formData={form}
                                    />
                                    <FieldWithHint
                                        name="pairingAsset"
                                        method={() => getAssetsList(data.symbol)}
                                        handleChange={form.handleChange}
                                        defaultVal={data}
                                        readOnly
                                    />
                                </div>
                                {data['predictionMarket'] &&
                                    <div className="form__row">
                                        <Input
                                            name="condition"
                                            formData={form}
                                        />
                                        <DateField
                                            name="resolutionDate"
                                            selected={form.dateBegin}
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                    </div>
                                }
                            </AccordeonItem>
                            {data['smartCoin'] &&
                                <AccordeonItem titleTag="assetUpdate.smartOptions">
                                        <Input
                                            name="feedInMinutes"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            name="minNumberOfFeeds"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            name="forcedSettlementDelay"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            name="forcedSettlementPercent"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            name="forcedSettlementMaxVolume"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <FieldWithHint
                                            name="backingAsset"
                                            method={() => getAssetsList(data.symbol)}
                                            handleChange={form.handleChange}
                                            defaultVal={data}
                                            readOnly
                                        />
                                </AccordeonItem>
                            }
                            <AccordeonItem titleTag="assetUpdate.permissions">
                                <WarningMessage titleTag="assetUpdate.permissionsWarning" />
                                <SwitchersGroup
                                    groupId="permissions"
                                    defaultData={data['permissions']}
                                    switchersList={permissionsList}
                                    handleChange={form.handleChange}
                                    labelTag="block.permissions"
                                />
                            </AccordeonItem>
                            <AccordeonItem titleTag="assetUpdate.flags">
                                <div className="switchers-group">
                                    <Switcher
                                        id="flagMarketFee"
                                        className="right-sided"
                                        label={`block.permissions.charge_market_fee`}
                                        selected={data['flagMarketFee']}
                                        handleChange={form.handleChange}
                                    />
                                </div>
                                {data.flagMarketFee &&
                                    <div className="form__row">
                                        <Input
                                            name="marketFee"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            name="maxMarketFee"
                                            type="number"
                                            formData={form}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                }
                                <SwitchersGroup
                                    groupId="flags"
                                    defaultData={data['flags']}
                                    switchersList={permissionsList}
                                    handleChange={form.handleChange}
                                    labelTag="block.permissions"
                                />
                            </AccordeonItem>
                            {/* <AccordeonItem titleTag="assetUpdate.flags">
                                <AccountUpdateList
                                    id="producers"
                                    type="user"
                                    itemsList={data.producers}
                                />
                            </AccordeonItem> */}
                        </Fragment>
                    )
                }
            }
        </Form>
    )
};

export default dataFetch({method: getDefaultFormData})(AssetUpdate)