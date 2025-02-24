function sketchProc(p) {
    let fishList = [];

    p.setup = function() {
        p.createCanvas(800, 400);
        for (let i = 0; i < 5; i++) {
            fishList.push(new Fish(p.random(p.width), p.random(p.height)));
        }
    };

    p.draw = function() {
        p.background(0, 150, 255); // Water background

        // Draw fish
        for (let fish of fishList) {
            fish.move();
            fish.display();
        }
    };

    p.mousePressed = function() {
        fishList.push(new Fish(p.mouseX, p.mouseY));
    };

    function Fish(x, y) {
        this.x = x;
        this.y = y;
        this.speed = p.random(1, 3);
        this.direction = p.random([-1, 1]);

        this.move = function() {
            this.x += this.speed * this.direction;
            if (this.x < 0 || this.x > p.width) {
                this.direction *= -1; // Reverse direction
            }
        };

        this.display = function() {
            p.fill(255, 165, 0);
            p.ellipse(this.x, this.y, 30, 20); // Fish body
            p.triangle(this.x - 15, this.y, this.x - 30, this.y - 10, this.x - 30, this.y + 10); // Tail
        };
    }
}

// Attach to canvas
const canvasElement = document.getElementById("fishTank");
new Processing(canvasElement, sketchProc);

function restartGame() {
    location.reload();
}