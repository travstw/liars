import React from 'react';
import './Die.css';



function Die(props) {
    return (
        <div className="Die">
            <i
                className={`fas fa-dice-${props.value}`}
                style={{fontSize: props.fontSize || '6rem', color: props.color || '#F1FFFA'}}
            ></i>
        </div>
    )
}

export default Die;