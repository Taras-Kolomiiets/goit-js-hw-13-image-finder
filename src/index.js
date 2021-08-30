import './css/styles.css';
import ImagesApiService from './js/apiService';
import LoadMoreBtn from './js/load-more-btn';
import ImageTpl from './templates/image.hbs';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.min.css';

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

  imagesApiService.query = e.currentTarget.elements.query.value.trim();

  if (imagesApiService.query === '') {
    return new Notify({
      status: 'warning',
      title: 'Enter a search query!',
      text: 'Write what you want to find.',
      effect: 'fade',
      speed: 300,
      customClass: '',
      customIcon: '',
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 2000,
      gap: 20,
      distance: 20,
      type: 1,
      position: 'right top'
    });
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
    loadMoreBtn.enable();
    if (images.totalHits === 0) {
      loadMoreBtn.hide();
      return new Notify({
        status: 'error',
        title: 'Oops!',
        text: 'Sorry, there are no images matching your search query.',
        effect: 'fade',
        speed: 300,
        customClass: '',
        customIcon: '',
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 2000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      });
    }
  }).catch(error => {
    console.log(`error`, error)
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