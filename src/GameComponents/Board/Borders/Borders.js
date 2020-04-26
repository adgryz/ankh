import React from 'react';

import './Borders.scss';

import BordersColumn from './BordersColumn'

const Borders = () => {
    return (
        <div className="borders">
            {
                new Array(23).fill(0).map((e, ind) =>
                    <BordersColumn x={ind} key={ind} />)
            }
        </div>
    )
}

export default Borders;