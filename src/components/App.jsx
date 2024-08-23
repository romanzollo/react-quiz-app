import { useEffect, useReducer } from 'react';

import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';

const initialState = {
    questions: [],

    // 'loading', 'error', 'ready', 'active', 'finished'
    status: 'loading',
    index: 0, // индекс вопроса
    answer: null, // индекс ответа
    points: 0, // количество очков за правильные ответы
    hightscore: 0, // высший балл
};

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload,
                status: 'ready',
            };

        case 'dataFailed':
            return {
                ...state,
                status: 'error',
            };

        case 'start':
            return {
                ...state,
                status: 'active',
            };

        case 'newAnswer':
            // находим нужный вопрос
            const question = state.questions[state.index];

            return {
                ...state,
                answer: action.payload, // индекс выбранного ответа

                // добавляем баллы за правильный ответ
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points,
            };

        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null, // очищаем индекс выбранного ответа
            };

        case 'finish':
            return {
                ...state,
                status: 'finished',
                // вычисляем высший балл за все вопросы
                hightscore:
                    state.points > state.hightscore
                        ? state.points
                        : state.hightscore,
            };

        default:
            throw new Error('Action unknown');
    }
}

function App() {
    const [{ questions, status, index, answer, points, hightscore }, dispatch] =
        useReducer(reducer, initialState);

    // вычисляем производную для количество вопросов
    const numQuestions = questions.length;

    // вычисляем максимальный индекс вопроса
    const maxPossiblePoints = questions.reduce(
        (prev, cur) => prev + cur.points,
        0
    );

    useEffect(() => {
        fetch('http://localhost:8000/questions')
            .then((res) => res.json())
            .then((data) => dispatch({ type: 'dataReceived', payload: data }))
            .catch((err) => dispatch({ type: 'dataFailed' }));
    }, []);

    return (
        <div className="app">
            <Header />

            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}

                {status === 'ready' && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                )}
                {status === 'active' && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            maxPossiblePoints={maxPossiblePoints}
                            answer={answer}
                        />
                        <Question
                            // передаем вопрос по текущему индексу
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <NextButton
                            dispatch={dispatch}
                            answer={answer}
                            index={index}
                            numQuestions={numQuestions}
                        />
                    </>
                )}
                {status === 'finished' && (
                    <FinishScreen
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        hightscore={hightscore}
                    />
                )}
            </Main>
        </div>
    );
}

export default App;
