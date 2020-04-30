import React from 'react';
import { useDispatch } from 'react-redux';

import { unlockAnkhPowerEffect } from 'GameLogic/actions/unlockAnkhPower';

import './AnkhPower.scss';
import AnkhToken from './AnkhToken'

const AnkhPower = ({ power, powerLevel, color, isUnlocked, isUnlocking }) => {
    const dispatch = useDispatch();
    const canUnlock = isUnlocking && !isUnlocked;
    const handlePowerUnlock = () => canUnlock ? dispatch(unlockAnkhPowerEffect({ powerName: power.name, powerLevel })) : {};
    const powerSlotStyles = canUnlock ? { backgroundColor: 'salmon', cursor: 'pointer' } : null

    return (
        <div className="ankhPower">
            <div className="powerSlot" onClick={handlePowerUnlock} style={powerSlotStyles}>
                {isUnlocked ? <AnkhToken color={color} /> : null}
            </div>
            <div>
                <div className="name" style={{ borderColor: color }}>{power.name}</div>
                <div className="description">{power.description}</div>
            </div>
        </div>
    )
}

export default AnkhPower