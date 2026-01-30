# Jewel Warrior - a swapping match game

Try it here: <https://kevinfjbecker.github.io/jewel-warrior/>

Jewel Warrior is a browser-based puzzle game inspired by classic match-style games. The application is built using plain HTML, CSS, and JavaScript, with a modular JavaScript architecture that separates game logic, rendering, input handling, and screen management.

This README provides a high-level overview of the project structure and how the pieces fit together. More detailed documentation for individual JavaScript files will be added as we expand this document.

---

## Project Overview

The game runs entirely in the browser and is designed to work on both desktop and mobile devices. It includes:

- A splash screen and install prompt for mobile users
- A main menu with navigation to different screens
- A game board where gameplay takes place
- A high-score display

The entry point of the application is `index.html`, which defines the DOM structure and loads all required stylesheets and JavaScript modules.

---

## File Structure

``` text
index.html
styles/
  ├─ fonts.css
  ├─ main.css
  └─ mobile.css
js/
  ├─ app.js
  ├─ dom.js
  ├─ game.js
  ├─ board.js
  ├─ display.js
  ├─ input.js
  ├─ screens.js
  ├─ gamescreen.js
  └─ main.js
images/
```

---

## index.html

`index.html` defines the layout of the game and loads all assets.

### Key Responsibilities

- Declares meta tags for mobile and iOS web app support
- Loads global and responsive stylesheets
- Defines all game screens in the DOM
- Loads JavaScript files in the required order

### Main DOM Structure

- `#game`: Root container for the entire game
  - `.background`: Visual background layer
  - `.screen`: Individual screens (splash, install, menu, game, high scores)
- `#jewel-proto`: A prototype DOM element used for creating jewel elements dynamically

Each screen is always present in the DOM but shown or hidden via JavaScript.

---

## Screens

The game uses a screen-based architecture. Each screen corresponds to a DOM element with the class `screen` and a unique `id`.

Current screens include:

- **Splash Screen (`#splash-screen`)**  
  Initial screen shown when the game loads.

- **Install Screen (`#install-screen`)**  
  Prompts mobile users to install the game to their home screen.

- **Main Menu (`#main-menu`)**  
  Allows navigation to gameplay, high scores, and about/exit options.

- **Game Screen (`#game-screen`)**  
  Contains the game board where gameplay occurs.

- **High Scores (`#high-scores`)**  
  Displays player scores.

Screen visibility and transitions are handled by JavaScript (documented later).

---

## JavaScript Loading Order

JavaScript files are loaded at the bottom of `index.html` to ensure the DOM is ready before scripts execute.

The order matters, as later files depend on earlier ones:

1. `app.js` – Application bootstrap and global namespace
2. `dom.js` – DOM utility helpers
3. `game.js` – Core game state and logic
4. `board.js` – Game board logic and data structures
5. `display.js` – Rendering and visual updates
6. `input.js` – Mouse/touch input handling
7. `screens.js` – Screen management and navigation
8. `gamescreen.js` – Game-specific screen behavior
9. `main.js` – Application startup

Each of these files will be documented in detail in later sections.

---

## Styling

- `fonts.css` – Custom fonts used by the game
- `main.css` – Core layout and visual styling
- `mobile.css` – Responsive overrides for tablets and phones

Media queries ensure the game adapts to different screen sizes and orientations.

---

## app.js

`app.js` defines the global application namespace and core configuration shared across the entire game. It is intentionally loaded first so that all other modules can rely on the objects and settings it provides.

### Global Namespace

The game uses a single global object, `jewel`, to avoid polluting the global scope and to act as a central registry:

- `jewel.screens` – A container for screen modules registered at runtime
- `jewel.settings` – Game-wide configuration values
- `jewel.images` – A cache of loaded image assets

This pattern allows all modules to communicate through a shared, well-defined interface without tight coupling.

### Settings Configuration

`jewel.settings` contains constants and tunable parameters used throughout the game:

- **Board configuration**
  - `rows` / `cols` – Dimensions of the game board
  - `numJewelTypes` – Number of distinct jewel types
  - `baseScore` – Base score awarded for matches

- **Rendering configuration**
  - `jewelSize` – Pixel size of a jewel, calculated dynamically at runtime

- **Input mapping**
  - `controls` – Maps keyboard, mouse, and touch inputs to logical game actions

Rather than binding logic directly to key codes or events, the game translates raw input into named actions such as `moveUp` or `selectJewel`.

### Image Loading

The `loadImages` function loads sprite assets based on the calculated jewel size:

- The image path is built dynamically using the jewel size
- Images are stored in `jewel.images` to avoid duplicate loading
- This allows the same codebase to support different screen resolutions

At present, only jewel sprites are loaded, with a clear extension point for additional assets.

### Startup Logic

On the browser `load` event, `app.js` performs initial setup:

1. Measures the size of the hidden `#jewel-proto` element
2. Stores the computed width as `jewel.settings.jewelSize`
3. Loads the appropriate jewel sprite sheet

By deriving sizes from the DOM rather than hardcoding values, the game adapts cleanly to different layouts and devices.

---

## Next Steps

Planned documentation additions:

- Detailed breakdown of each JavaScript file
- Game flow and lifecycle
- Event handling and input model
- Rendering and animation approach
- How to extend or modify the game
