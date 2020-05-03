import React, {useContext} from 'react';
import './Toast.css';

function Toast({ toast }) {

    return (
        <div className={`Toast ${'Toast' + '-' + toast.type}` } >
            {`${toast.message}`}
        </div>
    )
}

export default Toast;