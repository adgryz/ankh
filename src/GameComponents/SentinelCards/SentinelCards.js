import React from 'react';

import './SentinelCards.scss';
import SentinelCard from './SentinelCard';
import catMummy from './catMummy.png'
import mummy from './mummy.png'
import androsphinx from './androsphinx.png'

const SentinelCards = () => {
    return (
        <div className="sentinelCards">
            <SentinelCard level={1} name="Cat Mummy" id="s_catMummy" image={catMummy} description="When you win battle with Cat Mummy opponents lose 1 devotion" />
            <SentinelCard level={2} name="Mummy" id="s_mummy" image={mummy} description="When dies - summon it adjacent to your god" />
            <SentinelCard level={3} name="Androsphinx" id="s_androsphinx" image={androsphinx} description="Adjacent warriors and guardians have 0 strength" />
        </div>
    )
}

export default SentinelCards;