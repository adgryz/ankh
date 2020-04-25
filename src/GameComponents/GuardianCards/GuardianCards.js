import React from 'react';

import './GuardianCards.scss';
import GuardianCard from './GuardianCard';
import satet from './satet.png'
import apep from './apep.png'
import androsphinx from './androsphinx.png'

const GuardianCards = () => {
    return (
        <div className="guardianCards">
            <GuardianCard level={1} name="Satet" image={satet} description="Can push enemies" />
            <GuardianCard level={2} name="Apep" image={apep} description="Can be placed in water" />
            <GuardianCard level={3} name="Androsphinx" image={androsphinx} description="Adjecent figures have 0 strength" />
        </div>
    )
}

export default GuardianCards;