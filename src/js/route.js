'use strict';

import { updateWeather } from './app.js';

//Дeфолтная геопозиция Москва, если пользователь отказался от предоставление своей геопозиции
const defaultLocation = '#/weather?lat=55.7522&lon=37.6156'; //Москва

//Функция которая узнает тукущую геопозицию пользователя, функция возвращает долготу и широту геопозиии пользователя

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (response) => {
      const { latitude, longitude } = response.coords;

      updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    },
    (error) => {
      window.location.hash = defaultLocation;
    }
  );
};

const searchedLocation = (query) => updateWeather(...query.split('&'));

const routes = new Map([
  ['/current-location', currentLocation],
  ['/weather', searchedLocation]
]);

const checkHash = function () {
  const requestUrl = window.location.hash.slice(1);

  const [route, query] = requestUrl.includes
    ? requestUrl.split('?')
    : [requestUrl];

  routes.get(route) ? routes.get(route)(query) : console.error('404');
};

window.addEventListener('hashchange', checkHash);

window.addEventListener('load', function () {
  if (!window.location.hash) {
    window.location.hash = '#/current-location';
  } else {
    checkHash();
  }
});
