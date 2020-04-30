import React from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux'

import battle from './battle.svg';
import './TieBreakerToken.scss';

const TieBreakerToken = () => {
    const isUsed = useSelector(({ conflict }) => conflict.isTieBreakerUsed)
    return <div className={classnames("tieBreakerToken", { isUsed })}>
        <img width={15} height={15} alt="breaker" src={battle} />
    </div>
}

export default TieBreakerToken