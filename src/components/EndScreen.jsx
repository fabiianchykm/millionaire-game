export default function EndScreen({ earned, onRestart, gameWon }) {
  return (
    <div class="end-screen">
      <h1>{gameWon ? "Вітаємо, ви абсолютний переможець!" : "Гра завершена!"}</h1>
      <h2>Ваш виграш: {earned}</h2>
      <button onClick={onRestart}>Грати знову</button>
    </div>
  );
}
