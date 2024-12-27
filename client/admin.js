const apiUrl = "http://localhost:3000/api/restaurants";
const restaurantList = document.getElementById("restaurantsList");
const searchInput = document.getElementById("searchInput");
let currentPage = 1; // Track the current page
const itemsPerPage = 6; // Number of restaurants per page
let restaurantsData = []; // Store all fetched restaurants

// Load restaurants when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(apiUrl);
  restaurantsData = await response.json(); // Store data for pagination
  displayPage(currentPage);
  setupPagination();
});

// Display restaurants for the current page
function displayPage(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = restaurantsData.slice(startIndex, endIndex);
  displayRestaurants(paginatedData);
}

// Display restaurants in the table
function displayRestaurants(restaurants) {
  restaurantList.innerHTML = ""; // Clear the list before displaying
  restaurants.forEach((r) => {
    restaurantList.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td class="info">${r.name}</td>
        <td class="info">${r.address}</td>
        <td class="info">${r.phone}</td>
        <td class="kitchen">${r.kitchen}</td>
        <td><img src="${r.picture}" alt="${r.name}" style="width: 50px; height: 50px;"></td>
        <td>${r.rating}</td>
        <td><a href="${r.site}" target="_blank">Lien</a></td>
        <td class="actions">
          <a id="edit" href="./addRestaurant.html?id=${r.id}"><i class="fa-solid fa-pen-to-square"></i></a>
          <button id="delete" onclick="deleteRestaurant(${r.id})"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

// Set up pagination buttons
function setupPagination() {
  const totalPages = Math.ceil(restaurantsData.length / itemsPerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = ""; // Clear existing buttons

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i;
      displayPage(currentPage);
      updatePaginationButtons();
    });
    paginationDiv.appendChild(button);
  }
}

// Update active state on pagination buttons
function updatePaginationButtons() {
  const buttons = document.querySelectorAll(".pagination-button");
  buttons.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Edit restaurant (populate form)
async function editRestaurant(id) {
  const response = await fetch(`${apiUrl}/${id}`);
  const restaurant = await response.json();

  document.getElementById("restaurantId").value = restaurant.id;
  document.getElementById("nom").value = restaurant.nom;
  document.getElementById("adresse").value = restaurant.adresse;
  document.getElementById("telephone").value = restaurant.telephone;
  document.getElementById("cuisine").value = restaurant.cuisine;
  document.getElementById("photo").value = restaurant.photo;
  document.getElementById("note").value = restaurant.note;
  document.getElementById("site_web").value = restaurant.site_web;
}

// Delete restaurant
async function deleteRestaurant(id) {
  if (confirm("Voulez-vous vraiment supprimer ce restaurant ?")) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    loadRestaurants();
  }
}

// Search restaurant by name or cuisine
async function searchRestaurant() {
  const searchTerm = searchInput.value.toLowerCase();
  const response = await fetch(apiUrl);
  const data = await response.json();

  const filteredRestaurants = data.filter(
    (r) =>
      r.nom.toLowerCase().includes(searchTerm) ||
      r.cuisine.toLowerCase().includes(searchTerm)
  );
  displayRestaurants(filteredRestaurants);
}

document.getElementById("searchInput").addEventListener("keyup", () => {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filteredRestaurants = restaurantsData.filter((r) =>
    r.name.toLowerCase().includes(searchInput)
  );
  if (filteredRestaurants.length) {
    restaurantList.innerHTML = "";

    displayRestaurants(filteredRestaurants);
  } else {
    restaurantList.innerHTML = "Aucun résultat";
  }

  displayRestaurants(filteredRestaurants);
});
