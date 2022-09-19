import React, {Component, Fragment} from "react";
import Table from "../../helpers/table";
import {Card} from "../../helpers/card";
import {CardHeader} from "../../helpers/cardHeader";
import { updateAllBlockchainData } from '../../../actions/dataFetching/getGlobalData';
import Explorercards from '../../helpers/cards/explorercards';
import TableCard from "../../helpers/cards";

const tableHeadRecentBlocks = [
    {
        key: 'blockID',
        translateTag: 'blockID',
        params: 'fit-content'
    },
    {
        key: 'date',
        translateTag: 'blockTimestamp',
        params: 'fit-content bold'
    },
    {
        key: 'witness',
        translateTag: 'witness',
        params: 'fit-content'
    },
    {
        key: 'transaction',
        translateTag: 'transaction'
    }
];

class Explorer extends Component {
    state={
      data: {
        head_block_number: 0,
        current_supply: 0,
        active_witnesses: [],
        avgTime: 0,
        last_irreversible_block_num: 0,
        confidential_supply: 0,
        latestBlocks: [],
        coreAsset: {
            symbol: 'PPY'
        }
      }
    }

    componentDidMount() {
        this.refreshData();
        this.timerID = setInterval(() => this.refreshData(), 3000);
    }

    refreshData = () => {
        updateAllBlockchainData().then(data => {
          if(!data) {
            data = {
              head_block_number: 0,
              current_supply: 0,
              active_witnesses: [],
              avgTime: 0,
              last_irreversible_block_num: 0,
              confidential_supply: 0,
              latestBlocks: [],
              coreAsset: {
                  symbol: 'PPY'
              }
            }
          }
          this.setState({data});
        })
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        const {head_block_number, current_supply, active_witnesses, avgTime, last_irreversible_block_num, confidential_supply, latestBlocks, coreAsset} = this.state.data;
        return (
            <Fragment>
                <Explorercards 
                    head_block_number={head_block_number} 
                    current_supply={current_supply / (10 ** coreAsset.precision)} 
                    coreAsset={coreAsset} 
                    active_witnesses={active_witnesses}
                    avgTime={avgTime} 
                    last_irreversible_block_num={last_irreversible_block_num} 
                    confidential_supply={confidential_supply}
                />
                <Card mode="table">
                    <CardHeader title={'block.recentBlocks.title'}/>
                    <Table
                        tableHead={tableHeadRecentBlocks}
                        rows={latestBlocks}
                    />
                    <TableCard tableHead={tableHeadRecentBlocks} rows={latestBlocks}/>
                </Card>
            </Fragment>
        )
    }
}

export default Explorer;