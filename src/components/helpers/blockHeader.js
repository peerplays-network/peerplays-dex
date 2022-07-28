import React, {Component} from 'react';
import {getUserName} from "../../actions/account";
import {formDate} from "../../actions/formDate";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const blockHeaderItems = ['date', 'witness', 'previous', 'transactions'];

const formData = async (info) => ({
    date: formDate(info.timestamp),
    witness: await getUserName(info.witness),
    previous: info.previous,
    transactions: info.transactions.length
});

class BlockHeader extends Component {
    state = {
        data: ''
    };

    componentDidMount() {
        this.getData(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.num !== nextProps.num) this.getData(nextProps.data);
    }

    getData = (data) => formData(data).then(data => this.setState({ data }));

    render() {

        let content = '';

        if (this.state.data) {
            content = <div>
                {blockHeaderItems.map((elem, index) => (
                    <div key={index}>
                        <Grid container spacing={1} key={elem} className="blockHeader">
                            <Grid item xs={12} sm={3} >
                                <Typography variant="h6" >{elem.charAt(0).toUpperCase()}{elem.substr(1,)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <Typography style={{ fontSize: '12px' }}>{this.state.data[elem]}</Typography>
                            </Grid>
                        </Grid>
                    </div>
                ))}
            </div>
        }

        return (
            <div className="block-header">
                <h2 className="block-header__num">Block #{this.props.num}</h2>
                {content}
            </div>
        )
    }
};


export default BlockHeader;
