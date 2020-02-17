'use strict';

(function () {
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
  var getRoomsAndGuestsString = function (offer) {
    var roomsAndGuests = '';
    if (offer.offer.rooms && offer.offer.guests) {
      roomsAndGuests = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
    }
    return roomsAndGuests;
  };

  /**
   * @description Function returns a string with checkin and checkout time if both pieces of information present in the offer object.
   * @param {object} offer - Offer object.
   * @return {string} Offer data with checkin and checkout time.
   */
  var getCheckinAndCheckoutTime = function (offer) {
    var checkinAndCheckout = '';
    if (offer.offer.checkin && offer.offer.checkout) {
      checkinAndCheckout = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
    }
    return checkinAndCheckout;
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
    var mapCardTime = mapCardElement.querySelector('.popup__text--time');

    hideEmptyTextElement(mapCardTitle, offer.offer.title);
    hideEmptyTextElement(mapCardAddress, offer.offer.address);
    hideEmptyTextElement(mapCardPrice, offer.offer.price);
    hideEmptyTextElement(mapCardType, getOfferType(offer));
    hideEmptyTextElement(mapCardCapacity, getRoomsAndGuestsString(offer));
    hideEmptyTextElement(mapCardTime, getCheckinAndCheckoutTime(offer));

    var features = mapCardElement.querySelector('.popup__features');
    if (offer.offer.features.length > 0) {
      var featureFromHTML = features.querySelector('.popup__feature');
      features.innerHTML = '';
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

    var photos = mapCardElement.querySelector('.popup__photos');
    if (offer.offer.photos.length > 0) {
      var photoFromHTML = photos.querySelector('.popup__photo');
      photos.innerHTML = '';
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

  window.card = {
    create: renderOneMapCard
  };

})();
