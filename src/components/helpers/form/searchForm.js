import React, {Component} from "react";
import IconCross from "../../../svg/cross.svg";
import IconSearch from "../../../svg/search.svg";


class SearchForm extends Component{
    state = {
        val: ''
    }
    onChange = (e) => {
        this.setState({val: e.target.value});
        return this.props.handleChange(e.target.value);
    };
    onClose = () => {
        this.props.handleClose();
        this.setState({val:''});
        setTimeout(() => {
            document.getElementsByClassName('search__field')[0].value = this.state.val;
        }, 400);
        this.props.handleChange(this.state.val);
    };


    render(){
        return(
            <div className="search">
                <IconSearch className="search__icon" />
                <input  
                    className="search__field" 
                    type="text"
                    onChange={this.onChange}
                    attributes={{ placeholder: this.props.placeholderTag }} 
                />
                <button className="search__close" onClick={this.onClose}><IconCross /></button>
            </div>
        )
    }
}

export default SearchForm;
