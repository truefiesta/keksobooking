'use strict';

(function () {
  var ESC_KEY = window.utils.ESC_KEY;

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
      removeMessageListeners();
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
      removeMessageListeners();
    }
  };

  var addMessageListeners = function () {
    document.addEventListener('keydown', onKeydownWhileMessageOpened);
    document.addEventListener('click', onClickWhileMessageOpened);
  };

  var removeMessageListeners = function () {
    document.removeEventListener('keydown', onKeydownWhileMessageOpened);
    document.removeEventListener('click', onClickWhileMessageOpened);
  };

  window.message = {
    addListeners: addMessageListeners
  };

})();
