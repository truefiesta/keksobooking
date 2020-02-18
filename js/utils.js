'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var ESC_KEY = 'Escape';
  // Режимы страницы
  var MODE_ACTIVE = 'active';
  var MODE_INACTIVE = 'inactive';

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
   * @description Function adds class to hide the element.
   * @param {object} element HTML element.
   * @param {string} className Name of class, that hides the element.
   */
  var hideElement = function (element, className) {
    element.classList.add(className);
  };

  /**
   * @description Function removes a class, that hides the element.
   * @param {object} element HTML element.
   * @param {string} className Name of class, should be removed to show the element.
   */
  var showElement = function (element, className) {
    element.classList.remove(className);
  };

  /**
   * @description Function shows error or success message.
   * @param {string} messageText - Text of a message.
   * @param {object} elementTemplate - HTML template of the message element.
   */
  var showMessage = function (messageText, elementTemplate) {
    var messageElement = elementTemplate.cloneNode(true);
    var message = messageElement.querySelector('p');
    message.textContent = messageText;

    if (elementTemplate === document.querySelector('#error').content) {
      var errorButton = messageElement.querySelector('.error__message');
      errorButton.addEventListener('click', function () {
        messageElement.remove();
      });
    }

    document.querySelector('main').appendChild(messageElement);
  };

  window.utils = {
    ENTER_KEY: ENTER_KEY,
    ESC_KEY: ESC_KEY,
    MODE_ACTIVE: MODE_ACTIVE,
    MODE_INACTIVE: MODE_INACTIVE,
    getRandomElemenFromArray: getRandomElemenFromArray,
    getRandomInteger: getRandomInteger,
    generateArrayOfStrings: generateArrayOfStrings,
    hideElement: hideElement,
    showElement: showElement,
    showMessage: showMessage
  };

})();
