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
  var ESC_KEY = window.utils.ESC_KEY;
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

  var onKeydownWhileMessageOpened = function (evt) {
    var successMessageBlock = document.querySelector('.success');
    var errorMessageBlock = document.querySelector('.error');
    var messageBlock;

    if (successMessageBlock) {
      messageBlock = successMessageBlock;
    }

    if (errorMessageBlock) {
      messageBlock = errorMessageBlock;
    }

    if (evt.key === ESC_KEY && messageBlock) {
      messageBlock.remove();
    }

  };

  var onClickWhileMessageOpened = function (evt) {
    var successMessageBlock = document.querySelector('.success');
    var errorMessageBlock = document.querySelector('.error');
    var messageElement;
    var messageText;

    if (successMessageBlock) {
      messageElement = successMessageBlock;
      messageText = messageElement.querySelector('.success__message');
    }

    if (errorMessageBlock) {
      messageElement = errorMessageBlock;
      messageText = messageElement.querySelector('.error__message');
    }

    if (messageElement && evt.target !== messageText) {
      messageElement.remove();
    }
  };

  document.addEventListener('keydown', onKeydownWhileMessageOpened);
  document.addEventListener('click', onClickWhileMessageOpened);

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    saveForm(new FormData(adForm), onFormLoadSuccess, onFormLoadError);
  });

})();
