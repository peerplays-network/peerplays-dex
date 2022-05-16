import React, {Fragment, Component} from "react";
import Table from "../../helpers/table";
import {IconCheckGreen} from "../../../svg";
import {getInfoVoting} from "../../../actions/voting/getInfoVoting";
import SelectHeader from "../../helpers/selectHeader";
import {dbApi} from "../../../actions/nodes";
import dataFetch from "../../helpers/dataFetch";
import Dropdown from "../../helpers/form/dropdown";

const tableHead = [
    {
        key: 'rank',
        translateTag: 'hash',
        params: 'fit-content'
    },
    {
        key: 'id',
        translateTag: 'id',
        params: 'fit-content'
    },
    {
        key: 'name',
        translateTag: 'name_description',
        params: 'bold'
    },
    {
        key: 'total_votes',
        translateTag: 'votes',
        params: 'fit-content'
    },
    {
        key: 'status',
        translateTag: 'status',
        params: 'fit-content'
    },
    {
        key: 'vote_icon',
        translateTag: 'actions',
        params: 'fit-content'
    }
];

const tableHeadWorkers = [
    {
        key: 'rank',
        translateTag: 'hash',
        params: 'fit-content'
    },
    {
        key: 'id',
        translateTag: 'id',
        params: 'fit-content'
    },
    {
        key: 'name',
        translateTag: 'name_description',
        params: ''
    },
    {
        key: 'votes',
        translateTag: 'votes',
        params: 'fit-content'
    },
    {
        key: 'duration',
        translateTag: 'duration',
        params: 'fit-content'
    },
    {
        key: 'url',
        translateTag: 'url',
        params: 'fit-content'
    },
    {
        key: 'daily_pay',
        translateTag: 'daily_pay',
        params: 'fit-content'
    },
    {
        key: 'vote_icon',
        params: 'fit-content'
    }
];

class UserVoting extends Component {
    state = {
        data: false,
        show: false,
        buttons: []
    };

    componentDidMount() {
        let buttons = [];
        let witnesses = this.props.data.witness_account.filter(item => item.vote);
        let committee = this.props.data.committee_member_account.filter(item => item.vote);
        let workers = this.props.data.worker_account.filter(item => item.vote);

        if (witnesses && witnesses.length) buttons.push("Witnesses");
        if (committee && committee.length) buttons.push("Committee");
        if (workers && workers.length) buttons.push("Workers");

        this.setState({
            data: {
                witnesses: witnesses
                    .map((witness, index) => ({
                        ...witness,
                        rank: index + 1,
                        vote_icon: <IconCheckGreen/>,
                        status: witness.active ? 'Active' : 'Proposed'
                    })),
                committee: committee
                    .map((committee, index) => ({
                        ...committee,
                        rank: index + 1,
                        vote_icon: <IconCheckGreen/>,
                        status: committee.active ? 'Active' : 'Proposed'
                    })),
                workers: workers
                    .map((worker, index) => ({
                        ...worker,
                        rank: index + 1,
                        vote_icon: <IconCheckGreen/>
                    }))
            },
            buttons,
            show: Boolean(buttons.length) ? buttons[0].toLowerCase() : false
        })
    }

    render() {
        const {data, buttons, show} = this.state;

        return (
            <div className="user__voting">
                {
                    Boolean(buttons && buttons.length)
                        ?
                        <Dropdown
                            btn={<SelectHeader
                                text={show}
                                className="select-voting"
                            />}
                            list={buttons.map(item => <button onClick={() => this.setState({show: item.toLowerCase()})}>
                                {item}
                            </button>)}
                        />
                        :
                        <span className="no-data">No data</span>
                }
                {
                    Boolean(data[show] && data[show].length) &&
                    <div className="voting">
                        <Table
                            tableHead={show === 'workers' ? tableHeadWorkers : tableHead}
                            rows={data[show]}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default dataFetch({method: getInfoVoting})(UserVoting);