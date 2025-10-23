import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector('.form');
const input = document.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let page = 1;
let totalHits = 0;


const PER_PAGE = 15;


form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.warning({ message: 'Please enter a search term!', position: 'topRight' });
    return;
  }


  if (query !== currentQuery) {
    currentQuery = query;
    page = 1;
    clearGallery();
    hideLoadMoreButton();
  } else {
    page = 1;
    clearGallery();
    hideLoadMoreButton();
  }

  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, page);

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      iziToast.info({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    totalHits = data.totalHits;

    createGallery(data.hits);

    const loadedSoFar = page * PER_PAGE;
    if (loadedSoFar < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ message: "We're sorry, but you've reached the end of search results.", position: 'topRight' });
    }

   if (page === 1) {
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ message: 'An error occurred while fetching images.', position: 'topRight' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreButton();
  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, page);

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      iziToast.info({ message: "We're sorry, but you've reached the end of search results.", position: 'topRight' });
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);


    const firstCard = gallery.querySelector('.gallery-item');
    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

     const loadedSoFar = page * PER_PAGE;
    if (loadedSoFar < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ message: "We're sorry, but you've reached the end of search results.", position: 'topRight' });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ message: 'An error occurred while fetching images.', position: 'topRight' });
  } finally {
    hideLoader();
  }
});
