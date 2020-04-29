import React from 'react';

import './ConflictOrderToken.scss';

const ConflictOrderToken = ({ number }) => {
    return (
        <div className="conflictToken">
            {number}
        </div>
    )
}

export default ConflictOrderToken;
