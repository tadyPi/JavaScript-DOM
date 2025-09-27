# JavaScript DOM Matrix Rain Text Reveal

This project demonstrates advanced DOM manipulation using JavaScript and the HTML5 Canvas API to create a visually striking "Matrix rain" animation with a dynamic text reveal effect.

## Features

- **Matrix Rain Animation:** Simulates the iconic falling code effect from the Matrix movies using canvas and JavaScript.
- **Dynamic Text Reveal:** The phrase `LOAD OF PIXELS` is subtly revealed as the falling matrix symbols pass through its area. The text is not statically rendered, but is revealed only by the rain effect.
- **Column-Based Illumination:** Each letter of the text is mapped to specific matrix columns. When a rain column passes through a letter, only that column's portion of the letter is illuminated, creating a seamless integration between the text and the rain.
- **Subtle, Responsive Effect:** The text reveal is subtle, with a soft fade-out and glow, and the effect is responsive to window resizing and works on both desktop and mobile.
- **Randomized Rain Start:** Each rain column starts at a random vertical position for a natural, non-synchronized effect.

## Technologies Used

- **JavaScript** for DOM and canvas manipulation
- **HTML5 Canvas API** for rendering animation
- **Responsive Design** for cross-device compatibility

## How It Works

- The canvas is divided into columns, each representing a stream of falling symbols.
- The overlay text is mapped to these columns. When a symbol passes through the text area, it triggers a reveal effect for that column's portion of the letter.
- The effect is achieved by clipping and drawing only the relevant portions of the text, using the actual falling matrix symbols as the reveal.

## Github Pages https://tadypi.github.io/JavaScript-DOM/


## Learning Points

- Manipulating the DOM and canvas with JavaScript for advanced visual effects
- Mapping text to canvas columns and synchronizing animation with user-defined overlays
- Responsive and interactive animation techniques

---

This project is a creative demonstration of how JavaScript can be used to manipulate the DOM and canvas for visually rich, interactive web experiences.
