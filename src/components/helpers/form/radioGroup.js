import counterpart from 'counterpart';
import React, {Component} from 'react';
import {Radio} from "../radio";

class RadioGroup extends Component{

    handleChange = (e) => {
        const elem = e.target;
        const handleChange = this.props.onChange;
        handleChange && handleChange(elem.value, elem.name);
    };

    render() {
        const {name, list} = this.props;
        return (
            <div className="radio-group">
                {list.map((elem, id) => (
                    <Radio
                        key={elem}
                        name={name}
                        value={elem}
                        text={<span>{counterpart.translate(`field.radio.${elem}`)}</span>}
                        defaultChecked={id === 0}
                        callback={this.handleChange}
                    />
                ))}
            </div>
        )
    }
}

export default RadioGroup;