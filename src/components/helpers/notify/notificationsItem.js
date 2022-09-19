import Avatar from "../avatar";
import React from "react";
import IconWarning from "../../../svg/warning.svg";
import counterpart from "counterpart";

const NotificationsItem = ({data}) => (
    <div className={`notify__item${data.error ? ' error' : ''}`}>
        {data.error
            ? <div className="avatar"><IconWarning/></div>
            : <Avatar userName={data.data.author} />
        }
        <div className="notify__data">
            <span className="notify__text">{counterpart.translate(`tableInfo.${data.type}.description`, data.data)}</span>
            <div className="notify__date-wrapper">
                <span className="notify__date">{data.timestamp.date}</span>
                <span className="notify__time">{data.timestamp.time}</span>
            </div>
        </div>
    </div>
);

export default NotificationsItem;