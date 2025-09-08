document.addEventListener('DOMContentLoaded', function() {
  const API_KEY = 'EQkrmxtzIf3tKYRlxNuaHA1Ow40B4LHOSCGtbwZ54MqOD8gNAHckIIaf';
  const perPage = 4;
  const placeholderImage = 'https://via.placeholder.com/300?text=Placeholder+Image'; // Placeholder image URL
  const searchInput = document.getElementById('search-input');
  const imageList = document.getElementById('image-list');
  const sectionHeading = document.querySelector('.section-heading');
  const firstImageSection = document.getElementById('first-image-section');
  const favoriteListSection = document.getElementById('favorite-list-section');
  const favoriteList = document.getElementById('favorite-list');
  let favoriteSlider;

  // Function to fetch images based on the query
  function fetchImages(query) {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`;

    fetch(url, {
      headers: {
        Authorization: API_KEY
      }
    }).then(response => response.json())
      .then(data => {
        // Populate the "Similar Results" slider
        populateSimilarResults(data, query);

        // Populate the first image section
        if (data.photos.length > 0) {
          const firstImage = data.photos[0];
          populateFirstImage(firstImage);
        } else {
          // If no results, populate with placeholder
          populateFirstImage({ alt: 'No results', photographer: 'Unknown', src: { medium: placeholderImage } });
        }
      })
      .catch(error => {
        console.error('Error Found', error);
      });
  }

  // Function to populate the "Similar Results" slider
  function populateSimilarResults(data, query) {
    imageList.innerHTML = ''; // Clear the existing images
    if (data.photos.length > 0) {
      data.photos.forEach(photo => {
        const listItem = document.createElement('li');
        listItem.className = 'splide__slide';
        listItem.innerHTML = `
          <div class="image-card">
            <img src="${photo.src.medium}" alt="${photo.alt}" />
            <div class="image-info">
              <p class='photo-details'>${photo.alt} || ${query}</p>
              <p class='photographer-para'> ${photo.photographer}</p>
              <div class='heart-div'>
                 <span class="heart-icon">&hearts;</span>
              </div>
            </div>
          </div>
        `;
        imageList.appendChild(listItem);

        // Add click event listener to the heart icon
        listItem.querySelector('.heart-icon').addEventListener('click', function() {
          this.classList.toggle('favorite');
          if (this.classList.contains('favorite')) {
            addToFavorites(photo.src.medium, photo.alt, photo.photographer);
          } else {
            removeFromFavorites(photo.src.medium);
          }
        });
      });
    } else {
      const listItem = document.createElement('li');
      listItem.className = 'splide__slide';
      listItem.innerHTML = `
        <div class="image-card">
          <img src="${placeholderImage}" alt="No results" />
          <div class="image-info">
            <p>No results || ${query}</p>
            <p>Photographer: Unknown</p>
            <span class="heart-icon">&hearts;</span>
          </div>
        </div>
      `;
      imageList.appendChild(listItem);
    }

    new Splide('#image-slider', {
      type: 'loop',
      perPage: 4,
      autoplay: true,
      gap: '1rem',
      pagination: true,
      arrows: true,
      breakpoints: {
        1200: {
          perPage: 3,
        },
        768: {
          perPage: 2,
        },
        480: {
          perPage: 1,
        }
      }
    }).mount();
  }

  // Function to populate the first image section
  function populateFirstImage(imageData) {
    firstImageSection.innerHTML = `
      <div class='main-img'>
        <img src="${imageData.src.medium}" alt="${imageData.alt}" />
        <div class="first-image-info">
          <p class='img-alt'>${imageData.alt}</p>
          <p class='pg-name'>${imageData.photographer}</p>
          <button class='explore-btn'>Explore More</button>
        </div>
      </div>
    `;
  }

  // Function to add an image to the favorite list
  function addToFavorites(imageUrl, altText, photographer) {
    // Check if the image is already in the favorite list
    const favoriteItems = favoriteList.querySelectorAll('li');
    for (const item of favoriteItems) {
      if (item.querySelector('img').src === imageUrl) {
        return; // Image is already in the favorite list, so return
      }
    }

    // Image is not in the favorite list, so add it
    const favoriteItem = document.createElement('li');
    favoriteItem.className = 'splide__slide';
    favoriteItem.innerHTML = `
      <div class="image-card">
        <img src="${imageUrl}" alt="${altText}" />
        <div class="image-info">
          <p class='photo-details'>${altText}</p>
          <p class='photographer-para'>${photographer}</p>
          <div class='heart-div'>
            <span class="heart-icon favorite">&hearts;</span>
          </div>
        </div>
      </div>
    `;
    favoriteList.appendChild(favoriteItem);

    // Add click event listener to the heart icon in the favorite list
    favoriteItem.querySelector('.heart-icon').addEventListener('click', function() {
      removeFromFavorites(imageUrl);
    });

    // Initialize or refresh the Splide slider for the favorite list
    if (!favoriteSlider) {
      favoriteSlider = new Splide('#favorite-slider', {
        type: 'loop',
        perPage: 4, // Initially set to 1, will adjust based on items
        autoplay: true,
        gap: '1rem',
        pagination: true,
        arrows: true,
        breakpoints: {
          1200: {
            perPage: 3,
          },
          768: {
            perPage: 2,
          },
          480: {
            perPage: 1,
          }
        }
      }).mount();
    } else {
      favoriteSlider.refresh();
    }
  }

  // Function to remove an image from the favorite list
  function removeFromFavorites(imageUrl) {
    const favoriteItems = favoriteList.querySelectorAll('li');
    favoriteItems.forEach(item => {
      if (item.querySelector('img').src === imageUrl) {
        item.remove();

        // Remove the red heart icon from the Similar Results section
        const similarItems = imageList.querySelectorAll('li');
        similarItems.forEach(similarItem => {
          if (similarItem.querySelector('img').src === imageUrl) {
            const heartIcon = similarItem.querySelector('.heart-icon');
            if (heartIcon) {
              heartIcon.classList.remove('favorite');
            }
          }
        });
      }
    });

    // Refresh the Splide slider for the favorite list
    if (favoriteSlider) {
      favoriteSlider.refresh();
    }
  }

  // Initial fetch with placeholder images
  function loadPlaceholderImages() {
    imageList.innerHTML = ''; // Clear the existing images
    for (let i = 0; i < perPage; i++) {
      const listItem = document.createElement('li');
      listItem.className = 'splide__slide';
      listItem.innerHTML = `
        <div class="image-card">
          <img src="${placeholderImage}" alt="Placeholder" />
          <div class="image-info">
            <p>Placeholder || Placeholder</p>
            <p>Photographer: Unknown</p>
            <div class='heart-div'>
              <span class="heart-icon">&hearts;</span>
            </div>
          </div>
        </div>
      `;
      imageList.appendChild(listItem);
    }

    new Splide('#image-slider', {
      type: 'loop',
      perPage: 4,
      autoplay: true,
      gap: '1rem',
      pagination: true,
      arrows: true,
      breakpoints: {
        1200: {
          perPage: 3,
        },
        768: {
          perPage: 2,
        },
        480: {
          perPage: 1,
        }
      }
    }).mount();
  }

  // Load placeholder images initially
  loadPlaceholderImages();

  // Event listener for input field
  searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        sectionHeading.style.display = 'block'; // Show the heading
        favoriteListSection.style.display = 'block'; // Show the favorite list section
        fetchImages(query);
      } else {
        sectionHeading.style.display = 'none'; // Hide the heading
        favoriteListSection.style.display = 'none'; // Hide the favorite list section
        loadPlaceholderImages();
      }
    }
  });

  // Hide the heading and favorite list section initially
  sectionHeading.style.display = 'none';
  favoriteListSection.style.display = 'none';
});
