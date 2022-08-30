import counterpart from "counterpart";
import React from "react";

const NoData = ({tag}) => <span className="no-data">{counterpart.translate(`${tag ? tag : 'emptyPage.default'}`)}</span> ;

export default NoData;