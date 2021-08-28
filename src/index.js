import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash/debounce';
import CountryCardTpl from './templates/country-Card.hbs';
import CountriesListTpl from './templates/countriesList.hbs';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  countriesList: document.querySelector('.js-card-container'),
}

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  const searchQuery = e.target.value;

  if (searchQuery === '') {
    clearCountriesContainer();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 1 && countries.length <= 10) {
        renderCountriesList(countries);
        return;
      }

      if (countries.length === 1) {
        renderCountryCard(countries);
        return;
      }

      if (countries.length > 10) {
        onFetchError();
        return;
      }

      clearCountriesContainer();
      error({
        title: 'Oops!',
        text: 'You entered a non-existent country.',
        width: '300px',
        delay: 2000,
        sticker: false,
        closer: false,
       });
    })
  .catch(onFetchError)
}

function renderCountriesList(countries) {
  refs.countriesList.innerHTML = CountriesListTpl(countries);
}

function renderCountryCard(countries) {
  refs.countriesList.innerHTML = CountryCardTpl(countries[0]);
}

function clearCountriesContainer() {
  refs.countriesList.innerHTML = '';
}

function onFetchError() {
  clearCountriesContainer();
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    width: '300px',
    delay: 2000,
    sticker: false,
    closer: false,
});
}