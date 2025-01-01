import { tileData } from './tileData.js';

// Sticky header functionality
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// Add popup HTML for carousel
const popupHtml = `
  <div id="popup" class="popup hidden">
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <div class="popup-left">
        <div class="carousel">
          <button class="carousel-btn prev-btn">&#8249;</button>
          <img id="carousel-img" src="" alt="Popup Image" />
          <button class="carousel-btn next-btn">&#8250;</button>
        </div>
      </div>
      <div class="popup-right">
        <h2 id="popup-title">Item Title</h2>
        <p id="popup-description">
          This is a detailed description of the selected item. Click an image to see more details.
        </p>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', popupHtml);

// Add popup HTML for contact form
const contactPopupHtml = `
  <div id="contact-popup" class="popup hidden">
    <div class="popup-contact">
      <span class="close-btn">&times;</span>
      <h2 class="contactUs">Piece Enquiry</h2>
      <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label for="piece-section">Piece Section:</label>
        <input type="text" id="piece-section" name="piece-section" required />

        <button type="submit" id="submit-btn">Submit</button>
        <span id="loading-spinner" class="hidden">Sending...</span>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', contactPopupHtml);

document.addEventListener("DOMContentLoaded", () => {
  // Carousel Popup Elements
  const popup = document.querySelector("#popup");
  const popupTitle = document.querySelector("#popup-title");
  const popupDescription = document.querySelector("#popup-description");
  const carouselImg = document.querySelector("#carousel-img");
  const closeBtn = popup.querySelector(".close-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const tiles = document.querySelectorAll(".tile");

  // Carousel Variables
  let currentImageIndex = 0;
  let currentImages = [];

  // Function to update carousel image
  function updateCarouselImage() {
    if (!Array.isArray(currentImages) || currentImages.length === 0) {
      console.error("No images available for the carousel.");
      return;
    }
    carouselImg.src = currentImages[currentImageIndex];
  }

  // Add click event listeners to tiles
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => {
      const data = tileData[index];
      if (data && Array.isArray(data.imgSrcArray) && data.imgSrcArray.length > 0) {
        currentImages = data.imgSrcArray;
        currentImageIndex = 0;
        updateCarouselImage();

        popupTitle.textContent = data.title;
        popupDescription.textContent = data.description;

        // Show the popup
        popup.classList.add("active");
      } else {
        console.error(`Invalid data or empty imgSrcArray for tile at index ${index}.`);
      }
    });
  });

  // Close carousel popup
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  // Close carousel popup when clicking outside the content
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
    }
  });

  // Navigate to the previous image
  prevBtn.addEventListener("click", () => {
    if (currentImages.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      updateCarouselImage();
    }
  });

  // Navigate to the next image
  nextBtn.addEventListener("click", () => {
    if (currentImages.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      updateCarouselImage();
    }
  });

  // Contact Popup Elements
  const contactLink = document.querySelector("a[href='']");
  const contactPopup = document.querySelector("#contact-popup");
  const closeContactBtn = contactPopup.querySelector(".close-btn");
  const contactForm = document.querySelector("#contact-form");
  const submitBtn = document.querySelector("#submit-btn");
  const loadingSpinner = document.querySelector("#loading-spinner");

  // Show contact popup
  if (contactLink) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      contactPopup.classList.add("active");
    });
  }

  // Close contact popup
  closeContactBtn.addEventListener("click", () => {
    contactPopup.classList.remove("active");
  });

  // Close contact popup when clicking outside the content
  contactPopup.addEventListener("click", (e) => {
    if (e.target === contactPopup) {
      contactPopup.classList.remove("active");
    }
  });

  // Handle form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const from_name = document.querySelector("#name").value.trim();
    const from_email = document.querySelector("#email").value.trim();
    const piece_selection = document.querySelector("#piece-section").value.trim();

    // Input validation
    if (!from_name || !from_email || !piece_selection) {
      alert("Please fill out all fields.");
      return;
    }

    // Show spinner
    submitBtn.disabled = true;
    loadingSpinner.classList.remove("hidden");

    emailjs.send('service_3zgmef8', 'template_1pu6g7d', {
        from_name,
        from_email,
        piece_selection,
    }, 'lorZfMC0AT_xk78rh')
    .then(() => {
      alert("Message sent successfully!");
      contactPopup.classList.remove("active");
      contactForm.reset();
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try again later.");
    })
    .finally(() => {
      // Hide spinner and re-enable button
      submitBtn.disabled = false;
      loadingSpinner.classList.add("hidden");
    });
  });
});
