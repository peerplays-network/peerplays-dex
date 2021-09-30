import React, { Component } from 'react';
import { NavLink, Route, Switch } from "react-router-dom";
import Translate from "react-translate-component";
import VotingPage from "./voting/votingPage";
import VotingWorkers from "./voting/votingWorkers";
import { connect } from "react-redux";
import NeedToLogin from "../helpers/needToLogin";
import { getInfoVoting } from "../../actions/voting/getInfoVoting";
import dataFetch from "../helpers/dataFetch";
import SaveChangesCard from "../helpers/saveChangesCard";
import { getPassword, updateAccount } from "../../actions/forms";
import { getStorage } from "../../actions/storage";
import { dbApi } from "../../actions/nodes";
import { clearVotes } from "../../dispatch/votesDispatch";
import { getAccountData } from "../../actions/store";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VestGPOS from './voting/VestGPOS';
import WithdrawGPOS from './voting/WithdrawGPOS';
import { ChainStore } from 'peerplaysjs-lib';
import { getAsset } from '../../actions/assets/getAsset';

const tableHeadWitnesses = [
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
        key: 'total_votes',
        translateTag: 'votes',
        params: 'align-right fit-content'
    },
    {
        key: 'vote_icon',
        params: 'align-center fit-content content-padding'
    }
];

const tableHeadCommittee = tableHeadWitnesses.filter(elem => elem.translateTag !== 'lastBlock');

const votingMenu = [
    /*{
        link: '/',
        tag: 'workers',
        render: (account, voteList) => <VotingWorkers account={account} votes={voteList['worker_account']}
                                                      list="workers"/>
    },*/
    {
        link: '/',
        tag: 'witnesses',
        render: (account, voteList) => <VotingPage params="witness_account" tableHead={tableHeadWitnesses}
            account={account} votes={voteList['witness_account']}
            list="witnesses" />
    },
    {
        link: '/committee',
        tag: 'committee',
        render: (account, voteList) => <VotingPage params="committee_member_account" tableHead={tableHeadCommittee}
            account={account} votes={voteList['committee_member_account']}
            list="committee" />
    },
    {
        link: '/son',
        tag: 'son',
        render: (account, voteList) => <VotingPage params="son_account" tableHead={tableHeadCommittee}
            account={account} votes={voteList['son_account']}
            list="son" />
    }
];

class Voting extends Component {

    state = {
        amount: undefined, // form amount
        totalGpos: 0, // total gpos the user has vested
        availableGpos: 0, // the amount of gpos that the user has vested that is currently able to be withdrawn
        precision: 0, // the precision of the core token
        minAmount: 0, // the minimum float amount equal to the minimum amount allowed on the blockchain for the asset based on its precision
        maxAmount: 0, // the users core token balance (1.3.0)
        fees: { // fees object representing the cost of the gpos power up (deposit) & power down (withdraw) transactions
            up: 0,
            down: 0
        },
        symbol: '',
    }
    componentDidMount() {
        this.getAssets();
    }
    getAssets = () => {
        let user = getAccountData();
        dbApi('get_gpos_info', [user.id]).then((gposInfo) => {
            getAsset(gposInfo.award.asset_id).then((asset) => {
                this.setState({
                    totalGpos: gposInfo.account_vested_balance / (10 ** asset.precision),
                    availableGpos: gposInfo.allowed_withdraw_amount / (10 ** asset.precision),
                    symbol: asset.symbol
                })
                console.log('in', gposInfo, asset)
            });

        });
    }
    saveResult = (password) => {
        let user = getAccountData();
        dbApi('get_account_by_name', [user.name]).then(e => {
            let new_options = e.options;
            new_options.votes = this.props.votes.sort((a, b) => {
                const aSplit = a.split(':');
                const bSplit = b.split(':');

                return parseInt(aSplit[1], 10) - parseInt(bSplit[1], 10);
            });
            new_options.num_witness = this.props.votes.filter((vote) => parseInt(vote.split(':')[0]) === 1).length;
            new_options.num_committee = this.props.votes.filter((vote) => parseInt(vote.split(':')[0]) === 0).length;
            new_options.num_son = this.props.votes.filter((vote) => parseInt(vote.split(':')[0]) === 3).length;
            updateAccount({ new_options, extensions: { value: { update_last_voting_time: true } } }, password).then(clearVotes);
        });
    };

    reset = () => {
        clearVotes();
    };

    handleSave = () => getPassword(this.saveResult);

    render() {
        if (!this.props.account) return <NeedToLogin tag={'empty.login'} />;

        return (
            <div className="container page">
                <Row>
                    <Col>
                        <VestGPOS />
                    </Col>
                    <Col >
                        <WithdrawGPOS data={this.state} />
                    </Col>
                </Row>
                <div className="page__header-wrapper">
                    <Translate className="page__title" component="h1" content="voting.title" />
                </div>
                <div className="page__menu">
                    {
                        votingMenu.map((el, id) => (
                            <Translate
                                key={id}
                                content={`voting.${el.tag}.title`}
                                component={NavLink}
                                to={`/voting${el.link}`}
                                className="page__menu-item"
                                exact
                            />
                        ))
                    }
                </div>
                <div className="page__content">
                    <Switch>
                        {
                            votingMenu.map((el, id) => (
                                <Route
                                    key={id}
                                    path={`/voting${el.link}`}
                                    render={() => el.render(this.props.account, this.props.data)}
                                    exact
                                />
                            ))
                        }
                    </Switch>
                </div>
                <SaveChangesCard
                    show={this.props.votes && this.props.votes.length}
                    fee={this.props.data.update_fee}
                    cancelFunc={this.reset}
                    saveFunc={this.handleSave}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({ account: state.accountData, votes: state.votes });
const voteWithData = dataFetch({ method: getInfoVoting })(Voting);

export default connect(mapStateToProps)(voteWithData);
