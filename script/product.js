(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const productTitle = document.getElementById("productTitle");
  const productImgCarusel = document.getElementById("productImgCarusel");
  const productTotalPrice = document.getElementById("productTotalPrice");
  const productDiscount = document.getElementById("productDiscount");
  const productDiscountPrice = document.getElementById("productDiscountPrice");
  const productCategory = document.getElementById("productCategory");
  const productDescription = document.getElementById("productDescription");

  const getProduct = async () => {
    const product = await fetch(`https://dummyjson.com/products/${id}`);
    if (product.status === 200) {
      return await product.json();
    }
  };

  const caruselItem = (url, index) => {
    const slideClass = `carousel-item ${
      index === 0 ? "active" : ""
    } w-full ratio ratio-4x3`;

    const slide = document.createElement("div");
    slide.setAttribute("class", slideClass);
    const img = document.createElement("img");
    img.setAttribute("class", "d-block w-100");
    img.setAttribute("src", url);
    slide.appendChild(img);

    if (productImgCarusel) {
      productImgCarusel.appendChild(slide);
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const jsonProduct = await getProduct();

    jsonProduct.images?.forEach((url, index) => {
      caruselItem(url, index);
    });

    const discount = jsonProduct.discountPercentage / 100;
    const discountPrice = (
      jsonProduct.price -
      jsonProduct.price * discount
    ).toFixed(2);
    productTitle.innerHTML = jsonProduct.title;
    productTotalPrice.innerHTML = `$${jsonProduct.price}`;
    productDiscount.innerHTML = `-${jsonProduct.discountPercentage}%`;
    productDiscountPrice.innerHTML = `$${discountPrice}`;

    productCategory.innerHTML = jsonProduct.category;
    productDescription.innerHTML = jsonProduct.description;
  });
})();
