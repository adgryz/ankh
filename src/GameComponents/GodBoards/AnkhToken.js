import React from 'react';

import ankhSymbol from './ankhSymbol.svg';
import './AnkhToken.scss';

const AnkhToken = ({ color }) => {
    return <div style={{ backgroundColor: color }} className="ankhToken">
        <img width={15} height={15} alt="ankh" src={ankhSymbol} />
    </div>
}

export default AnkhToken