import React from 'react';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';

const Modal = (props) => {
    const {modal} = props;
    return (
        <div>
            <Grid item lg={modal && modal.props.grid ? modal.props.grid : 12} xs={12} className={`modal${modal ? ' open custom-scroll' : ''}`}>
                {modal}
            </Grid>
        </div>
    );
};

const mapStateToProps = (state) => ({modal: state.layout.modal});

export default connect(mapStateToProps)(Modal);
