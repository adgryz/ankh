import React from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux'

import battle from './battle.svg';
import './TieBreakerToken.scss';

const TieBreakerToken = () => {
    const tieBreakerUsed = useSelector(({ conflict }) => conflict.isTieBreakerUsed)
    return <div className={classnames("tieBreakerToken", { tieBreakerUsed })}>
        <img width={15} height={15} alt="breaker" src={battle} />
    </div>
}

export default TieBreakerToken