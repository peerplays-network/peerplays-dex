import React, { Component } from 'react';
import { connect } from "react-redux";
import { CardHeader } from "../helpers/cardHeader";
import { Card } from "../helpers/card";
import { SmallCardContent } from "../helpers/smallCardContent";
import QuickSellBuy from "../helpers/quickSellBuy";
import SendForm from "../helpers/sendForm";
import { GraphTrends } from "../helpers/graphTrends";
import { GraphBtsBtc } from "../helpers/graphBtsBtc";
import OpenOrders from "../helpers/openOrders";
import GraphMyAssets from "../helpers/graphMyAssets";
import TableMyAssets from "../helpers/tableMyAssets"
import NeedToLogin from "../helpers/needToLogin";
import UserActivity from './user/userActivity'
import { updateAccountAndLoginData } from '../../actions/account';
import Grid from '@material-ui/core/Grid';
import UserAssets from "../pages/user/userAssets";
import counterpart from 'counterpart';

class Dashboard extends Component {

    update = updateAccountAndLoginData

    render() {
        if (!this.props.account) return <NeedToLogin pageName={'dashboard'} />;

        let data = this.props.account;
        data.history = this.props.account.history.slice(0, 10);

        return (
            <div className="container">
           <div className="page__header-wrapper">
               <h1 className="page__title">{counterpart.translate(`dashboard.title`)}</h1>
           </div>
                <div className="card__list__none">
                    <Card mode="small">
                        <SmallCardContent />
                    </Card>
                    <Card mode="small">
                        <SmallCardContent />
                    </Card>
                    <Card mode="small">
                        <SmallCardContent />
                    </Card>
                    <Card mode="small">
                        <SmallCardContent />
                    </Card>
                    <Card mode="small">
                        <SmallCardContent />
                    </Card>
                    <Card mode="small">
                        <SmallCardContent />
                    </Card>
                </div>


                <div className="graphs_hidden">
                    <Card mode="graph">
                        <CardHeader title={`block.openOrders.title`} />
                        <OpenOrders />
                    </Card>
                    <Card mode="graph">
                        <CardHeader title={`block.graph.title`} additionalData={{ token: "BTC / BTH" }} />
                        <GraphBtsBtc />
                    </Card>
                    <Card mode="graph">
                        <CardHeader title={`block.myPortfolio.title`} />
                        <GraphMyAssets />
                    </Card>
                </div>

                <div>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <div className="graphs">
                                <Card mode="widget">
                                    <CardHeader title={`block.quickSellBuy.title`} />
                                    <div className="card__content">
                                        <QuickSellBuy update={this.update} />
                                    </div>
                                </Card>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className="graphs">
                                <Card mode="widget">
                                    <CardHeader title={`block.send.title`} />
                                    <SendForm update={this.update} />
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                </div>

                <div className="graphs_hidden">
                    <Card mode="widget">
                        <CardHeader title={`block.trends.title`} />
                        <GraphTrends />
                    </Card>
                    <Card mode="widget">
                        <CardHeader title={`block.todayTradeVolume.title`} />
                    </Card>
                </div>

                <div className="tables">
                    {
                        Boolean(data) &&
                        <Card mode="table">
                            <CardHeader title={`block.myActivity.title`} />
                            <UserActivity data={data} />
                        </Card>
                    }
                    <Card mode="table">
                        <CardHeader title={`block.myAssets.title`} />
                        {/* <TableMyAssets /> */}
                        <UserAssets data={this.props.account}/>
                    </Card>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({ account: state.accountData });

export default connect(mapStateToProps)(Dashboard);
