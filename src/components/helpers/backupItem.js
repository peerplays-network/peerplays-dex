import React, {Component} from 'react';
import {formDate} from "../../actions/formDate";
import Dropdown from "./form/dropdown";
import SelectHeader from "./selectHeader";
import counterpart from "counterpart";

class BackupItem extends Component {

    state = {
        item: this.props.actionsList[0],
    };

    changeBackup = item => this.setState({item});

    render(){

        const selectedItem = this.state.item;
        const {type, data, actionsList} = this.props;
        const translate = `reBackup.${type}`;
        const translateWithType = `${translate}.${selectedItem.type}`;

        let lastBackup, showComment;

        if(type === 'backup'){
            showComment = true;
            lastBackup = data[selectedItem.backupDate];
        }

        return(
            <div className="backup__item">
                <h2>{counterpart.translate(`${translate}.title`)}</h2>
                <Dropdown
                    btn={<SelectHeader
                        labelTag={`${translate}.selectTitle`}
                        text={<span>{counterpart.translate(`${translateWithType}.text`)}</span>}
                    />}
                    list={actionsList.map((e, id) => (
                        <button key={id} onClick={() => this.changeBackup(e)}>
                            {counterpart.translate(`${translate}.${e.type}.text`)}
                        </button>
                    ))}
                    comment={showComment && <span>{lastBackup ? counterpart.translate(`${translate}.lastBackup`) : counter.translate(`${translate}.needBackup`)}</span>}
                />
                <p className="backup__desc">{counterpart.translate(`${translateWithType}.desc`)}</p>
                <button className="btn-round" onClick={selectedItem.action} >{counterpart.translate(`${translate}.title`)}</button>
            </div>
        )
    }
};

export default BackupItem;