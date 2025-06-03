export type SupportedLang = 'ua' | 'en';

export type LocaleKey =
  | "ANALYTICS_FOR"
  | "DATAPOINTS_LENGTH"
  | "AVG_TEMPERATURE"
  | "STABILITY_COEFF"
  | "TREND"
  | "WARMING"
  | "COOLING"
  | "STABLE"
  | "MAX_VIOLATION"
  | "TEMPERATURE_CHART"
  | "HUMIDITY_CHART"
  | "CLOSE"
  | "STEPS"
  | "EDIT_REFRIGERATOR"
  | "NEW_REFRIGERATOR"
  | "NAME"
  | "LOCATION"
  | "CANCEL"
  | "SAVE_CHANGES"
  | "ADD"
  | "CONFIRM_DELETION"
  | "DELETE_FRIDGE_QUESTION"
  | "DELETE"
  | "PRODUCTS_IN"
  | "CATEGORY"
  | "EXPIRATION"
  | "RFID"
  | "ADD_PRODUCT"
  | "PRODUCT_NAME_REQUIRED"
  | "PRODUCT_CATEGORY_REQUIRED"
  | "EXPIRATION_REQUIRED"
  | "RFID_TAG_REQUIRED"
  | "DELETE_PRODUCT_QUESTION"
  | "MY_REFRIGERATORS"
  | "ADD_REFRIGERATOR"
  | "LOGOUT"
  | "EMPTY_FRIDGE_HINT"
  | "TEMPERATURE"
  | "NO_DATA"
  | "HUMIDITY"
  | "VIEW_ANALYTICS"
  | "PRODUCTS";

export const LOCALES: Record<LocaleKey, { ua: string; en: string }> = {
  ANALYTICS_FOR:      { ua: 'Аналітика для "{{name}}"', en: 'Analytics for "{{name}}"' },
  DATAPOINTS_LENGTH:  { ua: 'Кількість точок даних:', en: 'dataPoints length:' },
  AVG_TEMPERATURE:    { ua: 'Середня температура:', en: 'Average temperature:' },
  STABILITY_COEFF:    { ua: 'Коефіцієнт стабільності:', en: 'Stability coefficient:' },
  TREND:              { ua: 'Тренд:', en: 'Trend:' },
  WARMING:            { ua: 'Потепління ⬆', en: 'Warming ⬆' },
  COOLING:            { ua: 'Похолодання ⬇', en: 'Cooling ⬇' },
  STABLE:             { ua: 'Стабільно', en: 'Stable' },
  MAX_VIOLATION:      { ua: 'Максимальна тривалість порушення:', en: 'Max violation duration:' },
  TEMPERATURE_CHART:  { ua: '📊 Динаміка температури', en: '📊 Temperature over time' },
  HUMIDITY_CHART:     { ua: '💧 Динаміка вологості', en: '💧 Humidity over time' },
  CLOSE:              { ua: 'Закрити', en: 'Close' },
  STEPS:              { ua: 'кроків', en: 'steps' },

  EDIT_REFRIGERATOR:  { ua: 'Редагування холодильника', en: 'Edit refrigerator' },
  NEW_REFRIGERATOR:   { ua: 'Новий холодильник', en: 'New refrigerator' },
  NAME:               { ua: 'Назва', en: 'Name' },
  LOCATION:           { ua: 'Локація', en: 'Location' },
  CANCEL:             { ua: 'Скасувати', en: 'Cancel' },
  SAVE_CHANGES:       { ua: 'Зберегти зміни', en: 'Save changes' },
  ADD:                { ua: 'Додати', en: 'Add' },

  CONFIRM_DELETION:       { ua: 'Підтвердження видалення', en: 'Confirm deletion' },
  DELETE_FRIDGE_QUESTION: { ua: 'Видалити холодильник "{{name}}"?', en: 'Delete refrigerator "{{name}}"?' },
  DELETE:                 { ua: 'Видалити', en: 'Delete' },
  PRODUCTS_IN:            { ua: 'Продукти у "{{name}}"', en: 'Products in "{{name}}"' },
  CATEGORY:               { ua: 'Категорія', en: 'Category' },
  EXPIRATION:             { ua: 'Термін придатності:', en: 'Expiration:' },
  RFID:                   { ua: 'RFID:', en: 'RFID:' },
  ADD_PRODUCT:            { ua: 'Додати продукт', en: 'Add Product' },
  PRODUCT_NAME_REQUIRED:      { ua: 'Назва обов’язкова', en: 'Name is required' },
  PRODUCT_CATEGORY_REQUIRED:  { ua: 'Категорія обов’язкова', en: 'Category is required' },
  EXPIRATION_REQUIRED:        { ua: 'Вкажіть дату', en: 'Specify the date' },
  RFID_TAG_REQUIRED:          { ua: 'Введіть тег типу <strong>RFID1234</strong>', en: 'Enter tag like <strong>RFID1234</strong>' },
  DELETE_PRODUCT_QUESTION:    { ua: 'Видалити продукт "{{name}}"?', en: 'Delete product "{{name}}"?' },

  MY_REFRIGERATORS:      { ua: "Мої холодильники", en: "My refrigerators" },
  ADD_REFRIGERATOR:      { ua: 'Додати холодильник', en: 'Add refrigerator' },
  LOGOUT:                { ua: 'Вийти', en: 'Logout' },
  EMPTY_FRIDGE_HINT:     { ua: 'Щоб почати, додайте холодильник', en: 'To get started, add a refrigerator' },
  TEMPERATURE:           { ua: '🌡 Температура', en: '🌡 Temperature' },
  NO_DATA:               { ua: 'немає даних', en: 'no data' },
  HUMIDITY:              { ua: '💧 Вологість', en: '💧 Humidity' },
  VIEW_ANALYTICS:        { ua: 'Переглянути аналітику', en: 'View analytics' },
  PRODUCTS:              { ua: 'Продукти', en: 'Products' },
};
