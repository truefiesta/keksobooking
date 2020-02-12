'use strict';

(function () {
  // Начальные размеры главной метки на карте.
  var MAIN_PIN_INITIAL_WIDTH = 65;
  var MAIN_PIN_INITIAL_HEIGHT = 65;
  var MAIN_PIN_IMAGE_HEIGHT = 62;
  var MAIN_PIN_POINT_HEIGHT = 22;
  var MAIN_PIN_WITH_POINT_HEIGHT = MAIN_PIN_IMAGE_HEIGHT + MAIN_PIN_POINT_HEIGHT;

  /**
   * @description Function returns x and y coordinates of the main pin.
   * @param {stiring} mode - Page mode - 'active' or 'inactive'.
   * @param {object} pin - HTML element - main pin of a map.
   * @return {object} - x and y coordinates of main pin.
   */
  var getMainPinCoordinates = function (mode, pin) {
    var x = Math.round(pin.offsetLeft + MAIN_PIN_INITIAL_WIDTH / 2);
    var y = 0;
    if (mode === window.utils.MODE_INACTIVE) {
      y = Math.round(pin.offsetTop + MAIN_PIN_INITIAL_HEIGHT / 2);
    } else {
      y = Math.round(pin.offsetTop + MAIN_PIN_WITH_POINT_HEIGHT);
    }

    return {x: x, y: y};
  };

  /**
   * @description Function renders all map pins in the HTML block with a class 'map__pins'.
   * @param {array} offers - An array of offer objects;
   */
  var renderAllMapPins = function (offers) {
    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var mapPinsBlock = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      var pin = window.pin.create(offers[i], mapPin);
      window.pin.addClickListener(pin, offers[i], map);
      fragment.appendChild(pin);
    }

    mapPinsBlock.appendChild(fragment);
  };

  // Переводит страницу в неактивное состояние.
  var deactivatePage = function (mapElement, formElement, formFielsets) {
    window.utils.hideElement(mapElement, 'map--faded');
    window.utils.hideElement(formElement, 'ad-form--disabled');
    window.form.disable(formFielsets);
  };

  // Переводит страницу в активное состояние.
  var activatePage = function (mapElement, formElement, formFielsets) {
    window.utils.showElement(mapElement, 'map--faded');
    window.utils.showElement(formElement, 'ad-form--disabled');
    window.form.enable(formFielsets);
  };

  // Находим блок с картой.
  var map = document.querySelector('.map');
  // Находим главную метку.
  var mapPinMain = map.querySelector('.map__pin--main');

  // Получаем начальные координаты главной метки, когда у него нет острого указателя.
  var initialMainPinCoordinates = getMainPinCoordinates(window.utils.MODE_INACTIVE, mapPinMain);

  // Находим форму ad-form.
  var adForm = document.querySelector('.ad-form');
  // Находим поле адреса в форме ad-form.
  var adFormAddress = adForm.querySelector('input[name = address]');

  // Устанавливаем изначальные точки координат в поле адрес. Это точка центра главной метки карты до активации карты. То есть главная метка карты в этот момент является кругом без острого указателя.
  window.form.setAddress(initialMainPinCoordinates, adFormAddress);

  // Получаем начальные координаты главной метки при активации страницы. То есть у метки уже есть указатель.
  var afterActivationMainPinCoordinates = getMainPinCoordinates(window.utils.MODE_ACTIVE, mapPinMain);
  // Находим fieldsets формы .ad-form.
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0 && (map.classList.contains('map--faded'))) {
      activatePage(map, adForm, adFormFieldsets);
      renderAllMapPins(window.data.offers);
      window.form.setAddress(afterActivationMainPinCoordinates, adFormAddress);
    }
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      activatePage(map, adForm, adFormFieldsets);
      renderAllMapPins(window.data.offers);
      window.form.setAddress(afterActivationMainPinCoordinates, adFormAddress);
    }
  });

  // Переводим страницу в неактивное состояние.
  deactivatePage(map, adForm, adFormFieldsets);

})();
