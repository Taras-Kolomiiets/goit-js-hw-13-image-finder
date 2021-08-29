import './css/styles.css';
import ImagesApiService from './js/apiService';

import CountryCardTpl from './templates/country-Card.hbs';
import CountriesListTpl from './templates/countriesList.hbs';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  imagesContainer: document.querySelector('.js-images-container'),
};

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value;

  if (imagesApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  imagesApiService.resetPage();
  fetchImages();
}

function fetchImages() {
  imagesApiService.fetchImages().then(images => {
    console.log(`images`, images);
  });
}


