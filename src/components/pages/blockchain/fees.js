import React, {Component} from "react";
import {getFees} from "../../../actions/getFees";
import Table from "../../helpers/table";
import TableCard from "../../helpers/cards";

const tableHead = [
    {
        key: 'name',
        translateTag: 'operation'
    },
    {
        key: 'price_per_kbyte',
        translateTag: 'Price_per_KByte',
        params: 'fit-content'
    },
    {
        key: 'fee',
        translateTag: 'standardFee',
        params: 'fit-content align-right'
    },
    {
        key: 'membership_lifetime_fee',
        translateTag: 'memberFee',
        params: 'align-right fit-content'
    }
];

class Fees extends Component {
    state = {
        operations: []
    };

    componentDidMount() {
        getFees().then(e => this.setState({operations: e}));
    }

    render() {
        const {operations} = this.state;

        return (
            <div className="witnesses">
                <Table
                    tableHead={tableHead}
                    rows={operations}
                />
                <TableCard tableHead={tableHead} rows={operations}/>
            </div>
        )
    }
}

export default Fees;