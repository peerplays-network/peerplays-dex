import React, {Component} from 'react';
import Translate from "react-translate-component";
import {ContactItem} from "../helpers/contactItem";
import {IconBlackList, IconStar, IconTrash} from "../../svg";
import Switcher from "../helpers/switcher";
import {ActionsPanel} from "../helpers/actionsPanel";
import RoundButton from "../helpers/buttons/roundButton";
import {setModal} from "../../dispatch/layoutDispatch";
import AddNewContact from "../helpers/modal/content/addNewContact";
import {editStorage, getStorage} from "../../actions/storage";
import {getAccountData, getGlobals} from "../../actions/store";
import {connect} from "react-redux";
import {updateAccount} from "../../dispatch/setAccount";
import SaveChangesCard from "../helpers/saveChangesCard";
import {getPassword} from "../../actions/forms";
import {saveChanges} from "../../actions/forms/saveChanges";

class MyContacts extends Component {
    state = {
        showBlackList: false,
        changeLog: [],
        fee: 0
    };

    componentDidMount() {
        const {basicAsset, fees} = getGlobals();
        const fee = basicAsset.setPrecision(false, fees.account_whitelist.fee);
        this.setState({fee});
    }

    updateChangeLog = (id, type) => {
        const accountData = getAccountData();
        const contactsData = getStorage('contacts')[accountData.name];
        const defaultStatus = contactsData.find(e => e.id === id);
        const changeLog = this.state.changeLog.filter(e => e.id !== id);
        if (defaultStatus && defaultStatus.type !== type) changeLog.push({id, type});
        this.setState({changeLog});
    };

    changeContactsList = (id, type) => {
        const accountData = getAccountData();
        let contacts = this.props.account.contacts;

        contacts[contacts.findIndex(item => item.id === id)].type = type;
        accountData.contacts = contacts;

        updateAccount(accountData);
        this.updateChangeLog(id, type);
    };

    removeContact = (id, type) => {
        const accountData = getAccountData();
        let contacts = this.props.account.contacts;
        const contactIndex = contacts.findIndex(item => item.id === id);

        if ([1, 2].includes(contacts[contactIndex].type)) {
            contacts[contactIndex].type = type;
            accountData.contacts = contacts;

            editStorage('contacts', {[accountData.name]: contacts});
            updateAccount(accountData);
            this.updateChangeLog(id, type);
        } else {
            contacts = contacts.filter(item => item.id !== id);
            accountData.contacts = contacts;

            editStorage('contacts', {[accountData.name]: contacts});
            updateAccount(accountData);
        }
    };

    buttons = (id) => ({
        remove: <button onClick={() => this.removeContact(id, 0)} key={`remove-${id}`}><IconTrash/></button>,
        toBlackList: <button onClick={() => this.changeContactsList(id, 2)} key={`toBlackList-${id}`}><IconBlackList/></button>,
        toFavourite: <button className="mask" onClick={() => this.changeContactsList(id, 1)} key={`toFavourite-${id}`}><IconStar/></button>,
        removeFavourite: <button className="mask" onClick={() => this.changeContactsList(id, 3)} key={`removeFavourite-${id}`}><IconStar/></button>,
        removeBlackList: <button className="mask" onClick={() => this.changeContactsList(id, 3)} key={`removeBlackList-${id}`}><IconBlackList/></button>
    });

    favouriteActions = (id) => <ActionsPanel
        hover={[
            this.buttons(id).remove,
            this.props.account.membership.isLifetimeMember && this.buttons(id).toBlackList
        ]}
        instant={[this.props.account.membership.isLifetimeMember && this.buttons(id).removeFavourite]}
    />;

    generalActions = (id) => <ActionsPanel
        hover={[
            this.buttons(id).remove,
            this.props.account.membership.isLifetimeMember && this.buttons(id).toBlackList
        ]}
        instant={[this.props.account.membership.isLifetimeMember && this.buttons(id).toFavourite]}
    />;

    blackListActions = (id) => <ActionsPanel
        hover={[this.buttons(id).remove]}
        instant={[this.props.account.membership.isLifetimeMember && this.buttons(id).removeBlackList]}
    />;

    handleBlackList = () => this.setState({showBlackList: !this.state.showBlackList});

    dispatchContactCreation = () => setModal(<AddNewContact/>);

    reset = () => {
        const accountData = getAccountData();

        accountData.contacts = getStorage('contacts')[accountData.name];
        updateAccount(accountData);

        this.setState({changeLog: []});
    };

    handleSave = () => getPassword((password, keyType) => {
        saveChanges(this.props.account.contacts, password, keyType, this.state.changeLog).then(e => {
            if (e) this.setState({changeLog: []});
        });
    }, 'active');

    render() {
        const {showBlackList, fee, changeLog} = this.state;
        const contacts = this.props.account.contacts || [];

        const favList = contacts.filter(contact => contact.type === 1);
        const genList = contacts.filter(contact => contact.type === 3);
        const blackList = contacts.filter(contact => contact.type === 2);

        return (
            <div className="container page">
                <div className="page__header-wrapper">
                    <Translate component="h1" className="page__title" content="contacts.myContacts"/>
                </div>
                <div className="contacts__info">
                    <div className="contacts__count">
                        {contacts.length} {contacts.length > 1 ? 'Contacts' : 'Contact'}
                    </div>
                    <div className="blacklisted">
                        <Switcher
                            id="blackListSwitch"
                            label="contacts.blacklistedSwitcher"
                            selected={showBlackList}
                            handleChange={this.handleBlackList}
                        />
                    </div>

                    <RoundButton tag="newContact" className="btn--worker" onClick={this.dispatchContactCreation}/>
                </div>
                <span className="contacts__lists">
                    {
                        Boolean(favList.length) &&
                        <div className="contacts__favourite">
                            <div className="title">Favorite CONTACTS</div>
                            {favList.map((item, index) => (
                                <ContactItem data={item} actions={this.favouriteActions(item.id)} key={index} />
                            ))}
                        </div>
                    }
                    {
                        Boolean(genList.length) &&
                        <div>
                            <div className="title">CONTACTS</div>
                            {genList.map((item, index) => (
                                <ContactItem data={item} actions={this.generalActions(item.id)} key={index} />
                            ))}
                        </div>
                    }
                    {
                        Boolean(blackList.length && showBlackList) &&
                        <div>
                            <div className="title">Black List CONTACTS</div>
                            {blackList.map((item, index) => (
                                <ContactItem data={item} actions={this.blackListActions(item.id)} key={index} />
                            ))}
                        </div>
                    }
                </span>
                <SaveChangesCard
                    show={changeLog.length}
                    fee={fee * changeLog.length}
                    cancelFunc={this.reset}
                    saveFunc={this.handleSave}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({account: state.accountData});

export default connect(mapStateToProps)(MyContacts);