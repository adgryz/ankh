import React from 'react';

import './ActionField.scss';
import ankh from './ankh.svg';
import follower from './follower.svg';
import chariot from './chariot.svg';
import warrior from './warrior.svg';

const ActionBoardField = ({ isActive, isEventActivator, label, color }) => {
    const style = isActive || !isEventActivator ? null : { filter: 'invert(1)' };
    return <div className="actionField" style={{
        border: `3px solid ${color}`,
        background: isActive ? 'burlywood' : isEventActivator ? 'black' : 'white'
    }}>
        {color === 'blue' && <img src={chariot} width={18} height={18} alt="img" style={style} />}
        {color === 'red' && <img src={warrior} width={18} height={18} alt="img" style={style} />}
        {color === 'green' && <img src={follower} width={18} height={18} alt="img" style={style} />}
        {color === 'orange' && <img src={ankh} width={18} height={18} alt="img" style={style} />}

        {
            label && <div className="actionFieldPlayerCount">{label}</div>
        }
    </div>
}

export default ActionBoardField;