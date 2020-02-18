'use strict';

(function () {
  // Импорт из других модулей.
  var map = window.map.element;
  var adForm = window.form.element;
  var getAddressCoordinates = window.map.getAddressCoordinates;
  var renderPins = window.map.renderPins;
  var loadOffers = window.upload.load;
  var saveForm = window.upload.save;
  var showMessage = window.utils.showMessage;
  var setOfferAddress = window.form.setAddress;
  var hideElement = window.utils.hideElement;
  var disableForm = window.form.disable;
  var showElement = window.utils.showElement;
  var enableForm = window.form.enable;
  var MODE_INACTIVE = window.utils.MODE_INACTIVE;
  var MODE_ACTIVE = window.utils.MODE_ACTIVE;
  var ESC_KEY = window.utils.ESC_KEY;
  var ENTER_KEY = window.utils.ENTER_KEY;
  var SUCCESS_MESSAGE = 'Ваше объявление опубликовано.';
  var MAIN_PIN_INITIAL_WIDTH = window.map.MAIN_PIN_INITIAL_WIDTH;
  var MAIN_PIN_WITH_POINT_HEIGHT = window.map.MAIN_PIN_WITH_POINT_HEIGHT;
  var ADDRESS_VERTICAL_COORD_MIN = 130;
  var ADDRESS_VERTICAL_COORD_MAX = 630;
  var ADDRESS_HORIZONTAL_COORD_MIN = 0;

  /* -------------- Функции для активации и деактивации страницы -------------- */

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

  /* --- Положение главной метки и координаты адреса до активации страницы --- */
  // Находим главную метку.
  var mapPinMain = map.querySelector('.map__pin--main');
  // Запоминаем начальное положение главной метки.
  var mainPinInitialPosition = {
    x: mapPinMain.offsetLeft,
    y: mapPinMain.offsetTop,
  };
  // Получаем начальные координаты главной метки, когда у него нет острого указателя.
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

  // При успешной загрузке данных с сервера, показываем пины.
  var onSuccessOffersLoad = function (offers) {
    renderPins(offers);
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

  // Активация страницы при нажатии на главную метку.
  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0 && (map.classList.contains('map--faded'))) {
      activatePage(map, adForm, adFormFieldsets);
      loadOffers(onSuccessOffersLoad, null);
      setOfferAddress(MODE_ACTIVE, afterActivationMainPinCoordinates, adFormAddress);
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
      activatePage(map, adForm, adFormFieldsets);
      loadOffers(onSuccessOffersLoad, null);
      setOfferAddress(MODE_ACTIVE, afterActivationMainPinCoordinates, adFormAddress);
    }
  });

  /* -------------- Для деактивации страницы -------------- */

  // Убираем метки и возвращаем главную метку в исходное положение
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

  // Находим шаблоны блоков с сообщением о успешной и неуспешной отправке формы.
  var successTemplate = document.querySelector('#success').content;
  var errorTemplate = document.querySelector('#error').content;

  adForm.addEventListener('reset', function () {
    // Главную метку возвращаем в исходное положение, остальные метки удаляем.
    deactivatePins();
    // Переводим страницу в неактивное состояние.
    deactivatePage(map, adForm, adFormFieldsets);
  });

  var onFormLoadSuccess = function () {
    showMessage(SUCCESS_MESSAGE, successTemplate);
    adForm.reset();
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
