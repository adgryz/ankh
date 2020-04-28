import React from 'react';
import { useSelector } from 'react-redux';

import './Borders.scss';

import BordersColumn from './BordersColumn'

const Borders = ({ borders }) => {
    const isPreviewActive = useSelector(({ board }) => board.isBordersPreviewActive)
    return (
        <div className="borders" style={isPreviewActive ? {} : { pointerEvents: 'none' }} >
            {
                borders.map((e, ind) =>
                    <BordersColumn key={ind} x={ind} column={borders[ind]} />)
            }
        </div>
    )
}

export default Borders;