import React from "react";
import IconNotify from "../../../svg/notifications.svg";
import {connect} from "react-redux";

const NotificationsBtn = ({notifications}) => (
    <div className="notify-btn">
        <IconNotify />
        <span className={`notify-btn__unread-counter${notifications.unread > 0 ? ' shown' : ''}`}>{notifications.unread}</span>
    </div>
);

const mapStateToProps = state => ({notifications: state.notifications});

export default connect(mapStateToProps)(NotificationsBtn);