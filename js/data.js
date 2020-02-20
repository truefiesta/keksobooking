'use strict';

(function () {
  // Импорт из других модулей.
  var getRandomInteger = window.utils.getRandomInteger;
  var getRandomElemenFromArray = window.utils.getRandomElemenFromArray;
  var generateArrayOfStrings = window.utils.generateArrayOfStrings;
  // Константы
  var OFFER_TITLES = ['Уютный дом с видом на сад', 'Стильная комната в лучшем районе города', 'Квартира рядом с метро', 'Сдается комната на 3 месяца', 'Квартира для семьи из трех человек', 'Комната с отдельной ванной', 'Комната с балконом и видом на парк', 'Дворец для пары без детей'];
  var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
  var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_DESCRIPTIONS = ['A comfortable space that can accommodate up to 2 people. This apartment is 3mins from Shinjuku by train and also close to Shibuya ! It is a 6-minute walk from the nearest station of the apartment.The apartment is in a residential area so you can sleep peacefully and sleep at night.', 'We have permission for business as hotel, Japan visitors can legally stay* >3 metro stations nearby take you directly to the best Tokyo spots >Bus to Tokyo airports (Tokyo City Air Terminal) is a short walk distance >Neighborhood has traditional shops, pubs, restaurants for true local experience >Grocery&drug stores, ¥100 shops nearby to fill your shopping needs >Ideal for short stay, but we have had many satisfied long-term guests >Checkin until 12am, convenient in case of arrival by late flight', 'Tateishi Tokyo,Quaint Neighborhood around the Station. Many Bars still exist since right after the World War near the station. You can feel what Tokyo was like back in 1940s. Good access to Major spot (15mins-50mins )'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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

  window.data = {
    generate: generateOffers,
    OFFER_FEATURES: OFFER_FEATURES
  };

})();
