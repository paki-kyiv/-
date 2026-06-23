// Загрузити дані з Firebase
let currentData = null;

async function loadData() {
  const defaultData = getDefaultData();

  try {
    const firebaseData = await loadDataFromFirebase();
    currentData = {
      ...defaultData,
      ...firebaseData,
      live: Array.isArray(firebaseData?.live) ? firebaseData.live : defaultData.live,
      cooked: Array.isArray(firebaseData?.cooked) ? firebaseData.cooked : defaultData.cooked,
      extras: Array.isArray(firebaseData?.extras) ? firebaseData.extras : defaultData.extras,
      mussels: Array.isArray(firebaseData?.mussels) ? firebaseData.mussels : defaultData.mussels,
      recipes: Array.isArray(firebaseData?.recipes) ? firebaseData.recipes : defaultData.recipes,
      categories: Array.isArray(firebaseData?.categories) ? firebaseData.categories : defaultData.categories,
    };
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    currentData = defaultData;
  }

  return currentData;
}

// Зберегти дані в Firebase
async function saveData(data) {
  currentData = data;
  const result = await saveDataToFirebase(data);
  if (result && result.success) {
    showMessage('✅ Дані синхронізовані з хмарою!', 'success');
    return true;
  } else {
    const message = result && result.message ? `: ${result.message}` : '';
    showMessage(`⚠️ Помилка синхронізації${message}`, 'error');
    return false;
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
  const live = Array.isArray(data.live) ? data.live : [];
  const container = document.getElementById('liveContainer');
  container.innerHTML = '';

  live.forEach((item, index) => {
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
  const saved = await saveData(data);
  if (saved) renderLive();
}

// Додати живих раків
async function addLivePrice() {
  const data = await loadData();
  data.live.push({ weight: "", price: "" });
  const saved = await saveData(data);
  if (saved) renderLive();
}

// Рендер варених раків
async function renderCooked() {
  const data = await loadData();
  const cooked = Array.isArray(data.cooked) ? data.cooked : [];
  const container = document.getElementById('cookedContainer');
  container.innerHTML = '';

  cooked.forEach((item, index) => {
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
  const saved = await saveData(data);
  if (saved) renderCooked();
}

// Додати варених раків
async function addCookedPrice() {
  const data = await loadData();
  data.cooked.push({ portion: "", price: "" });
  const saved = await saveData(data);
  if (saved) renderCooked();
}

// Рендер доповнень
async function renderExtras() {
  const data = await loadData();
  const extras = Array.isArray(data.extras) ? data.extras : [];
  const container = document.getElementById('extrasContainer');
  container.innerHTML = '';

  extras.forEach((item, index) => {
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
  const saved = await saveData(data);
  if (saved) renderExtras();
}

// Додати доповнення
async function addExtra() {
  const data = await loadData();
  data.extras.push({ name: "", description: "", price: "" });
  const saved = await saveData(data);
  if (saved) renderExtras();
}

// Рендер категорій
async function renderCategories() {
  const data = await loadData();
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';

  categories.forEach((item, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '1.5rem';
    div.innerHTML = `
      <div style="background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 12px; border-left: 3px solid var(--accent-2);">
        <div class="form-group">
          <label>Назва категорії</label>
          <input type="text" placeholder="Наприклад: Мідії" value="${item.title}" onchange="updateCategory(${index}, 'title', this.value)">
        </div>
        <div class="form-group">
          <label>Фото (URL)</label>
          <input type="text" placeholder="Вставте посилання на фото" value="${item.photo}" onchange="updateCategory(${index}, 'photo', this.value)">
        </div>
        <div class="form-group">
          <label>Опис</label>
          <textarea placeholder="Опишіть категорію..." onchange="updateCategory(${index}, 'description', this.value)">${item.description}</textarea>
        </div>
        <div class="form-group">
          <label>Ціна</label>
          <input type="text" placeholder="Наприклад: від 120 грн" value="${item.price}" onchange="updateCategory(${index}, 'price', this.value)">
        </div>
        <button class="btn-delete" onclick="deleteCategory(${index})">Видалити</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function updateCategory(index, field, value) {
  const data = await loadData();
  data.categories[index][field] = value;
  await saveData(data);
}

async function deleteCategory(index) {
  const data = await loadData();
  data.categories.splice(index, 1);
  const saved = await saveData(data);
  if (saved) renderCategories();
}

async function addCategory() {
  const data = await loadData();
  if (!Array.isArray(data.categories)) data.categories = [];
  data.categories.push({ title: "", photo: "", description: "", price: "" });
  const saved = await saveData(data);
  if (saved) renderCategories();
}

// Рендер мідій
async function renderMussels() {
  const data = await loadData();
  const mussels = Array.isArray(data.mussels) ? data.mussels : [];
  const container = document.getElementById('musselsContainer');
  container.innerHTML = '';

  mussels.forEach((item, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '1.5rem';
    div.innerHTML = `
      <div style="background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 12px; border-left: 3px solid var(--accent-2);">
        <div class="form-group">
          <label>Назва</label>
          <input type="text" placeholder="Наприклад: Мідії в часниковому соусі" value="${item.name}" onchange="updateMussel(${index}, 'name', this.value)">
        </div>
        <div class="form-group">
          <label>Фото (URL)</label>
          <input type="text" placeholder="Вставте посилання на фото" value="${item.photo}" onchange="updateMussel(${index}, 'photo', this.value)">
        </div>
        <div class="form-group">
          <label>Опис</label>
          <textarea placeholder="Опишіть мідії..." onchange="updateMussel(${index}, 'description', this.value)">${item.description}</textarea>
        </div>
        <div class="form-group">
          <label>Ціна</label>
          <input type="text" placeholder="Наприклад: від 120 грн" value="${item.price}" onchange="updateMussel(${index}, 'price', this.value)">
        </div>
        <button class="btn-delete" onclick="deleteMussel(${index})">Видалити</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function updateMussel(index, field, value) {
  const data = await loadData();
  data.mussels[index][field] = value;
  await saveData(data);
}

async function deleteMussel(index) {
  const data = await loadData();
  data.mussels.splice(index, 1);
  const saved = await saveData(data);
  if (saved) renderMussels();
}

async function addMussel() {
  const data = await loadData();
  if (!Array.isArray(data.mussels)) data.mussels = [];
  data.mussels.push({ name: "", photo: "", description: "", price: "" });
  const saved = await saveData(data);
  if (saved) renderMussels();
}

// Рендер рецептів
async function renderRecipes() {
  const data = await loadData();
  const recipes = Array.isArray(data.recipes) ? data.recipes : [];
  const container = document.getElementById('recipesContainer');
  container.innerHTML = '';

  recipes.forEach((item, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '1.5rem';
    div.innerHTML = `
      <div style="background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 12px; border-left: 3px solid var(--accent-2);">
        <div class="form-group">
          <label>Назва</label>
          <input type="text" placeholder="Наприклад: Раки на пиві" value="${item.name}" onchange="updateRecipe(${index}, 'name', this.value)">
        </div>
        <div class="form-group">
          <label>Фото (URL)</label>
          <input type="text" placeholder="Вставте посилання на фото" value="${item.photo}" onchange="updateRecipe(${index}, 'photo', this.value)">
        </div>
        <div class="form-group">
          <label>Опис</label>
          <textarea placeholder="Опишіть рецепт..." onchange="updateRecipe(${index}, 'description', this.value)">${item.description}</textarea>
        </div>
        <div class="form-group">
          <label>Ціна</label>
          <input type="text" placeholder="Наприклад: від 180 грн" value="${item.price}" onchange="updateRecipe(${index}, 'price', this.value)">
        </div>
        <button class="btn-delete" onclick="deleteRecipe(${index})">Видалити</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function updateRecipe(index, field, value) {
  const data = await loadData();
  data.recipes[index][field] = value;
  await saveData(data);
}

async function deleteRecipe(index) {
  const data = await loadData();
  data.recipes.splice(index, 1);
  const saved = await saveData(data);
  if (saved) renderRecipes();
}

async function addRecipe() {
  const data = await loadData();
  if (!Array.isArray(data.recipes)) data.recipes = [];
  data.recipes.push({ name: "", photo: "", description: "", price: "" });
  const saved = await saveData(data);
  if (saved) renderRecipes();
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
  await renderCategories();
  await renderMussels();
  await renderRecipes();

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
