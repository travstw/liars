import React, {useState, useEffect} from 'react';
import './Timer.css';

function Timer({ startValue, timeout }) {
    const [currentValue, setCurrentValue] = useState(startValue);

    const handleTimeout = () => {
        timeout();
    }


    useEffect(() => {
        console.log('use fired');
        if (currentValue === 0) {
            handleTimeout();
            setCurrentValue(startValue);
            return;
        }
        const clock = setTimeout(() => {
            setCurrentValue(prevState => prevState - 1);
        }, 1000);
    }, [currentValue, startValue]);

    return (
        <div className="Timer">
            {currentValue < 10 ? '0' + currentValue: currentValue}
        </div>
    )
}

export default Timer;