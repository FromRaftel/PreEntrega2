// Función para obtener los productos desde el servidor
async function getProducts() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // En caso de error, retorna un arreglo vacío
  }
}

// Función para mostrar los productos en la página
async function showProducts() {
  const productList = document.getElementById('product-list');
  const products = await getProducts(); // Obtiene los productos desde el servidor

  // Si hay productos, muestra cada uno en la página
  if (products && products.length > 0) {
    productList.innerHTML = ''; // Limpia el contenido del div antes de mostrar los productos

    products.forEach((product) => {
      const productItem = document.createElement('div');
      productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
      `;
      productList.appendChild(productItem);
    });
  } else {
    productList.innerHTML = '<p>No hay productos disponibles.</p>'; // Mensaje si no hay productos
  }
}

// Ejecuta la función para mostrar los productos cuando la página se carga
window.addEventListener('load', showProducts);
