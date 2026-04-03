export default function ChoiceScreen({ onContinue, onTakePrize, currentPrize }) {
  return (
    <div class="choice-overlay">
      <div class="choice-popup">
        <h1>Вітаємо! </h1>
        <h2>Ваш поточний виграш: <div class="choice-prize">{currentPrize}</div></h2>
        <p>Ви можете забрати або продовжити гру.</p>
        <div class="choice-buttons">
          <button onClick={onTakePrize}>Забрати виграш</button>
          <button onClick={onContinue}>Продовжити гру</button>
        </div>
      </div>
    </div>
  );
}