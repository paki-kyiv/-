// Стандартні дані
const defaultData = {
  live: [
    { weight: "500 г", price: "450 грн" },
    { weight: "1 кг", price: "850 грн" },
    { weight: "2 кг", price: "1600 грн" }
  ],
  cooked: [
    { portion: "1 кг", price: "1500 грн" },
    { portion: "3 кг", price: "4000 грн" },
    { portion: "5 кг", price: "6000 грн" }
  ],
  extras: [
    { name: "Пиво", description: "Холодне пиво до раків. Відмінний варіант для компанії.", price: "від 60 грн за пляшку" },
    { name: "Закуски", description: "До пива та раків: солоні крекери, горішки, лимон.", price: "від 40 грн" },
    { name: "Риба", description: "Рибні страви та свіжа охолоджена риба на додаток до раків.", price: "від 120 грн" }
  ],
  deliveryText: "Доставка по Києву 250 грн при замовленні від 3 кг варених або 5 живих — доставка безкоштовно.",
  workingHours: "Працюємо щодня з 10:00 до 20:00"
};

// Загрузити дані з localStorage або використати стандартні
function loadData() {
  const saved = localStorage.getItem('siteData');
  return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultData));
}

// Зберегти дані в localStorage
function saveData(data) {
  localStorage.setItem('siteData', JSON.stringify(data));
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
function renderLive() {
  const data = loadData();
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
function updateLive(index, field, value) {
  const data = loadData();
  data.live[index][field] = value;
  saveData(data);
}

// Видалити живих раків
function deleteLive(index) {
  const data = loadData();
  data.live.splice(index, 1);
  saveData(data);
  renderLive();
}

// Додати живих раків
function addLivePrice() {
  const data = loadData();
  data.live.push({ weight: "", price: "" });
  saveData(data);
  renderLive();
}

// Рендер варених раків
function renderCooked() {
  const data = loadData();
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
function updateCooked(index, field, value) {
  const data = loadData();
  data.cooked[index][field] = value;
  saveData(data);
}

// Видалити варених раків
function deleteCooked(index) {
  const data = loadData();
  data.cooked.splice(index, 1);
  saveData(data);
  renderCooked();
}

// Додати варених раків
function addCookedPrice() {
  const data = loadData();
  data.cooked.push({ portion: "", price: "" });
  saveData(data);
  renderCooked();
}

// Рендер доповнень
function renderExtras() {
  const data = loadData();
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
function updateExtra(index, field, value) {
  const data = loadData();
  data.extras[index][field] = value;
  saveData(data);
}

// Видалити доповнення
function deleteExtra(index) {
  const data = loadData();
  data.extras.splice(index, 1);
  saveData(data);
  renderExtras();
}

// Додати доповнення
function addExtra() {
  const data = loadData();
  data.extras.push({ name: "", description: "", price: "" });
  saveData(data);
  renderExtras();
}

// Зберегти всі зміни і показати повідомлення
function saveAllChanges() {
  // Оновити тексти
  const data = loadData();
  data.deliveryText = document.getElementById('deliveryText').value;
  data.workingHours = document.getElementById('workingHours').value;
  saveData(data);

  showMessage('✅ Усі зміни успішно збережені!', 'success');

  // Перезавантажити основний сайт якщо він відкритий
  const mainWindow = window.opener;
  if (mainWindow) {
    mainWindow.location.reload();
  }
}

// Повернути стандартні ціни
function resetToDefaults() {
  if (confirm('Ви впевнені? Усі ціни будуть повернені до стандартних.')) {
    saveData(JSON.parse(JSON.stringify(defaultData)));
    renderAll();
    showMessage('✅ Стандартні ціни відновлені!', 'success');
  }
}

// Рендер все
function renderAll() {
  renderLive();
  renderCooked();
  renderExtras();

  const data = loadData();
  document.getElementById('deliveryText').value = data.deliveryText;
  document.getElementById('workingHours').value = data.workingHours;
}

// Ініціалізація при загрузці
document.addEventListener('DOMContentLoaded', renderAll);
