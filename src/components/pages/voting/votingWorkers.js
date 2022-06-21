import React, {Component, Fragment} from "react";
import {IconCheckBlue} from "../../../svg";
import Table from "../../helpers/table";
import AddNewWorker from "../../helpers/modal/content/addNewWorker";
import {getPassword} from "../../../actions/forms";
import {setVotes} from "../../../dispatch/votesDispatch";
import {setModal} from "../../../dispatch/layoutDispatch";
import {getStore} from "../../../actions/store";
import RoundButton from "../../helpers/buttons/roundButton";

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

class VotingWorkers extends Component {
    state = {
        voteList: [],
        workers: false
    };

    buttons = (id) => ({
        toVote: <button onClick={() => this.addToVote(id)}><IconCheckBlue className="vote__like"/></button>,
        fromVote: <button onClick={() => this.removeFromVote(id)}><IconCheckBlue className="mask vote__like"/></button>
    });

    formatVote = (array, voteList) => {
        return array.map((item, index) => ({
            ...item,
            rank: index + 1,
            vote_icon: this.buttons(item.vote_for)[voteList.find(elem => elem === item.vote_for) ? 'fromVote' : 'toVote']
        }))
    };

    componentDidMount() {
        const {account, votes} = this.props;
        let newList = getStore().votes;
        let list = newList.length ? newList : account.votes.map(item => item.vote_id || item.vote_for);

        this.setState({
            workers: this.formatVote(votes, list)
        });
    }

    addToVote = (id) => {
        this.setState((state, props) => {
            let voteList = state.voteList;
            voteList.push(id);
            setVotes([...getStore().votes, ...voteList]);
            return {
                voteList,
                workers: this.formatVote(state.workers, voteList)
            }
        });
    };

    removeFromVote = (id) => {
        this.setState((state, props) => {
            let voteList = state.voteList.filter(item => item !== id);
            setVotes([...getStore().votes, ...voteList]);
            return {
                voteList,
                workers: this.formatVote(state.workers, voteList)
            }
        });
    };

    dispatchWorkerCreation = () => getPassword((password, keyType) => setModal(<AddNewWorker keyType={keyType} password={password} />), 'active');

    render() {
        const {workers} = this.state;

        return(
            <Fragment>
                <RoundButton tag="newWorker" className="btn--worker" onClick={this.dispatchWorkerCreation} />
                <div className="voting__table">
                    {
                        workers &&
                        <Table
                            tableHead={tableHeadWorkers}
                            rows={workers}
                        />
                    }
                </div>
            </Fragment>
        )
    }
}

export default VotingWorkers;