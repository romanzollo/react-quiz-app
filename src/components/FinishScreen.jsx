function FinishScreen({ points, maxPossiblePoints, hightscore, dispatch }) {
    // процентное соотношение количества баллов и максимального количества баллов
    const percentage = (points / maxPossiblePoints) * 100;

    let emoji;
    if (percentage === 100) emoji = '🥇';
    if (percentage >= 80 && percentage < 100) emoji = '🎉';
    if (percentage >= 50 && percentage < 80) emoji = '😊';
    if (percentage >= 0 && percentage < 50) emoji = '🤨';
    if (percentage === 0) emoji = '🤦‍♂️';

    return (
        <>
            <p className="result">
                <span>{emoji}</span> You scored <strong>{points}</strong> out of{' '}
                {maxPossiblePoints} ({Math.ceil(percentage)}%)
            </p>
            <p className="highscore">(Highscore: {hightscore} points)</p>
            <button
                className="btn btn-ui"
                onClick={() => {
                    dispatch({ type: 'restart' });
                }}
            >
                Restart quiz
            </button>
        </>
    );
}

export default FinishScreen;
