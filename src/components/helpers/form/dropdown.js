import React, {Component, Fragment} from "react";
import * as ReactDOM from "react-dom";

class Dropdown extends Component {
    state = {
        path: window.location.pathname,
        display:true
    };

    open = () => {
        const obj = ReactDOM.findDOMNode(this);
        if (obj.matches('.open')) {
            obj.classList.remove('open')
            this.setState({display : true})
        } else {
            this.setState({display : false})
            document.addEventListener('click', this.handleOutsideClick, false);
            let arrDrops = Object.values(document.querySelectorAll('.dropdown.open'));
            // arrDrops.forEach(el => el.classList.remove("open"));
            obj.classList.add('open')
        }
        
        
        this.props.openCallback && this.props.openCallback();
    };

    close = () => {
        this.removeListener();
        this.setState({display : true})
        ReactDOM.findDOMNode(this).classList.remove('open');
    };

    removeListener = () => document.removeEventListener('click', this.handleOutsideClick, false);

    handleOutsideClick = (e) => {
        if (!ReactDOM.findDOMNode(this).contains(e.target)) this.close();
    };

    componentWillUnmount() {
        this.removeListener();
    }

    componentWillReceiveProps() {
        if(this.state.path !== window.location.pathname){
            this.close();
        }
    }

    render() {
        const {
            list = [],
            body = '',
            btn = '',
            comment = '',
            position = '',
            className
        } = this.props;

        let content = body;

        if(list.length){
            content = <Fragment>
                {list.map((e, index) =>
                    <div key={index} className={`dropdown__item  ${this.state.display ? 'display-none' : ''}`}  onClick={this.close}>{e}</div>)
                }
            </Fragment>
        }

        return (
            <div className={`dropdown ${className ? className : ''} ${position ? position : ''}`}>
                <button className="dropdown__btn-wrapper" onClick={this.open} type="button">
                    {btn}
                </button>
                <div className={`dropdown__body${list.length ? ' custom-scroll' : ''}`}>
                    {content}
                </div>
                {comment
                    ? <div className="field__comment">
                        {comment}
                    </div>
                    : ''
                }
            </div>
        )
    }
}

export default Dropdown;
