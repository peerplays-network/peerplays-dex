import counterpart from 'counterpart';
import React from 'react';

const TableHeading = ({tableHead}) => (
    <div className="table__header">
        {tableHead.map((el, id) => (
            el.translateTag
                ?
                    <div 
                        key={`th-${id}`}
                        className={`table__cell bold ${el.params ? el.params : ''}`}
                    >
                        {counterpart.translate(`tableHead.${el.translateTag}`, {el.translateParams})}
                    </div>     
                : <div
                    key={`th-${id}`}
                    className={`table__cell bold ${el.params ? el.params : ''}`}
                />
        ))}
    </div>
);

export default TableHeading