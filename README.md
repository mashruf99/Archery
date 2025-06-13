# 🏹 Play Archery - A Responsive HTML5 Canvas Game


A fun, lightweight archery game built entirely with HTML, CSS, and vanilla JavaScript. The goal is simple: hit the moving target to score as many points as you can before you run out of arrows.

This project is fully responsive and designed to work seamlessly on desktops, tablets, and mobile phones, supporting both mouse and touch controls.

## ✨ Features

* **Fully Responsive:** Uses modern CSS (`aspect-ratio`, media queries) to adapt to any screen size.
* **HTML5 Canvas Rendering:** All dynamic game elements (bow, arrow, target) are rendered on an HTML5 canvas.
* **Simple Physics:** The arrow is affected by gravity, making shots more challenging and rewarding.
* **Power Mechanic:** Press and hold to charge up your shot for more power and distance.
* **Scoring System:** Different points are awarded for hitting different rings of the target.
* **Moving Target:** The target moves up and down to increase the difficulty.
* **Game State Management:** Includes a start menu, pause/resume functionality, and a game-over screen.
* **Audio Controls:** Background music with a mute/unmute toggle.
* **Cross-Device Controls:** Works with both mouse (desktop) and touch (mobile/tablet) events.
* **Zero Dependencies:** Written in pure, vanilla JavaScript. No frameworks or libraries needed.

## 🕹️ How to Play

1.  **Aim:** Move your mouse cursor or drag your finger across the screen to aim the bow.
2.  **Charge Shot:** Press and hold the left mouse button or keep your finger held down on the screen. The power bar at the bottom will fill up.
3.  **Shoot:** Release the mouse button or lift your finger to fire the arrow.
4.  **Objective:** Score points by hitting the target. The closer to the center, the more points you get! Try to get the highest score with your 10 arrows.




## 📂 File Structure

The project is organized into three main files, keeping the structure clean and simple.

**archery-game/**
* `index.html` # Main HTML file containing game structure and UI
    * DOCTYPE declaration
    * HTML5 structure
    * Meta tags (viewport, charset)
    * Google Fonts import
    * Game container div
    * UI elements (score, timer, buttons)
    * Menu screens (start, pause, game over)
    * Canvas element
    * Audio element
    * Script/CSS links
* `styles.css` # All styling for UI and responsive layout
    * Base styles
    * Canvas styling
    * UI elements
    * Menu system
    * Game elements
    * Responsive rules
* `game.js` # Core game logic and rendering
    * Canvas setup
    * Game objects
    * Event listeners
    * Game loop
    * Rendering
    * Game mechanics
    * UI controls
    * Game states
    * Touch controls
* `sound.mp3` # Background music file
* `README.md` # Project documentation

## 💻 Technologies Used

* **HTML5:** For the core structure and semantic layout of the game.
* **CSS3:** For all styling, animations, and creating a responsive layout with Flexbox and Media Queries.
* **JavaScript (ES6+):** For all game logic, including physics, controls, scoring, and DOM manipulation.
* **HTML5 Canvas API:** Used to render and animate all the dynamic game elements.

## 🔮 Possible Future Improvements

* **High Score Board:** Use `localStorage` to save the highest score on the user's browser.
* **Wind Effects:** Add a wind element that changes direction and strength, forcing the player to compensate.
* **Different Levels:** Introduce new levels with different target paths, obstacles, or distances.
* **More Sound Effects:** Add specific sounds for hitting the target, missing, and nocking an arrow.
* **Arrow Quiver:** Visually show the remaining arrows in a quiver on the screen.

## Citing and Credits

This project was built from scratch, but utilizes the following third-party assets:

* **Font:** [Bangers](https://fonts.google.com/specimen/Bangers) from Google Fonts.
* **Texture:** "Green Gobbler" pattern from [Transparent Textures](https://www.transparenttextures.com/).
* **Developed by:** Shafiul islam mashruf 

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as you see fit.

---
Copyright (c) 2025 Shafiul Islam Mashruf
