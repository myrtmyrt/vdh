// we draw a beer in the canvas: to do that, we keep track of the angle of the liquid surface
// and we draw it as a line. everything under is yellow, everything above is transparent
// so in the end we draw a trapezoid with a yellow color, at something like 70% of the height
let angle = 50; // angle in degrees
let angleVelocity = 0; // angle velocity in degrees per second
const bubbles = []; // array of bubbles

// we draw the beer in the canvas
function drawBeer(canvas) {
  // console.log(angle)
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const middleHeight = canvas.height * 0.3;

  // compute the left and right heights of the trapezoid based on the angle
  const leftHeight = middleHeight + Math.sin((angle * Math.PI) / 180) * 100;
  const rightHeight =
    middleHeight + Math.sin(((angle + 180) * Math.PI) / 180) * 100;
  ctx.moveTo(0, leftHeight);
  ctx.lineTo(canvas.width, rightHeight);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.fillStyle = "yellow";
  ctx.fill();

  // now draw the beer foam
  ctx.beginPath();
  ctx.moveTo(0, leftHeight);
  ctx.lineTo(canvas.width, rightHeight);
  ctx.lineTo(canvas.width, rightHeight - canvas.height * 0.1);
  ctx.lineTo(0, leftHeight - canvas.height * 0.1);
  ctx.lineTo(0, leftHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // draw bubbles
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}

// we update the angle of the liquid surface and the bubbles position
function update(canvas) {
  // compute velocity ( inversely proportional to the angle )
  angleVelocity += -angle / 100;
  // friction
  angleVelocity *= 0.95;
  // friction optimization
  if (Math.abs(angleVelocity) < 0.001) {
    angleVelocity = 0;
  }
  // update angle
  angle += angleVelocity;

  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    bubble.x += bubble.velocityX;
    bubble.y += bubble.velocityY;
    // remove bubbles that are out of the beer
    if (
      bubble.x < 0 ||
      bubble.x > canvas.width ||
      bubble.y < canvas.height * 0.3
    ) {
      bubbles.splice(i, 1);
      i--;
    }
  }
}

// we add a bubble to the canvas
function addBubble(canvas) {
  const bubble = {
    x: Math.random() * canvas.width,
    // spawn randomly in bottom half of the canvas
    y: Math.random() * canvas.height * 0.8 + canvas.height * 0.8,
    radius: Math.random() * canvas.height * 0.05,
    velocityX: Math.random() * 0.5 - 0.25,
    velocityY: -Math.random() * 0.5 - 0.25,
  };
  bubbles.push(bubble);
}

export function startSimulation(canvasId, svgId) {
  const beerCanvas = document.querySelector("#" + canvasId);
  // call addBubble every 100ms
  setInterval(() => {
    addBubble(beerCanvas);
  }, 100);

  // we draw the beer and update the angle every 10ms
  setInterval(() => {
    drawBeer(beerCanvas);
    update(beerCanvas);
  }, 10);

  // on mouse move, we update the angle velocity based on the mouse position, and we move the canvas and svg
  const body = document.querySelector("body");
  const beerSvg = document.querySelector("#" + svgId);
  let lastClientX = 0;
  body.addEventListener("mousemove", (event) => {
    const { clientX } = event;
    angleVelocity += (lastClientX - clientX) * 0.005;
    // set canvas position to cursor
    beerCanvas.style.left = `${clientX}px`;
    beerCanvas.style.top = `${window.scrollY + event.clientY}px`;
    // set svg position to cursor
    beerSvg.style.left = `${clientX}px`;
    beerSvg.style.top = `${window.scrollY + event.clientY}px`;
    lastClientX = clientX;
  });

  // on scroll, we update the positions of canvas and svg
  body.addEventListener("wheel", (event) => {
    const { clientX } = event;

    // set canvas position to cursor
    beerCanvas.style.top = `${window.scrollY + event.clientY}px`;
    // set svg position to cursor
    beerSvg.style.top = `${window.scrollY + event.clientY}px`;
    lastClientX = clientX;
  });
}
