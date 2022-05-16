import React, {Component} from "react";
import Table from "../table";

class OrderBookTable extends Component{
    state = {
        type: '',
        threshold: '',
        newData: this.props.data
    };

    componentDidMount(){
        this.setNewFilter(this.props);
    }

    componentWillReceiveProps(props){
        if(props.type !== this.state.type || props.threshold !== this.state.threshold) this.setNewFilter(props)
    }

    setNewFilter(props){
        const {type, threshold} = props;

        this.setState({type, threshold}, () => {
            const container = document.getElementsByClassName('order-book__table')[0];
            const spread = document.getElementsByClassName('order-book__spread-wrapper')[0];
            let scroll = 0;
            if(type === 'all' && spread != undefined || type === 'sell' && spread != undefined || type === 'buy' && spread != undefined ) {
                let buydata = props.data.buy.buyRows.filter((item)=>{
                    if(parseInt(props.threshold)  == item.price ){
                        return item;
                    }
                })
                let selldata = props.data.sell.sellRows.filter((item)=>{
                    if(parseInt(props.threshold) == item.price){
                         return item;
                     }
                 })
                 if(this.state.tdata){
                 let byData = this.state.tdata
                 byData.buy.buyRows = buydata;
                 byData.sell.sellRows = selldata;
                this.setState({tdata:byData})
                 }
                scroll = spread.offsetTop - container.offsetTop - spread.offsetHeight * 1.75;
             }
           
         container.scrollTop = scroll;
        })
    }

    render(){

        const {type, threshold} = this.state;
        const {sell, spread, buy} = this.props.data;
        return(
            <div className="order-book__table custom-scroll">
                {['all', 'sell'].includes(type)
                && <Table
                    className="table--exchange table--without_header"
                    tableHead={sell.sellHeader}
                    rows={sell.sellRows}
                    onClick={this.props.handleRowClick}
                    partialFill={{
                        percentKey: 'encashed',
                        color: 'rgba(255,9,160,0.1)'
                    }}
                />
                }
                {
                    type === 'all'
                    && <div className="order-book__spread-wrapper">
                        <div className="order-book__spread-val">
                            <span className="order-book__spread">Spread</span>
                            {spread.difference}
                        </div>
                        <div className="order-book__spread-price">{spread.lastPrice}</div>
                    </div>
                }
                {['all', 'buy'].includes(type)
                && <Table
                    className="table--exchange table--without_header"
                    tableHead={buy.buyHeader}
                    rows={buy.buyRows}
                    onClick={this.props.handleRowClick}
                    partialFill={{
                        percentKey: 'encashed',
                        color: 'rgba(9,255,0,0.16)'
                    }}
                />
                }
            </div>
        )
    }
}

export default OrderBookTable;