const fetchRestaurantDetails = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      throw new Error("Restaurant ID is missing in the URL.");
    }

    const response = await fetch(`http://localhost:3000/api/restaurants/${id}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch restaurant details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    document.getElementById("restaurant-details").innerHTML = `
            <img src="${data.picture}" alt="${data.name}">
            <div class="info">
            <h1>${data.name}</h1>
            <p> <span>Adress:</span> ${data.address}</p>
            <p><span>Phone Number:</span> ${data.phone}</p>
            <p><span>Kitchen:</span> ${data.kitchen}</p>
            <p><span>Rating:</span> <i class="fa-solid fa-star"></i> ${data.rating}</p>
            <a href="${data.site}"><i class="fa-solid fa-globe"></i>Visit the website</a>
            </div>
        `;
  } catch (error) {
    console.error("An error occurred:", error);
    document.getElementById("restaurant-details").innerHTML = `
            <p>Une erreur s'est produite lors du chargement des détails du restaurant.</p>
        `;
  }
};

fetchRestaurantDetails();
