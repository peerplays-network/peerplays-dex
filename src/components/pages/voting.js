import React, { Component, useEffect, useState } from 'react';
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
import { dbApi } from "../../actions/nodes";
import { clearVotes } from "../../dispatch/votesDispatch";
import { getAccountData } from "../../actions/store";
import VestGPOS from './voting/VestGPOS';
import WithdrawGPOS from './voting/WithdrawGPOS';
import { getAsset } from '../../actions/assets/getAsset';
import { Grid, Card, CardContent, makeStyles } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { updateAccount as updateReduxAccount } from '../../dispatch/setAccount';
import { formAccount } from '../../actions/account';
import {getGlobalData} from "../../actions/dataFetching/getGlobalData";
import {setAccount, setSidechainAccounts} from "../../dispatch/setAccount";
import {setGlobals, setMaintenance} from "../../dispatch";
import {setNotifications} from "../../dispatch/notificationsDispatch";



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
        translateTag: 'voteCount',
        params: 'align-right fit-content'
    },
    {
        key: 'vote_icon',
        translateTag: 'votes',
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
        render: (account, voteList, cancelVotes, hooks) => <VotingPage params="witness_account" tableHead={tableHeadWitnesses}
            account={account} votes={voteList['witness_account']}
            list="witnesses" cancelVotes={cancelVotes} hooks={hooks} />
    },
    {
        link: '/committee',
        tag: 'committee',
        render: (account, voteList, cancelVotes, hooks) => <VotingPage params="committee_member_account" tableHead={tableHeadCommittee}
            account={account} votes={voteList['committee_member_account']}
            list="committee" cancelVotes={cancelVotes} hooks={hooks} />
    },
    {
        link: '/son',
        tag: 'son',
        render: (account, voteList, cancelVotes, hooks) => <VotingPage params="son_account" tableHead={tableHeadCommittee}
            account={account} votes={voteList['son_account']}
            list="son" cancelVotes={cancelVotes} hooks={hooks} />
    }
];

const useStyles = makeStyles((theme) => ({
    toastify: {
        '& .Toastify__toast-icon': {
            padding: '8px',
        },
    },
}));

const Voting = (props) => {
    const { account, votes, maintenance } = props;
    const [totalGpos, setTotalGpos] = useState(0);
    
    const [availableGpos, setAvailableGpos] = useState(0);
    const [gposPerformance, setGposPerformance] = useState(0);
    const [estimatedRakeReward, setEstimatedRakeReward] = useState(0);
    const [gposPerfString, setGposPerfString] = useState("");
    const [precision, setPrecision] = useState(0);
    const [symbol, setSymbol] = useState("");
    const [symbol_id, setSymbol_id] = useState("");
    const [cancelVotes, setCancelVotes] = useState(false);
    const [newVotes, setNewVotes] = useState(props.account.votes.map(el => el.vote_id));
    const [gposSubPeriodStr, setGposSubPeriodStr] = useState('Calculating')
    const [saveLoading, setSaveLoading] = useState(false);
    const classes = useStyles();

    const trimNum = (num, digits) => {
        // Early return if NaN
        if (isNaN(num)) {
            return 0;
        }
        let numString = num.toString();
        let decimalIndex = numString.indexOf('.');
        let subString = decimalIndex > 0 ? numString.substring(0, decimalIndex + (digits + 1)) : num;
        return parseFloat(subString);
    }
    const determineGposPerfString = (gposPerformance) => {
        const constSection = "voting.performance";
        switch (true) {
            case gposPerformance === 100:
                setGposPerfString(constSection + '.max')
                break;
            case gposPerformance > 83.33 && gposPerformance < 100:
                setGposPerfString(constSection + '.great')
                break;
            case gposPerformance > 66.66 && gposPerformance <= 83.33:
                setGposPerfString(constSection + '.good')
                break;
            case gposPerformance > 50 && gposPerformance <= 66.66:
                setGposPerfString(constSection + '.ok')
                break;
            case gposPerformance > 33.33 && gposPerformance <= 50:
                setGposPerfString(constSection + '.low')
                break;
            case gposPerformance > 16.68 && gposPerformance <= 33.33:
                setGposPerfString(constSection + '.lower')
                break;
            case gposPerformance >= 1 && gposPerformance <= 16.68:
                setGposPerfString(constSection + '.crit')
                break;
            default: // 0
                setGposPerfString(constSection + '.none')
                break;
        }

    }
    const getAssets = () => {
        let user = getAccountData();
        dbApi('get_gpos_info', [user.id]).then((gposInfo) => {
            getAsset(gposInfo.award.asset_id).then((asset) => {
                if (asset) {
                    const totalBlockchainGpos = gposInfo.total_amount / (10 ** asset.precision);
                    setTotalGpos(gposInfo.account_vested_balance / (10 ** asset.precision));
                    setAvailableGpos(gposInfo.allowed_withdraw_amount / (10 ** asset.precision));
                    const vestingFactor = gposInfo && gposInfo.vesting_factor;
                    setGposPerformance(trimNum((vestingFactor * 100 || 0), 2));
                    setEstimatedRakeReward(trimNum(((gposInfo.account_vested_balance / (10 ** asset.precision)) / totalBlockchainGpos) * trimNum((vestingFactor * 100 || 0), 2), 2));
                    setSymbol(asset.symbol);
                    setSymbol_id(gposInfo.award.asset_id);
                    setPrecision(asset.precision);
                    determineGposPerfString(trimNum((vestingFactor * 100 || 0), 2));
                }
            });
        });
    }
    useEffect(() => {
        getAssets();
        calculateSubPeriodStr();
        setInterval(() => {
            calculateSubPeriodStr();
        }, 1000)
    }, []);

    const calculateSubPeriodStr = () => {
        var now = new Date();
        var utcNowMS = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).getTime();
        var nextMtMS = new Date(maintenance.nextMaintenance).getTime();
        var _mt = Math.floor((nextMtMS - utcNowMS) / 1000 / 60);
        var _hr = parseInt(_mt/60)
        var _ms = Math.floor((nextMtMS - utcNowMS) / 1000);
        var _mmt = "";
        if (nextMtMS <= utcNowMS) {
            _mmt = "0 Minute 0 Second";
            getGlobalData()
                .then(({userData, globalData, notifications, lastBlockData}) => {
                    if(userData) {
                        let sd = userData.accountData;
                        setAccount(userData);
                        setSidechainAccounts(sd.sidechainAccounts);
                    } 
                    if(globalData) setGlobals(globalData);
                    if(lastBlockData) setMaintenance(lastBlockData);
                    if(notifications) setNotifications(notifications);
                    console.timeEnd();
                })
                .then(() => {
                    this.setState({
                        connectEstablished,
                        nodeSelected: true
                    })
                });
        } else {
            if (_mt === 0) {
                _mmt = Math.floor((nextMtMS - utcNowMS) / 1000) + ' Seconds'
            } else if (_hr === 0) {
                _mmt = _mt + " Minute " +(_ms -(_mt*60)) + " Seconds"
            }else  if(_hr > 0){
                _mmt = _hr + " Hours " + (_mt-(_hr*60) ) + " Minutes " + (_ms -(_mt*60))+ " Seconds"
            }
             else {
                _mmt = _mt + " Minutes " + _ms + " Seconds"
            }
        }
        setGposSubPeriodStr(_mmt)
    }
    useEffect(() => {
        setNewVotes(props.account.votes.map(el => el.vote_id))
    }, [props.account])
    const saveResult = (password) => {
        setSaveLoading(true);
        let user = getAccountData();
        dbApi('get_account_by_name', [user.name]).then(e => {
            const currentVotes = [...newVotes, ...votes];
            let new_options = e.options;
            new_options.votes = currentVotes.sort((a, b) => {
                const aSplit = a.split(':');
                const bSplit = b.split(':');

                return parseInt(aSplit[1], 10) - parseInt(bSplit[1], 10);
            });
            new_options.num_witness = currentVotes.filter((vote) => parseInt(vote.split(':')[0]) === 1).length;
            new_options.num_committee = currentVotes.filter((vote) => parseInt(vote.split(':')[0]) === 0).length;
            new_options.num_son = currentVotes.filter((vote) => parseInt(vote.split(':')[0]) === 3).length;
            updateAccount({ new_options, extensions: { value: { update_last_voting_time: true } } }, password).then(async () => {
                updateReduxAccount(await formAccount(user.name))
                clearVotes();
                setSaveLoading(false);
            });
        });
    };
    const reset = () => {
        setCancelVotes(true);
        setNewVotes(props.account.votes.map(el => el.vote_id))
        clearVotes();
        setTimeout(() => {
            setCancelVotes(false);
        });
    };

    const handleSave = () => {
        let user = getAccountData();
        if (user.assets[0].amount / 100000 < 20) {
            return toast.error('Insufficient test balance.')
        }
        if (totalGpos > 0) {
            getPassword(saveResult)

        } else {
            toast.error('You need to Vest some GPOS balance first')
        }
    };
    if (!account) return <NeedToLogin tag={'empty.login'} />;
    return (
        <div className="container page">
              <div className="page__header-wrapper">
            <Translate className="page__title" component="h1" content={"voting.vestingTitle"}/>
        </div>
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <VestGPOS symbol_id={symbol_id} symbol={symbol} precision={precision} totalGpos={totalGpos} getAssets={getAssets} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <WithdrawGPOS symbol_id={symbol_id} symbol={symbol} precision={precision} totalGpos={totalGpos} availableGpos={availableGpos} getAssets={getAssets} />
                    </Grid>
                </Grid>
            </div>
            <div style={{ paddingTop: "24px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card >
                            <Translate className="card__title" style={{paddingTop:"20px"}} component="div" content='voting.performance.title' />
                            <CardContent >
                                <Translate component="div" content={gposPerfString} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card >
                            <Translate className="card__title" style={{paddingTop:"20px"}} component="div" content='voting.percent' />
                            <CardContent>
                                {gposPerformance}%
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card >
                            <Translate className="card__title" style={{paddingTop:"20px"}} component="div" content='voting.potential' />
                            <CardContent>
                                {`${estimatedRakeReward}%`}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card >
                            <Translate className="card__title" style={{paddingTop:"20px"}} component="div" content='voting.next_vote' />
                            <CardContent>
                                {gposSubPeriodStr}
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>
            </div>

            <div className="page__header-wrapper">
                <Translate className="page__title" component="h1" content="voting.votingTitle" />
            </div>
            <div className="page__menu">
                {
                    votingMenu.map((el, id) => (
                        <Translate
                            key={id}
                            content={`voting.${el.tag}.title`}
                            component={NavLink}
                            to={`/voting-vesting${el.link}`}
                            className="page__menu-item"
                            exact
                        />
                    ))
                }
            </div>
            <div className="page__content voting__content">
                <Switch>
                    {
                        votingMenu.map((el, id) => (
                            <Route
                                key={id}
                                path={`/voting-vesting${el.link}`}
                                render={() => el.render(account, props.data, cancelVotes, { setNewVotes, newVotes })}
                                exact
                            />
                        ))
                    }
                </Switch>
            </div>
            <SaveChangesCard
                show={newVotes.length !== props.account.votes.length}
                fee={props.data.update_fee}
                cancelFunc={reset}
                saveFunc={handleSave}
                loading={saveLoading}
            />
            <ToastContainer className={classes.toastify}/>
        </div>
    )
}


const mapStateToProps = (state) => ({ account: state.accountData, votes: state.votes, maintenance: state.maintenance });
const voteWithData = dataFetch({ method: getInfoVoting })(Voting);

export default connect(mapStateToProps)(voteWithData);
