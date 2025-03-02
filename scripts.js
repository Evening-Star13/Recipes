document.addEventListener("DOMContentLoaded", function () {
  const recipeForm = document.getElementById("recipe-form");
  const searchInput = document.getElementById("search-input");
  const recipeList = document.getElementById("recipes");
  const recipeCards = document.getElementById("recipe-cards");
  const modal = document.getElementById("recipe-modal");
  const closeModal = document.querySelector(".close");

  // Save recipe to local storage
  if (recipeForm) {
    recipeForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const recipeName = document.getElementById("recipe-name").value;
      const recipeCourse = document.getElementById("recipe-course").value;
      const vegetarian = document.getElementById("vegetarian").checked;
      const peanutFree = document.getElementById("peanut-free").checked;
      const glutenFree = document.getElementById("gluten-free").checked;
      const cookTime = document.getElementById("cook-time").value;
      const ingredients = document.getElementById("ingredients").value;
      const directions = document.getElementById("directions").value;
      const recipeImage = document.getElementById("recipe-image").files[0];

      const reader = new FileReader();
      reader.onload = function (e) {
        const recipe = {
          name: recipeName,
          course: recipeCourse,
          vegetarian: vegetarian,
          peanutFree: peanutFree,
          glutenFree: glutenFree,
          cookTime: cookTime,
          ingredients: ingredients,
          directions: directions,
          image: e.target.result,
        };

        saveRecipe(recipe);
        alert("Recipe added successfully!");
        recipeForm.reset();
      };

      reader.readAsDataURL(recipeImage);
    });
  }

  // Load and filter recipes
  if (searchInput && recipeList) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm === "") {
        recipeList.style.display = "none"; // Hide recipe list if search term is empty
        return;
      }

      const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm)
      );

      if (filteredRecipes.length > 0) {
        displayRecipes(filteredRecipes);
        recipeList.style.display = "block"; // Show recipe list if there are results
      } else {
        recipeList.style.display = "none"; // Hide recipe list if no results
      }
    });
  }

  // Load and display recipe cards on the All Recipes page
  if (recipeCards) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    displayRecipeCards(recipes);
  }

  // Function to save a recipe
  function saveRecipe(recipe) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  // Function to display recipes
  function displayRecipes(recipes) {
    recipeList.innerHTML = ""; // Clear the list
    recipes.forEach((recipe, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <h3>${recipe.name}</h3>
              <p><strong>Course:</strong> ${recipe.course}</p>
              <p><strong>Dietary Options:</strong> ${
                recipe.vegetarian ? "Vegetarian " : ""
              }${recipe.peanutFree ? "Peanut Free " : ""}${
        recipe.glutenFree ? "Gluten Free " : ""
      }</p>
              <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
              <img src="${recipe.image}" alt="${recipe.name}">
              <p><strong>Ingredients:</strong></p>
              <ul>${recipe.ingredients
                .split("\n")
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join("")}
              </ul>
              <p><strong>Directions:</strong></p>
              <ol>${recipe.directions
                .split("\n")
                .map((step) => `<li>${step}</li>`)
                .join("")}
              </ol>
              <button class="delete-button" data-index="${index}">Delete Recipe</button>
          `;
      recipeList.appendChild(li);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = button.getAttribute("data-index");
        deleteRecipe(index);
      });
    });
  }

  // Function to display recipe cards
  function displayRecipeCards(recipes) {
    recipeCards.innerHTML = ""; // Clear the container
    recipes.forEach((recipe, index) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
              <img src="${recipe.image}" alt="${recipe.name}">
              <h3>${recipe.name}</h3>
              <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
          `;
      card.addEventListener("click", () => openModal(recipe)); // Add click event to open modal
      recipeCards.appendChild(card);
    });
  }

  // Function to open modal with full recipe details
  function openModal(recipe) {
    document.getElementById("modal-recipe-name").textContent = recipe.name;
    document.getElementById("modal-recipe-course").textContent = recipe.course;
    document.getElementById("modal-recipe-diet").textContent = `${
      recipe.vegetarian ? "Vegetarian " : ""
    }${recipe.peanutFree ? "Peanut Free " : ""}${
      recipe.glutenFree ? "Gluten Free " : ""
    }`;
    document.getElementById("modal-recipe-cook-time").textContent =
      recipe.cookTime;
    document.getElementById("modal-recipe-image").src = recipe.image;

    // Display ingredients as a list
    const ingredientsList = document.getElementById("modal-recipe-ingredients");
    ingredientsList.innerHTML = recipe.ingredients
      .split("\n")
      .map((ingredient) => `<li>${ingredient}</li>`)
      .join("");

    // Display directions as a list
    const directionsList = document.getElementById("modal-recipe-directions");
    directionsList.innerHTML = recipe.directions
      .split("\n")
      .map((step) => `<li>${step}</li>`)
      .join("");

    modal.style.display = "block"; // Show the modal
  }

  // Close the modal when the close button is clicked
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close the modal when clicking outside the modal content
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Function to delete a recipe
  function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.splice(index, 1); // Remove the recipe at the specified index
    localStorage.setItem("recipes", JSON.stringify(recipes));
    displayRecipes(recipes); // Refresh the displayed recipes
    displayRecipeCards(recipes); // Refresh the recipe cards
  }
});
