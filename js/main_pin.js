'use strict';

(function () {
  var map = window.map.element;
  var adForm = window.adform.element;
  var activatePage = window.page.activate;
  var setOfferAddress = window.adform.setAddress;
  var updatePins = window.filter.updatePins;
  var loadOffers = window.offers.load;
  var MODE_ACTIVE = window.utils.MODE_ACTIVE;
  var ENTER_KEY = window.utils.ENTER_KEY;
  var MAIN_PIN_INITIAL_WIDTH = window.map.MAIN_PIN_INITIAL_WIDTH;
  var MAIN_PIN_WITH_POINT_HEIGHT = window.map.MAIN_PIN_WITH_POINT_HEIGHT;
  var ADDRESS_VERTICAL_COORD_MIN = 130;
  var ADDRESS_VERTICAL_COORD_MAX = 630;
  var ADDRESS_HORIZONTAL_COORD_MIN = 0;

  // Определяем ширину блока, в котором перемещается главная метка
  var addressHorizontalCoordMax = map.offsetWidth;
  // Определяем границы области, в которой может перемещаться главная метка.
  var draggableAreaLimits = {
    xLeft: ADDRESS_HORIZONTAL_COORD_MIN - (MAIN_PIN_INITIAL_WIDTH / 2),
    xRight: addressHorizontalCoordMax - (MAIN_PIN_INITIAL_WIDTH / 2),
    yTop: ADDRESS_VERTICAL_COORD_MIN - MAIN_PIN_WITH_POINT_HEIGHT,
    yBottom: ADDRESS_VERTICAL_COORD_MAX - MAIN_PIN_WITH_POINT_HEIGHT
  };

  var mapPinMain = map.querySelector('.map__pin--main');
  // Находим поле адреса в форме ad-form.
  var adFormAddress = adForm.querySelector('input[name = address]');

  // Активация страницы при нажатии на главную метку.
  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0 && (map.classList.contains('map--faded'))) {
      activatePage();
      loadOffers(updatePins);
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

        setOfferAddress(MODE_ACTIVE, newAddressCoords, adFormAddress);
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
      activatePage();
      loadOffers(updatePins);
    }
  });

})();
