import counterpart from "counterpart";
import React from "react";

const SubmitBtn = ({tag, className, loading}) => loading ?
    <button className={className} type="submit" >{counterpart.translate(`${tag}`)}</button>
    : <button className={className} type="submit" disabled><Loader /></button>;

export default SubmitBtn;