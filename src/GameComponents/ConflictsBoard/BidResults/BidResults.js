import React from 'react';
import { useSelector } from 'react-redux';

import Figure from 'GameComponents/Board/Figure'

const BidResults = () => {
    const getPlayerGod = playerId => playerId.replace('p', 'g');
    const playersBids = useSelector(({ conflict }) => conflict.playersBids);
    const winnerId = useSelector(({ conflict }) => conflict.bidWinnerId);

    return (
        <div>
            {
                Object.entries(playersBids).map(([playerId, bid]) => <div style={{ display: 'flex', alignItems: 'center', margin: 5 }}>
                    <Figure figureId={getPlayerGod(playerId)} />
                    <div style={{ marginLeft: 5, fontWeight: 'bold', color: playerId === winnerId ? 'red' : 'brown' }}>
                        {bid}
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default BidResults