'use strict';

(function () {
  var load = window.upload.load;
  var offers = [];

  var loadOffers = function (onLoad) {
    load(function (data) {
      offers = data;
      onLoad();
    }, null);
  };

  var getOffers = function () {
    return offers;
  };

  window.offers = {
    load: loadOffers,
    get: getOffers
  };

})();
