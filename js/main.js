'use strict';

var OFFER_TITLES = ['Уютный дом с видом на сад', 'Стильная комната в лучшем районе города', 'Квартира рядом с метро', 'Сдается комната на 3 месяца', 'Квартира для семьи из трех человек', 'Комната с отдельной ванной', 'Комната с балконом и видом на парк', 'Дворец для пары без детей'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_DESCRIPTIONS = ['A comfortable space that can accommodate up to 2 people. This apartment is 3mins from Shinjuku by train and also close to Shibuya ! It is a 6-minute walk from the nearest station of the apartment.The apartment is in a residential area so you can sleep peacefully and sleep at night.', 'We have permission for business as hotel, Japan visitors can legally stay* >3 metro stations nearby take you directly to the best Tokyo spots >Bus to Tokyo airports (Tokyo City Air Terminal) is a short walk distance >Neighborhood has traditional shops, pubs, restaurants for true local experience >Grocery&drug stores, ¥100 shops nearby to fill your shopping needs >Ideal for short stay, but we have had many satisfied long-term guests >Checkin until 12am, convenient in case of arrival by late flight', 'Tateishi Tokyo,Quaint Neighborhood around the Station. Many Bars still exist since right after the World War near the station. You can feel what Tokyo was like back in 1940s. Good access to Major spot (15mins-50mins )'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var OFFERS_NUMBER = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

/**
 * @description Function always returns a random number between min and max (both included).
 * @param {number} min - Minimun number from a range of numbers.
 * @param {number} max - Maximum number from a range of numbers.
 * @return {number} A random integer between min (included) and max (included).
 */
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @description Function returns a random item from an array.
 * @param {Array} array, from which you want to get a random item.
 * @return {*} - random array item
 */
var getRandomElemenFromArray = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

/**
 * @description Function generates avatar image URL.
 * @param {number} index - Index of the offer.
 * @return {string} URL address of avatar image
 */
var generateAvatarUrl = function (index) {
  return 'img/avatars/user0' + (index + 1) + '.png';
};

/**
 * @description Function returns an object with x an y coordinates to place the pin on map.
 * @return {object} Object represents location with coordinates of an offer.
 */
var generateLocation = function () {
  return {
    'x': getRandomInteger(130, 630),
    'y': getRandomInteger(130, 630)
  };
};

/**
 * @description Function generates an array of strings from the strings included in the dictionary.
 * @param {array} dictionary - Array of strings.
 * @return {array} New array of strings of various length from 1 string to the same number of string as the length of the dictionary.
 */
var generateArrayOfStrings = function (dictionary) {
  var resultArrayLength = getRandomInteger(1, dictionary.length);
  var resultArray = [];

  for (var i = 0; i < resultArrayLength; i++) {
    resultArray[i] = getRandomElemenFromArray(dictionary);
  }

  return resultArray;
};

/**
 * @description Function generates an offer.
 * @param {number} index of an offer.
 * @return {object} One offer.
 */
var generateOneOffer = function (index) {
  var location = generateLocation();

  return {
    'author': {
      'avatar': generateAvatarUrl(index)
    },
    'offer': {
      'title': getRandomElemenFromArray(OFFER_TITLES),
      'address': location.x + ', ' + location.y,
      'price': getRandomInteger(0, 1000000),
      'type': getRandomElemenFromArray(OFFER_TYPES),
      'rooms': getRandomInteger(0, 100),
      'guests': getRandomInteger(0, 3),
      'checkin': getRandomElemenFromArray(OFFER_CHECKINS),
      'checkout': getRandomElemenFromArray(OFFER_CHECKOUTS),
      'features': generateArrayOfStrings(OFFER_FEATURES),
      'description': getRandomElemenFromArray(OFFER_DESCRIPTIONS),
      'photos': generateArrayOfStrings(OFFER_PHOTOS)
    },

    'location': {
      'x': location.x,
      'y': location.y
    }
  };
};

/**
 * @description Function generates an array of offers.
 * @param {number} number - Quantity of offers to generate.
 * @return {array} An array of offer objects.
 */
var generateOffers = function (number) {
  var offers = [];
  for (var i = 0; i < number; i++) {
    offers[i] = generateOneOffer(i);
  }

  return offers;
};

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

  return mapPinElement;
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
    fragment.appendChild(renderOneMapPin(offers[i], mapPin));
  }

  mapPinsBlock.appendChild(fragment);
};

/**
 * @description Function removes fade effect from the map.
 */
var showMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};

/**
 * @description Function returns Russian word for offer type;
 * @param {object} offer - An object with offer data.
 * @return {string} - a Russian word for the offer type.
 */
var getOfferType = function (offer) {
  switch (offer.offer.type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
  }

  return offer.offer.type;
};

/**
 * @description Function returns a string with guests and rooms number if both pieces of information present in the offer object.
 * @param {object} offer - Offer object.
 * @return {string} Offer data with rooms and guests number.
 */
var getRoomsAndGuests = function (offer) {
  var roomsAndGuests = '';
  if (offer.offer.rooms && offer.offer.guests) {
    roomsAndGuests = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
  }
  return roomsAndGuests;
};

/**
 * @description Function hides HTML element if the offer does not contain information for that element. If offer has text content for the element, function adds that text content in the element and shows the element in HTML.
 * @param {object} element - HTML block with text content.
 * @param {string} elementText Text from the offer that should be in the element's textContent.
 */
var hideEmptyTextElement = function (element, elementText) {
  if (elementText) {
    element.textContent = elementText;
  } else {
    element.classList.add('hidden');
  }
};

/**
 * @description Function creates one offer card.
 * @param {object} offer - An object with offer data.
 * @param {object} cardTemplate - HTML object with a template markup.
 * @return {object} HTML object with one map card.
 */
var renderOneMapCard = function (offer, cardTemplate) {
  var mapCardElement = cardTemplate.cloneNode(true);
  var mapCardTitle = mapCardElement.querySelector('.popup__title');
  var mapCardAddress = mapCardElement.querySelector('.popup__text--address');
  var mapCardPrice = mapCardElement.querySelector('.popup__text--price');
  var mapCardType = mapCardElement.querySelector('.popup__type');
  var mapCardDescription = mapCardElement.querySelector('.popup__description');
  var mapCardCapacity = mapCardElement.querySelector('.popup__text--capacity');

  hideEmptyTextElement(mapCardTitle, offer.offer.title);
  hideEmptyTextElement(mapCardAddress, offer.offer.address);
  hideEmptyTextElement(mapCardPrice, offer.offer.price);
  hideEmptyTextElement(mapCardType, getOfferType(offer));
  if (offer.offer.checkin && offer.offer.checkout) {
    mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  } else {
    mapCardElement.querySelector('.popup__text--time').classList.add('hidden');
  }

  // Альтернативный способ вывода features
  // var features = mapCardElement.querySelector('.popup__features');
  // var featuresFromHTML = features.querySelectorAll('.popup__feature');
  // for (var i = 0; i < featuresFromHTML.length; i++) {
  //   var featureList = featuresFromHTML[i].classList;
  //   for (var j = 0; j < featureList.length; j++) {
  //     if (featureList[j].includes('popup__feature--')) {
  //       var featureClassSplitArray = featureList[j].split('--');
  //       var featureClass = featureClassSplitArray[1];
  //       var offerFeaturesIncluded = offer.offer.features;
  //       if (!offerFeaturesIncluded.includes(featureClass)) {
  //         featuresFromHTML[i].remove();
  //       }
  //     }
  //   }
  // }

  if (offer.offer.features.length > 0) {
    var features = mapCardElement.querySelector('.popup__features');
    var featuresFromHTML = features.querySelectorAll('.popup__feature');
    var featureFromHTML = features.removeChild(featuresFromHTML[0]);
    for (var featureItemIndex = 1; featureItemIndex < featuresFromHTML.length; featureItemIndex++) {
      featuresFromHTML[featureItemIndex].remove();
    }
    for (var featureIndex = 0; featureIndex < offer.offer.features.length; featureIndex++) {
      var feature = featureFromHTML.cloneNode(true);
      feature.classList.remove('popup__feature--wifi');
      feature.classList.add('popup__feature--' + offer.offer.features[featureIndex]);
      features.appendChild(feature);
    }
  } else {
    features.classList.add('hidden');
  }

  hideEmptyTextElement(mapCardDescription, offer.offer.description);

  if (offer.offer.photos.length > 0) {
    var photos = mapCardElement.querySelector('.popup__photos');
    var photoFromHTML = photos.removeChild(photos.querySelector('.popup__photo'));
    for (var photoIndexInOffer = 0; photoIndexInOffer < offer.offer.photos.length; photoIndexInOffer++) {
      var photo = photoFromHTML.cloneNode(true);
      photo.src = offer.offer.photos[photoIndexInOffer];
      photos.appendChild(photo);
    }
  } else {
    photos.classList.add('hidden');
  }

  if (offer.author.avatar) {
    mapCardElement.querySelector('.popup__avatar').src = offer.author.avatar;
  } else {
    mapCardElement.querySelector('.popup__avatar').classList.add('hidden');
  }

  return mapCardElement;
};

// Генерируем массив предложений (моки)
var offers = generateOffers(OFFERS_NUMBER);
// Находит шаблон карточки предложения
var mapCardTemplate = document.querySelector('#card').content.querySelector('.popup');
// Создаем карточку предложения на основе первого элемента из массива предложений
var cardElement = renderOneMapCard(offers[0], mapCardTemplate);
// Находим блок с картой.
var mapCardBlock = document.querySelector('.map');
// Выводим карточку предложения перед блоком с классом .map__filters-container в блоке с картой
mapCardBlock.insertBefore(cardElement, mapCardBlock.querySelector('.map__filters-container'));
// Выводим все пины предложений на карту.
renderAllMapPins(offers);
// Убираем эффект затемнения с карты.
showMap();
