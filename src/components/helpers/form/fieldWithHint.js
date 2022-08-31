import * as ReactDOM from "react-dom";
import React, {Component} from 'react'
import ControlledInput from "./controlledInput";
import {Caret} from "../../../svg";
import counterpart from "counterpart";

class FieldWithHint extends Component{
    state = {
        data: {},
        hints: [],
        timeout: false,
        dropdown:false,
        filterAsset:[
            "AQSQFHZAJVZDTVAC",
            "AXFMUJYATHGJSOIV",
            "BSEBEIBGLWDPKMDB",
            "CFQBVAIKFFJEEOOJ",
            "DOQIBMVBUJYYDXXF",
            "MCLUSD",
            "BTFUN",
            "SEUSD",
            "FKGANJJRLRRSUNTR",
            "HVVTNQNBHEFYPSJP",
            "LTQCNISQAEWLEJVS",
            "NGJZSUSFKIJBXKWJ",
            "OPNQEXZYKBPOZAUP",
            "RCDQHTNAHQNDHJXE",
            "RYVCIRCYJSVAUESQ",
            "TSKXLOICQJTCFPYY",
            "UGQZISWHZJKNGVRC",
            "UUCSGNDAXHJNRJUF",
            "WGKGQTICUIYEYTWV",
            "WNIPJIXZAFZGHGIC",
            "WTFUN",
        ]
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
        const obj = ReactDOM.findDOMNode(this);

        if (obj.matches('.open')) {
            obj.classList.remove('open')
        } else {
            document.addEventListener('click', this.handleOutsideClick, false);
            let arrDrops = Object.values(document.querySelectorAll('.dropdown.open'));
            obj.classList.add('open')
        }

        this.props.openCallback && this.props.openCallback();
    }

    render(){

        const {name, hideLabel, labelParams, className, errors,id, readOnly, hint} = this.props;
        const {data, hints} = this.state;
        const filterAssetResult = hints.filter((item) => !this.state.filterAsset.find(asset => item === asset )) 
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
                    hint={hint}
                    {...this.props}
                />
                <Caret className='field__caret' onClick={()=>this.toggleDropdown()}/>
                
                { errors && errors[name] && <span className="field__error">{counterpart.translate(`errors.${errors[name]}`)}</span> }
                <div className="dropdown__body custom-scroll">
                    {hasHints && this.props.hint && this.props.hint === 'asset' ? filterAssetResult.map(e => (
                        data[name] != e && 
                        <div key={e} className="dropdown__item">
                            <span  className="cpointer" onClick={() => this.setNewVal(e)}>{e}</span>
                        </div>
                    )):hints.map(e => (
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