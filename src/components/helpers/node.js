import counterpart from 'counterpart';
import React from 'react';
import {IconConnectedNode, IconNode} from "../../svg";
import ActionsBtn from "./buttons/actionsBtn";

const Node = ({data, handleActivation}) => (
    <div className="node">
        <div className="node__primary-data">
            <button
                onClick={e => handleActivation ? handleActivation(data) : e.preventDefault()}
                className={`node__icon${!handleActivation ? ' active' : ''}${data.connectTime === 0 ? ' disabled' : ''}`}
                disabled={data.connectTime === 0 || !handleActivation}
            >
                { handleActivation ? <IconNode /> : <IconConnectedNode /> }
            </button>
            <div className="node__group">
                <span className="node__group-title">{data.location}</span>
                <span className="node__group-subtitle">{data.url}</span>
            </div>
        </div>
        <div className="node__group">
            <span className={`node__group-title clr--${data.connectTime !== 0 && data.connectTime < 500 ? 'positive' : 'negative'}`}>
                {data.connectTime}ms
            </span>
            <span className="node__group-subtitle">
                {counterpart.translate(`nodes.latency`)}
            </span>
        </div>
        <div className="node__group">
            <span className="node__group-title">{data.user.name}</span>
            <span className="node__group-subtitle">
                {counterpart.translate(`nodes.operator`)}
            </span>
        </div>
        <ActionsBtn
            actionsList={[
                <button>Option 1</button>,
                <button>Option 2</button>,
                <button>Option 3</button>
            ]}
        />
    </div>
);

export default Node;