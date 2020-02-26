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
  var resetFiltersForm = window.filter.reset;
  var deactivateMapAndForms = window.page.deactivate;
  var setAdFormActivator = window.mainPin.setAdFormActivator;
  var SUCCESS_MESSAGE = 'Ваше объявление опубликовано.';

  // Находим шаблоны блоков с сообщением о успешной и неуспешной отправке формы.
  var successTemplate = document.querySelector('#success').content;
  var errorTemplate = document.querySelector('#error').content;

  var onFormReset = function () {
    // Главную метку возвращаем в исходное положение, остальные метки удаляем.
    deactivatePins();
    // Удаляет открытую карточку предложения.
    deleteOfferCard();
    // Восстанавливаем обработчики событий на главной метке.
    resetMainPinListeners();
    // Удаляем слушатели adform.
    resetAdForm();
    // Удаляем слушатель событий формы с фильтрами и переводим ее в начальное состояние.
    resetFiltersForm();
    // Переводим страницу в неактивное состояние.
    deactivateMapAndForms();
  };

  var onFormLoadSuccess = function () {
    showMessage(SUCCESS_MESSAGE, successTemplate);
    adForm.reset();
    filtersForm.reset();
    removeAdFormSubmitResetListeners();
  };

  var onFormLoadError = function (errorMessage) {
    showMessage(errorMessage, errorTemplate);
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    saveForm(new FormData(adForm), onFormLoadSuccess, onFormLoadError);
  };

  var addAdFormSubmitResetListeners = function () {
    adForm.addEventListener('reset', onFormReset);
    adForm.addEventListener('submit', onFormSubmit);
  };

  var removeAdFormSubmitResetListeners = function () {
    adForm.removeEventListener('reset', onFormReset);
    adForm.removeEventListener('submit', onFormSubmit);
  };

  // Передаем в качестве коллбэка функцию для добавления слушателей событий submit и reset формы.
  setAdFormActivator(addAdFormSubmitResetListeners);

  window.offerSubmition = {
    addAdFormSubmitResetListeners: addAdFormSubmitResetListeners
  };

})();
