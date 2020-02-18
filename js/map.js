'use strict';

(function () {
  var createPin = window.pin.create;
  var addPinClickListener = window.pin.addClickListener;
  var MODE_INACTIVE = window.utils.MODE_INACTIVE;
  // Начальные размеры главной метки на карте.
  var MAIN_PIN_INITIAL_WIDTH = 65;
  var MAIN_PIN_INITIAL_HEIGHT = 65;
  var MAIN_PIN_IMAGE_HEIGHT = 62;
  var MAIN_PIN_POINT_HEIGHT = 22;
  var MAIN_PIN_WITH_POINT_HEIGHT = MAIN_PIN_IMAGE_HEIGHT + MAIN_PIN_POINT_HEIGHT;
  var MAX_PINS_NUMBER = 5;
  // Находим блок с картой.
  var map = document.querySelector('.map');

  /**
   * @description Function returns x and y coordinates of the main pin center or main pin point.
   * @param {stiring} mode - Page mode - 'active' or 'inactive'.
   * @param {object} pin - HTML element - main pin of a map.
   * @return {object} - x and y coordinates to put into address field according to the main pin appearance.
   */
  var getAddressCoordinates = function (mode, pin) {
    var x = Math.round(pin.offsetLeft + MAIN_PIN_INITIAL_WIDTH / 2);
    var y = 0;
    if (mode === MODE_INACTIVE) {
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
    var pinsNumber = offers.length > MAX_PINS_NUMBER ? MAX_PINS_NUMBER : offers.length;

    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var mapPinsBlock = document.querySelector('.map__pins');

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pinsNumber; i++) {
      var pin = createPin(offers[i], mapPin);
      addPinClickListener(pin, offers[i], map);
      fragment.appendChild(pin);
    }

    mapPinsBlock.appendChild(fragment);
  };

  window.map = {
    element: map,
    MAIN_PIN_INITIAL_WIDTH: MAIN_PIN_INITIAL_WIDTH,
    MAIN_PIN_WITH_POINT_HEIGHT: MAIN_PIN_WITH_POINT_HEIGHT,
    getAddressCoordinates: getAddressCoordinates,
    renderPins: renderAllMapPins
  };

})();
