'use strict';

(function () {
  // Импорт из других модулей.
  // var generateOffers = window.data.generate;
  var loadOffers = window.upload.load;
  // var showMessage = window.utils.showMessage;
  var hideElement = window.utils.hideElement;
  var disableForm = window.form.disable;
  var showElement = window.utils.showElement;
  var enableForm = window.form.enable;
  var createPin = window.pin.create;
  var setOfferAddress = window.form.setAddress;
  var addPinClickListener = window.pin.addClickListener;
  var MODE_INACTIVE = window.utils.MODE_INACTIVE;
  var MODE_ACTIVE = window.utils.MODE_ACTIVE;
  var ENTER_KEY = window.utils.ENTER_KEY;
  // Начальные размеры главной метки на карте.
  var MAIN_PIN_INITIAL_WIDTH = 65;
  var MAIN_PIN_INITIAL_HEIGHT = 65;
  var MAIN_PIN_IMAGE_HEIGHT = 62;
  var MAIN_PIN_POINT_HEIGHT = 22;
  var MAIN_PIN_WITH_POINT_HEIGHT = MAIN_PIN_IMAGE_HEIGHT + MAIN_PIN_POINT_HEIGHT;
  var ADDRESS_VERTICAL_COORD_MIN = 130;
  var ADDRESS_VERTICAL_COORD_MAX = 630;
  var ADDRESS_HORIZONTAL_COORD_MIN = 0;
  // var OFFERS_NUMBER = 8;

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
    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var mapPinsBlock = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      var pin = createPin(offers[i], mapPin);
      addPinClickListener(pin, offers[i], map);
      fragment.appendChild(pin);
    }

    mapPinsBlock.appendChild(fragment);
  };

  // Переводит страницу в неактивное состояние.
  var deactivatePage = function (mapElement, formElement, formFielsets) {
    hideElement(mapElement, 'map--faded');
    hideElement(formElement, 'ad-form--disabled');
    disableForm(formFielsets);
  };

  // Переводит страницу в активное состояние.
  var activatePage = function (mapElement, formElement, formFielsets) {
    showElement(mapElement, 'map--faded');
    showElement(formElement, 'ad-form--disabled');
    enableForm(formFielsets);
  };

  // Находим блок с картой.
  var map = document.querySelector('.map');
  // Находим главную метку.
  var mapPinMain = map.querySelector('.map__pin--main');

  // Получаем начальные координаты главной метки, когда у него нет острого указателя.
  var initialMainPinCoordinates = getAddressCoordinates(MODE_INACTIVE, mapPinMain);

  // Находим форму ad-form.
  var adForm = document.querySelector('.ad-form');
  // Находим поле адреса в форме ad-form.
  var adFormAddress = adForm.querySelector('input[name = address]');

  // Устанавливаем изначальные точки координат в поле адрес (до активации страницы).
  setOfferAddress(initialMainPinCoordinates, adFormAddress);

  // Получаем начальные координаты главной метки при активации страницы.
  var afterActivationMainPinCoordinates = getAddressCoordinates(MODE_ACTIVE, mapPinMain);
  // Находим fieldsets формы .ad-form.
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  // Генерируем массив предложений.
  // var offers = generateOffers(OFFERS_NUMBER);

  // var successTemplate = document.querySelector('#success').content;
  // var errorTemplate = document.querySelector('#error').content;

  var onSuccessOffersLoad = function (offers) {
    renderAllMapPins(offers);
  };

  // Определяем ширину блока, в котором перемещается главная метка
  var addressHorizontalCoordMax = map.offsetWidth;
  // Определяем границы области, в которой может перемещаться главная метка.
  var draggableAreaLimits = {
    xLeft: ADDRESS_HORIZONTAL_COORD_MIN - (MAIN_PIN_INITIAL_WIDTH / 2),
    xRight: addressHorizontalCoordMax - (MAIN_PIN_INITIAL_WIDTH / 2),
    yTop: ADDRESS_VERTICAL_COORD_MIN - MAIN_PIN_WITH_POINT_HEIGHT,
    yBottom: ADDRESS_VERTICAL_COORD_MAX - MAIN_PIN_WITH_POINT_HEIGHT
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0 && (map.classList.contains('map--faded'))) {
      activatePage(map, adForm, adFormFieldsets);
      loadOffers(onSuccessOffersLoad, null);
      setOfferAddress(afterActivationMainPinCoordinates, adFormAddress);
    } else {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var newMainPinCoords = {
          x: mapPinMain.offsetLeft - shift.x,
          y: mapPinMain.offsetTop - shift.y
        };

        if (newMainPinCoords.x <= draggableAreaLimits.xLeft) {
          newMainPinCoords.x = draggableAreaLimits.xLeft;
        } else if (newMainPinCoords.x >= draggableAreaLimits.xRight) {
          newMainPinCoords.x = draggableAreaLimits.xRight;
        } else {
          newMainPinCoords.x = newMainPinCoords.x;
        }

        if (newMainPinCoords.y <= draggableAreaLimits.yTop) {
          newMainPinCoords.y = draggableAreaLimits.yTop;
        } else if (newMainPinCoords.y >= draggableAreaLimits.yBottom) {
          newMainPinCoords.y = draggableAreaLimits.yBottom;
        } else {
          newMainPinCoords.y = newMainPinCoords.y;
        }

        mapPinMain.style.left = newMainPinCoords.x + 'px';
        mapPinMain.style.top = newMainPinCoords.y + 'px';

        var newAddressCoords = {
          x: Math.round(newMainPinCoords.x + MAIN_PIN_INITIAL_WIDTH / 2),
          y: Math.round(newMainPinCoords.y + MAIN_PIN_WITH_POINT_HEIGHT)
        };

        setOfferAddress(newAddressCoords, adFormAddress);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER_KEY) {
      activatePage(map, adForm, adFormFieldsets);
      loadOffers(onSuccessOffersLoad, null);
      setOfferAddress(afterActivationMainPinCoordinates, adFormAddress);
    }
  });

  // Переводим страницу в неактивное состояние.
  deactivatePage(map, adForm, adFormFieldsets);

})();
