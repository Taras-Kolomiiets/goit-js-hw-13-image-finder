import './css/styles.css';
import ImagesApiService from './js/apiService';

import ImageTpl from './templates/image.hbs';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
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
  imagesApiService.fetchImages().then( images  => {
    console.log(`images`, images );
    appendImagesMarkup( images );
  });
}

function appendImagesMarkup(images) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', ImageTpl(images.hits));
}

