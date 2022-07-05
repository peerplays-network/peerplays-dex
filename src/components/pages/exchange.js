import React, { Component, Fragment } from 'react';
import PairStats from "../helpers/exchange/pairStats";
import Tabs from "../helpers/tabs/tabs";
import OrderBook from "../helpers/exchange/orderBook";
import UserOrders from "../helpers/exchange/userOrders";
import BuyForm from "../helpers/exchange/buyForm";
import HistoryBook from "../helpers/exchange/historyBook";
import UserOrdersHistory from "../helpers/exchange/userOrdersHistory";
import NoData from "../helpers/noData";
//import TradingViewWrapper from "../helpers/tradingViewWrapper";
import { connect } from "react-redux";
import { clearExchangeData, loadExchangeData } from "../../dispatch/exchangeData";
import Translate from "react-translate-component";
import Grid from '@material-ui/core/Grid';

class Exchange extends Component {

    state = {
        isLoaded: false
    };

    async componentDidMount() {
        this.setPair(this.props);
        this.timerID = setInterval(() => this.setPair(this.props), 5000);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.account.name !== newProps.account.name) {
            this.setPair(newProps);
            clearInterval(this.timerID);
            this.timerID = setInterval(() => this.setPair(newProps), 5000);
        } else if (this.props.match.params.pair !== newProps.match.params.pair) {
            this.setPair(newProps);
            clearInterval(this.timerID);
            this.timerID = setInterval(() => this.setPair(newProps), 5000);
        }
    }

    componentWillUnmount() {
        clearExchangeData();
        clearInterval(this.timerID);
    }

    setPair = (props) => loadExchangeData(props.match.params.pair).then(() => this.setState({ isLoaded: true }));

    handleOrderClick = (data) => this.setState({ buySellParams: data });

    render() {

        const { isLoaded } = this.state;
        const { pair, stats, orderBook, globalHistory, userBook, userHistory, fieldParams } = this.props.exchangeData;

        if (!isLoaded) return <span>Loading...</span>;
        if (isLoaded && !pair) return <NoData />;

        return (
            <Fragment>
                <div className="page__header-wrapper">
            <Translate className="page__title" component="h1" content={"exchange.title"}/>
        </div>
                <PairStats pair={pair} data={stats} history={this.props.history} />

                <Grid container>
                    <Grid item xs={12} sm={3}>
                        <div className="exchangse">
                            <div className="">
                                <Tabs head={['orderBook', 'history']}>
                                    <OrderBook data={orderBook} handleRowClick={this.handleOrderClick} />
                                    <HistoryBook data={globalHistory} />
                                </Tabs>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <div className="exchange__center custom-scroll">
                            <Tabs head={['openOrders', 'orderHistory']}>
                                <UserOrders data={userBook} />
                                <UserOrdersHistory data={userHistory} />
                            </Tabs>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ padding: '10px 10px 10px 10px'}}>
                        <Translate content="exchange.buy" className="exchange-form__title" component="div" />
                        <BuyForm
                            type="buy"
                            pair={pair}
                            defaultData={fieldParams}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} className="exchange__center" style={{ padding: '10px 10px 10px 10px'}}>
                        <Translate content="exchange.sell" className="exchange-form__title" component="div" />
                        <BuyForm
                            type="sell"
                            pair={pair}
                            defaultData={fieldParams}
                        />
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    account: state.accountData,
    exchangeData: state.pageData
});

export default connect(mapStateToProps)(Exchange);
