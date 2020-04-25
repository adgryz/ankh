import React from 'react';

import ActionRow from './ActionRow';
import { actionBoardConfig } from './actionBoardConfig';

import './ActionBoard.scss';

const ActionBoard = ({ actions }) => {
    return <div className="actionBoard">
        <div className="label">Actions</div>
        {
            Object.values(actions).map((action, index) =>
                <ActionRow
                    key={action.id}
                    config={actionBoardConfig[action.id]}
                    actionId={action.id}
                    actionRowIndex={index + 1}
                    currentActionIndex={action.index}
                    maxIndex={action.maxIndex} />)
        }
    </div>
}

export default ActionBoard;