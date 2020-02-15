'use strict';

(function () {
  // Импорт из других модулей.
  var createCard = window.card.create;
  var ESC_KEY = window.utils.ESC_KEY;
  // Константы
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  /**
   * @description Function renders one pin on the map.
   * @param {object} offer - Object with offer data.
   * @param {object} mapPin - HTML element object that will contain a pin.
   * @return {object} HTML element of one map pin.
   */
  var renderOneMapPin = function (offer, mapPin) {
    var mapPinElement = mapPin.cloneNode(true);

    mapPinElement.style.left = (offer.location.x - (PIN_WIDTH / 2)) + 'px';
    mapPinElement.style.top = offer.location.y - PIN_HEIGHT + 'px';
    mapPinElement.querySelector('img').src = offer.author.avatar;
    mapPinElement.querySelector('img').alt = offer.offer.title;
    if (!offer.offer) {
      mapPinElement.classList.add('hidden');
    }

    return mapPinElement;
  };

  /**
   * @description Function handles click on a map pin.
   * @param {object} pin - HTML element - map pin, that was clicked.
   * @param {object} offer - Data from offers array.
   * @param {object} block - HTML blocke, where card assotiated with the pin should be inserted.
   */
  var addClickListener = function (pin, offer, block) {
    // Находим шаблон карточки предложения
    var mapCardTemplate = document.querySelector('#card').content.querySelector('.popup');
    // Создаем карточку предложения на основе элемента из массива предложений
    var cardElement = createCard(offer, mapCardTemplate);
    // Находим кнопку закрытия на карточке.
    var cardCloseButton = cardElement.querySelector('.popup__close');

    var pinClick = function () {
      var openedCard = document.querySelector('.map__card');
      if (openedCard) {
        openedCard.querySelector('.popup__close').click();
      }
      // Выводим карточку предложения перед блоком с классом .map__filters-container.
      block.insertBefore(cardElement, block.querySelector('.map__filters-container'));
      // Добавляем обработчик клика кнопке закрытия карточки предложения.
      cardCloseButton.addEventListener('click', closeCard);
      // Добавить класс к пину, по которому кликнули.
      pin.classList.add('map__pin--active');
      document.addEventListener('keydown', onCardEscPress);
      pin.removeEventListener('click', pinClick);
    };

    var onCardEscPress = function (evt) {
      if (evt.key === ESC_KEY) {
        closeCard();
      }
    };

    var closeCard = function () {
      cardElement.remove();
      pin.addEventListener('click', pinClick);
      pin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardEscPress);
    };

    pin.addEventListener('click', pinClick);
  };

  window.pin = {
    create: renderOneMapPin,
    addClickListener: addClickListener
  };

})();
