const pendulumCanvas = document.getElementById('pendulum');
const graphCanvas = document.getElementById('graph');
const ctx = pendulumCanvas.getContext('2d');
const gctx = graphCanvas.getContext('2d');
const stateDisplay = document.getElementById('stateDisplay');

let angle = Math.PI;
let velocity = 0;
let integral = 0;
let prevError = 0;
let torque = 0;

let data = [];

function drawPendulum() {
    ctx.clearRect(0, 0, pendulumCanvas.width, pendulumCanvas.height);

    const origin = { x: 200, y: 200 }; // Centered vertically
    const length = 150;
    const x = origin.x + length * Math.sin(angle);
    const y = origin.y + length * Math.cos(angle);

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
}

function drawGraph() {
    gctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
    gctx.beginPath();
    gctx.moveTo(0, 100);
    for (let i = 0; i < data.length; i++) {
        let y = 100 - data[i] * 50;
        gctx.lineTo(i, y);
    }
    gctx.stroke();
}

function updateStateDisplay() {
    stateDisplay.innerHTML = `
        θ: ${angle.toFixed(2)}<br>
        ω: ${velocity.toFixed(2)}<br>
        u: ${torque.toFixed(2)}
    `;
}

function controlLoop() {
    let target = 0;
    let error = target - angle;
    let kp = +document.getElementById('kp').value;
    let ki = +document.getElementById('ki').value;
    let kd = +document.getElementById('kd').value;

    integral += error;
    let derivative = error - prevError;
    torque = kp * error + ki * integral + kd * derivative;

    prevError = error;

    let dt = 0.02;
    let gravity = 9.8;
    let length = 1;
    let damping = 0.01;

    let acc = (gravity / length) * Math.sin(angle) + torque;
    velocity += acc * dt;
    velocity *= (1 - damping);
    angle += velocity * dt;

    if (data.length > 400) data.shift();
    data.push(angle);

    drawPendulum();
    drawGraph();
    updateStateDisplay();
    requestAnimationFrame(controlLoop);
}

function setStable() {
    angle = 0.1;
    velocity = 0;
    integral = 0;
    prevError = 0;
}

function setUnstable() {
    angle = Math.PI;
    velocity = 0;
    integral = 0;
    prevError = 0;
}
function updateSliderValue(id) {
    const slider = document.getElementById(id);
    const display = document.getElementById(id + "-val");
    display.textContent = slider.value;
  }
  
controlLoop();
