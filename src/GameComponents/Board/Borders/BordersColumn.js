import React from 'react';

import Border from './Border';
import './BordersColumn.scss';

const BordersColumn = ({ x, column }) => {
    return (
        <div >
            {
                column.map((e, ind) =>
                    <div key={ind} style={x !== 0 ? { marginLeft: x % 2 === 0 ? -12 : -20 } : null}>
                        <Border y={ind} x={x} borderData={column[ind]} />
                    </div>
                )
            }
        </div>
    )
}

export default BordersColumn;