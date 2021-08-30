import './css/styles.css';
import ImagesApiService from './js/apiService';
import LoadMoreBtn from './js/load-more-btn';
import ImageTpl from './templates/image.hbs';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
};

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value;

  if (imagesApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();
  imagesApiService.fetchImages().then( images  => {
    appendImagesMarkup(images);
    console.log(`images`, images)
    loadMoreBtn.enable();
  });
}

function appendImagesMarkup(images) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', ImageTpl(images.hits));
  scrollpageBtn();
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function scrollpageBtn() {
  loadMoreBtn.refs.button.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: "nearest"
  });
}

refs.imagesContainer.addEventListener('click', (event) => {
  if (event.target.nodeName !== 'IMG') {
    return;
  };
  basicLightbox.create(`
    <img width="1400" height="900" src="${event.target.dataset['source']}">
	`).show()
})