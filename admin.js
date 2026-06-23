// Загрузити дані з Firebase
let currentData = null;

async function loadData() {
  try {
    currentData = await loadDataFromFirebase();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    currentData = getDefaultData();
  }
  return currentData;
}

// Зберегти дані в Firebase
async function saveData(data) {
  currentData = data;
  const success = await saveDataToFirebase(data);
  if (success) {
    showMessage('✅ Дані синхронізовані з хмарою!', 'success');
  } else {
    showMessage('⚠️ Помилка синхронізації. Дані збережені локально.', 'error');
  }
}

// Показати повідомлення
function showMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = `message show ${type}`;
  setTimeout(() => {
    msg.classList.remove('show');
  }, 3000);
}

// Рендер живих раків
async function renderLive() {
  const data = await loadData();
  const container = document.getElementById('liveContainer');
  container.innerHTML = '';

  data.live.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'price-row';
    row.innerHTML = `
      <div>
        <label>Вага</label>
        <input type="text" placeholder="Наприклад: 500 г" value="${item.weight}" onchange="updateLive(${index}, 'weight', this.value)">
      </div>
      <div>
        <label>Ціна</label>
        <input type="text" placeholder="Наприклад: 450 грн" value="${item.price}" onchange="updateLive(${index}, 'price', this.value)">
      </div>
      <button class="btn-delete" onclick="deleteLive(${index})">Видалити</button>
    `;
    container.appendChild(row);
  });
}

// Обновить живых раков
async function updateLive(index, field, value) {
  const data = await loadData();
  data.live[index][field] = value;
  await saveData(data);
}

// Видалити живих раків
async function deleteLive(index) {
  const data = await loadData();
  data.live.splice(index, 1);
  await saveData(data);
  renderLive();
}

// Додати живих раків
async function addLivePrice() {
  const data = await loadData();
  data.live.push({ weight: "", price: "" });
  await saveData(data);
  renderLive();
}

// Рендер варених раків
async function renderCooked() {
  const data = await loadData();
  const container = document.getElementById('cookedContainer');
  container.innerHTML = '';

  data.cooked.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'price-row';
    row.innerHTML = `
      <div>
        <label>Порція</label>
        <input type="text" placeholder="Наприклад: 1 кг" value="${item.portion}" onchange="updateCooked(${index}, 'portion', this.value)">
      </div>
      <div>
        <label>Ціна</label>
        <input type="text" placeholder="Наприклад: 1500 грн" value="${item.price}" onchange="updateCooked(${index}, 'price', this.value)">
      </div>
      <button class="btn-delete" onclick="deleteCooked(${index})">Видалити</button>
    `;
    container.appendChild(row);
  });
}

// Обновить варених раків
async function updateCooked(index, field, value) {
  const data = await loadData();
  data.cooked[index][field] = value;
  await saveData(data);
}

// Видалити варених раків
async function deleteCooked(index) {
  const data = await loadData();
  data.cooked.splice(index, 1);
  await saveData(data);
  renderCooked();
}

// Додати варених раків
async function addCookedPrice() {
  const data = await loadData();
  data.cooked.push({ portion: "", price: "" });
  await saveData(data);
  renderCooked();
}

// Рендер доповнень
async function renderExtras() {
  const data = await loadData();
  const container = document.getElementById('extrasContainer');
  container.innerHTML = '';

  data.extras.forEach((item, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '1.5rem';
    div.innerHTML = `
      <div style="background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 12px; border-left: 3px solid var(--accent-2);">
        <div class="form-group">
          <label>Назва</label>
          <input type="text" placeholder="Наприклад: Пиво" value="${item.name}" onchange="updateExtra(${index}, 'name', this.value)">
        </div>
        <div class="form-group">
          <label>Опис</label>
          <textarea placeholder="Опишіть продукт..." onchange="updateExtra(${index}, 'description', this.value)">${item.description}</textarea>
        </div>
        <div class="form-group">
          <label>Ціна</label>
          <input type="text" placeholder="Наприклад: від 60 грн за пляшку" value="${item.price}" onchange="updateExtra(${index}, 'price', this.value)">
        </div>
        <button class="btn-delete" onclick="deleteExtra(${index})">Видалити</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Обновить доповнення
async function updateExtra(index, field, value) {
  const data = await loadData();
  data.extras[index][field] = value;
  await saveData(data);
}

// Видалити доповнення
async function deleteExtra(index) {
  const data = await loadData();
  data.extras.splice(index, 1);
  await saveData(data);
  renderExtras();
}

// Додати доповнення
async function addExtra() {
  const data = await loadData();
  data.extras.push({ name: "", description: "", price: "" });
  await saveData(data);
  renderExtras();
}

// Зберегти всі зміни і показати повідомлення
async function saveAllChanges() {
  // Оновити тексти
  const data = await loadData();
  data.deliveryText = document.getElementById('deliveryText').value;
  data.workingHours = document.getElementById('workingHours').value;
  await saveData(data);
}

// Повернути стандартні ціни
async function resetToDefaults() {
  if (confirm('Ви впевнені? Усі ціни будуть повернені до стандартних.')) {
    const defaultData = getDefaultData();
    await saveData(defaultData);
    renderAll();
    showMessage('✅ Стандартні ціни відновлені!', 'success');
  }
}

// Рендер все
async function renderAll() {
  await renderLive();
  await renderCooked();
  await renderExtras();

  const data = await loadData();
  document.getElementById('deliveryText').value = data.deliveryText;
  document.getElementById('workingHours').value = data.workingHours;
}

// Ініціалізація при загрузці
document.addEventListener('DOMContentLoaded', renderAll);

// Слухати зміни з інших вкладок/пристроїв в реальному часі
if (typeof watchDataChanges !== 'undefined') {
  watchDataChanges(() => {
    console.log('Дані оновилися на іншому пристрої, перезавантажуємо...');
    renderAll();
  });
}
