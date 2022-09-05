import React, {Component} from 'react';
import Link from "react-router-dom/es/Link";
import IconCross from "../../svg/cross.svg";
import Table from "./table";

const defaultTableHead = [
    {
        key: 'id',
        translateTag: 'id',
        params: 'fit-content'
    },
    {
        key: 'item',
    },
    {
        key: 'action',
        translateTag: 'action',
        params: 'align-right'
    }
];

class AccountUpdateList extends Component{
    state = {
        currentItems: [],
        addedItems: [],
        listToSave: [],
        tableData: false
    };

    // componentDidMount(){
    //     const {type, itemsList} = this.props;
    //     const head = [...defaultTableHead];
    //     const rows = [];
    //
    //     head[1].translateTag = type;
    //
    //     const tableData = this.formTableData(itemsList, {head, rows});
    //     this.setState({currentItems: itemsList, tableData});
    // };

    deleteItem = itemToDelete => {
        const {handleChange, id} = this.props;
        let {currentItems, listToSave} = this.state;

        currentItems = currentItems.filter(el => el !== itemToDelete);
        listToSave = listToSave.filter(el => el !== itemToDelete);

        const tableData = this.formTableData(currentItems);

        this.setState({currentItems: itemsList, tableData, listToSave});
        handleChange && handleChange(listToSave, id);
    };

    newItemAction = (value, action) => {
        const {handleChange, id} = this.props;
        let {addedItems, listToSave} = this.state;

        if(action === 'add'){
            addedItems = addedItems.push(value);
            listToSave = listToSave.push(value);
        } else {
            addedItems = addedItems.filter(el => el !== value);
            listToSave = listToSave.filter(el => el !== value);
        }

        this.setState({addedItems, listToSave});
        handleChange && handleChange(listToSave, id);
    };

    formTableData = (itemsList, tableData = {...this.state.tableData}) => {
        tableData.rows = itemsList.map((el, index) => {

            const linkPath = type === 'user' ? '/user/' : '/asset/';
            const item = <Link to={`${linkPath}/${el}`}>{el}</Link>;
            const action = <button type="button" onClick={() => this.deleteItem(el)}><IconCross /></button>;

            return {
                id: index,
                item,
                action,
            }
        });
        return tableData;
    };

    render(){

        const tableData = this.state.tableData;

        if(!tableData) return <span />;

        return(
            <div>
                <Table
                    tableHead={tableData.head}
                    rows={tableData.rows}
                />
            </div>
        )
    }
}

export default AccountUpdateList;