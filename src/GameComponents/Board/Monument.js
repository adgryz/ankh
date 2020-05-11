import React from 'react';

import './Monument.scss';

const Monument = ({ monumentId, size }) => {
    return (
        <div className="monument">
            <img width={25 || size} height={25 || size} src={getMonumentImg(monumentId)} alt="figure" />
        </div>
    )
};

const getMonumentImg = monumentId => {
    if (monumentId.startsWith('o')) {
        return require('./monuments/obelisk.svg')
    }
    if (monumentId.startsWith('p')) {
        return require('./monuments/pyramid.svg')
    }
    if (monumentId.startsWith('t')) {
        return require('./monuments/temple.svg')
    }
}

export default Monument;