import counterpart from "counterpart";
import React from "react";

const DefaultTabsHead = ({head, activeTab, callback}) => (
    <div className="tabs__head">
        {head.map((el, id) => (
            <button 
                key={id}
                id={el} 
                className={`tabs__head-item${activeTab === id ? ' active' : ''}`}
                onClick={callback}
            >
                {counterpart.translate(`tabs.${el}`)}
            </button>
        ))}
    </div>
);

export default DefaultTabsHead;