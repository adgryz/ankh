import React from 'react';

import './Monument.scss';

const Monument = ({ monumentId }) => {
    return (
        <div className="monument">
            <img width={25} height={25} src={getMonumentImg(monumentId)} alt="figure" />
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