const apiUrl = "http://localhost:3000/api/restaurants";

// Function to show a custom alert
// Function to show a custom alert
function showCustomAlert(message, type = "success") {
  const alertContainer = document.createElement("div");
  alertContainer.className = `custom-alert ${type}`;
  alertContainer.textContent = message;
  document.body.appendChild(alertContainer);

  // Automatically remove the alert after 3 seconds
  setTimeout(() => {
    alertContainer.remove();
  }, 5000);
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get("id");

  if (restaurantId) {
    // Fetch restaurant details by ID
    const response = await fetch(`${apiUrl}/${restaurantId}`);
    const restaurant = await response.json();
    console.log(restaurant);

    // Populate the form with the restaurant details
    document.getElementById("restaurantId").value = restaurant.id;
    document.getElementById("nom").value = restaurant.name;
    document.getElementById("adresse").value = restaurant.address;
    document.getElementById("telephone").value = restaurant.phone;
    document.getElementById("cuisine").value = restaurant.kitchen.join("-");
    document.getElementById("photo").value = restaurant.picture;
    document.getElementById("note").value = restaurant.rating;
    document.getElementById("site_web").value = restaurant.site;

    // Change the submit button text to "Edit"
    const submitButton = document.querySelector(
      "#restaurantForm input[type='submit']"
    );
    submitButton.value = "Edit";
  }
});
const form = document.getElementById("restaurantForm");
// Modify the form submission for editing
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const restaurantId = document.getElementById("restaurantId").value;

  const restaurantData = {
    name: document.getElementById("nom").value,
    address: document.getElementById("adresse").value,
    phone: document.getElementById("telephone").value,
    kitchen: document.getElementById("cuisine").value.split("-"),
    picture: document.getElementById("photo").value,
    rating: parseFloat(document.getElementById("note").value),
    site: document.getElementById("site_web").value,
  };

  try {
    const method = restaurantId ? "PUT" : "POST"; // Use PUT for editing, POST for adding
    const url = restaurantId ? `${apiUrl}/${restaurantId}` : apiUrl;

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurantData),
    });

    if (!response.ok) {
      throw new Error(
        restaurantId
          ? "Failed to edit the restaurant."
          : "Failed to add the restaurant."
      );
    } else {
      form.reset();
      showCustomAlert(
        restaurantId
          ? "Restaurant updated successfully!"
          : "Restaurant added successfully!",
        "success"
      );
    }
  } catch (error) {
    console.error(error);
    showCustomAlert(
      restaurantId
        ? "An error occurred while updating the restaurant."
        : "An error occurred while adding the restaurant.",
      "error"
    );
  }
});
