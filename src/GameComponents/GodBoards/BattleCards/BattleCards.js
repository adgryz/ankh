import React from 'react';

import { BATTLE_CARD } from 'GameLogic/conflicts/const';

const BattleCards = ({ playerCards }) => {
    return (
        <div style={{ width: 30, marginRight: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: 'burlywood', background: 'brown', padding: 3, marginTop: 10, marginBottom: 5 }}>
                Played
                <br />
                Cards
                </div>
            {
                Object.values(BATTLE_CARD).filter(card => !playerCards.find(c => c === card)).map(card => <img
                    width={20}
                    height={35}
                    style={{ marginBottom: 5 }}
                    alt={card}
                    key={card}
                    src={require(`GameComponents/ConflictsBoard/battleCards/${card}.png`)} />
                )
            }
        </div>
    )
}

export default BattleCards