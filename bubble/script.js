const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;
let particleArray = [];
let adjustX = 5;
let adjustY = 5;
let newFont = new FontFace("LilitaOner", "url(/bubble/font/LilitaOner.ttf)");

newFont.load().then((font) => {
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-over";
    // handle mouse
    const mouse = {
        x: null,
        y: null,
        radius: 100,
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    document.fonts.add(font);
    ctx.fillStyle = "white";
    ctx.font = "30px LilitaOner";
    ctx.fillText("Bubble", 0, 30);

    const textCoordinates = ctx.getImageData(0, 0, 100, 100);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 3;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = Math.random() * 2 + 1;
            this.distance;
        }
        draw() {
            // ctx.fillStyle = "rgba(61,20,69,0.5)";
            ctx.strokeStyle = "rgba(255,255,255,0.8)";
            ctx.beginPath();

            if (this.distance < mouse.radius - 5) {
                // 마우스 영역-5 안에 있을때
                this.size = 10;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.fillStyle = "rgba(255,255,255,0.5)";

                ctx.beginPath();
                ctx.arc(this.x - 3, this.y - 3, this.size / 3, 0, Math.PI * 2);
                ctx.arc(this.x + 3, this.y - 1, this.size / 4, 0, Math.PI * 2);
            } else if (this.distance <= mouse.radius) {
                // 마우스영역 -5 < 사이에 있을때 <= 마우스영역
                this.size = 8;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(this.x - 2, this.y - 2, this.size / 3, 0, Math.PI * 2);
            } else {
                // 마우스 영역에 닿지 않을때
                this.size = 5;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(this.x - 1, this.y - 1, this.size / 3, 0, Math.PI * 2);
            }

            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            this.distance = distance;
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }
    const init = () => {
        particleArray = [];
        for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
            for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
                if (
                    textCoordinates.data[
                        y * 4 * textCoordinates.width + x * 4 + 3
                    ] > 128
                ) {
                    let positionX = x + adjustX;
                    let positionY = y + adjustY;
                    particleArray.push(
                        new Particle(positionX * 10, positionY * 10)
                    );
                }
            }
        }
    };
    init();

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].draw();
            particleArray[i].update();
        }
        // connect();
        requestAnimationFrame(animate);
    };

    const connect = () => {
        for (let a = 0; a < particleArray.length; a++) {
            for (let b = a; b < particleArray.length; b++) {
                let dx = particleArray[a].x - particleArray[b].x;
                let dy = particleArray[a].y - particleArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 20) {
                    opacityValue = 1 - distance / 20;
                    ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(particleArray[a].x, particleArray[a].y);
                    ctx.lineTo(particleArray[b].x, particleArray[b].y);
                    ctx.stroke();
                }
            }
        }
    };
    animate();
});
