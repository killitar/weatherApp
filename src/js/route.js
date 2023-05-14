'use strict';

import { updateWeather } from './app.js';

const defaultLocation = '#/weather?lat=55.7522&lon=37.6156'; //Москва

const currentLocation = function () {
	window.navigator.geolocation.getCurrentPosition(
		(res) => {
			const { latitude, longitude } = res.coords;

			updateWeather(`lat=${latitude}`, `lon=${longitude}`);
		},
		(err) => {
			window.location.hash = defaultLocation;
		}
	);
};

const searchedLocation = (query) => updateWeather(...query.split('&'));

const routes = new Map([
	['/current-location', currentLocation],
	['/weather', searchedLocation],
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
