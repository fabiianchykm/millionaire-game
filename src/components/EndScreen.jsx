import { h } from 'preact';

export default function EndScreen({ earned, onRestart }) {
  return (
    <div class="end-screen">
      <h1>Гра завершена!</h1>
      <button onClick={onRestart}>Грати знову</button>
    </div>
  );
}
