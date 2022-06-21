import React, {Component, Fragment} from "react";
import {store} from "../../../index";
import Table from "../../helpers/table";
import PermissionTable from "../../helpers/permissions/permissionsTable";
import dataFetch from "../../helpers/dataFetch";
import AddPermission from "../../helpers/permissions/addPermission";
import {defaultToken} from "../../../params/networkParams";
import {getPassword, updateAccount} from "../../../actions/forms/index";
import {fetchPermissions} from "../../../actions/dataFetching/accountData/fetchPermissions";
import PermissionTitle from "../../helpers/permissions/permissionTitle";
import SaveChangesCard from "../../helpers/saveChangesCard";
import {getAccountData} from "../../../actions/store";
import TableCard from "../../helpers/cards";

const tableHeadActivities = [
    {
        key: 'time',
        translateTag: 'time',
        params: 'fit-content'
    },
    {
        key: 'type',
        translateTag: 'type',
        params: 'fit-content'
    },
    {
        key: 'desc',
        translateTag: 'info'
    },
    {
        key: 'id',
        translateTag: 'id',
        params: 'align-center fit-content'
    },
    {
        key: 'fee',
        translateTag: 'fee',
        params: 'fit-content'
    },
    {
        key: 'actions',
        params: 'align-right fit-content actions'
    }
];

class AssetsPermissions extends Component {

    state = {
        changeLog: {},
        dataForUpdate: {},
        basicData: false,
        permissions: false,
        history: [],
        showSave: false
    };

    componentDidMount(){

        const {basicData, permissions, history, basicFee} = this.props.data;
        const account = getAccountData();

        const changeLog = {
            fee: basicFee.fee,
            delete: [],
            errorsIDs: [],
            add: {},
            threshold: {}
        };

        const dataForUpdate = {
            fee: { amount: 0, asset_id: account.assets.find(e => e.symbol === defaultToken).id },
            account: account.id,
        };

        this.setState({basicData, changeLog, dataForUpdate, permissions, basicFee, history})
    }

    addPermissionData = (id, add) => {
        const {changeLog} = this.state;
        const errorsArr = changeLog.errorsIDs;
        const errorsIncludes = errorsArr.includes(id);

        if(!errorsIncludes && add.hasErrors){
            errorsArr.push(id);
        } else if(errorsIncludes && !add.hasErrors){
            changeLog.errorsIDs = errorsArr.filter(el => el !== id);
        }

        if(add.data && add.data.key){
            changeLog.add[id] = add.data;
        } else {
            delete changeLog.add[id];
        }

        this.updateChangeLog(changeLog);
    };

    deleteActivePermission = (elToDelete) => {
        const {changeLog} = this.state;
        changeLog.delete.push(elToDelete);
        this.updateChangeLog(changeLog);
    };

    changeThreshold = (type, data) => {
        const {changeLog} = this.state;
        changeLog.threshold[type] = data;
        this.updateChangeLog(changeLog);
    };

    updateChangeLog = (changeLog) => {
        let showSave = false;

        if(
            changeLog.errorsIDs.length === 0
            && (
                Object.values(changeLog.add).length
                || Object.values(changeLog.threshold).length
                || changeLog.delete.length
            )
        ) showSave = true;

        this.setState({changeLog, showSave});
    };

    saveResult = (password, keyType) => {
        const {basicData, changeLog, dataForUpdate} = this.state;
        const addData = Object.values(changeLog.add);
        const changeThreshold = Object.keys(changeLog.threshold);

        let changedTypes = [];
        let data = basicData;

        if(changeLog.delete.length){
            changeLog.delete.forEach(el => {
                if(!changedTypes.includes(el.type)) changedTypes.push(el.type);
                data[el.type][el.keyType] = data[el.type][el.keyType].filter(basicKeyArr => basicKeyArr[0] !== el.key);
            });
        }

        if(addData.length){
            addData.forEach(el => {
                if(!changedTypes.includes(el.type)) changedTypes.push(el.type);
                data[el.type][el.keyType].push([el.key, el.weight]);
            });
        }

        if(changeThreshold.length){
            changeThreshold.forEach(key => {
                if(!changedTypes.includes(key)) changedTypes.push(key);
                data[key]['weight_threshold'] = changeLog.threshold[key];
            })
        }

        if(!changedTypes) return;

        changedTypes.forEach(type => {
            dataForUpdate[type] = data[type];
        });

        updateAccount(dataForUpdate, password, keyType).then(this.reset);
    };

    handleSave = () => getPassword(this.saveResult, 'active');

    reset = () => this.props.reset();

    render() {

        if(!this.state.permissions) return <span />;
        const {history, permissions, changeLog, showSave} = this.state;

        const {owner, active, memo} = permissions;

        return (
            <div className="permissions">
                <PermissionTable
                    type="owner"
                    data={owner}
                    changeThreshold={this.changeThreshold}
                    deleteData={this.deleteActivePermission}
                />
                <AddPermission
                    type="owner"
                    data={owner}
                    addPermissionData={this.addPermissionData}
                />
                <PermissionTable
                    type="active"
                    data={active}
                    changeThreshold={this.changeThreshold}
                    deleteData={this.deleteActivePermission}
                />
                <AddPermission
                    type="active"
                    data={active}
                    addPermissionData={this.addPermissionData}
                />
                <PermissionTable type="memo" data={memo} />
                {
                    history.length > 0 && <Fragment>
                        <div className="permissions__header">
                            <PermissionTitle type="activity" />
                        </div>
                        <Table
                            className="permissions__history"
                            tableHead={tableHeadActivities}
                            rows={history}
                        />
                        <TableCard tableHead={tableHeadActivities} rows={history}/>
                    </Fragment>
                }
                <SaveChangesCard
                    show={showSave}
                    fee={changeLog.fee}
                    cancelFunc={this.reset}
                    saveFunc={this.handleSave}
                />
            </div>
        )
    }
}

export default dataFetch({method: fetchPermissions})(AssetsPermissions);