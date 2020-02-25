'use strict';

(function () {
  var MODE_INACTIVE = window.utils.MODE_INACTIVE;
  var getSelectedOption = window.utils.getSelectedOption;
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];

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
  // Находим поле для ввода количества комнат и поле для ввода количества гостей.
  var adFormRooms = adForm.querySelector('select[name = rooms]');
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

  // Находим поле для ввода цены за ночь и поле для выбора типа жилья.
  var adFormPrice = adForm.querySelector('input[name = price]');
  var adFormTypes = adForm.querySelector('select[name = type]');

  // Определяем выбранное значение в поле с типом предложения.
  var onOfferTypeChange = function (evt) {
    var adFormSelectedType = getSelectedOption(evt.target);
    adFormPrice.min = getMinPriceForOfferType(adFormSelectedType.value);
    adFormPrice['placeholder'] = adFormPrice.min;
  };

  // Находим поля для выбора времени въезда и выезда.
  var adCheckinTimes = adForm.querySelector('select[name = timein]');
  var adCheckoutTimes = adForm.querySelector('select[name = timeout]');

  // Обработчик изменения времени вьезда и выезда.
  var onCheckinTimesChange = function (evt) {
    var element = evt.target;
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

  // Функция для создания обработчика при загрузке/изменении картинок в форме ad-form.
  var createPictureChangeListener = function (filePreviewElement) {
    var picturePreview = filePreviewElement;

    return function (evt) {
      var pictureFile = evt.target.files[0];
      var pictureFileName = pictureFile.name.toLowerCase();

      if (pictureFile) {
        var isApprortiateFormat = FILE_TYPES.some(function (it) {
          return pictureFileName.endsWith(it);
        });

        if (isApprortiateFormat) {
          var picturePreviewImg = picturePreview.querySelector('img');

          if (!picturePreviewImg) {
            var img = document.createElement('img');
            img.alt = 'Фотография жилья';
            img.width = 70;
            img.height = 70;
            picturePreview.appendChild(img);
            picturePreviewImg = picturePreview.querySelector('img');
          }

          var reader = new FileReader();

          reader.addEventListener('load', function (evtRead) {
            picturePreviewImg.src = evtRead.target.result;
          });

          reader.readAsDataURL(pictureFile);
        }
      }
    };
  };

  // Находим поля для загрузки аватарки и для превью аватарки
  var adformAvatar = adForm.querySelector('.ad-form__field');
  var adFormAvatarPreview = adForm.querySelector('.ad-form-header__preview');
  // Создаем обработчик для изменения аватарки.
  var onAvatarChange = createPictureChangeListener(adFormAvatarPreview);

  var defaultAvatar = adFormAvatarPreview.querySelector('img').cloneNode();

  var restoreDefaultAdFormAvatar = function () {
    var copyDefaultAvatar = defaultAvatar.cloneNode();
    adFormAvatarPreview.innerHTML = '';
    adFormAvatarPreview.appendChild(copyDefaultAvatar);
  };

  // Находим поля для загрузки фотографии и превью фотографии
  var adFormPhoto = adForm.querySelector('.ad-form__upload');
  var adFormPhotoPreview = adForm.querySelector('.ad-form__photo');
  // Создаем обработчик для изменения фотографии.
  var onAdFormPhotoChange = createPictureChangeListener(adFormPhotoPreview);

  var resetAdFormPhoto = function () {
    adFormPhotoPreview.innerHTML = '';
  };

  var onInvalidFormElement = function (evt) {
    evt.target.parentElement.classList.add('ad-form__invalid');
  };

  // Находим все элементы формы и создаем из них массивы.
  var allAdFormInputs = Array.from(adForm.querySelectorAll('input'));
  var allAdFormSelects = Array.from(adForm.querySelectorAll('select'));
  var allAdFormTextareas = Array.from(adForm.querySelectorAll('textarea'));
  // Объединяем все элементы формы в один массив.
  var allAdFormElements = allAdFormInputs.concat(allAdFormSelects, allAdFormTextareas);

  // Функция для добавления слушателей на поля формы ad-form.
  var addAdFormListeners = function () {
    // Навешиваем слушатель события измненения на поле тип жилья.
    adFormTypes.addEventListener('change', onOfferTypeChange);
    // Навешиваем слушатели события измненения на поля время въезда/выезда.
    adCheckinTimes.addEventListener('change', onCheckinTimesChange);
    adCheckoutTimes.addEventListener('change', onCheckinTimesChange);
    // Обработчики изменения количества комнат и гостей.
    adFormGuests.addEventListener('change', onRoomsOrGuestsChange);
    adFormRooms.addEventListener('change', onRoomsOrGuestsChange);
    // Навешиваем слушатели события изменения аватарки и фотографии.
    adformAvatar.addEventListener('change', onAvatarChange);
    adFormPhoto.addEventListener('change', onAdFormPhotoChange);
    // Добавляем слушатели события invalid на все элементы формы.
    allAdFormElements.forEach(function (adFormInput) {
      adFormInput.addEventListener('invalid', onInvalidFormElement);
    });
  };

  // Функция для удаления слушателей с полей формы ad-form.
  var removeAdFormListeners = function () {
    adFormTypes.removeEventListener('change', onOfferTypeChange);
    adCheckinTimes.removeEventListener('change', onCheckinTimesChange);
    adCheckoutTimes.removeEventListener('change', onCheckinTimesChange);
    adFormGuests.removeEventListener('change', onRoomsOrGuestsChange);
    adFormRooms.removeEventListener('change', onRoomsOrGuestsChange);
    adformAvatar.removeEventListener('change', onAvatarChange);
    adFormPhoto.removeEventListener('change', onAdFormPhotoChange);
    allAdFormElements.forEach(function (adFormInput) {
      adFormInput.removeEventListener('invalid', onInvalidFormElement);
    });
  };

  // Запоминаем начальное минимальное значение цены.
  var adFormDefaultMinPrice = adFormPrice.min;
  // Функция устанавливает начальное минимальное значение цены.
  var setDefaultMinPrice = function () {
    adFormPrice.min = adFormDefaultMinPrice;
    adFormPrice['placeholder'] = adFormDefaultMinPrice;
  };

  var resetAdFormElements = function () {
    restoreDefaultAdFormAvatar();
    resetAdFormPhoto();
    removeAdFormListeners();
    setDefaultMinPrice();
  };

  window.adform = {
    element: adForm,
    setAddress: setAddress,
    addListeners: addAdFormListeners,
    reset: resetAdFormElements
  };

})();
