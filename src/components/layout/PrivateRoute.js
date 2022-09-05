import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ account, ...rest }) => {
    if (account)
        return <Route {...rest} />
    else
        return <Redirect to="/" />
};

const mapStateToProps = (state) => ({ account: state.accountData });

export default connect(mapStateToProps)(PrivateRoute);