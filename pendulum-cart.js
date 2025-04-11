class PendulumSim {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.controllerOn = true;
    this.g = 9.81;
    this.l = 1.0;
    this.m = 1.0;
    this.M = 5.0;

    this.dt = 0.008;
    this.stepsPerFrame = 5;

    this.reset();
    this.loop();
  }

  reset() {
    this.theta = 0.1;      // radians
    this.thetadot = 0;
    this.x = 0;            // meters
    this.xdot = 0;
  }

  nudge() {
    this.thetadot += 2;
  }

  toggleController() {
    this.controllerOn = !this.controllerOn;
  }

  getControllerForce() {
    if (!this.controllerOn || Math.abs(this.theta) > Math.PI / 2) return 0;

    const kTheta = parseFloat(document.getElementById("kTheta").value);
    const kdTheta = parseFloat(document.getElementById("kdTheta").value);
    const kCart = parseFloat(document.getElementById("kCart").value);
    const kdCart = parseFloat(document.getElementById("kdCart").value);

    return (
      kTheta * this.theta +
      kdTheta * this.thetadot +
      kCart * this.x +
      kdCart * this.xdot
    );
  }

  rk4Step() {
    const state = [this.theta, this.x, this.thetadot, this.xdot];

    const k1 = this.stateDot(state);
    const k2 = this.stateDot(this.add(state, this.mul(k1, this.dt / 2)));
    const k3 = this.stateDot(this.add(state, this.mul(k2, this.dt / 2)));
    const k4 = this.stateDot(this.add(state, this.mul(k3, this.dt)));

    const total = this.mul(
      this.add(
        this.add(k1, this.mul(k2, 2)),
        this.add(this.mul(k3, 2), k4)
      ),
      this.dt / 6
    );

    const [theta, x, thetadot, xdot] = this.add(state, total);

    this.theta = ((theta + Math.PI) % (2 * Math.PI)) - Math.PI; // Wrap θ
    this.x = Math.max(-3.5, Math.min(3.5, x)); // cart within bounds
    this.thetadot = thetadot;
    this.xdot = xdot;
  }

  stateDot([theta, x, thetadot, xdot]) {
    const F = this.getControllerForce();
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const totalMass = this.m + this.M * sin ** 2;
    const xddot =
      this.M / totalMass * (this.l * thetadot ** 2 * sin - this.g * sin * cos) +
      F / this.m;

    const thetaddot = this.g / this.l * sin - xddot / this.l * cos;

    // Add damping
    const damping = 0.2;
    return [
      thetadot,
      xdot,
      thetaddot - damping * thetadot,
      xddot - damping * xdot
    ];
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const cartX = this.canvas.width / 2 + this.x * 100;
    const cartY = 300;
    const cartWidth = 80;
    const cartHeight = 40;
    const scale = 100;

    // Track
    ctx.beginPath();
    ctx.moveTo(0, cartY + cartHeight / 2);
    ctx.lineTo(this.canvas.width, cartY + cartHeight / 2);
    ctx.strokeStyle = "#888";
    ctx.stroke();

    // Cart
    ctx.fillStyle = "#444";
    ctx.fillRect(
      cartX - cartWidth / 2,
      cartY - cartHeight / 2,
      cartWidth,
      cartHeight
    );

    // Pendulum
    const pendulumX = cartX + scale * this.l * Math.sin(this.theta);
    const pendulumY = cartY - cartHeight / 2 - scale * this.l * Math.cos(this.theta);

    ctx.beginPath();
    ctx.moveTo(cartX, cartY - cartHeight / 2);
    ctx.lineTo(pendulumX, pendulumY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Bob
    ctx.beginPath();
    ctx.arc(pendulumX, pendulumY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
  }

  loop() {
    for (let i = 0; i < this.stepsPerFrame; i++) {
      this.rk4Step();
    }
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  // Vector helpers
  add(a, b) {
    return a.map((v, i) => v + b[i]);
  }

  mul(a, k) {
    return a.map(v => v * k);
  }
}

// Update slider label text
function updateSliderLabel(slider) {
  const id = slider.id;
  document.getElementById(id + "-val").textContent = slider.value;
}

const sim = new PendulumSim("canvas");
