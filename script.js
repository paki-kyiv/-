const button = document.getElementById('greetButton');
const greeting = document.getElementById('greeting');

button.addEventListener('click', () => {
  const now = new Date();
  const hours = now.getHours();
  const partOfDay = hours < 12 ? 'утро' : hours < 18 ? 'день' : 'вечер';
  greeting.textContent = `Привет! Хорошего ${partOfDay}!`; 
});
