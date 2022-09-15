import React, {Component, Fragment} from "react";
import Close from "../decoration/close";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";

class OrderConfirmationModel extends Component {
    state = {
        data: '',
        type: '',
    };

    componentDidMount() {
        this.getData(this.props.data.defaultData);
    }

    getData = (data) => {
        const modalData = this.modalData(data)
        this.setState({data: modalData, type: data.type},)
    };

    handleMethod = () => {
        const {onSuccess} = this.props;
        onSuccess();
    };

    orderPreviewItems = ['Price', 'Quantity', 'Fee', 'Total', 'Balance'];

    modalData = (info) => ({
        Price: `${info.price} ${info.sellAsset}`,
        Quantity: `${info.amount_to_receive} ${info.buyAsset}`,
        Fee: `${info.fee} ${info.feeAsset}`,
        Total: `${+info.amount_to_sell} ${info.sellAsset}`,
        Balance: this.getBalance(info),
    });

    getBalance = (info) => {
        const isBuy = info.type === 'buy';
        const assetSymbol = isBuy ? info.sellAsset : info.buyAsset
        let balance = 0;

        if (this.props.account) {
            const asset = this.props.account.assets.find(el => el.symbol === assetSymbol);
            balance = asset ? asset.setPrecision() : 0;
        }
        return `${balance} ${assetSymbol}` ;
    }


    render() {
        let content = '';
        if (this.state.data) {
            content = <Fragment>
                <div className="modal__header">
                    <h5 className="modal__title"><strong>Order preview</strong></h5>
                </div>
                {this.orderPreviewItems.map(elem => (
                    <Grid container spacing={1} key={elem} style={{justifyContent: "space-between"}}>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="h6">{elem.charAt(0).toUpperCase()}{elem.substr(1,)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                style={{fontSize: '12px', textAlign: "right"}}>{this.state.data[elem]}</Typography>
                        </Grid>
                    </Grid>
                ))}
                <div className="modal__smbottom">
                    <button onClick={this.handleMethod} className="btn-round btn-round">
                        {this.state.type} {this.props.data && this.props.data.defaultData && this.props.data.defaultData.buyAsset} Now
                    </button>
                    <Close/>
                </div>
            </Fragment>
        }

        return (
            <div>
                {content}
            </div>
        )
    }
};

const mapStateToProps = state => ({account: state.accountData});

export default connect(mapStateToProps)(OrderConfirmationModel);

