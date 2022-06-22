import React, {Fragment} from "react";
import {setModal} from "../../../dispatch/layoutDispatch";
import {getPassword} from "../../../actions/forms";
import RoundButton from "../../helpers/buttons/roundButton";
import AddNewAsset from "../../helpers/modal/content/addNewAsset";
import Table from "../../helpers/table";
import TableCard from "../../helpers/cards";

const tableHead = [
    {
        key: 'symbol',
        translateTag: 'asset'
    },
    {
        key: 'assetType',
        translateTag: 'assetType'
    },
    {
        key: 'supply',
        translateTag: 'supply'
    },
    {
        key: 'maxSupply',
        translateTag: 'maxSupply'
    },
    {
        key: 'actions',
        translateTag: 'actions'
    }
];

const CreatedAssets = ({data}) => (
    <Fragment>
        <RoundButton
            tag="newAsset"
            className="btn--worker"
            onClick={() => getPassword((password, keyType) => setModal(<AddNewAsset password={password} keyType={keyType} />), 'owner')}
        />
        {Boolean(data.createdAssets.length) &&
        <div>
            <Table
                tableHead={tableHead}
                rows={data.createdAssets}
                link={{ path: '/asset/', key: 'symbol' }}
            />
            <TableCard rows={data.createdAssets} tableHead={tableHead} link={{ path: '/asset/', key: 'symbol' }}/>
        </div>
        }
    </Fragment>
);

export default CreatedAssets;