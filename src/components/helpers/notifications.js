import React from 'react';
import IconMore from "../../svg/more.svg";
import IconWarning from "../../svg/warning.svg";
import Avatar from "./avatar";

const notificationsList = [{
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: true
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
    },
    {
        avatar: require('../../images/avatar.jpg'),
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which...',
        date: new Date(),
        error: false
}];

const Notifications = () => (
    <div className="notify">
        <div className="notify__header">
            <h2 className="notify__title">Notifications</h2>
            <div className="notify__icons">
                <IconMore />
            </div>
        </div>
        <div className="notify__items-wrapper custom-scroll">
            {
                notificationsList.map((el, id) => (
                    <div key={id} className={`notify__item${el.error ? ' error' : ''}`}>
                        {el.error
                            ? <div className="avatar"><IconWarning/></div>
                            : <Avatar userName="A" image={el.avatar} />
                        }
                        <div className="notify__data">
                            <span className="notify__text">{el.text}</span>
                            <div className="notify__date-wrapper">
                                <span className="notify__date">13 Oct 2018</span>
                                <span className="notify__time">9:32 PM</span>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
);

export default Notifications;