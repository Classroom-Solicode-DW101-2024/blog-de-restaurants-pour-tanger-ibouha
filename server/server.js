const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let restaurants = require("./data.json");

// Get all restaurants
app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

// Get a specific restaurant by ID
app.get("/api/restaurants/:id", (req, res) => {
  const restaurant = restaurants.find((r) => r.id == req.params.id);
  restaurant
    ? res.json(restaurant)
    : res.status(404).send("Restaurant not found");
});

// Add a new restaurant
// app.post("/api/restaurants", (req, res) => {
//   const newRestaurant = { id: restaurants.length + 1, ...req.body };
//   restaurants.push(newRestaurant);
//   fs.writeFileSync(restaurants, JSON.stringify(restaurants, null, 2));
//   res.status(201).json(newRestaurant);
// });

app.post("/api/restaurants", (req, res) => {
  try {
    console.log("Received data:", req.body);
    const newRestaurant = { id: restaurants.length + 1, ...req.body };
    restaurants.push(newRestaurant);
    fs.writeFileSync("./data.json", JSON.stringify(restaurants, null, 2));
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error while adding restaurant:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a restaurant
app.put("/api/restaurants/:id", (req, res) => {
  const index = restaurants.findIndex((r) => r.id == req.params.id);
  if (index !== -1) {
    restaurants[index] = { id: restaurants[index].id, ...req.body };
    fs.writeFileSync("./data.json", JSON.stringify(restaurants, null, 2));
    res.json(restaurants[index]);
  } else {
    res.status(404).send("Restaurant not found");
  }
});

// Delete a restaurant
app.delete("/api/restaurants/:id", (req, res) => {
  restaurants = restaurants.filter((r) => r.id != req.params.id);
  fs.writeFileSync("./data.json", JSON.stringify(restaurants, null, 2));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
