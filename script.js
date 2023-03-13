const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set the canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circles = [
  {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    color: "white",
    velocityX: Math.random() * 10 - 5, // Random velocity between -5 and 5
    velocityY: Math.random() * 10 - 5,
  },
  {
    x: canvas.width / 4,
    y: canvas.height / 4,
    radius: 30,
    color: "red",
    velocityX: Math.random() * 10 - 5, // Random velocity between -5 and 5
    velocityY: Math.random() * 10 - 5,
  },
];

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = circle.color;
  ctx.fill();
  ctx.closePath();
}

function checkCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle1.radius + circle2.radius) {
    circle1.velocityX = -circle1.velocityX;
    circle1.velocityY = -circle1.velocityY;

    circle2.velocityX = -circle2.velocityX;
    circle2.velocityY = -circle2.velocityY;

    if (circles.length < 50) {
      let newX = Math.random() * canvas.width;
      let newY = Math.random() * canvas.height;
      let newRadius = 15;
      let isOverlapping = false;

      for (let i = 0; i < circles.length; i++) {
        let distance =
          Math.sqrt(
            (circles[i].x - newX) * (circles[i].x - newX) +
              (circles[i].y - newY) * (circles[i].y - newY)
          ) -
          circles[i].radius -
          newRadius;
        if (distance < 0) {
          isOverlapping = true;
          break;
        }
      }

      if (!isOverlapping) {
        circles.push({
          x: newX,
          y: newY,
          radius: newRadius,
          color: generateRandomGradient(),
          velocityX: Math.random() * 10 - 5, // Random velocity between -5 and 5
          velocityY: Math.random() * 10 - 5,
        });
      }
    }
  }
}

function generateRandomGradient() {
  // Generate two random color stops
  const color1 = getRandomColor();
  const color2 = getRandomColor();

  // Create the gradient with the randomly generated color stops
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  return gradient;
}

function getRandomColor() {
  // Generate a random color in the format 'rgb(r, g, b)'
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < circles.length; i++) {
    let circle1 = circles[i];

    // Check for collision with other circles
    for (let j = i + 1; j < circles.length; j++) {
      let circle2 = circles[j];
      checkCollision(circle1, circle2);
    }

    // Check for collision with walls
    if (
      circle1.x + circle1.radius > canvas.width ||
      circle1.x - circle1.radius < 0
    ) {
      circle1.velocityX = -circle1.velocityX;
    }

    if (
      circle1.y + circle1.radius > canvas.height ||
      circle1.y - circle1.radius < 0
    ) {
      circle1.velocityY = -circle1.velocityY;
    }

    // Update the position of the circle based on its velocity
    circle1.x += circle1.velocityX;
    circle1.y += circle1.velocityY;

    drawCircle(circle1);
  }

  requestAnimationFrame(update);
}

update();
