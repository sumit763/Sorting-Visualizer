class Column {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.queue = [];
    this.color = {
      r: 150,
      g: 150,
      b: 150,
    };
  }
  moveTo(loc, yOffset = 1, frameCount = 15) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      const u = Math.sin(t * Math.PI);
      this.queue.push({
        x: lerp(this.x, loc.x, t),
        y: lerp(this.y, loc.y, t) + ((u * this.width) / 2) * yOffset,
        r: lerp(150, 255, u),
        g: lerp(150, 0, u),
        b: lerp(150, 0, u),
      });
    }
  }

  jump(frameCount = 20) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      const u = Math.sin(t * Math.PI);
      this.queue.push({
        x: this.x,
        y: this.y - u * this.width,
        r: lerp(150, 100, u),
        g: lerp(150, 100, u),
        b: lerp(150, 100, u),
      });
    }
  }

  draw(ctx) {
    let change = false;
    if (this.queue.length > 0) {
      const { x, y, r, g, b } = this.queue.shift();
      this.x = x;
      this.y = y;
      this.color = { r, g, b };
      change = true;
    }
    const left = this.x - this.width / 2;
    const top = this.y - this.height;
    const right = this.x + this.width / 2;

    ctx.beginPath();
    const { r, g, b } = this.color;
    ctx.fillStyle = `rgb(${r},${g},${b})`;

    // Move to the top-left corner
    ctx.moveTo(left, top);

    // Draw left line
    ctx.lineTo(left, this.y);

    // Draw bottom ellipse
    ctx.ellipse(
      this.x, // x-coordinate of the ellipse's center
      this.y, // y-coordinate of the ellipse's center
      this.width / 2, // x-radius
      this.width / 4, // y-radius
      0, // rotation
      Math.PI, // start angle
      Math.PI * 2, // end angle
      true // counterclockwise
    );

    // Draw right line
    ctx.lineTo(right, top);

    // Draw top ellipse
    ctx.ellipse(
      this.x, // x-coordinate of the ellipse's center
      top, // y-coordinate of the ellipse's center
      this.width / 2, // x-radius
      this.width / 4, // y-radius
      0, // rotation
      0, // start angle
      Math.PI * 2, // end angle
      true // counterclockwise
    );

    ctx.fill();
    ctx.stroke();
    return change;
  }
}
