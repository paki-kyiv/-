// Ініціалізація при загрузці сторінки
document.addEventListener('DOMContentLoaded', initializeSite);

async function initializeSite() {
  const data = await loadDataFromFirebase() || getDefaultData();
  updateAllSections(data);

  watchDataChanges((updatedData) => {
    updateAllSections(updatedData);
    console.log('✅ Дані оновилися на сайті!');
  });
}

// Обновить всі секції
function updateAllSections(data) {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  
  categories.forEach(cat => {
    updateCategorySection(cat);
  });

  updateExtras(data);
  updateDeliveryText(data);
  updateWorkingHours(data);
}

// Обновить одну категорію
function updateCategorySection(category) {
  const items = Array.isArray(category?.items) ? category.items : [];
  const sectionId = category.id;
  const section = document.querySelector(`#${sectionId}`);

  if (!section) return;

  // Для таблиць (live, cooked)
  const table = section.querySelector('.price-table tbody');
  if (table) {
    table.innerHTML = '';
    items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.name}</td><td>${item.price}</td>`;
      table.appendChild(row);
    });
  }
}

// Обновить доповнення
function updateExtras(data) {
  const extrasGrid = document.querySelector('#extras .info-grid');
  const extras = Array.isArray(data?.extras) ? data.extras : [];

  if (extrasGrid) {
    extrasGrid.innerHTML = '';
    extras.forEach(item => {
      const article = document.createElement('article');
      article.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p class="price">${item.price}</p>
      `;
      extrasGrid.appendChild(article);
    });
  }
}

// Обновить текст доставки
function updateDeliveryText(data) {
  const deliverySection = document.querySelector('#delivery p');
  if (deliverySection) {
    deliverySection.textContent = data.deliveryText;
  }
}

// Обновить часы роботы
function updateWorkingHours(data) {
  const hoursElement = document.querySelector('.working-hours');
  if (hoursElement) {
    hoursElement.textContent = data.workingHours;
  }
}
