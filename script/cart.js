(() => {
  const cartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartContainer = document.getElementById("cartContainer");
  const productBuy = document.getElementById("productBuy");
  const localStorageKey = "cart";
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const totalQty = document.getElementById("totalQty");
  const totalPrice = document.getElementById("totalPrice");

  cartBtn.addEventListener("click", () => {
    closeCartBtn.classList.toggle("d-none");
  });

  const getProduct = async (productId) => {
    const product = await fetch(`https://dummyjson.com/products/${productId}`);
    if (product.status === 200) {
      return await product.json();
    }
  };

  const buyCartProducts = (product, productQty = 1, productPrice) => {
    const container = document.createElement("div");
    container.setAttribute(
      "class",
      "d-flex gap-2 align-items-center  border-bottom pb-3"
    );
    container.setAttribute("id", product.id);

    const img = document.createElement("img");
    img.setAttribute("class", " w-50p");
    img.setAttribute("src", product.thumbnail);
    container.appendChild(img);

    const linkProduct = document.createElement("a");
    linkProduct.setAttribute(
      "class",
      "fs-6 fw-normal text-decoration-none flex-fill"
    );
    linkProduct.setAttribute("href", `/product.html?id=${product.id}`);
    linkProduct.textContent = product.title;
    container.appendChild(linkProduct);

    const quantityProducts = document.createElement("p");
    quantityProducts.setAttribute("class", "text-dark fw-light m-0");
    quantityProducts.textContent = `x`;
    const span = document.createElement("span");
    span.textContent = productQty;
    quantityProducts.appendChild(span);
    container.appendChild(quantityProducts);

    const discount = product.discountPercentage / 100;
    const discountPrice = (product.price - product.price * discount).toFixed(2);

    const price = document.createElement("p");
    price.setAttribute("class", "text-danger fw-bolder m-0");
    price.textContent = `$`;
    const priceNumber = document.createElement("span");
    priceNumber.textContent = productPrice
      ? productPrice.toFixed(2)
      : discountPrice;
    price.appendChild(priceNumber);
    container.appendChild(price);

    const removeProduct = document.createElement("i");
    removeProduct.setAttribute(
      "class",
      "fa-solid fa-x text-secondary-emphasis"
    );
    removeProduct.style.cursor = "pointer";
    removeProduct.addEventListener("click", () => {
      container.remove();
      const cartData = JSON.parse(localStorage.getItem(localStorageKey)) || [];
      const newCartData = cartData.filter(
        (element) => element.id !== product.id
      );
      const productToRemove = cartData.find(
        (element) => element.id === product.id
      );

      localStorage.setItem(localStorageKey, JSON.stringify(newCartData));
      totalQty.textContent = newCartData.length;

      totalPrice.textContent = (
        Number(totalPrice.innerHTML) -
        (productPrice ? productPrice : discountPrice * productToRemove.qty)
      ).toFixed(2);
    });
    container.appendChild(removeProduct);

    if (cartContainer) {
      cartContainer.appendChild(container);
    }
  };

  const updateCart = (cartProduct, product) => {
    const qty = cartProduct.childNodes.item(2).children[0];
    const price = cartProduct.childNodes.item(3).children[0];
    const discount = product.discountPercentage / 100;
    const discountPrice = (product.price - product.price * discount).toFixed(2);

    qty.textContent = Number(qty.innerText) + 1;
    price.textContent = (discountPrice * Number(qty.innerText)).toFixed(2);
  };

  productBuy &&
    productBuy.addEventListener("click", async () => {
      const jsonProduct = await getProduct(id);
      const cartProduct = [...cartContainer.children].find(
        (element) => element.id == jsonProduct.id
      );

      if (!cartProduct) {
        buyCartProducts(jsonProduct);
      } else {
        updateCart(cartProduct, jsonProduct);
      }

      const cartData = JSON.parse(localStorage.getItem(localStorageKey)) || [];

      const lsProduct = cartData.find(
        (element) => element.id === jsonProduct.id
      );

      if (!lsProduct) {
        cartData.push({ id: jsonProduct.id, qty: 1 });
        localStorage.setItem(localStorageKey, JSON.stringify(cartData));
        totalQty.textContent = cartData.length;
      } else {
        const newCartData = cartData.map((element) => {
          if (element.id === jsonProduct.id) {
            return { ...element, qty: element.qty + 1 };
          } else {
            return element;
          }
        });

        localStorage.setItem(localStorageKey, JSON.stringify(newCartData));
        totalQty.textContent = newCartData.length;
      }
      const discount = jsonProduct.discountPercentage / 100;
      const discountPrice = (
        jsonProduct.price -
        jsonProduct.price * discount
      ).toFixed(2);
      totalPrice.textContent = (
        Number(totalPrice.innerHTML) + Number(discountPrice)
      ).toFixed(2);
    });

  document.addEventListener("DOMContentLoaded", async () => {
    const cartData = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    let totalProductPrice = 0;

    await cartData.forEach(async (element) => {
      const jsonProduct = await getProduct(element.id);
      let price = jsonProduct.price * element.qty;
      buyCartProducts(jsonProduct, element.qty, price);

      totalProductPrice += price;
      totalPrice.textContent = totalProductPrice.toFixed(2);
    });
    totalQty.textContent = cartData.length;
  });
})();
