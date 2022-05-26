import React from 'react';
import {connect} from "react-redux";
import {clearLayout} from "../../dispatch/layoutDispatch";

const Overlay = ({overlay, modalProps}) => { 
    return(
    <div
        className={`overlay${overlay ? ' open' : ''}`}
        onClick={modalProps && modalProps.persist ? ()=>{} : clearLayout}
    />
)};

const mapStateToProps = (state) => ({overlay: state.layout.overlay, modalProps: state.layout.modal.props});

export default connect(mapStateToProps)(Overlay);
