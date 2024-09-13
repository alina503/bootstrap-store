const inputSearch = document.getElementById("inputSearch");
const btnSearch = document.getElementById("btnSearch");
const searchProductsList = document.getElementById("searchProductsList");

let inputValue = "";

inputSearch.addEventListener("input", (event) => {
  inputValue = event.target.value;
});

const searchProducts = async (string) => {
  const products = await fetch(
    `https://dummyjson.com/products/search?q=${string}`
  );
  if (products.status === 200) {
    return await products.json();
  }
};

btnSearch.addEventListener("click", async (event) => {
  event.preventDefault();
  if (inputValue.length >= 3) {
    window.location.replace(`/search.html?q=${inputValue}`);
  }
});

const productSearchCard = (product) => {
  const col = document.createElement("div");
  col.setAttribute(
    "class",
    "col-12 col-sm-6 col-md-4 col-lg-3 mb-3 custom-card h-100"
  );
  const card = document.createElement("div");
  card.setAttribute("class", "card ");
  col.appendChild(card);

  const imgContainer = document.createElement("div");
  imgContainer.setAttribute("class", "w-full ratio ratio-4x3");
  const img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("src", product.thumbnail);
  imgContainer.appendChild(img);

  card.appendChild(imgContainer);

  const cardBody = document.createElement("div");
  cardBody.setAttribute(
    "class",
    "card-body d-flex justify-content-between flex-column"
  );

  const cardTitle = document.createElement("h5");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerHTML = product.title;
  const price = document.createElement("p");
  price.setAttribute("class", "card-text");
  price.innerHTML = `$${product.price}`;
  const btn = document.createElement("a");
  btn.setAttribute("class", "btn btn-primary");
  btn.setAttribute("href", `/product.html?id=${product.id}`);
  btn.innerHTML = "See Details";

  const priceContainerBtn = document.createElement("div");
  priceContainerBtn.appendChild(price);
  priceContainerBtn.appendChild(btn);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(priceContainerBtn);
  card.appendChild(cardBody);

  if (searchProductsList) {
    searchProductsList.appendChild(col);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (query) {
    const jsonProducts = await searchProducts(query);
    const products = jsonProducts.products;
    products.forEach((product) => {
      productSearchCard(product);
    });
  }
});
