import React from 'react';
import {connect} from "react-redux";
import {store} from "../../index";

const closeModal = () => {
    [
        {type: `CLOSE_MODAL`},
        {type: 'REMOVE_OVERLAY'}
    ].forEach(e => store.dispatch(e))
};

const Modal = (props) => (
    <div className={`modal${props.modal ? ' open' : ''}`}>
        {props.modal}
    </div>
);

const mapStateToProps = (state) => ({modal: state.modal});

export default connect(mapStateToProps)(Modal);