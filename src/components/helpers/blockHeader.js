import React, {Component} from 'react';
import {getUserName} from "../../actions/account";
import {formDate} from "../../actions/formDate";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {clearLayout} from "../../dispatch";
import Link from "react-router-dom/Link";

const blockHeaderItems = ['blockID','date', 'witness', 'previous', 'transactions'];

const formData = async (info, num) => {
    const collection = [];
    let i = 0;
    for await (const node of info) {
        collection.push({
            blockID: parseInt(num) + i,
            date: formDate(node.timestamp),
            witness: await getUserName(node.witness),
            previous: node.previous,
            transactions: node.transactions.length
        });
        i++;
    }
    return collection.filter(data => String(data.blockID).startsWith(String(num)));
};

const ChildBlock = ({column, data}) => {
    return (
        <Grid container spacing={1} key={column} className="blockHeader">
            <Grid item xs={12} sm={3}>
                <Typography variant="h6">
                    {column.charAt(0).toUpperCase()}{column.substr(1,)}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography className="block__typography">{data[column]}</Typography>
            </Grid>
        </Grid>
    );
}

const MainBlock = ({data}) => {
    return (
        <Link to={`/block/${data.blockID}`} onClick={clearLayout}>
            <div className="global-search__card card card__margins">
                <div className="block-header">
                    <h2 className="block-header__num">Block #{data.blockID}</h2>
                    {blockHeaderItems.filter(v => !['blockID'].includes(v)).map(column => (
                        <ChildBlock data={data}
                                    key={`${data.witness}-${Math.random() * 100}`} column={column}/>
                    ))}
                </div>
            </div>
        </Link>
    );
}

class BlockHeader extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        this.getData(this.props.data, this.props.num);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.num !== nextProps.num) this.getData(nextProps.data, nextProps.num);
    }

    getData = (data, num) => formData(data, num).then(data => this.setState({data}));

    render() {
        const nodes = [];
        this.state.data.forEach(data => {
            nodes.push(<MainBlock key={data.previous} data={data}/>);
        });

        return nodes;
    }
};

export default BlockHeader;
