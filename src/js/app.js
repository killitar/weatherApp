'use strict';

import * as module from './module.js';
import { fetchData, url } from './api.js';

const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

const searchField = document.querySelector('.search-field');
const searchResult = document.querySelector('.search-result');
const spinSearch = document.querySelector('.spin-search');
const searchCityWrapper = document.querySelector('.search-city-wrapper');

let searchTimeout = 0;
const searchTimeoutDuration = 500;

function closeSearchAutocomplete() {
  searchCityWrapper.classList.add('rounded-3xl');
  searchCityWrapper.classList.remove('rounded-t-3xl');
  spinSearch.classList.add('hidden');
  searchResult.classList.add('hidden');
}
function showSearchAutocomplete() {
  searchCityWrapper.classList.remove('rounded-3xl');
  searchCityWrapper.classList.add('rounded-t-3xl');
  spinSearch.classList.remove('hidden');
  searchResult.classList.remove('hidden');
}

searchField.addEventListener('input', function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (searchField.value) {
    showSearchAutocomplete();
  } else {
    closeSearchAutocomplete();
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        spinSearch.classList.add('hidden');

        searchResult.innerHTML = `
	          <ul
							class="view-list grid flex-col items-center cursor-pointer"
						>

						</ul>
				`;
        const items = [];

        for (const { name, lat, lon, country, state } of locations) {
          const searchItem = document.createElement('li');

          searchItem.classList.add('view-item');

          searchItem.innerHTML = `
						<a href="#/weather?lat=${lat}&lon=${lon}" area-label=${name} class="view-item search-toggler flex items-center mt-2 ml-2">
								<div class="mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="#ffffff"
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path
											d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"
										/>
									</svg>
								</div>
								<div>
									<p class="text-white text-lg">${name}</p>
									<p class="text-graysoft">${state || ''} ${country}</p>
								</div>

						</a>
					`;

          searchResult.querySelector('.view-list').appendChild(searchItem);
          items.push(searchItem.querySelector('.search-toggler'));
        }

        addEventOnElements(items, 'click', function () {
          searchCityWrapper.classList.add('rounded-3xl');
          searchCityWrapper.classList.remove('rounded-t-3xl');
          spinSearch.classList.add('hidden');
          searchResult.classList.add('hidden');
          searchField.value = '';
        });
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector('.container');
const currentLocationBtn = document.querySelector('.current-location-btn');
const loading = document.querySelector('.spin-loading');

export const updateWeather = function (lat, lon) {
  loading.classList.add('hidden');

  container.classList.remove('hidden');

  const currentWeatherSection = document.querySelector('.current-weather');
  const highlightSection = document.querySelector('.section-highlights');
  const hourlySection = document.querySelector('.section-hourly-forecast');
  const forecastSection = document.querySelector('.section-forecast');

  currentWeatherSection.innerHTML = '';
  highlightSection.innerHTML = '';
  hourlySection.innerHTML = '';
  forecastSection.innerHTML = '';

  if (window.location.hash === '#/current-location') {
    currentLocationBtn.setAttribute('disabled', '');
  } else {
    currentLocationBtn.removeAttribute('disabled');
  }

  ////Текушая погода

  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      name,

      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC, country: country },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone
    } = currentWeather;

    const [{ description, icon }] = weather;

    const card = document.createElement('div');

    card.classList.add(
      'card',
      'current-weather-card',
      'p-6',
      'bg-darkerblack',
      'rounded-2xl',
      'shadow-xl'
    );

    card.innerHTML = `
			<h2 class="card-title text-white text-xl mb-4">Сейчас</h2>
							<div class="wrapper flex justify-start items-center mb-4">
								<p class="heading mr-6 text-white text-6xl font-bold">
									${parseInt(temp)}&deg;<sup>C</sup>
								</p>
								<img
									class="weather-icon h-16 w-16 fill-white"
									src="./icons/weathers-icons/${icon}.svg"
									alt="${icon}"
								/>
							</div>
							<p class="text-white text-base mb-4">${description}</p>

							<ul class="meta-list">
								<li class="meta-item flex items-center">
									<span class="m-icon">
										<svg
											version="1.0"
											id="Layer_1"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											width="16px"
											height="16px"
											viewBox="0 0 64 64"
											enable-background="new 0 0 64 64"
											xml:space="preserve"
											fill="#ffffff"
										>
											<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
											<g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round"
											></g>
											<g id="SVGRepo_iconCarrier">
												<g>
													<path
														fill="#ffffff"
														d="M11,54h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C10,53.553,10.447,54,11,54 z M12,49h4v3h-4V49z"
													></path>
													<path
														fill="#ffffff"
														d="M23,54h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C22,53.553,22.447,54,23,54 z M24,49h4v3h-4V49z"
													></path>
													<path
														fill="#ffffff"
														d="M35,54h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C34,53.553,34.447,54,35,54 z M36,49h4v3h-4V49z"
													></path>
													<path
														fill="#ffffff"
														d="M11,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C10,42.553,10.447,43,11,43 z M12,38h4v3h-4V38z"
													></path>
													<path
														fill="#ffffff"
														d="M23,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C22,42.553,22.447,43,23,43 z M24,38h4v3h-4V38z"
													></path>
													<path
														fill="#ffffff"
														d="M35,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C34,42.553,34.447,43,35,43 z M36,38h4v3h-4V38z"
													></path>
													<path
														fill="#ffffff"
														d="M47,43h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C46,42.553,46.447,43,47,43 z M48,38h4v3h-4V38z"
													></path>
													<path
														fill="#ffffff"
														d="M11,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C10,31.553,10.447,32,11,32 z M12,27h4v3h-4V27z"
													></path>
													<path
														fill="#ffffff"
														d="M23,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C22,31.553,22.447,32,23,32 z M24,27h4v3h-4V27z"
													></path>
													<path
														fill="#ffffff"
														d="M35,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C34,31.553,34.447,32,35,32 z M36,27h4v3h-4V27z"
													></path>
													<path
														fill="#ffffff"
														d="M47,32h6c0.553,0,1-0.447,1-1v-5c0-0.553-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1v5C46,31.553,46.447,32,47,32 z M48,27h4v3h-4V27z"
													></path>
													<path
														fill="#ffffff"
														d="M60,4h-7V3c0-1.657-1.343-3-3-3s-3,1.343-3,3v1H17V3c0-1.657-1.343-3-3-3s-3,1.343-3,3v1H4 C1.789,4,0,5.789,0,8v52c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V8C64,5.789,62.211,4,60,4z M49,3c0-0.553,0.447-1,1-1 s1,0.447,1,1v3v4c0,0.553-0.447,1-1,1s-1-0.447-1-1V6V3z M13,3c0-0.553,0.447-1,1-1s1,0.447,1,1v3v4c0,0.553-0.447,1-1,1 s-1-0.447-1-1V6V3z M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V17h60V60z M62,15H2V8c0-1.104,0.896-2,2-2h7v4 c0,1.657,1.343,3,3,3s3-1.343,3-3V6h30v4c0,1.657,1.343,3,3,3s3-1.343,3-3V6h7c1.104,0,2,0.896,2,2V15z"
													></path>
												</g>
											</g>
										</svg>
									</span>

									<p class="text text-graysoft ml-2 font-normal text-sm">
										${module.getDate(dateUnix, timezone)}
									</p>
								</li>
								<li class="meta-item flex items-center mt-2">
									<span class="m-icon">
										<svg
											fill="#ffffff"
											width="16px"
											height="16px"
											viewBox="0 0 32 32"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
											<g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round"
											></g>
											<g id="SVGRepo_iconCarrier">
												<path
													d="M16.114-0.011c-6.559 0-12.114 5.587-12.114 12.204 0 6.93 6.439 14.017 10.77 18.998 0.017 0.020 0.717 0.797 1.579 0.797h0.076c0.863 0 1.558-0.777 1.575-0.797 4.064-4.672 10-12.377 10-18.998 0-6.618-4.333-12.204-11.886-12.204zM16.515 29.849c-0.035 0.035-0.086 0.074-0.131 0.107-0.046-0.032-0.096-0.072-0.133-0.107l-0.523-0.602c-4.106-4.71-9.729-11.161-9.729-17.055 0-5.532 4.632-10.205 10.114-10.205 6.829 0 9.886 5.125 9.886 10.205 0 4.474-3.192 10.416-9.485 17.657zM16.035 6.044c-3.313 0-6 2.686-6 6s2.687 6 6 6 6-2.687 6-6-2.686-6-6-6zM16.035 16.044c-2.206 0-4.046-1.838-4.046-4.044s1.794-4 4-4c2.207 0 4 1.794 4 4 0.001 2.206-1.747 4.044-3.954 4.044z"
												></path>
											</g>
										</svg>
									</span>
									<p class="location-now ml-2 text-graysoft">${name},${country}</p>
								</li>
							</ul>
		`;

    currentWeatherSection.appendChild(card);

    ///Получение погоды на сегодня, рендер блока погоды на сегодня

    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 }
        }
      ] = airPollution.list;

      const card = document.createElement('div');
      card.classList.add('card', 'p-6');

      card.innerHTML = `
			  <h2 class="text-white text-xl">Сегодня</h2>
							<div class="highlight-list lg:flex lg:flex-wrap">
								<div
									class="hightlight-card one mt-5 bg-darker p-5 rounded-xl lg:w-full"
								>
									<h3 class="card-title text-graysoft text-xl mb-10 ">
										Качество воздуха
									</h3>
									<div class="wrapper flex">
										<span
											><img
												class="h-12 w-12 mr-7"
												src="./icons/weathers-icons/wind.png"
												alt=""
										/></span>
										<ul class="card-list grid grid-cols-2 gap-2 md:flex lg:flex lg:w-full ">
											<li class="card-item mr-6">
												<p class="text-graysoft font-normal text-xs">
													PM <sub>2.5</sub>
												</p>
												<p class="text-white font-normal text-3xl">${Number(pm2_5).toPrecision(3)}</p>
											</li>
											<li class="card-item mr-6">
												<p class="text-graysoft font-normal text-xs">
													SO <sub>2</sub>
												</p>
												<p class="text-white font-normal text-3xl">${Number(so2).toPrecision(3)}</p>
											</li>
											<li class="card-item mr-6">
												<p class="text-graysoft font-normal text-xs">
													NO <sub>2</sub>
												</p>
												<p class="text-white font-normal text-3xl">${Number(no2).toPrecision(3)}</p>
											</li>
											<li class="card-item">
												<p class="text-graysoft font-normal text-xs">
													O <sub>3</sub>
												</p>
												<p class="text-white font-normal text-3xl">${Number(o3).toPrecision(3)}</p>
											</li>
										</ul>
									</div>
								</div>
								<div
									class="hightlight-card mt-5 bg-darker p-5 rounded-xl lg:w-full"
								>
									<h3 class="card-title text-graysoft text-xl mb-10">
										Восход, Закат
									</h3>
									<div class="cark-list flex flex-col md:flex-row md:justify-between ">
										<div class="card-item flex items-center mb-8 md:mb-0 md:mr-12">
											<span
												><img
													class="h-12 w-12 mr-3"
													src="./icons/weathers-icons/sunrise.png"
													alt=""
											/></span>
											<div>
												<p class="text-graysoft font-normal text-xs">Восход</p>
												<p class="text-white font-normal text-3xl">${module.getTime(
                          sunriseUnixUTC,
                          timezone
                        )}</p>
											</div>
										</div>

										<div class="card-item flex items-center">
											<span
												><img
													class="h-12 w-12 mr-3"
													src="./icons/weathers-icons/sunset.png"
													alt=""
											/></span>
											<div>
												<p class="text-graysoft font-normal text-xs">Закат</p>
												<p class="text-white font-normal text-3xl">${module.getTime(
                          sunsetUnixUTC,
                          timezone
                        )}</p>
											</div>
										</div>
									</div>
								</div>
							<div class="sm:flex lg:grid lg:grid-cols-2 lg:gap-2 lg:w-full">
							<div
									class="hightlight-card mt-5 bg-darker p-5 rounded-xl h-40"
								>
									<h3 class="card-title text-graysoft text-xl mb-10">
										Влажность
									</h3>

									<div class="card-list">
										<div class="card-item flex justify-between items-center">
											<span
												><img
													class="h-12 w-12 mr-3"
													src="./icons/weathers-icons/humidity.png"
													alt=""
											/></span>
											<p class="text-white font-normal text-3xl">
												${humidity} <sup>%</sup>
											</p>
										</div>
									</div>
								</div>
								<div
									class="hightlight-card mt-4 bg-darker p-5 rounded-xl h-40"
								>
									<h3 class="card-title text-graysoft text-xl mb-10">
										Давление
									</h3>

									<div class="card-list">
										<div class="card-item flex justify-between items-center">
											<span
												><img
													class="h-12 w-12 mr-3"
													src="./icons/weathers-icons/pressure.png"
													alt=""
											/></span>
											<p class="text-white font-normal text-3xl">
												${pressure} <sup>hPa</sup>
											</p>
										</div>
									</div>
								</div>
								<div
									class="hightlight-card mt-5 bg-darker p-5 rounded-xl h-40"
								>
									<h3 class="card-title text-graysoft text-xl mb-10">
										Видимость
									</h3>

									<div class="card-list">
										<div class="card-item flex justify-between items-center">
											<span
												><img
													class="h-12 w-12 mr-3"
													src="./icons/weathers-icons/visibility.png"
													alt=""
											/></span>
											<p class="text-white font-normal text-3xl">
												${visibility / 1000} <sub>km</sub>
											</p>
										</div>
									</div>
								</div>
								<div
									class="hightlight-card mt-5 bg-darker p-5 rounded-xl h-40"
								>
									<h3 class="card-title text-graysoft text-xl mb-10">
										Чувствуется как
									</h3>

									<div class="card-list">
										<div class="card-item flex justify-between items-center">
											<span
												><img
													class="h-12 w-12 mr-3"
													src="./icons/weathers-icons/temperature.png"
													alt=""
											/></span>
											<p class="text-white font-normal text-3xl">${parseInt(feels_like)}&deg;</p>
										</div>
									</div>
								</div>
							</div>

							</div>
									`;

      highlightSection.appendChild(card);

      //Почасовой прогноз погоды

      fetchData(url.forecast(lat, lon), function (forecast) {
        const {
          list: forecastList,
          city: { timezone }
        } = forecast;

        hourlySection.innerHTML = `
				    <h2 class="text-white text-xl">Сегодня в</h2>

						<div class="slider-container">
							<ul class="slider-list">
							
							</ul>
						</div>
				`;

        for (const [index, data] of forecastList.entries()) {
          if (index > 7) break;

          const {
            dt: dateTimeUnix,
            main: { temp },
            weather
          } = data;

          const [{ icon, description }] = weather;

          const tempLi = document.createElement('li');
          tempLi.classList.add(
            'slider-item',
            'mt-2',
            'bg-darker',
            'p-5',
            'rounded-xl',
            'h-16'
          );

          tempLi.innerHTML = `
                <div class="slider-card flex justify-between items-center">
										<div class="flex">
											<img
												src="icons/weathers-icons/${icon}.svg"
												alt="cloudy"
												class="weather-icon w-6 h-6"
											/>
											<p class="text-white ml-2 text-center">${parseInt(temp)}&deg;</p>
										</div>

										<p class="text-white text-center">${module.getHours(
                      dateTimeUnix,
                      timezone
                    )}:00</p>
									</div>
					`;

          hourlySection.querySelector('.slider-list').appendChild(tempLi);
        }

        //Прогноз погоды на 5 дней

        forecastSection.innerHTML = `
				<h2 class="text-white text-xl mb-2">Прогноз на 5 дней</h2>

						<div
							class="forecast-card p-6 bg-darkerblack rounded-2xl shadow-xl"
						>
							<ul class="forecast-list my-5">
								
							</ul>
							
						</div>
				`;

        for (let i = 7, len = forecastList.length; i < len; i += 8) {
          const {
            main: { temp_max },
            weather,
            dt_txt
          } = forecastList[i];

          const [{ icon, description }] = weather;

          const date = new Date(dt_txt);

          const li = document.createElement('li');

          li.classList.add(
            'card-item',
            'flex',
            'justify-between',
            'items-center',
            'mb-4'
          );

          li.innerHTML = `
					   <div class="icon-wrapper flex items-center">
										<img
											src="./icons/weathers-icons/${icon}.svg"
											alt="${description}"
											class="weather-icon h-6 w-6"
										/>
										<span>
											<p class="text-white ml-2">${parseInt(temp_max)} &deg</p>
										</span>
						 </div>
									<p class="text-graysoft">${date.getDate()}, ${
            module.monthNames[date.getMonth()]
          }</p>
									<p class="text-graysoft">${module.weekDayNames[date.getDay()]}</p>
							
					`;
          forecastSection.querySelector('.forecast-list').appendChild(li);
        }
      });
    });
  });
};
