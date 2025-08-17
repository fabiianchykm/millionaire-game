import { useState, useEffect, useRef } from 'preact/hooks';
import { questions, prizePyramid } from '../questions';
import EndScreen from './EndScreen';

export default function Game() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState('answer');
  const [earned, setEarned] = useState("Нічого");
  const [timer, setTimer] = useState(30);
  const timeouts = useRef([]);

  // Цей ефект виконається при видаленні компонента, очищаючи всі активні таймери.
  // Це запобігає витокам пам'яті та помилкам, пов'язаним зі спробою
  // оновити стан компонента, якого вже не існує.
  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (questionNumber > 1) {
      setEarned(prizePyramid.find((m) => m.id === questionNumber - 1).amount);
    }
  }, [questionNumber]);

  // Цей ефект відповідає за зворотний відлік таймера.
  // Він запускається, коли гра не на паузі (немає вибраної відповіді) і не закінчена.
  useEffect(() => {
    if (gameOver || selectedAnswer) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    // Очищаємо інтервал, коли компонент видаляється або змінюються залежності.
    return () => clearInterval(interval);
  }, [gameOver, selectedAnswer]);

  // Цей ефект перевіряє, чи не закінчився час, і завершує гру.
  useEffect(() => {
    if (timer === 0) {
      setGameOver(true);
    }
  }, [timer]);

  // Цей ефект скидає таймер на 30 секунд при переході на нове питання.
  useEffect(() => {
    setTimer(30);
  }, [questionNumber]);

  const delay = (duration, callback) => {
    const timeoutId = setTimeout(() => {
      callback();
    }, duration);
    timeouts.current.push(timeoutId);
  };

  const handleClick = (a) => {
    setSelectedAnswer(a);
    setClassName('answer active');
    delay(2000, () => {
      setClassName(a.correct ? 'answer correct' : 'answer wrong');
    });

    if (a.correct) {
      delay(4000, () => {
        if (questionNumber === questions.length) {
          setGameOver(true);
          setEarned(prizePyramid.find((m) => m.id === questionNumber).amount);
        } else {
          setQuestionNumber((prev) => prev + 1);
          setSelectedAnswer(null);
        }
      });
    } else {
      delay(5000, () => {
        setGameOver(true);
      });
    }
  };

  const handleTakePrize = () => {
    setGameOver(true);
  };

  const handleRestart = () => {
    // Очищаємо всі активні таймери від попередньої гри
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setQuestionNumber(1);
    setGameOver(false);
    setSelectedAnswer(null);
    setEarned("Нічого");
    setTimer(30);
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
              <div class="timer">{timer}</div>
              <button
                class="take-prize-btn"
                onClick={handleTakePrize}
                disabled={selectedAnswer !== null || questionNumber === 1}
              >
                Забрати виграш
              </button>
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
                  <span class="moneyListItemAmount">
                    {m.id < questionNumber ? m.amount : 'Сюрприз'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
