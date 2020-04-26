import React from 'react';

import Border from './Border';
import './BordersColumn.scss';

const BordersColumn = ({ x }) => {
    return (
        <div>
            {
                new Array(x % 2 === 0 ? 20 : 12).fill(0).map((e, ind) =>
                    <div style={x !== 0 ? { marginLeft: x % 2 === 0 ? -12 : -20 } : null}>
                        <Border y={ind} x={x} key={ind} />
                    </div>
                )
            }
        </div>
    )
}

export default BordersColumn;