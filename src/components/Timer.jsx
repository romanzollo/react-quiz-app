import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
    // вычисляем минуты и секунды
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;

    useEffect(() => {
        const timer = setInterval(() => {
            dispatch({ type: 'secondsRemaining' });
        }, 1000);

        return () => clearInterval(timer);
    }, [dispatch]);

    return (
        <div className="timer">
            {mins < 10 && '0'}
            {mins}:{secs < 10 && '0'}
            {secs}
        </div>
    );
}

export default Timer;
