import counterpart from "counterpart";
import React from "react";
import {Radio} from "../radio";

const RadioTabsHead = ({head, activeTab, callback}) => (
    <div className="tabs__head">
        {head.map((elem, id) => (
            <Radio
               key={elem}
               name='tableHead'
               value={elem}
               text={<span>{counterpart.translate(`tabs.${elem}`)}</span>}
               defaultChecked={id === 0}
               callback={callback}
            />
        ))}
    </div>
);

export default RadioTabsHead;