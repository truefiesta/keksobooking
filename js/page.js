'use strict';

(function () {
  // Импорт из других модулей.
  var map = window.map.element;
  var adForm = window.adform.element;
  var getAddressCoordinates = window.map.getAddressCoordinates;
  var setOfferAddress = window.adform.setAddress;
  var hideElement = window.utils.hideElement;
  var disableForm = window.utils.disableFormElements;
  var showElement = window.utils.showElement;
  var enableForm = window.utils.enableFormElements;
  var MODE_INACTIVE = window.utils.MODE_INACTIVE;
  var MODE_ACTIVE = window.utils.MODE_ACTIVE;

  /* --- Положение главной метки и координаты адреса до активации страницы --- */

  // Находим главную метку.
  var mapPinMain = map.querySelector('.map__pin--main');

  // Запоминаем начальное положение главной метки.
  var mainPinInitialPosition = {
    x: mapPinMain.offsetLeft,
    y: mapPinMain.offsetTop,
  };

  // Получаем начальные координаты главной метки, когда у нее нет острого указателя.
  var initialMainPinCoordinates = getAddressCoordinates(MODE_INACTIVE, mapPinMain);

  // Находим поле адреса в форме ad-form.
  var adFormAddress = adForm.querySelector('input[name = address]');

  // Устанавливаем изначальные точки координат в поле адрес (до активации страницы).
  setOfferAddress(MODE_INACTIVE, initialMainPinCoordinates, adFormAddress);

  /* -------------- Для активации страницы -------------- */

  // Получаем начальные координаты главной метки при активации страницы.
  var afterActivationMainPinCoordinates = getAddressCoordinates(MODE_ACTIVE, mapPinMain);

  // Находим fieldsets формы .ad-form.
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  // Находим элементы формы с фильтрами.
  var filtersForm = document.querySelector('.map__filters');
  var filtersFormSelects = filtersForm.querySelectorAll('select');
  var filtersFormFieldsets = filtersForm.querySelectorAll('fieldset');

  // Функция, чтобы убрать метки и вернуть главную метку в исходное положение
  var deactivatePins = function () {
    var allMapPins = map.querySelectorAll('.map__pin');
    for (var pinIndex = 0; pinIndex < allMapPins.length; pinIndex++) {
      if (allMapPins[pinIndex] === mapPinMain) {
        // Переносим главную метку в исходное положение.
        allMapPins[pinIndex].style.left = mainPinInitialPosition.x + 'px';
        allMapPins[pinIndex].style.top = mainPinInitialPosition.y + 'px';
      } else {
        allMapPins[pinIndex].remove();
      }
    }
  };

  var deleteOfferCard = function () {
    var offerCard = map.querySelector('.map__card');
    if (offerCard) {
      offerCard.remove();
    }
  };

  // Переводит страницу в неактивное состояние.
  var deactivatePage = function () {
    hideElement(map, 'map--faded');
    hideElement(adForm, 'ad-form--disabled');
    disableForm(adFormFieldsets);
    disableForm(filtersFormSelects);
    disableForm(filtersFormFieldsets);
    setOfferAddress(MODE_INACTIVE, initialMainPinCoordinates, adFormAddress);
  };

  // Переводит страницу в активное состояние.
  var activatePage = function () {
    showElement(map, 'map--faded');
    showElement(adForm, 'ad-form--disabled');
    enableForm(adFormFieldsets);
    enableForm(filtersFormSelects);
    enableForm(filtersFormFieldsets);
    setOfferAddress(MODE_ACTIVE, afterActivationMainPinCoordinates, adFormAddress);
  };

  // При открытии сайта страница в неактивном состоянии.
  deactivatePage();

  window.page = {
    activate: activatePage,
    deactivate: deactivatePage,
    deactivatePins: deactivatePins,
    deleteOfferCard: deleteOfferCard
  };

})();
