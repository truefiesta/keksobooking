'use strict';

(function () {
  var MODE_INACTIVE = window.utils.MODE_INACTIVE;
  var getSelectedOption = window.utils.getSelectedOption;

  /**
   * @description Function sets address in the ad-form address field as a string {x, y}.
   * @param {string} mode - Active or inactive page mode.
   * @param {object} location - Object with x and y coordinates.
   * @param {object} addressField - Input field with address value.
   */
  var setAddress = function (mode, location, addressField) {
    if (mode === MODE_INACTIVE) {
      addressField.defaultValue = location.x + ', ' + location.y;
    } else {
      addressField.value = location.x + ', ' + location.y;
    }
  };

  // Находим форму ad-form.
  var adForm = document.querySelector('.ad-form');
  // Находим поле для ввода количества комнат в форме ad-form.
  var adFormRooms = adForm.querySelector('select[name = rooms]');
  // Находим поле для ввода количества гостей в форме ad-form.
  var adFormGuests = adForm.querySelector('select[name = capacity]');

  // Функция проверяет соответствие количества комнат количеству гостей.
  var checkRoomsAndGuestsValidity = function (guestsValue, roomsValue) {
    if (guestsValue === 0 && roomsValue === 100) {
      adFormGuests.setCustomValidity('');
    } else if ((guestsValue !== 0) && (roomsValue !== 100) && (guestsValue <= roomsValue)) {
      adFormGuests.setCustomValidity('');
    } else {
      adFormGuests.setCustomValidity('Количество гостей не соответствует количеству комнат.');
    }
  };

  // Обработчик для изменения полей количества комнат и количества гостей.
  var onRoomsOrGuestsChange = function () {
    var guestsCurrentValue = parseInt(getSelectedOption(adFormGuests).value, 10);
    var roomsCurrentValue = parseInt(getSelectedOption(adFormRooms).value, 10);
    checkRoomsAndGuestsValidity(guestsCurrentValue, roomsCurrentValue);
  };

  adFormGuests.addEventListener('change', onRoomsOrGuestsChange);
  adFormRooms.addEventListener('change', onRoomsOrGuestsChange);

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
  var getMinPriceForOfferType = function (selectedTypeValue) {
    switch (selectedTypeValue) {
      case 'flat': return 1000;
      case 'bungalo': return 0;
      case 'house': return 5000;
      case 'palace': return 10000;
    }
    return 0;
  };

  // Находим поле для ввода цены за ночь.
  var adFormPrice = adForm.querySelector('input[name = price]');
  // Находим поле для выбора типа жилья.
  var adFormTypes = adForm.querySelector('select[name = type]');

  // Определяем выбранное значение в поле с типом предложения.
  var onOfferTypeChange = function (evt) {
    var adFormSelectedType = getSelectedOption(evt.target);
    adFormPrice.min = getMinPriceForOfferType(adFormSelectedType.value);
    adFormPrice['placeholder'] = adFormPrice.min;
  };

  adFormTypes.addEventListener('change', onOfferTypeChange);

  // Находим поля для выбора времени въезда и выезда.
  var adCheckinTimes = adForm.querySelector('select[name = timein]');
  var adCheckoutTimes = adForm.querySelector('select[name = timeout]');

  var onTimeChange = function (element) {
    var checkinTime = getSelectedOption(adCheckinTimes).value;
    var checkoutTime = getSelectedOption(adCheckoutTimes).value;
    if (checkinTime !== checkoutTime) {
      if (element === adCheckinTimes) {
        adCheckoutTimes.value = checkinTime;
      } else {
        adCheckinTimes.value = checkoutTime;
      }
    }
  };

  adCheckinTimes.addEventListener('change', function (evt) {
    var target = evt.target;
    onTimeChange(target);
  });

  adCheckoutTimes.addEventListener('change', function (evt) {
    var target = evt.target;
    onTimeChange(target);
  });

  window.adform = {
    element: adForm,
    setAddress: setAddress,
  };

})();
