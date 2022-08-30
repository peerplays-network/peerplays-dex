import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import counterpart from 'counterpart';

export const CardHeader = ({title, action, additionalData}) => (
    <div className="card__header">
        <div className="card__title">
            {counterpart.translate(`${title}`, {additionalData})}
        </div>
        {action && <button className="card__button" onClick={action}>
            <MoreVertIcon/>
        </button> }
    </div>
);
