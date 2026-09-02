const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const popup = document.querySelector('#welcome')
const winPopup = document.querySelector('#winPopup')

// Image import
const skyImg = new Image();
skyImg.src = 'Sky.png'; 
const hillsImg = new Image();
hillsImg.src = 'Hills.png'; 
const grassImg = new Image();
grassImg.src = 'Grass.png'; 
const platformImg = new Image();
platformImg.src = 'Platform.png'; 
const homeImg = new Image();
homeImg.src = 'home.png'; 

const guyRightImg = new Image();
guyRightImg.src = 'GuyRight.png'; 
const guyLeftImg = new Image();
guyLeftImg.src = 'GuyLeft.png'; 
const girlLeftImg = new Image();
girlLeftImg.src = 'GirlLeft.png'; 


canvas.width = 1024
canvas.height = 576

const gravity = 0.5
const gameEnd = 3500

let gameWon = false

// Player class construction
class Player {
    constructor() {
        this.speed = 8
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 50
        this.height = 50
    }

    draw() {
        
        if (keys.left.pressed) {
            c.drawImage(guyLeftImg, this.position.x, this.position.y, this.width, this.height)
        } else {
            c.drawImage(guyRightImg, this.position.x, this.position.y, this.width, this.height)
        }
       
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        // else this.velocity.y = 0

        if (this.position.y <= 0)
            this.velocity.y = 20
        else if (this.position.y > 0 && this.position.y < 15)
            this.velocity.y = 1
    }
}

class NPC {
    constructor({ x, y, image, width = 50, height = 50 }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = width
        this.height = height
    }

    draw() {
        let screenX = this.position.x - scrollOffset

        c.drawImage(
            this.image,
            screenX,
            this.position.y,
            this.width,
            this.height
        )
    }
    isTouching(player) {
        let npcScreenX = this.position.x - scrollOffset

        return (
            player.position.x + player.width >= npcScreenX &&
            player.position.x <= npcScreenX + this.width &&
            player.position.y + player.height >= this.position.y &&
            player.position.y <= this.position.y + this.height
        )
    }
}

// Platform class construction
class Platform {
    constructor({ x, y, image, w, h }) {
        this.position = {
            x: x,
            y: y
        }

        this.image = image
        this.width = w
        this.height = h
    }

    draw() {
            c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
        }
}

// Background element construction
class Background {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = 3000
        this.height = 580
    }

    draw() {
            c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
        }
}

let player = new Player()
let npc = new NPC({x: 3870, y: 357, image: girlLeftImg, width: 50, height: 50})
let platforms = []
let sky = new Background({x: 0, y: 0, image: skyImg})
let hills = new Background({x: 0, y: 80, image: hillsImg})
let grass = new Background({x: 0, y: 30, image: grassImg})

let scrollOffset = 0

// Initialization
function init() {
    player = new Player()
    npc = new NPC({x: 3870, y: 357, image: girlLeftImg, width: 50, height: 50})
    platforms = [
        new Platform({x: 0, y: 480, image: platformImg, w: 200, h: 100}), 
        new Platform({x: 400, y: 350, image: platformImg, w: 200, h: 100}),
        new Platform({x: 700, y: 200, image: platformImg, w: 200, h: 100}),
        new Platform({x: 1100, y: 350, image: platformImg, w: 200, h: 100}),
        new Platform({x: 1500, y: 100, image: platformImg, w: 200, h: 100}),
        new Platform({x: 1900, y: 300, image: platformImg, w: 200, h: 100}),
        new Platform({x: 2100, y: 100, image: platformImg, w: 200, h: 100}),
        new Platform({x: 2400, y: 200, image: platformImg, w: 200, h: 100}),
        new Platform({x: 2900, y: 350, image: platformImg, w: 200, h: 100}),
        new Platform({x: 3500, y: 100, image: platformImg, w: 200, h: 100}),
        new Platform({x: 3700, y: 300, image: homeImg, w: 400, h: 300}),
    ]
    sky = new Background({x: 0, y: 0, image: skyImg})
    hills = new Background({x: 0, y: 80, image: hillsImg})
    grass = new Background({x: 0, y: 30, image: grassImg})

    scrollOffset = 0
}

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = '#caf4fa'
    c.fillRect(0, 0, canvas.width, canvas.height)

    sky.draw()
    hills.draw()
    grass.draw()
    
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()
    npc.draw()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    }
    else if ((keys.left.pressed && player.position.x > 100) || 
             (keys.left.pressed && scrollOffset == 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        // scroll effect
        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })

            sky.position.x -= player.speed * 0.2
            hills.position.x -= player.speed * 0.4
            grass.position.x -= player.speed * 0.6

        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })

            sky.position.x += player.speed * 0.2
            hills.position.x += player.speed * 0.4
            grass.position.x += player.speed * 0.6
        }

    }

    
    platforms.forEach(platform => {

        // Collision detection
        const groundHeight = 65
        const platformCollisionY = platform.position.y + platform.height / 2.8
        const playerPixels = 15

    if (
        player.velocity.y > 0 &&

        player.position.y + player.height <= platformCollisionY &&
        player.position.y + player.height + player.velocity.y >= platformCollisionY &&

        player.position.x + player.width - playerPixels >= platform.position.x &&
        player.position.x + playerPixels <= platform.position.x + platform.width
    ) {
        player.velocity.y = 0

        player.position.y = platformCollisionY - player.height
    }

        // Win scenario
        // scrollOffset >= gameEnd
        if (npc.isTouching(player)) {
            console.log('you win!')
            winPopup.classList.remove('hidden')
            gameWon = true
        }

        // Lose scenario
        if (player.position.y > canvas.height) {
            init()
        }
    })
}

init()
animate()


// Event Listeners
window.addEventListener('keydown', ( { keyCode }) => {
    switch (keyCode) { 
        case 65:
            console.log('left')
            keys.left.pressed = true
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            break
        
        case 87:
            console.log('up')
            if (event.repeat) {return}
            player.velocity.y -= 15 
            break
    }
})

window.addEventListener('keyup', ( { keyCode }) => {
    switch (keyCode) { 
        case 65:
            console.log('left stop')
            keys.left.pressed = false
            break

        case 83:
            console.log('down stop')
            break

        case 68:
            console.log('right stop')
            keys.right.pressed = false
            break
        
        case 87:
            console.log('up stop') 
            break
    }
})

// To remove pop-ups
window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        popup.style.display = 'none'
    }
})

// To restart game after winning
window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && gameWon) {
        winPopup.classList.add('hidden')
        init()
        gameWon = false
    }
})