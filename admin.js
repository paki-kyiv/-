// Загрузити дані з Firebase
let currentData = null;

async function loadData() {
  try {
    if (typeof getDefaultData !== 'function') {
      throw new Error('firebase-config.js не завантажено!');
    }
    
    const defaultData = getDefaultData();

    try {
      const firebaseData = await loadDataFromFirebase();
      currentData = {
        ...defaultData,
        ...firebaseData,
        categories: Array.isArray(firebaseData?.categories) ? firebaseData.categories : defaultData.categories,
        extras: Array.isArray(firebaseData?.extras) ? firebaseData.extras : defaultData.extras,
      };
    } catch (error) {
      console.warn('Firebase недоступен, используем локальные данные:', error);
      currentData = defaultData;
    }
  } catch (error) {
    console.error('Критическая ошибка загрузки:', error);
    alert('⚠️ Ошибка: firebase-config.js не загружен!');
    throw error;
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

// Рендер категорій
async function renderCategories() {
  const data = await loadData();
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';

  categories.forEach((category, catIndex) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.style.marginBottom = '2rem';
    categoryDiv.style.padding = '1.5rem';
    categoryDiv.style.background = 'rgba(0, 0, 0, 0.5)';
    categoryDiv.style.borderRadius = '12px';
    categoryDiv.style.borderLeft = '4px solid var(--accent-2)';

    const titleHtml = `
      <div class="form-group">
        <label>Назва категорії (з іконкою)</label>
        <input type="text" placeholder="Наприклад: 🦞 Живі раки" value="${category.icon} ${category.title}" onchange="updateCategoryTitle(${catIndex}, this.value)">
      </div>
      <div class="form-group">
        <label>ID категорії</label>
        <input type="text" placeholder="Наприклад: live" value="${category.id}" disabled style="opacity: 0.6;">
      </div>
      <div class="form-group">
        <label>Тип відображення</label>
        <select onchange="updateCategoryType(${catIndex}, this.value)" style="padding: 0.75rem; border: 1px solid #333; border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-family: inherit; font-size: 1rem;">
          <option value="table" ${category.type === 'table' ? 'selected' : ''}>Таблиця (для раків)</option>
          <option value="grid" ${category.type === 'grid' ? 'selected' : ''}>Сітка з фото (для рецептів)</option>
        </select>
      </div>
    `;

    let itemsHtml = '<h4 style="margin-top: 1rem;">Елементи:</h4>';
    const items = Array.isArray(category.items) ? category.items : [];
    items.forEach((item, itemIndex) => {
      const isGridType = category.type === 'grid';
      
      let itemInputHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; margin-bottom: 0.75rem;">
          <input type="text" placeholder="Назва" value="${item.name}" onchange="updateCategoryItem(${catIndex}, ${itemIndex}, 'name', this.value)" style="padding: 0.5rem; border-radius: 6px;">
          <input type="text" placeholder="Ціна" value="${item.price}" onchange="updateCategoryItem(${catIndex}, ${itemIndex}, 'price', this.value)" style="padding: 0.5rem; border-radius: 6px;">
          <button class="btn-delete" onclick="deleteCategoryItem(${catIndex}, ${itemIndex})">❌</button>
        </div>
      `;

      if (isGridType) {
        itemInputHtml += `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
            <input type="text" placeholder="URL фото" value="${item.photo || ''}" onchange="updateCategoryItem(${catIndex}, ${itemIndex}, 'photo', this.value)" style="padding: 0.5rem; border-radius: 6px;">
            <textarea placeholder="Опис" onchange="updateCategoryItem(${catIndex}, ${itemIndex}, 'description', this.value)" style="padding: 0.5rem; border-radius: 6px; font-family: inherit;">${item.description || ''}</textarea>
          </div>
        `;
      }

      itemsHtml += itemInputHtml;
    });

    itemsHtml += `<button class="add-item-btn" onclick="addCategoryItem(${catIndex})" style="width: 100%; margin-top: 0.5rem;">+ Додати елемент</button>`;

    const deleteBtn = `<button class="btn-delete" onclick="deleteCategory(${catIndex})" style="width: 100%; margin-top: 1rem;">🗑️ Видалити категорію</button>`;

    categoryDiv.innerHTML = titleHtml + itemsHtml + deleteBtn;
    container.appendChild(categoryDiv);
  });
}

async function updateCategoryTitle(catIndex, newTitle) {
  const data = await loadData();
  const parts = newTitle.trim().split(' ');
  const icon = parts[0];
  const title = parts.slice(1).join(' ');
  data.categories[catIndex].icon = icon;
  data.categories[catIndex].title = title;
  await saveData(data);
  await renderCategories();
}

async function updateCategoryType(catIndex, newType) {
  const data = await loadData();
  data.categories[catIndex].type = newType;
  await saveData(data);
  await renderCategories();
}

async function updateCategoryItem(catIndex, itemIndex, field, value) {
  const data = await loadData();
  data.categories[catIndex].items[itemIndex][field] = value;
  await saveData(data);
}

async function deleteCategoryItem(catIndex, itemIndex) {
  const data = await loadData();
  data.categories[catIndex].items.splice(itemIndex, 1);
  await saveData(data);
  await renderCategories();
}

async function addCategoryItem(catIndex) {
  const data = await loadData();
  if (!Array.isArray(data.categories[catIndex].items)) {
    data.categories[catIndex].items = [];
  }
  data.categories[catIndex].items.push({ name: '', price: '', photo: '', description: '' });
  const saved = await saveData(data);
  if (saved) await renderCategories();
}

async function addCategory() {
  const data = await loadData();
  if (!Array.isArray(data.categories)) data.categories = [];
  const newId = 'cat_' + Date.now();
  data.categories.push({
    id: newId,
    icon: '📦',
    title: 'Нова категорія',
    type: 'table',
    items: [{ name: '', price: '', photo: '', description: '' }]
  });
  const saved = await saveData(data);
  if (saved) await renderCategories();
}

async function deleteCategory(catIndex) {
  if (confirm('Видалити цю категорію?')) {
    const data = await loadData();
    data.categories.splice(catIndex, 1);
    const saved = await saveData(data);
    if (saved) await renderCategories();
  }
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

async function updateExtra(index, field, value) {
  const data = await loadData();
  data.extras[index][field] = value;
  await saveData(data);
}

async function deleteExtra(index) {
  const data = await loadData();
  data.extras.splice(index, 1);
  const saved = await saveData(data);
  if (saved) await renderExtras();
}

async function addExtra() {
  const data = await loadData();
  data.extras.push({ name: '', description: '', price: '' });
  const saved = await saveData(data);
  if (saved) await renderExtras();
}

// Зберегти всі зміни і показати повідомлення
async function saveAllChanges() {
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
  try {
    await renderCategories();
    await renderExtras();

    const data = await loadData();
    document.getElementById('deliveryText').value = data.deliveryText || '';
    document.getElementById('workingHours').value = data.workingHours || '';
    
    console.log('✅ Адміпанель завантажена успішно!');
  } catch (error) {
    console.error('❌ Ошибка инициализации админ-панели:', error);
    alert('❌ Ошибка загрузки админ-панели. Проверьте консоль (F12)');
  }
}

// Ініціалізація при загрузці
document.addEventListener('DOMContentLoaded', renderAll);

// Слухати зміни з інших вкладок/пристроїв в реальному часі
document.addEventListener('DOMContentLoaded', () => {
  if (typeof watchDataChanges !== 'undefined') {
    watchDataChanges(() => {
      console.log('ℹ️ Дані оновилися на іншому пристрої, перезавантажуємо...');
      renderAll();
    });
  }
});
