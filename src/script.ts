let isInitialLoad = true;

// Unsplash API
let initialCount = 5;
const apiKey = "fvKLfGSyf2etmg7wZCOrngWd4L0pxS8z7vbDx6xPzmk";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// DOM elements
const loader = document.getElementById("loader")! as HTMLDivElement;
const scrollImageContainer = document.getElementById(
  "scroll__image-container"
)! as HTMLDivElement;

let ready = false;
let imagesLoadedNum = 0;
let totalImages = 0;

const updateAPIURLWithNewCount = function (picCount = initialCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
};

// Check if all images were loaded
const imageLoaded = function () {
  ++imagesLoadedNum;
  if (imagesLoadedNum === totalImages) {
    ready = true;
    loader.classList.add("hidden");
  }
};

// Get photos from Unsplash API
const getPhotos = async function () {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Create image elements and insert them into the DOM
    createImageElement(data);

    if (isInitialLoad) {
      updateAPIURLWithNewCount(10);
      isInitialLoad = false;
    }
  } catch (err) {
    loader.classList.add("hidden");
    scrollImageContainer.innerHTML = `Sorry, an error occured while fetching the images due to reaching requests limit!<br/>Please try reloading after an hour.`;
    throw err;
  }
};
getPhotos();

const createImageElement = function (imagesArr: any[]) {
  totalImages += imagesArr.length;
  imagesArr.forEach((imgObj: any) => {
    const id = imgObj.id;
    const link = imgObj.links.html;
    const imgUrl = imgObj.urls.regular;
    const altText = imgObj.alt_description;

    const html = `<a href="${link}" target="_blank" data-link-id="${id}"><img src="${imgUrl}" alt="${altText}" title="${altText}" class="scroll__image" id="${id}" /></a>`;

    scrollImageContainer.insertAdjacentHTML("beforeend", html);

    const imageEl = document.getElementById(`${id}`)! as HTMLImageElement;
    imageEl.addEventListener("load", imageLoaded);
  });
};

document.addEventListener("scroll", function () {
  if (
    window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});
