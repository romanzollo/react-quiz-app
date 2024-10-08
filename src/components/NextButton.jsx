import { useQuiz } from '../hooks/useQuiz';

function NextButton() {
    const { dispatch, answer, index, numQuestions } = useQuiz();

    if (answer === null) return;

    // показываем кнопку "Next" только если вопросы не закончились
    if (index < numQuestions - 1) {
        return (
            <button
                className="btn btn-ui"
                onClick={() => {
                    dispatch({ type: 'nextQuestion' });
                }}
            >
                Next
            </button>
        );
    }

    // если вопросы закончились показываем кнопку "Finish"
    if (index === numQuestions - 1) {
        return (
            <button
                className="btn btn-ui"
                onClick={() => {
                    dispatch({ type: 'finish' });
                }}
            >
                Finish
            </button>
        );
    }
}

export default NextButton;
