export const prizePyramid = [
  { id: 1, amount: "Закладка для Біблії" },
  { id: 2, amount: "Браслет з написом 'WWJD'" },
  { id: 3, amount: "Право обрати пісню" },
  { id: 4, amount: "Християнська книга" },
  { id: 5, amount: "Кружка з віршем з Біблії" },
  { id: 6, amount: "Квиток на концерт" },
  { id: 7, amount: "Особлива молитва" },
].reverse();

export const questions = [
  {
    id: 1,
    question: "Як звали перших людей, створених Богом?",
    answers: [
      { text: "Авраам і Сарра", correct: false },
      { text: "Ісаак і Ревекка", correct: false },
      { text: "Адам і Єва", correct: true },
      { text: "Ной і його дружина", correct: false },
    ],
  },
  {
    id: 2,
    question: "Хто переміг велетня Голіафа?",
    answers: [
      { text: "Самсон", correct: false },
      { text: "Давид", correct: true },
      { text: "Мойсей", correct: false },
      { text: "Авраам", correct: false },
    ],
  },
  {
    id: 3,
    question: "Скільки учнів було в Ісуса Христа?",
    answers: [
      { text: "10", correct: false },
      { text: "12", correct: true },
      { text: "11", correct: false },
      { text: "13", correct: false },
    ],
  },
  {
    id: 4,
    question: "Де народився Ісус Христос?",
    answers: [
      { text: "В Єрусалимі", correct: false },
      { text: "В Назареті", correct: false },
      { text: "У Вифлеємі", correct: true },
      { text: "В Єгипті", correct: false },
    ],
  },
  {
    id: 5,
    question: "Яке перше чудо створив Ісус?",
    answers: [
      { text: "Ходіння по воді", correct: false },
      { text: "Зцілення сліпого", correct: false },
      { text: "Перетворення води на вино", correct: true },
      { text: "Воскресіння Лазаря", correct: false },
    ],
  },
  {
    id: 6,
    question: "Хто написав більшість книг Нового Заповіту?",
    answers: [
      { text: "Апостол Петро", correct: false },
      { text: "Апостол Павло", correct: true },
      { text: "Апостол Іван", correct: false },
      { text: "Матвій", correct: false },
    ],
  },
  {
    id: 7,
    question: "Скільки книг у протестантському каноні Біблії?",
    answers: [
      { text: "55", correct: false },
      { text: "77", correct: false },
      { text: "66", correct: true },
      { text: "39", correct: false },
    ],
  },
];