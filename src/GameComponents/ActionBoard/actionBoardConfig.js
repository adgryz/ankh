import { ACTIONS_IDS } from 'GameLogic/actions/const'

export const actionBoardConfig = {
    [ACTIONS_IDS.MOVE]: {
        title: 'Move figures',
        color: 'blue'
    },
    [ACTIONS_IDS.SUMMON]: {
        title: 'Summon figure',
        color: 'red'
    },
    [ACTIONS_IDS.FOLLOWERS]: {
        title: 'Gain followers',
        color: 'green'
    },
    [ACTIONS_IDS.ANKH]: {
        title: 'Unlock Ankh power',
        color: 'orange'
    }
}