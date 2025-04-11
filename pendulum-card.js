const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");

let cartX = 400;
let cartV = 0;
let angle = Math.PI + 0.3; // slightly off-vertical
let angleV = 0;

let integral = 0;
let prevError = 0;

const g = 9.8;
const massPendulum = 1;
const massCart = 2;
const length = 100; // pixels → 1 meter

function updateSliderValue(id) {
  document.getElementById(id + "-val").textContent = document.getElementById(id).value;
}

function physicsStep() {
  const dt = 0.02;
  const kp = +document.getElementById("kp").value;
  const kd = +document.getElementById("kd").value;
  const ki = +document.getElementById("ki").value;

  const error = 0 - (angle - Math.PI);
  integral += error * dt;
  const derivative = (error - prevError) / dt;
  prevError = error;

  const force = kp * error + ki * integral + kd * derivative;

  // Dynamics (simplified model)
  const sinTheta = Math.sin(angle);
  const cosTheta = Math.cos(angle);
  const totalMass = massCart + massPendulum;
  const temp = (force + massPendulum * length * angleV * angleV * sinTheta) / totalMass;
  const angleA = (g * sinTheta - cosTheta * temp) /
                 (length * (4/3 - massPendulum * cosTheta * cosTheta / totalMass));
  const cartA = temp - massPendulum * length * angleA * cosTheta / totalMass;

  cartV += cartA * dt;
  cartX += cartV * dt;

  angleV += angleA * dt;
  angle += angleV * dt;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cartWidth = 80;
  const cartHeight = 40;
  const originY = 300;

  // Draw track
  ctx.beginPath();
  ctx.moveTo(0, originY + cartHeight / 2);
  ctx.lineTo(canvas.width, originY + cartHeight / 2);
  ctx.stroke();

  // Draw cart
  ctx.fillStyle = "gray";
  ctx.fillRect(cartX - cartWidth / 2, originY - cartHeight / 2, cartWidth, cartHeight);

  // Draw pendulum
  const pendulumX = cartX + length * Math.sin(angle);
  const pendulumY = originY - cartHeight / 2 - length * Math.cos(angle);

  ctx.beginPath();
  ctx.moveTo(cartX, originY - cartHeight / 2);
  ctx.lineTo(pendulumX, pendulumY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pendulumX, pendulumY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
}

function loop() {
  physicsStep();
  draw();
  requestAnimationFrame(loop);
}

loop();
