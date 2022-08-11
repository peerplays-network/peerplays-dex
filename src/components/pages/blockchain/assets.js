import React, {Component} from "react";
import Table from "../../helpers/table";
import {getAssets} from "../../../actions/getAssets";
import {Radio} from "../../helpers/radio";
import Translate from "react-translate-component";
import TableCard from "../../helpers/cards";

const tableHead = [
    {
        key: 'asset',
        translateTag: 'asset',
        params: 'fit-content bold'
    },
    {
        key: 'issuer',
        translateTag: 'issuer',
        params: 'fit-content'
    },
    {
        key: 'supply',
        translateTag: 'supply',
        params: 'align-right'
    }
];

class Assets extends Component {
    state = {
        assets: [],
        radio: '',
        filterAsset:[
            "AQSQFHZAJVZDTVAC",
            "AXFMUJYATHGJSOIV",
            "BSEBEIBGLWDPKMDB",
            "CFQBVAIKFFJEEOOJ",
            "DOQIBMVBUJYYDXXF",
            "MCLUSD",
            "BTFUN",
            "SEUSD",
            "FKGANJJRLRRSUNTR",
            "HVVTNQNBHEFYPSJP",
            "LTQCNISQAEWLEJVS",
            "NGJZSUSFKIJBXKWJ",
            "OPNQEXZYKBPOZAUP",
            "RCDQHTNAHQNDHJXE",
            "RYVCIRCYJSVAUESQ",
            "TSKXLOICQJTCFPYY",
            "UGQZISWHZJKNGVRC",
            "UUCSGNDAXHJNRJUF",
            "WGKGQTICUIYEYTWV",
            "WNIPJIXZAFZGHGIC",
            "WTFUN",
        ]
    
    };

    componentDidMount() {
        getAssets().then(e => this.setState({assets: e}));
    }

    render() {
        const {assets} = this.state;
        return (
            <div className="assets">
                <Table
                    tableHead={tableHead}
                    rows={assets}
                />
                <TableCard rows={assets} tableHead={tableHead}/>
            </div>
        )

    }
}

export default Assets;