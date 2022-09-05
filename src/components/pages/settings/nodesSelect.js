import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {setNodes} from "../../../dispatch/setNodes";
import {setInstance} from "../../../dispatch/index";
import {nodeInit} from "../../../actions/nodes/nodeInit";
import {pingNodes} from "../../../actions/nodes/index";
import Switcher from "../../helpers/switcher";
import {editStorage, getStorage} from "../../../actions/storage/index";
import Node from "../../helpers/node";
import {defaultNodesList} from "../../../params/nodesList";
import RoundButton from "../../helpers/buttons/roundButton";
import counterpart from 'counterpart';

class NodesSelect extends Component{

    state = {
        autoselect: getStorage('settings').nodeAutoselect
    };

    setActive = (node) => nodeInit(node.url, true)
        .then(({instance}) => {
            editStorage('nodes', {active: node.url});
            this.changeAutoSelect(false);
            this.props.setInstance(instance);
        });

    changeAutoSelect = (e) => {
        const value = typeof e === 'boolean' ? e : e.target.checked;
        editStorage('settings', {nodeAutoselect: value});
        this.setState({autoselect: value})
    };

    ping = () => {
        this.props.setNodes({});
        pingNodes();
    };

    render(){
        const {nodesList, instance} = this.props;
        const autoSelect = this.state.autoselect;
        let nodesAmount = defaultNodesList.length;
        let content = <span>{counterpart.translate(`nodes.checking`)}</span>;

        if(nodesList.length){
            const activeNode = nodesList.find(e => e.url === instance.url);
            const availableNodes = nodesList.filter(e => e.url !== instance.url && e.connectTime);
            const unavailableNodes = nodesList.filter(e => !e.connectTime);

            nodesAmount = nodesList.length;
            content = <Fragment>
                <h2>{counterpart.translate(`nodes.active`)}</h2>
                <Node data={activeNode} />
                {availableNodes.length &&
                    <Fragment>
                        <h2>{counterpart.translate(`nodes.available`)}</h2>
                        { availableNodes.map((el, id) => <Node key={id} data={el} handleActivation={this.setActive} />) }
                    </Fragment>
                }
                {unavailableNodes.length &&
                    <Fragment>
                        <h2>{counterpart.translate(`nodes.unavailable`)}</h2>
                        { unavailableNodes.map((el, id) => <Node key={id} data={el} handleActivation={this.setActive} />) }
                    </Fragment>
                }
            </Fragment>
        }

        return(
            <div className="nodes">
                <div className="nodes__top">
                    <div className="nodes__autoselect">
                        <Switcher
                            id="autoSwitch"
                            label="nodes.autoSelect"
                            selected={autoSelect}
                            handleChange={this.changeAutoSelect}
                        />
                        <span  nodesAmount={nodesAmount} className="nodes__amount">{counterpart.translate(`nodes.listed`)}</span>
                    </div>
                    <RoundButton tag="ping" onClick={this.ping} />
                </div>
                {content}
            </div>
        )
    }
}

const mapStateToProps = ({nodesList, instance}) => ({nodesList, instance});
const mapDispatchToProps = dispatch => ({
    setInstance: data => dispatch(setInstance(data)),
    setNodes: data => dispatch(setNodes(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NodesSelect);
