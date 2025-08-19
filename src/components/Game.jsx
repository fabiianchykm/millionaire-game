import { useState, useEffect, useRef, useMemo } from 'preact/hooks';
import { questions, prizePyramid } from '../questions';
import EndScreen from './EndScreen';
import RoundOverScreen from './RoundOverScreen';

const TIMER_DURATION = 60; // 1 хвилина

export default function Game() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [className, setClassName] = useState('answer');
  const [earned, setEarned] = useState("Нічого");
  const [timer, setTimer] = useState(TIMER_DURATION);
  const timeouts = useRef([]);

  // Цей ефект виконається при видаленні компонента, очищаючи всі активні таймери.
  // Це запобігає витокам пам'яті та помилкам, пов'язаним зі спробою
  // оновити стан компонента, якого вже не існує.
  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const { questionInRound, currentRoundNumber } = useMemo(() => {
    const qir = ((questionNumber - 1) % 7) + 1;
    const crn = Math.floor((questionNumber - 1) / 7) + 1;
    return { questionInRound: qir, currentRoundNumber: crn };
  }, [questionNumber]);

  useEffect(() => {
    if (questionInRound > 1) {
      setEarned(prizePyramid.find((m) => m.id === questionInRound - 1).amount);
    } else {
      setEarned("Нічого");
    }
  }, [questionInRound]);

  // Цей ефект відповідає за зворотний відлік таймера.
  // Він запускається, коли гра не на паузі (немає вибраної відповіді) і не закінчена.
  useEffect(() => {
    if (gameOver || selectedAnswer || roundOver) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    // Очищаємо інтервал, коли компонент видаляється або змінюються залежності.
    return () => clearInterval(interval);
  }, [gameOver, selectedAnswer, roundOver]);

  // Цей ефект перевіряє, чи не закінчився час, і завершує гру.
  useEffect(() => {
    if (timer === 0) {
      // Якщо час вийшов, гравець програв. Розраховуємо гарантований виграш.
      if (currentRoundNumber > 1) {
        const guaranteedPrize = prizePyramid.find(p => p.id === 7)?.amount || "Нічого";
        setEarned(guaranteedPrize);
      } else {
        setEarned("Нічого");
      }
      setGameOver(true);
    }
  }, [timer, currentRoundNumber]);

  // Цей ефект скидає таймер при переході на нове питання.
  useEffect(() => {
    setTimer(TIMER_DURATION);
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
        const isLastQuestionOfGame = questionNumber === questions.length;

        if (isLastQuestionOfGame) {
          setEarned(prizePyramid.find((m) => m.id === questionInRound).amount);
          setGameWon(true);
          setGameOver(true);
        } else if (questionInRound === 7) {
          setRoundOver(true);
        } else {
          setQuestionNumber((prev) => prev + 1);
          setSelectedAnswer(null);
        }
      });
    } else {
      // Якщо відповідь неправильна, гравець програв. Розраховуємо гарантований виграш.
      delay(4000, () => {
        if (currentRoundNumber > 1) {
          const guaranteedPrize = prizePyramid.find(p => p.id === 7)?.amount || "Нічого";
          setEarned(guaranteedPrize);
        } else {
          setEarned("Нічого");
        }
        setGameOver(true);
      });
    }
  };

  const handleTakePrize = () => {
    // Якщо гравець забирає виграш на першому питанні нового раунду (після першого),
    // він повинен отримати гарантований приз за попередній раунд.
    if (questionInRound === 1 && currentRoundNumber > 1) {
      const guaranteedPrize = prizePyramid.find(p => p.id === 7)?.amount || "Нічого";
      setEarned(guaranteedPrize);
    }
    // В інших випадках стан `earned` вже містить правильне значення.
    setGameOver(true);
  };

  const handleNextRound = () => {
    setQuestionNumber(prev => prev + 1);
    setSelectedAnswer(null);
    setRoundOver(false);
  };

  const handleRestart = () => {
    // Очищаємо всі активні таймери від попередньої гри
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
 
    // Скидаємо гру до початкового стану, щоб завжди починати з першого питання.
    setQuestionNumber(1);
    setGameWon(false);
    setGameOver(false);
    setRoundOver(false);
    setSelectedAnswer(null);
    setEarned("Нічого");
    setTimer(TIMER_DURATION);
  }

  const currentQuestion = questions.find((q) => q.id === questionNumber);

  return (
    <div class="app">
      {gameOver ? (
        <EndScreen earned={earned} onRestart={handleRestart} gameWon={gameWon} />
      ) : roundOver ? (
        <RoundOverScreen
          onNextRound={handleNextRound}
          round={currentRoundNumber}
          prize={prizePyramid.find(p => p.id === 7).amount}
        />
      ) : (
        <>
          <div class="main">
            <div class="top">
              <div class="timer">{timer}</div>
              <button
                class="take-prize-btn"
                onClick={handleTakePrize}
                // Кнопка неактивна, якщо відповідь обробляється, або на першому питанні першого раунду.
                disabled={selectedAnswer !== null || (questionInRound === 1 && currentRoundNumber === 1)}
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
                <li class={questionInRound === m.id ? 'moneyListItem active' : 'moneyListItem'}>
                  <span class="moneyListItemNumber">{m.id}</span>
                  <span class="moneyListItemAmount">
                    {m.id < questionInRound ? m.amount : 'Сюрприз'}
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
