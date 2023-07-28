const baseUrl = 'https://pixabay.com/api/?key=38504392-669850f0770e8c5d617675997&q=';
const listWrapper = document.getElementById('list');
const form = document.getElementById("search-form");
let current_page = 1;
let observer;

function createObserver() {
  if (observer) observer.disconnect();

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const lastChild = listWrapper.lastElementChild;

      if (entry.target !== lastChild) return;

      observer.unobserve(lastChild);
      const queryValue = form.elements.query.value;
      apiCall(queryValue, ++current_page);
    });
  }, options);

  observer.observe(listWrapper.lastElementChild);
}

const apiCall = (queryValue, page) => {
  const query = queryValue.replace(" ", "+");
  const url = `${baseUrl}${query}&page=${page}`

  fetch(url)
    .then(response => response.json())
    .then(json => {
      const responseData = json.hits;

      if (!responseData) listWrapper.innerHTML += `<p>Images not found</p>`;

      responseData.forEach(el => {
        const liContent = `
        <li>
          <a onclick="showImage('${el.largeImageURL}')">
            <img src="${el.webformatURL}" data-source="${el.largeImageURL}" alt="${el.tags}" />
          </a>
        </li>
        `;
        listWrapper.insertAdjacentHTML('beforeend', liContent);
      });

      createObserver();
    }).catch(() => listWrapper.innerHTML += `<p>Not other image was found</p>`);
}

const resetDOM = () => {
  listWrapper.innerHTML = '';
  current_page = 1;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const queryValue = event.target[0].value;
  if (!queryValue) return;

  resetDOM();

  apiCall(queryValue, current_page);
});

const showImage = (url) => {
  const instance = basicLightbox.create(`
    <img src="${url}">
  `)

  instance.show()
}

window.showImage = showImage;