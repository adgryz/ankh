import React from 'react';

import AnkhPower from './AnkhPower';
import AnkhToken from './AnkhToken';
import './AnkhPowerColumn.scss';
import scarabSymbol from './scarabSymbol.svg';

const AnkhPowerColumn = ({ columnNumber, guardianIndex, powers, unlockedPowers, firstActive, secondActive, color, isUnlocking }) => {

    return (
        <div className="ankhPowerColumn">
            <div>
                {
                    powers.map(power => <AnkhPower
                        isUnlocking={isUnlocking}
                        key={power.name}
                        powerLevel={columnNumber}
                        color={color}
                        isUnlocked={!!unlockedPowers.find(name => name === power.name)}
                        power={power} />)
                }
            </div>
            <div className="tokensTrack">
                <div className="powerSlot">
                    {firstActive && guardianIndex === 1 && <img alt="scarab" src={scarabSymbol} width={15} height={15} />}
                    {!firstActive && <AnkhToken color={color} />}
                </div>
                <div className="powerSlot">
                    {secondActive && guardianIndex === 2 && <img alt="scarab" src={scarabSymbol} width={15} height={15} />}
                    {!secondActive && <AnkhToken color={color} />}
                </div>
                <div className="columnNumber">
                    {columnNumber}
                </div>
            </div>
        </div>
    )
}

export default AnkhPowerColumn;