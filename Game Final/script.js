window.addEventListener('load', function () {//makes sure everthing is loaded first   

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const CANVAS_WIDTH = canvas.width = 900;
    const CANVAS_HEIGHT = canvas.height = 648;

    let baseSpeed = 0;
    let pushing = false;
    let pushSpeed = 0;

    let nearTop = false;
    //when close to top rock rolls quickly down
    //start over message 

    const backgroundLayer1 = new Image();
    backgroundLayer1.src = "layer1.png";
    const backgroundLayer2 = new Image();
    backgroundLayer2.src = "layer2.png";
    const backgroundLayer3 = new Image();
    backgroundLayer3.src = "layer3.png";
    const backgroundLayer4 = new Image();
    backgroundLayer4.src = "layer4.png";
    const backgroundLayer5 = new Image();
    backgroundLayer5.src = "layer5.png";

    // const footsteps = new Audio();
    // footsteps.src = "Footstep_Dirt_07.wav"

    //rock sound
    //onimous music'



    //-----------------------------------------------------------------------------------------------

    class InputHandler { // holds event listeners for key events ie controls, what is currently pressed
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', e => { //es6 arrow function, inherit 'this' from parent function?
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {//if key is pressed and not already in array?
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {  //when key is released, find the index of it and remove it
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    //-----------------------------------------------------------------------------------------------


    class Player { //reacts to inputs
        constructor(gameWidth, gameHeight) { // boundaries for player
            this.gameWidth = gameWidth; // make class properties 
            this.gameHeight = gameHeight;
            this.width = 50; //size of sprite
            this.height = 90;
            this.x = 30; // starting posistion
            this.y = this.gameHeight - this.height; // starting posistion
            this.image = document.getElementById('character')
            this.speed = 0;
            this.vy = 0; //velocity of y axis ie jumping
            this.weight = .5;//come back down
            //this.sound = footsteps;

        }
        draw(context) {
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y - this.height, this.width, this.height);
        }

        update(input) {
            //collision detection
            const dx = (rock.x + (rock.width * rock.scale) / 2) - (this.x + this.width / 2); // center point set to top left corner of sprite so must be off set
            const dy = (rock.y + (rock.height * rock.scale) / 2) - (this.y + this.height / 2);
            const distance = Math.sqrt((dx * dx) + (dy * dy));//pythagorean
            if ((distance + 20 < rock.width / 2 + this.width / 2) && (this.speed > 0) && (this.x < this.gameWidth - this.width * 2.5)) { // only when moving forward not back 
                pushing = true;
                pushSpeed = this.speed;
                //console.log("collision");
            }
            else {
                pushing = false;
            }
            this.x += this.speed;

            //controls
            if (input.keys.indexOf('ArrowRight') > -1) { //if array has key 
                this.speed = .5;
                baseSpeed = 1;
                //this.sound.play();
            }
            else if (input.keys.indexOf('ArrowLeft') > -1 && this.x > 30) { // x pos cant be less than 30 (ont move off to the left)
                this.speed = -.5;
                baseSpeed = -1;
                //this.sound.play();
            }
            else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) { // go up when pushed
                this.vy -= 10;
            }
            else {
                this.speed = 0;
                baseSpeed = 0;
            }
            //horizontal movement 
            this.x += this.speed;
            if (this.x < 5) this.x = 5;//can't go off to the left (is this eve working? should I take it out?)
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;//can't go off to the right 

            // vertical movement 
            this.y += this.vy;
            if (!this.onGround()) {// if false aka if NOT on ground aka if jumping
                this.vy += this.weight; // realize your going up and come back down
                this.frameY = 1; //change to jump animation
                this.maxFrame = 5;//jump animation only has 5 frames not 8
            }
            else {
                this.vy = 0; // if your not NOT on the ground, go back to nuetral
                this.frameY = 0; //back to walk animation
                this.maxFrame = 8;//set back to running animation frame 
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height; // never under game height aka in floor
            if (this.x > this.gameWidth - this.width * 2.5) {
                nearTop = true;
                console.log("neartop")
            }
        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }


    //-----------------------------------------------------------------------------------------------

    class Rock { //reacts to inputs
        constructor(gameWidth, gameHeight) { // boundaries for player
            this.gameWidth = gameWidth; // make class properties 
            this.gameHeight = gameHeight;
            this.width = 214; //size of sprite
            this.height = 213;
            this.x = 90; // starting posistion
            this.y = this.gameHeight;
            this.image = document.getElementById('rock')
            this.scale = 0.5;
            this.frameX = 0;
            this.maxFrame = 8; //frames in sheet
            this.speed = 0;
            this.vy = 0; //velocity of y axis ie jumping
            this.weight = .5;//come back down
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y - this.height + 30, this.width * this.scale, this.height * this.scale);
        }

        update() {
            //sprite animation
            if (animateCount % 10 == 0 && this.speed != 0) { //if frames are divisable by 10 then update- slows animation
                if (this.frameX >= this.maxFrame) this.frameX = 0; // cycle between frames
                else this.frameX++;
                this.frameTimer = 0;
            }
            if (pushing === true) {
                this.speed = pushSpeed * 2;
                this.x += this.speed;
            }
            else if (pushing == false && this.x > 90) {
                this.x--;
            }
            else {
                this.speed = 0;
            }
        }
    }

    //-----------------------------------------------------------------------------------------------


    //class for similar background images
    class imageLayer {
        constructor(image, speedMod) {
            this.x = 0;
            this.y = 0;
            this.width = 1152;// size of actual pitcure, should change for ratio?
            this.height = 648;// 1152 x 648 
            this.image = image;
            this.speedMod = speedMod; // so I can adjust speed with game controls
            this.speed = baseSpeed * this.speedMod;
        }

        update() {
            this.speed = baseSpeed * this.speedMod; //update speed
            if (this.x <= -this.width) { //reposition for loop
                this.x = 0;
            }
            this.x = this.x - this.speed; //prevents gaps between image cycles
        }
        draw() {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height); //second image for loop cycle 
        }
    }


    //start button, hide screen then hide button
    window.startGame = function () {
        document.getElementById("canvas").style.display = "block";
        document.getElementById("startGame").style.display = "none";
    }


    //click to reload after reaching the top
    function reload() {
        location.reload();
    }

    function top(context) {
        context.fillStyle = 'black';
        context.font = '40px helvetica';
        if (nearTop) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER', canvas.width / 2, 200);
            context.fillStyle = 'white';
            context.fillText('GAME OVER', canvas.width / 2 + 2, 202);
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('TRY AGAIN?', canvas.width / 2, 300);
            context.fillStyle = 'white';
            context.fillText('TRY AGAIN?', canvas.width / 2 + 2, 302);
            window.addEventListener("click", reload);
        }
    }

    const layer1 = new imageLayer(backgroundLayer1, 1);
    const layer2 = new imageLayer(backgroundLayer2, 1.2);
    const layer3 = new imageLayer(backgroundLayer3, 1.4);
    const layer4 = new imageLayer(backgroundLayer4, 1.6);
    const layer5 = new imageLayer(backgroundLayer5, 1.8);

    const backgroundObjects = [layer1, layer2, layer3, layer4, layer5];//array of layers

    const input = new InputHandler(); //execute 
    const player = new Player(canvas.width, canvas.height); //create instance of player
    const rock = new Rock(canvas.width, canvas.height); //create instance of rock

    let animateCount = 0; //count animation frames


    function animate() {
        animateCount++; //each frame it goes up

        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        backgroundObjects.forEach(object => {
            object.update();
            object.draw();
        });

        player.draw(context);
        player.update(input);

        rock.draw(context);
        rock.update();
        top(context);

        requestAnimationFrame(animate);
    }

    animate();

});
