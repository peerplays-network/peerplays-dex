import React, {Component, Fragment} from "react";
import Table from "../table";
import Dropdown from "../form/dropdown";
import ActionsBtn from "../buttons/actionsBtn";
import AddPermission from "./addPermission";
import PermissionTitle from "./permissionTitle";
import PermissionsCards from "../../helpers/permissionsCards";
import counterpart from "counterpart";

const tableBasic = {
    key: 'key',
    translateTag: 'key',
};

const tableDefault = [
    tableBasic,
    null,
    {
        key: 'actions',
        params: 'align-right fit-content actions'
    }
];

const tableTypes = {
    number: {
        key: 'weight',
        translateTag: 'weight',
        params: 'align-center fit-content'
    },
    percent: {
        key: 'percent',
        translateTag: 'weight',
        params: 'align-center fit-content'
    },
};

const memoHeader = [tableBasic];

const typesList = [
    {tag: 'Number', name: 'number'},
    {tag: '%', name: 'percent'}
];

const formThresholdList = (type, best) => {
    const result = [];
    for(let i = 1; i <= best; i++){
        const value = i;
        const name = type !== 'percent' ? i : i / best * 100 + '%';
        result.push({ name, value });
    }
    return result;
};

class PermissionTable extends Component{
    state = {
        tableHead: false,
        tableType: typesList[0],
        tableData: [],
        threshold: false
    };

    componentDidMount(){ this.setTable(this.props) }

    setTable = (props) => {

        const tableData = props.data.list;

        if(props.type === 'memo') {
            this.setState({
                tableHead: memoHeader,
                tableData
            });
            return;
        }

        const dataWithActions = tableData.map(el => {
            el.actions = <div className="actions__wrapper">
                <ActionsBtn
                    actionsList={[
                        <button onClick={() => this.deleteKey(el.key)}>Delete</button>
                    ]}
                />
            </div>;
            return el;
        });

        let threshold = this.state.threshold;

        if(!threshold){
            threshold = {
                best: 0,
                list: [],
                selected: 0
            };

            threshold.best = props.data.list.reduce((acc, el) => el.weight > acc ? el.weight : acc, 0);
            threshold.selected = props.data.threshold;
        }

        const tableType = this.state.tableType;

        this.setState({tableData: dataWithActions, threshold}, () => this.changeHead(tableType));
    };

    changeHead = (tableType) => {
        const threshold = {...this.state.threshold};
        const tableHead = [...tableDefault];

        tableHead[1] = tableTypes[tableType.name];
        threshold.list = formThresholdList(tableType.name, threshold.best);

        this.setState({tableHead, tableType, threshold});
    };

    changeThreshold = (num) => {
        const threshold = {...this.state.threshold};
        threshold.selected = num;
        this.setState({threshold});
        this.props.changeThreshold(this.props.type, num);
    };

    deleteKey = (key) => {
        const oldTableData = [...this.state.tableData];
        let elToDelete = {
            key,
            keyType: '',
            type: this.props.type
        };
        const tableData = oldTableData.filter(el => {
            if(el.key === key){
                elToDelete.keyType = el.type;
                return false;
            }
            return true;
        });

        this.props.deleteData(elToDelete);
        this.setState({tableData});
    };

    render(){

        const {tableHead, tableType, tableData, threshold} = this.state;
        const type = this.props.type;
        const isNotMemo = type !== 'memo';

        if(!tableHead) return <span />;

        return(
            <Fragment>
                <div className="permissions__header">
                    <PermissionTitle type={type} />
                    {isNotMemo && <div className="permissions__filter-wrapper">
                        <span>{counterpart.translate(`permissions.threshold`)}</span>
                        <Dropdown
                            btn={<SelectHeader
                                text={tableType.tag}
                            />}
                            list={typesList.map((e, id) => (
                                <button key={id} onClick={() => this.changeHead(e)}>{e.tag}</button>
                            ))}
                        />
                        <Dropdown
                            btn={<SelectHeader
                                text={threshold.list[threshold.selected - 1].name}
                                className="with-bg"
                            />}
                            list={threshold.list.map((el, id) => (
                                <button key={id} onClick={() => this.changeThreshold(el.value)}>{el.name}</button>
                            ))}
                        />
                    </div>}
                </div>
                {
                    !!tableData.length && 
                    <div>
                    <Table
                        tableHead={tableHead}
                        rows={tableData}
                    />
                    <PermissionsCards tableHead={tableHead} rows={tableData}/>
                    </div>
                }
            </Fragment>
        );
    }
}

export default PermissionTable;