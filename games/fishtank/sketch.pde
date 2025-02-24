ArrayList<Fish> fishList;

void setup() {
    size(800, 400);
    fishList = new ArrayList<Fish>();

    // Add some initial fish
    for (int i = 0; i < 5; i++) {
        fishList.add(new Fish(random(width), random(height)));
    }
}

void draw() {
    // Gradient Background
    for (int i = 0; i < height; i++) {
        float inter = map(i, 0, height, 0, 1);
        stroke(lerpColor(color(0, 150, 255), color(0, 100, 200), inter));
        line(0, i, width, i);
    }

    // Update and display fish
    for (Fish f : fishList) {
        f.move();
        f.display();
    }
}

// Add new fish when mouse is clicked
void mousePressed() {
    fishList.add(new Fish(mouseX, mouseY));
}

// Fish Class
class Fish {
    float x, y, speed;
    int direction;
    color bodyColor;
    color tailColor;
    float bodyWidth, bodyHeight, tailSize;

    Fish(float startX, float startY) {
        x = startX;
        y = startY;
        speed = random(1, 3);
        direction = random(1) > 0.5 ? 1 : -1;

        // Gradient Colors for body and tail
        bodyColor = color(random(100, 255), random(100, 255), random(255));
        tailColor = color(random(100, 200), random(50, 150), random(100, 200));

        // Randomize fish size
        bodyWidth = random(25, 50);
        bodyHeight = random(15, 30);
        tailSize = random(15, 25);
    }

    void move() {
        x += speed * direction;

        // Reverse direction if hitting the wall
        if (x < 0 || x > width) {
            direction *= -1;
        }
    }

    void display() {
        noStroke();

        // Tail with different color
        fill(tailColor);
        float tailX = x - (bodyWidth / 2) * direction;
        triangle(
            tailX, y, 
            tailX - tailSize * direction, y - tailSize, 
            tailX - tailSize * direction, y + tailSize
        );

        // Fish Body (Rounded Shape)
        fill(bodyColor);
        ellipse(x, y, bodyWidth, bodyHeight);

        // Fish Fins (Side Fin)
        fill(lerpColor(bodyColor, color(255), 0.3));
        ellipse(x, y - (bodyHeight / 3), bodyWidth / 3, bodyHeight / 5);

        // Fish Eye
        float eyeX = x + (bodyWidth / 4) * direction;
        float eyeY = y - bodyHeight / 5;
        fill(255); // White eye
        ellipse(eyeX, eyeY, 6, 6);
        fill(0); // Pupil
        ellipse(eyeX + 1 * direction, eyeY, 2, 2);
    }
}