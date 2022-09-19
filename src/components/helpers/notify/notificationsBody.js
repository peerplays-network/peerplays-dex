import React, {Component} from 'react';
import {connect} from "react-redux";
import ActionsBtn from "../buttons/actionsBtn";
import NotificationsItem from "./notificationsItem";
import NoData from "../noData";
import NotificationsSearch from "./notificationsSearch";
import {clearAllNotifications} from "../../../actions/notifications";
import Button from "../buttons/button";
import counterpart from 'counterpart';

class NotificationsBody extends Component {
    handleSearch = (value) => {
        const list = document.getElementsByClassName('notify__item');
        Object.values(list).forEach(el => {
            el.style = '';
            if(value && !el.textContent.includes(value)) {
                el.style.transform = 'scaleY(0) translate3d(0, -100%, 0)';
                setTimeout(() => { el.style.position = 'absolute' }, 100);
            }
        });
    };

    render(){

        const notifications = this.props.notifications.list;
        const hasData = notifications && notifications.length;

        return (
            <div className="notify">
                <div className="notify__header">
                    <h2 className="notify__title">{counterpart.translate(`layout.notifications`)}</h2>
                    {hasData
                        && <div className="notify__actions">
                            <NotificationsSearch handleSearch={this.handleSearch} />
                            <ActionsBtn
                                actionsList={[
                                    <Button tag="clear" onClick={clearAllNotifications} />
                                ]}
                            />
                        </div>
                    }
                </div>
                <div className="notify__items-wrapper custom-scroll">
                    {
                        hasData
                            ? notifications.map((el, id) => <NotificationsItem key={id} data={el}/>)
                            : <NoData tag={"emptyPage.allRead"}/>
                    }
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({notifications: state.notifications});

export default connect(mapStateToProps)(NotificationsBody);