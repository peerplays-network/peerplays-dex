import * as ReactDOM from "react-dom";
import React, {Component} from 'react'
import ControlledInput from "./controlledInput";
import {Caret} from "../../../svg";
import Translate from "react-translate-component";

class FieldWithHint extends Component{
    state = {
        data: {},
        hints: [],
        timeout: false,
        dropdown:false,
    };
     
    componentDidMount(){
        const {defaultVal, name} = this.props;
        const data = {};
        if(defaultVal){
            data[name] = defaultVal[name];
            this.setState({data});
        }
        
    }

    componentDidUpdate(prevProps) {
      if(prevProps.defaultVal && this.props.defaultVal && prevProps.defaultVal[prevProps.name] !== this.props.defaultVal[this.props.name]) {
          const data = {};
          data[this.props.name] = this.props.defaultVal[this.props.name];
          this.setState({data});
      }
    }

    componentWillUnmount() { this.removeListener(); }

    handleChange = (val, name) => {
        let {data, timeout} = this.state;
        data[name] = val;
        if(timeout) clearTimeout(timeout);

        if(!val) {
            if(this.props.defaultHints) {
                this.setState({hints: this.props.defaultHints})
            }
            const {name, handleChange} = this.props;
            handleChange(val, name)
        };
        if(val) timeout = setTimeout(() => {
            const {name, method, handleChange} = this.props;
            method(val).then(hints => this.setState({hints}));
            handleChange(val, name);
        }, 250);

        document.addEventListener('click', this.handleOutsideClick, false);
        this.setState({data, timeout});
    };

    handleOutsideClick = (e) => {
        if (!ReactDOM.findDOMNode(this).contains(e.target)) this.close();
    };

    removeListener = () => document.removeEventListener('click', this.handleOutsideClick, false);

    close = (data = this.state.data) => {
        const hints = [];
        this.removeListener();
        this.setState({data, hints});
    };

    setNewVal = (val) => {
        const {name, handleChange} = this.props;
        const data = this.state.data;

        data[name] = val;
        handleChange(val, name);
        this.close(data);
    };
  
    toggleDropdown = ()=>{
        this.setState({dropdown :!this.state.dropdown})
    }

    toggleDropdown = ()=>{
        this.setState({dropdown :!this.state.dropdown})
    }


    render(){

        const {name, hideLabel, labelParams, className, errors,id, readOnly} = this.props;
        const {data, hints} = this.state;

        const hasHints = !!hints.length;

        return(
            <div className={`dropdown dropdown--with-hint ${hasHints && this.state.dropdown && 'open'}`}>
                <ControlledInput
                    name={name}
                    id={id}
                    labelParams={labelParams}
                    className={className}
                    hideLabel={hideLabel}
                    onChange={this.toggleDropdown}
                    onFocus={this.handleChange}
                    onClick={this.handleChange}
                    value={data}
                    readOnly={readOnly}
                    {...this.props}
                />
                <Caret className='field__caret' onClick={()=>this.toggleDropdown()}/>
                { errors && errors[name] && <Translate content={`errors.${errors[name]}`} className="field__error" /> }
                <div className="dropdown__body custom-scroll">
                    {hasHints && hints.map(e => (
                        data[name] != e && 
                        <div key={e} className="dropdown__item">
                            <span  className="cpointer" onClick={() => this.setNewVal(e)}>{e}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default FieldWithHint;