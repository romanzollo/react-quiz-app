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
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION = 10;

const initialState = {
    questions: [],

    // 'loading', 'error', 'ready', 'active', 'finished'
    status: 'loading',
    index: 0, // индекс вопроса
    answer: null, // индекс ответа
    points: 0, // количество очков за правильные ответы
    hightscore: 0, // высший балл
    secondsRemaining: null,
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
                // вычисляем количество вопросов и прибавляем количество секунд за вопрос
                secondsRemaining: state.questions.length * SECS_PER_QUESTION,
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

        case 'restart':
            return {
                ...initialState,
                questions: state.questions,
                hightscore: state.hightscore,
                status: 'ready',
            };

        case 'secondsRemaining':
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                // завершаем тест, если время вышло
                status:
                    state.secondsRemaining === 0 ? 'finished' : state.status,
            };

        default:
            throw new Error('Action unknown');
    }
}

function App() {
    const [
        {
            questions,
            status,
            index,
            answer,
            points,
            hightscore,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    // вычисляем производную для количество вопросов
    const numQuestions = questions.length;

    // вычисляем максимальный индекс вопроса
    const maxPossiblePoints = questions.reduce(
        (prev, cur) => prev + cur.points,
        0
    );

    useEffect(() => {
        fetch('https://json-server-vercel-six-roan.vercel.app/questions')
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
                        <Footer>
                            <Timer
                                dispatch={dispatch}
                                secondsRemaining={secondsRemaining}
                            />
                            <NextButton
                                dispatch={dispatch}
                                answer={answer}
                                index={index}
                                numQuestions={numQuestions}
                            />
                        </Footer>
                    </>
                )}
                {status === 'finished' && (
                    <FinishScreen
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        hightscore={hightscore}
                        dispatch={dispatch}
                    />
                )}
            </Main>
        </div>
    );
}

export default App;
