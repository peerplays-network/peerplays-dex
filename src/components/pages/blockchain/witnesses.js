import React, {Component, Fragment} from "react";
import {getWitnesses} from "../../../actions/getWitnesses";
import Table from "../../helpers/table";
import {Card} from "../../helpers/card";
import { updateAllBlockchainData } from '../../../actions/dataFetching/getGlobalData';
import TableCard from "../../helpers/cards";
import Witnesscards from '../../helpers/cards/witnesscards';

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
        key: 'url',
        translateTag: 'url',
        params: 'fit-content'
    },
    {
        key: 'last_confirmed_block_num',
        translateTag: 'lastBlock',
        params: 'fit-content'
    },
    {
        key: 'total_missed',
        translateTag: 'missingBlock'
    },
    {
        key: 'total_votes',
        translateTag: 'votes',
        params: 'align-right fit-content'
    }
];


class Witnesses extends Component {
    state = {
        active: false,
        pending: false
    };

    componentDidMount() {
        updateAllBlockchainData().then(data => this.setState({
          blockchainData: data
        }));
        this.timerID = setInterval(() => updateAllBlockchainData().then(data => this.setState({
            blockchainData: data
          })), 3000);
        getWitnesses().then(e =>
            this.setState({
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
            })
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        const {active, pending, blockchainData} = this.state;
        const currentWitness = active && blockchainData ? active.find(e => e.id === blockchainData.current_witness) : {name: ''};

        return (
            <div className="witnesses">
                <Witnesscards active={active} pending={pending} blockchainData={blockchainData} currentWitness={currentWitness}/>

                {
                    active &&
                    <Fragment>
                        <Translate className="table__title" component="div" content={"blockchain.witnesses.active"}/>
                        <Table
                            tableHead={tableHead}
                            rows={active}
                        />
                        <TableCard rows={active} tableHead={tableHead}/>
                    </Fragment>
                }

                {
                    pending &&
                    <Fragment>
                        <Translate className="table__title" component="div" content={"blockchain.witnesses.pending"}/>
                        <Table
                            tableHead={tableHead}
                            rows={pending}
                        />
                        <TableCard rows={pending} tableHead={tableHead}/>
                    </Fragment>
                }
            </div>
        )
    }
}

export default Witnesses;