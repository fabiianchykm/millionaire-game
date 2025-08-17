import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { questions, prizePyramid } from '../questions';
import EndScreen from './EndScreen';

export default function Game() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState('answer');
  const [earned, setEarned] = useState("Нічого");

  useEffect(() => {
    if (questionNumber > 1) {
      setEarned(prizePyramid.find((m) => m.id === questionNumber - 1).amount);
    }
  }, [questionNumber]);

  const delay = (duration, callback) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const handleClick = (a) => {
    setSelectedAnswer(a);
    setClassName('answer active');
    delay(2000, () => {
      setClassName(a.correct ? 'answer correct' : 'answer wrong');
    });

    delay(4000, () => {
      if (a.correct) {
        if (questionNumber === questions.length) {
            setGameOver(true);
            setEarned(prizePyramid.find((m) => m.id === questionNumber).amount);
        } else {
            setQuestionNumber((prev) => prev + 1);
            setSelectedAnswer(null);
        }
      } else {
        setGameOver(true);
      }
    });
  };

  const handleRestart = () => {
    setQuestionNumber(1);
    setGameOver(false);
    setSelectedAnswer(null);
    setEarned("Нічого");
  }

  const currentQuestion = questions.find((q) => q.id === questionNumber);

  return (
    <div class="app">
      {gameOver ? (
        <EndScreen earned={earned} onRestart={handleRestart} />
      ) : (
        <>
          <div class="main">
            <div class="top">
              <div class="timer">30</div>
            </div>
            <div class="bottom">
              <div class="millionaire">
                <div class="question">{currentQuestion?.question}</div>
                <div class="answers">
                  {currentQuestion?.answers.map((a) => (
                    <div
                      class={selectedAnswer === a ? className : 'answer'}
                      onClick={() => !selectedAnswer && handleClick(a)}
                    >
                      {a.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div class="pyramid">
            <ul class="moneyList">
              {prizePyramid.map((m) => (
                <li class={questionNumber === m.id ? 'moneyListItem active' : 'moneyListItem'}>
                  <span class="moneyListItemNumber">{m.id}</span>
                  <span class="moneyListItemAmount">{m.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}