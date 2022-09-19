import React, {Component, Fragment} from "react";
import Table from "../../helpers/table";
import {getCommittee} from "../../../actions/getCommittee";
import TableCard from "../../helpers/cards";
import counterpart from "counterpart";

const tableHead = [
    {
        key: 'rank',
        translateTag: 'hash',
        params: 'fit-content'
    },
    {
        key: 'name',
        translateTag: 'name',
        params: 'fit-content bold'
    },
    {
        key: 'total_votes',
        translateTag: 'votes',
        params: 'fit-content'
    },
    {
        key: 'url',
        translateTag: 'webpage'
    }
];

class Committee extends Component {
    state = {
        active: false,
        pending: false
    };

    componentDidMount() {
        getCommittee().then(e => this.setState({
            active: e
                .filter(item => item.active)
                .map((item, index) => ({
                    ...item,
                    rank: index + 1
                })),
            pending: e
                .filter(item => !item.active)
                .map((item, index) => ({
                    ...item,
                    rank: index + 1
                }))
        }));
    }

    render() {
        const {active, pending} = this.state;

        return (
            <Fragment>
                {
                    active &&
                    <Fragment>
                        <div className="table__title">{counterpart.translate(`blockchain.witnesses.active`)}</div>
                        <Table
                            tableHead={tableHead}
                            rows={active}
                        />
                        <TableCard tableHead={tableHead} rows={active}/>
                    </Fragment>
                }

                {
                    pending &&
                    <Fragment>
                        <div className="table__title">{counterpart.translate(`blockchain.witnesses.pending`)}</div>
                        <Table
                            tableHead={tableHead}
                            rows={pending}
                        />
                        <TableCard tableHead={tableHead} rows={pending}/>
                    </Fragment>
                }
            </Fragment>
        )
    }
};

export default Committee;