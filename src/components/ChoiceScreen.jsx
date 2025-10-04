export default function ChoiceScreen({ onContinue, onTakePrize, currentPrize }) {
  return (
    <div class="end-screen">
      <h1>Вітаємо! Ви відповіли правильно!</h1>
      <h2>Ваш поточний виграш: {currentPrize}</h2>
      <p>Ви можете забрати гроші або продовжити гру.</p>
      <div class="choice-buttons">
        <button onClick={onTakePrize}>Забрати виграш</button>
        <button onClick={onContinue}>Продовжити гру</button>
      </div>
    </div>
  );
}