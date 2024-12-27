const apiUrl = "http://localhost:3000/api/restaurants";
let allRestaurants = [];

async function fetchRestaurants() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  allRestaurants = data;
  populateCuisineFilter(data);
  displayRestaurants(data);
}

function displayRestaurants(restaurants) {
  const container = document.querySelector(".restaurant-list");
  container.innerHTML = "";
  restaurants.forEach((r) => {
    const kitchenList = r.kitchen.join(", ");

    container.innerHTML += `
            <div class="restaurant-card">
                <img src="${r.picture}" alt="${r.name}">
                <h3>${r.name}</h3>
                <p class="kitchen">Kitchen: ${kitchenList}</p>
                <p class="rating">Rating: <i class="fa-solid fa-star"></i> ${r.rating}</p>
                <a href="./client/restaurant.html?id=${r.id}">Détails</a>
            </div>
        `;
  });
}

fetchRestaurants();

document.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    // Adjust the scroll threshold as needed
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

function populateCuisineFilter(restaurants) {
  const filterSelect = document.getElementById("filterCuisine");
  const uniqueKitchens = new Set();

  // Collect unique kitchens from all restaurants
  restaurants.forEach((r) => {
    r.kitchen.forEach((k) => uniqueKitchens.add(k));
  });

  // Populate the select dropdown with unique kitchen types
  uniqueKitchens.forEach((kitchen) => {
    const option = document.createElement("option");
    option.value = kitchen;
    option.textContent = kitchen;
    filterSelect.appendChild(option);
  });
}

// Search functionality by search

document.getElementById("search").addEventListener("keyup", () => {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const filteredRestaurants = allRestaurants.filter((r) =>
    r.name.toLowerCase().includes(searchInput)
  );
  if (filteredRestaurants.length) {
    document.querySelector(".restaurant-list").innerHTML = "";
    displayRestaurants(filteredRestaurants);
  } else {
    document.querySelector(".restaurant-list").innerHTML = "Aucun résultat";
  }

  displayRestaurants(filteredRestaurants);
});

// Filter functionality by cuisine
document.getElementById("filterCuisine").addEventListener("change", () => {
  const selectedCuisine = document.getElementById("filterCuisine").value;
  const filteredRestaurants = allRestaurants.filter((r) =>
    r.kitchen.includes(selectedCuisine)
  );
  displayRestaurants(filteredRestaurants);
});
