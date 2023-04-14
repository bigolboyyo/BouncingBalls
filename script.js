const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circles = [
  {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    color: "white",
    velocityX: Math.random() * 10 - 5,
    velocityY: Math.random() * 10 - 5,
  },
  {
    x: canvas.width / 4,
    y: canvas.height / 4,
    radius: 30,
    color: "red",
    velocityX: Math.random() * 10 - 5,
    velocityY: Math.random() * 10 - 5,
  },
];

let numBalls = circles.length;
let addingBalls = true;
let removingBalls = false;
let reverseTimer = 0;
let shouldReset = false;

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

    if (addingBalls && numBalls < 50) {
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
          velocityX: Math.random() * 10 - 5,
          velocityY: Math.random() * 10 - 5,
        });
        numBalls++;
      }
    } else if (!addingBalls && numBalls > 2 && !removingBalls) {
      removingBalls = true;
      reverseTimer = 5000 / (numBalls - 2);
    }
  }
}

function generateRandomGradient() {
  const color1 = getRandomColor();
  const color2 = getRandomColor();

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  return gradient;
}

function getRandomColor() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < circles.length; i++) {
    let circle1 = circles[i];

    for (let j = i + 1; j < circles.length; j++) {
      let circle2 = circles[j];
      checkCollision(circle1, circle2);
    }

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

    circle1.x += circle1.velocityX;
    circle1.y += circle1.velocityY;

    drawCircle(circle1);
  }

  if (addingBalls && numBalls == 50) {
    addingBalls = false;
    removingBalls = true;
    reverseTimer = 5000 / (numBalls - 2);
  } else if (removingBalls && numBalls > 2 && reverseTimer > 0) {
    reverseTimer -= 16;
    if (reverseTimer <= 0) {
      circles.splice(-1, 1);
      numBalls--;
      reverseTimer = 5000 / (numBalls - 2);
    }
  } else if (removingBalls && numBalls == 2) {
    removingBalls = false;
    addingBalls = true;
    shouldReset = true;
  }

  if (shouldReset) {
    circles = [
      {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 50,
        color: "white",
        velocityX: Math.random() * 10 - 5,
        velocityY: Math.random() * 10 - 5,
      },
      {
        x: canvas.width / 4,
        y: canvas.height / 4,
        radius: 30,
        color: "red",
        velocityX: Math.random() * 10 - 5,
        velocityY: Math.random() * 10 - 5,
      },
    ];
    numBalls = circles.length;
    addingBalls = true;
    removingBalls = false;
    shouldReset = false;
  }

  requestAnimationFrame(update);
}

update();
