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
function loadSiteData() {
  const saved = localStorage.getItem('siteData');
  return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultData));
}

// Ініціалізація при загрузці сторінки
document.addEventListener('DOMContentLoaded', initializeSite);

function initializeSite() {
  updatePricesTables();
  updateExtras();
  updateDeliveryText();
  updateWorkingHours();
}

// Обновить таблицы цен
function updatePricesTables() {
  const data = loadSiteData();

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
function updateExtras() {
  const data = loadSiteData();
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
function updateDeliveryText() {
  const data = loadSiteData();
  const deliverySection = document.querySelector('#delivery p');
  if (deliverySection) {
    deliverySection.textContent = data.deliveryText;
  }
}

// Обновить часы роботы
function updateWorkingHours() {
  const data = loadSiteData();
  const hoursElement = document.querySelector('.working-hours');
  if (hoursElement) {
    hoursElement.textContent = data.workingHours;
  }
}
