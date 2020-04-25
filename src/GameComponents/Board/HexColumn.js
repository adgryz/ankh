import React from 'react';

import Hex from './Hex';
import './HexColumn.scss';

const HexColumn = ({ yOffset, columnNumber, columnData }) => {
    const hexes = new Array(columnData.length).fill(0);
    const firstCol = columnNumber === 0;
    return (
        <div style={{
            marginTop: `${yOffset * 43.5}px`,
            marginLeft: `-${firstCol ? 0 : 12}px`
        }}>
            {
                hexes.map((hex, index) => <div key={index} style={{ marginTop: "-13%" }}>
                    <Hex
                        hexData={columnData[index]}
                        hexNumber={index}
                        columnNumber={columnNumber} />
                </div>)
            }
        </div>
    )
}


export default HexColumn;
