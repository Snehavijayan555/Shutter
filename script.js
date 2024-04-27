const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");


// API key , pagination,searchTerm variables
const apiKey = "Jxek7U7fLp3fJoCJN8vWx0xO6Y8cApgJ2eIlOjqJUDk6dDa6RdFsSWux";
const perPage = 15;
let currentPage = 1;
let searchTerm=null

const generateHTML = (images) => {
    // making li of all fetched images and adding them to the existing image wrapper
  imagesWrapper.innerHTML += images.map((img) =>
    `<li class="card">
      <img src="${img.src.large ?? img.src.medium}" alt="img">
      <div class="details">
          <div class="photographer">
              <i class="uil uil-camera"></i>
              <span>${img.photographer}</span>
          </div>
          <button><i class="uil uil-import"></i></button>
      </div>
    </li>`
  ).join("");
};

const getImages = (apiURL) => {
    loadMoreBtn.innerText="Loading...";
    loadMoreBtn.classList.add("disabled")
  fetch(apiURL, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((res) => res.json()) // Parse the JSON response
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText="Load More";
    loadMoreBtn.classList.remove("disabled")
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
    });
};

const loadMoreImages= () =>{
    // increment currentpage by 1
    currentPage++; 
    let apiURL=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // if pressed key is Enter (key code 13), update the current page, search term, and call the getImages
    if(e.key === "Enter"){
       currentPage = 1;
       searchTerm = e.target.value;
       imagesWrapper.innerHTML = ""; // Clear existing images
       getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}



getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click",loadMoreImages)
searchInput.addEventListener("keyup",loadSearchImages)

