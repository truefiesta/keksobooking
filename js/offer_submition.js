'use strict';

(function () {
  var adForm = window.adform.element;
  var filtersForm = window.filter.element;
  var saveForm = window.upload.save;
  var showMessage = window.utils.showMessage;
  var deactivatePins = window.page.deactivatePins;
  var deleteOfferCard = window.page.deleteOfferCard;
  var resetMainPinListeners = window.mainPin.resetEventListeners;
  var resetAdForm = window.adform.reset;
  var removeFiltersformListener = window.filter.removeListener;
  var deactivateMapAndForms = window.page.deactivate;
  var SUCCESS_MESSAGE = 'Ваше объявление опубликовано.';

  // Находим шаблоны блоков с сообщением о успешной и неуспешной отправке формы.
  var successTemplate = document.querySelector('#success').content;
  var errorTemplate = document.querySelector('#error').content;

  adForm.addEventListener('reset', function () {
    // Главную метку возвращаем в исходное положение, остальные метки удаляем.
    deactivatePins();
    // Удаляет открытую карточку предложения.
    deleteOfferCard();
    // Восстанавливаем обработчики событий на главной метке.
    resetMainPinListeners();
    // Удаляем слушатели adform.
    resetAdForm();
    // Удаляем слушатель событий формы с фильтрами.
    removeFiltersformListener();
    // Переводим страницу в неактивное состояние.
    deactivateMapAndForms();
  });

  var onFormLoadSuccess = function () {
    showMessage(SUCCESS_MESSAGE, successTemplate);
    adForm.reset();
    filtersForm.reset();
  };

  var onFormLoadError = function (errorMessage) {
    showMessage(errorMessage, errorTemplate);
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    saveForm(new FormData(adForm), onFormLoadSuccess, onFormLoadError);
  });


})();
