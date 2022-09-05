import counterpart from 'counterpart';
import React, {Component} from 'react';
import Dropdown from "../helpers/dropdown";
import SelectHeader from "../helpers/selectHeader";

const backupsList = [
    {
        text: 'reBackup.backupWallet',
        type: 'wallet'
    },
    {
        text: 'reBackup.backupBrain',
        type: 'brainkey'
    }
];

const restoresList = [
    {
        text: 'reBackup.fromBin',
        type: 'bin'
    },
    {
        text: 'reBackup.fromPrivate',
        type: 'private'
    },
    {
        text: 'reBackup.fromBrain',
        type: 'brain'
    }
];

class Backup extends Component{

    state = {
        backup: backupsList[0],
        restore: restoresList[0]
    };

    changeBackup = (elem) => {
        this.setState({backup: elem});
    };

    changeRestore = (elem) => {
        this.setState({restore: elem});
    };

    render(){

        const backupTranslate = "reBackup.backup";
        const restoreTranslate = "reBackup.restore";

        return(
            <div className="backup">
                <div className="backup__item">
                    <h2>{counterpart.translate(`${backupTranslate}.title`)}</h2>
                    <Dropdown
                        btn={<SelectHeader
                            labelTag={`${backupTranslate}.type`}
                            text={<span>{counterpart.translate(`${this.state.backup.text}`)}</span>}
                            className="with-bg with-border"
                        />}
                        list={backupsList.map((e, id) => <button key={id} onClick={() => this.changeBackup(e)}>{counterpart.translate(`${e.text}`)}</button> )}
                        comment={<span lastBackup={'01/22/2019'}>{counterpart.translate(`${backupTranslate}.comment`)}</span> }
                    />
                    <span className="backup__warning">{counterpart.translate(`${backupTranslate}.needed`)}</span>
                    <p className="backup__desc">{counterpart.translate(`${backupTranslate}.desc`)}</p>
                    <button className="btn-round">{counterpart.translate(`${backupTranslate}.title`)}</button>
                </div>
                <div className="backup__item">
                    <h2>{counterpart.translate(`${restoreTranslate}.title`)}</h2>
                    <Dropdown
                        btn={<SelectHeader
                            labelTag={`${restoreTranslate}.type`}
                            text={<span>{counterpart.translate(`${this.state.restore.text}`)}</span> }
                            className="with-bg with-border"
                        />}
                        list={restoresList.map((e, id) => <button key={id} onClick={() => this.changeRestore(e)}>
                                {counterpart.translate(`${e.text}`)}
                            </button>)
                        }
                    />
                    <button className="btn-round btn-round--grey">
                        {counterpart.translate(`${restoreTranslate}.fileUpload`)}
                    </button>
                    <p className="backup__desc">{counterpart.translate(`${restoreTranslate}.desc`)}</p>
                    <button className="btn-round">{counterpart.translate(`${restoreTranslate}.title`)}</button>
                </div>

            </div>
        )
    }
}

export default Backup;