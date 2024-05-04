const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");





// API key , pagination,searchTerm variables
const apiKey = "Jxek7U7fLp3fJoCJN8vWx0xO6Y8cApgJ2eIlOjqJUDk6dDa6RdFsSWux";
const perPage = 15;
let currentPage = 1;
let searchTerm=null

const downloadImg = (imgURL) => {
  // converting received img to blob, creating its download link, & downloading it
  fetch(imgURL)
    .then(res => res.blob())
    .then(file => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      // Set a meaningful filename with appropriate extension
      a.download = `image_${new Date().getTime()}.jpg`; // Example: "image_123456789.jpg"
      a.click();
    })
    .catch(() => alert("Failed to download image!"))
}

const showLightbox = (name,img) => {
  // showing lightbox and setting img source,name and button attribute
  lightBox.querySelector("img").src=img;
  lightBox.querySelector("span").innerText=name;
  downloadImgBtn.setAttribute("data-img",img);
  lightBox.classList.add("show")
  document.body.style.overflow="hidden"
}


const hideLightbox = () => {
  lightBox.classList.remove("show")
  document.body.style.overflow="auto"

}


const generateHTML = (images) => {
  // making li of all fetched images and adding them to the existing image wrapper
  imagesWrapper.innerHTML += images.map((img) =>
    `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large ?? img.src.medium}')">
      <img src="${img.src.large ?? img.src.medium}" alt="img">
      <div class="details">
          <div class="photographer">
              <i class="uil uil-camera"></i>
              <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large ?? img.src.medium}');event.stopPropagation();">
            <i class="uil uil-import"></i>
          </button>
      </div>
    </li>`
).join("");
}


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
    }).catch(() => 
     alert("Failed to load images!"));
};

const loadMoreImages= () =>{
    // increment currentpage by 1
    currentPage++; 
    // if search term has some value then call api with search term else call default api
    let apiURL=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // if search input is empty set the search term else call default api
    if(e.target.value === "")return searchTerm = null;
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
closeBtn.addEventListener("click",hideLightbox)
downloadImgBtn.addEventListener("click",(e) => downloadImg(e.target.dataset.img))



