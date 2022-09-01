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
                            text={<Translate content={this.state.backup.text} />}
                            className="with-bg with-border"
                        />}
                        list={backupsList.map((e, id) => <Translate key={id} onClick={() => this.changeBackup(e)} content={e.text} component="button" />)}
                        comment={<Translate content={`${backupTranslate}.comment`} lastBackup={'01/22/2019'} />}
                    />
                    <Translate content={`${backupTranslate}.needed`} className="backup__warning" />
                    <Translate content={`${backupTranslate}.desc`} className="backup__desc" component="p" />
                    <Translate content={`${backupTranslate}.title`} component="button" className="btn-round" />
                </div>
                <div className="backup__item">
                    <Translate content={`${restoreTranslate}.title`} component="h2" />
                    <Dropdown
                        btn={<SelectHeader
                            labelTag={`${restoreTranslate}.type`}
                            text={<Translate content={this.state.restore.text} />}
                            className="with-bg with-border"
                        />}
                        list={restoresList.map((e, id) => <Translate key={id} onClick={() => this.changeRestore(e)} content={e.text} component="button" />)}
                    />
                    <Translate content={`${restoreTranslate}.fileUpload`} component="button" className="btn-round btn-round--grey" />
                    <Translate content={`${restoreTranslate}.desc`} className="backup__desc" component="p" />
                    <Translate content={`${restoreTranslate}.title`} component="button" className="btn-round" />
                </div>

            </div>
        )
    }
}

export default Backup;