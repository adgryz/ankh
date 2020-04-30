import React from 'react';
import { useSelector } from 'react-redux';

import ConflictRow from './ConflictRow'
import './ConflictsBoard.scss'

const ConflictsBoard = () => {
    const conflicts = useSelector(({ conflict }) => conflict.conflicts);
    const activeConflictNumber = useSelector(({ conflict }) => conflict.activeConflictNumber);

    return (
        <div className="conflictsBoard">
            <div className="label">Conflicts</div>
            {
                conflicts.map(conflict => <ConflictRow
                    isActive={activeConflictNumber === conflict.regionNumber}
                    conflict={conflict}
                    key={conflict.regionNumber} />)
            }
        </div>
    )
}

export default ConflictsBoard;