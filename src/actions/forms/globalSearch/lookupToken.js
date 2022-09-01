import React from "react";
import { Link } from "react-router-dom";
import {clearLayout} from "../../../dispatch/layoutDispatch";
import {dbApi} from "../../nodes";
import AssetStatistic from "../../../components/helpers/assetStatistic";
import {getDynamicData} from "../../assets/";
import {formAssetData} from "../../assets";
import {getBasicAsset} from "../../store";

export const lookupToken = async val => {
    val = val.toUpperCase();
    let result = await dbApi('list_assets', [val, 20]).then(list => Promise.all(list.filter(e => e.symbol.includes(val)).map(async (el, id) => {
        const dynamicData = await getDynamicData(el.dynamic_asset_data_id);

        const baseAsset = await formAssetData(el);
        const quoteAsset = getBasicAsset();
        const title = <div className="card__header"><div className="card__title">{el.symbol}</div></div>;

        return <Link to={`/asset/${el.symbol}`} onClick={clearLayout}>
            <AssetStatistic
                key={id}
                title={title}
                basicData={el}
                dynamicData={dynamicData}
                baseAsset={baseAsset}
                quoteAsset={quoteAsset}
            />
        </Link>
    })));
    if (result.length > 0)
        return result;
    return 'No result Found';
};
