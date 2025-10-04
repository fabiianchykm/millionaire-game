import { useState, useEffect, useRef, useMemo } from 'preact/hooks';
import { questions, prizePyramid } from '../questions';
import EndScreen from './EndScreen';
import RoundOverScreen from './RoundOverScreen';
import ChoiceScreen from './ChoiceScreen';

const TIMER_DURATION = 60; // 1 хвилина

// Функція для перемішування масиву (алгоритм тасування Фішера-Єтса)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Game() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showChoiceScreen, setShowChoiceScreen] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [className, setClassName] = useState('answer');
  const [guaranteedWinnings, setGuaranteedWinnings] = useState('Нічого');
  const [endReason, setEndReason] = useState(null); // 'loss', 'timeout', 'take_prize', 'win'
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const timeouts = useRef([]);
  // Створюємо перемішаний список питань при першому рендері
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleArray(questions));

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

  // Цей ефект перевіряє, чи не закінчився час, і завершує гру.
  useEffect(() => {
    if (timer === 0) {
      // Якщо час вийшов, гравець програє. Його виграш - це остання гарантована сума.
      setEndReason('timeout');
      setGameOver(true);
    }
  }, [timer]);

  // Цей ефект відповідає за зворотний відлік таймера.
  // Він запускається, коли гра не на паузі (немає вибраної відповіді) і не закінчена.
  useEffect(() => {
    if (gameOver || selectedAnswer || roundOver || showChoiceScreen) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    // Очищаємо інтервал, коли компонент видаляється або змінюються залежності.
    return () => clearInterval(interval); // eslint-disable-line
  }, [gameOver, selectedAnswer, roundOver, showChoiceScreen]);

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
      delay(5000, () => {
        const isLastQuestionOfGame = questionNumber === questions.length;

        if (isLastQuestionOfGame) {
          setEndReason('win');
          setGameWon(true);
          setGameOver(true);
        } else {
          setShowChoiceScreen(true);
        }
      });
    } else {
      // Якщо відповідь неправильна, гравець програє.
      // Його виграш - це гарантована сума з попереднього раунду.
      delay(5000, () => {
        setEndReason('loss');
        setGameOver(true);
      });
    }
  };

  const handleTakePrize = () => {
    // Гравець забирає виграш за попереднє правильно відповінене питання.
    setEndReason('take_prize');
    setGameOver(true);
    setShowChoiceScreen(false);
  };

  const handleContinueGame = () => {
    setShowChoiceScreen(false);

    const prizeForThisQuestion = prizePyramid.find(
      (m) => m.id === questionInRound
    )?.amount;

    if (questionInRound === 7) {
      if (prizeForThisQuestion) {
        setGuaranteedWinnings(prizeForThisQuestion);
      }
      setRoundOver(true);
    } else {
      setQuestionNumber((prev) => prev + 1);
      setSelectedAnswer(null);
    }
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

    // Перемішуємо питання для нової гри
    setShuffledQuestions(shuffleArray(questions));

    // Визначаємо, з якого питання починати наступну гру.
    // Це буде початок наступного раунду для нового гравця.
    const nextRoundStartsAt = currentRoundNumber * 7 + 1;

    if (gameWon || nextRoundStartsAt > questions.length) {
      // Якщо гру повністю виграно або всі раунди пройдено, починаємо з самого початку.
      setQuestionNumber(1);
    } else {
      // Інакше, починаємо з наступного раунду для нового гравця.
      setQuestionNumber(nextRoundStartsAt);
    }

    setGameWon(false);
    setGameOver(false);
    setRoundOver(false);
    setShowChoiceScreen(false);
    setSelectedAnswer(null);
    setEndReason(null);
    setGuaranteedWinnings('Нічого');
    setTimer(TIMER_DURATION);
  };

  // Беремо питання з перемішаного масиву за індексом
  const currentQuestion = shuffledQuestions[questionNumber - 1];

  const finalPrize = useMemo(() => {
    if (!gameOver) return 'Нічого';

    if (endReason === 'loss' || endReason === 'timeout') {
      return 'Нічого';
    }

    if (endReason === 'take_prize') {
      // При "забрати приз" гравець отримує виграш за останнє правильне питання
      const currentPrize = prizePyramid.find(p => p.id === questionInRound)?.amount;
      return currentPrize || guaranteedWinnings;
    }

    if (endReason === 'win') {
      return prizePyramid.find(p => p.id === 7)?.amount || guaranteedWinnings;
    }

    return 'Нічого';
  }, [gameOver, endReason, questionInRound, guaranteedWinnings]);
  
  const prizeForChoiceScreen = useMemo(() => {
    return prizePyramid.find(p => p.id === questionInRound)?.amount || 'Нічого';
  }, [questionInRound]);

  return (
    <div class="app">
      {gameOver ? (
        <EndScreen earned={finalPrize} onRestart={handleRestart} gameWon={gameWon} />
      ) : showChoiceScreen ? (
        <ChoiceScreen
          onContinue={handleContinueGame}
          onTakePrize={handleTakePrize}
          currentPrize={prizeForChoiceScreen} />
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