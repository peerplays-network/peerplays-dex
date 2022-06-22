import React from 'react';
import Translate from "react-translate-component";

const TableHeading = ({tableHead}) => (
    <div className="table__header">
        {tableHead.map((el, id) => (
            el.translateTag
                ? <Translate
                    key={`th-${id}`}
                    content={`tableHead.${el.translateTag}`}
                    component="div"
                    className={`table__cell bold ${el.params ? el.params : ''}`}
                    with={el.translateParams}
                />
                : <div
                    key={`th-${id}`}
                    className={`table__cell bold ${el.params ? el.params : ''}`}
                />
        ))}
    </div>
);

export default TableHeading