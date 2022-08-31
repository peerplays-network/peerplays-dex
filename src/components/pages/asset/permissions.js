import React, {Component} from "react";
import {CardHeader} from "../../helpers/cardHeader"
import {IconCheck} from "../../../svg";
import counterpart from "counterpart";

class Permissions extends Component {
    render() {
        const {title, permissions} = this.props;
        return (
            <div className="fee-pool card">
                <CardHeader title={`block.${title}.title`}/>
                <div className="asset-stats__content">
                    {
                        permissions.map((item, index) =>
                            <div className="permissions__list" key={index}>
                                <IconCheck/>
                                <span>{counterpart.translate(`block.${title}.${item}`)}</span>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Permissions;