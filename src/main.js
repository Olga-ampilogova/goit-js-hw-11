import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
const item = document.querySelector('.gallery');
const inputValue = document.querySelector('.searchform')
const searchForm = document.querySelector('.search-form');
const animateLoad = document.querySelector('.animate');
animateLoad.style.visibility = 'hidden';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41618210-7d4eb9e03ab25b6c1f3452a1d';
let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250, captionsData: 'alt', close: true ,className: 'modal-style'});
gallery.on('show.simplelightbox', function () {
});

let searchParams = new URLSearchParams({
    key: '41618210-7d4eb9e03ab25b6c1f3452a1d',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
});

searchForm.addEventListener('submit', (event) => {
       event.preventDefault();
    if (inputValue.value.trim().length === 0) {
        return;
    }
    cleanScreen();
    showLoad();
    searchParams.set("q",inputValue.value);
    getPhotos();
    inputValue.value = '';
});

function getPhotos() {
    const fullQuery = `${BASE_URL}?${searchParams}`;
    showLoad();
    fetch(fullQuery)
        .then((response) => {
            if (!response.ok) {
                throw new Error('error');
            }
            return response.json();
        })
        .then(({ hits }) => {
            if (hits.length === 0) {
                iziToast.error({
                    title: 'Error',
                    position: 'topCenter',
                    message: "Sorry, there are no images matching your search query. Please try again!"
                });
            }
            let renderImages = hits.reduce(
                (html, image) =>
                    html +
                        ` <li class="gallery-item">
                            <a class="gallery-link" href="${image.largeImageURL}">
                            <img class="gallery-image" data-source=${image.largeImageURL} src=${image.webformatURL} alt = ${image.tags} width="360" height="200"/>
                            </a>
                            <div class= 'title'>
                            <p>Likes:<span class="value">${image.likes}</p>
                            <p>Views:<span class="value">${image.views}</span></p>
                            <p>Comments:<span class="value">${image.comments}</span></p>
                            <p>Downloads:<span class="value">${image.downloads}</span></p>
                            </div>
                       </li>`
                , '');
            item.innerHTML = renderImages;
            gallery.refresh();
            hideLoad();
        })
        .catch(() => {
              iziToast.error({
                title: 'Error',
                position: 'topCenter',
                message: "Exeptional error!"
            });
        });
}

function cleanScreen() {
    item.replaceChildren();
}

function hideLoad() {
    animateLoad.style.visibility = 'hidden';
      }
function showLoad() {
    animateLoad.style.visibility = 'visible';
      }













