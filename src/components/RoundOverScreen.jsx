export default function RoundOverScreen({ onNextRound, round, prize }) {
  return (
    <div class="end-screen">
      <h1>Вітаємо! Ви завершили раунд {round}!</h1>
      <h2>Ваш гарантований виграш за цей раунд: {prize}</h2>
      <button onClick={onNextRound}>Наступний раунд</button>
    </div>
  );
}