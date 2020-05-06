import React from 'react';

import GodBoard from './GodBoard';

const GodBoards = ({ players }) => {
    return (
        <>
            {
                players.map(({ god, followers, id, figuresPool, battleCards }) =>
                    <GodBoard
                        key={god.name}
                        unlockedPowers={god.unlockedPowers}
                        followers={followers}
                        godName={god.name}
                        godImg={god.imgSrc}
                        godTitle={god.title}
                        playerId={id}
                        battleCards={battleCards}
                        figuresPool={figuresPool}
                        color={god.color} />
                )
            }

        </>
    )
}

export default GodBoards;