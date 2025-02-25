int spiderX, spiderY;
boolean goingUp = true;
boolean isMoving = true; // Toggle movement

void setup() {
    size(400, 400);
    spiderX = width / 2;
    spiderY = height - 50;
}

void draw() {
    background(173, 216, 230); // Light blue background

    // Draw web
    stroke(255);
    line(spiderX, 0, spiderX, height);

    // Draw colorful spider
    fill(138, 43, 226); // Purple body
    ellipse(spiderX, spiderY, 40, 40);  
    fill(255, 165, 0); // Orange head
    ellipse(spiderX, spiderY - 20, 20, 20);

    // Draw colorful legs
    stroke(255, 0, 0); // Red legs
    line(spiderX - 15, spiderY + 10, spiderX - 30, spiderY + 20);
    line(spiderX + 15, spiderY + 10, spiderX + 30, spiderY + 20);

    stroke(0, 0, 255); // Blue legs
    line(spiderX - 15, spiderY - 5, spiderX - 30, spiderY - 10);
    line(spiderX + 15, spiderY - 5, spiderX + 30, spiderY - 10);

    // Move spider if allowed
    if (isMoving) {
        if (goingUp) {
            spiderY -= 1;
            if (spiderY < 50) goingUp = false;
        } else {
            spiderY += 1;
            if (spiderY > height - 50) goingUp = true;
        }
    }
}

// Toggle movement when clicking the spider
void mousePressed() {
    float d = dist(mouseX, mouseY, spiderX, spiderY);
    if (d < 30) { // Click detection
        isMoving = !isMoving; // Toggle movement
    }
}