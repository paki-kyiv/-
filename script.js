// Ініціалізація при загрузці сторінки
document.addEventListener('DOMContentLoaded', initializeSite);

async function initializeSite() {
  // Спочатку завантажуємо дані з Firebase
  const data = await loadDataFromFirebase();
  updatePricesTables(data);
  updateExtras(data);
  updateDeliveryText(data);
  updateWorkingHours(data);

  // Потім слухаємо зміни в реальному часі
  watchDataChanges((updatedData) => {
    updatePricesTables(updatedData);
    updateExtras(updatedData);
    updateDeliveryText(updatedData);
    updateWorkingHours(updatedData);
    console.log('✅ Дані оновилися на сайті!');
  });
}

// Обновить таблицы цен
function updatePricesTables(data) {
  // Живі раки
  const liveTable = document.querySelector('#live .price-table tbody');
  if (liveTable) {
    liveTable.innerHTML = '';
    data.live.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.weight}</td><td>${item.price}</td>`;
      liveTable.appendChild(row);
    });
  }

  // Варені раки
  const cookedTable = document.querySelector('#cooked .price-table tbody');
  if (cookedTable) {
    cookedTable.innerHTML = '';
    data.cooked.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.portion}</td><td>${item.price}</td>`;
      cookedTable.appendChild(row);
    });
  }
}

// Обновить доповнення
function updateExtras(data) {
  const extrasGrid = document.querySelector('#extras .info-grid');

  if (extrasGrid) {
    extrasGrid.innerHTML = '';
    data.extras.forEach(item => {
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
