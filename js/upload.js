'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data00';
  var URL_SAVE = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  };

  var sendRequest = function (method, URL, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.OK:
          onLoad(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          error = 'Heверный запрос';
          break;
        case StatusCode.NOT_FOUND:
          error = 'К сожалению, по вашему запросу ничего не найдено';
          break;
        case StatusCode.SERVICE_UNAVAILABLE:
          error = 'Кексобукинг в данный момент не доступна. Пожалуйста, зайдите позже.';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Пожалуйста, проверьте свое подключение к Интернету.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.open(method, URL);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    sendRequest('GET', URL_LOAD, null, onLoad, onError);
  };

  var save = function (data, onLoad, onError) {
    sendRequest('POST', URL_SAVE, data, onLoad, onError);
  };

  window.upload = {
    load: load,
    save: save
  };

})();
