const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Image import
const SkyImg = new Image();
SkyImg.src = 'Sky.png'; 
const hillsImg = new Image();
hillsImg.src = 'Hills.png'; 
const platformImg = new Image();
platformImg.src = 'Platform.png'; 

const GuyRightImg = new Image();
GuyRightImg.src = 'GuyRight.png'; 
const GuyLeftImg = new Image();
GuyLeftImg.src = 'GuyLeft.png'; 



canvas.width = 1024
canvas.height = 576

const gravity = 0.5

// Player class construction
class Player {
    constructor() {
        this.speed = 7
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
            c.drawImage(GuyLeftImg, this.position.x, this.position.y, this.width, this.height)
        } else {
            c.drawImage(GuyRightImg, this.position.x, this.position.y, this.width, this.height)
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

// Platform class construction
class Platform {
    constructor({ x, y }) {
        this.position = {
            x: x,
            y: y
        }

        this.width = 200
        this.height = 100
    }

    draw() {
            c.drawImage(
            platformImg,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
        }
}

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
let platforms = []
let sky = new Background({x: 0, y: 0, image: SkyImg})
let hills = new Background({x: 0, y: 0, image: hillsImg})

let scrollOffset = 0

// Initialization
function init() {
    player = new Player()
    platforms = [
        new Platform({x: 0, y: 480}), 
        new Platform({x: 400, y: 350}),
        new Platform({x: 700, y: 200})]
    sky = new Background({x: 0, y: 0, image: SkyImg})
    hills = new Background({x: 0, y: 0, image: hillsImg})

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
    
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

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

            sky.position.x -= player.speed * 0.33
            hills.position.x -= player.speed * 0.66

        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })

            sky.position.x += player.speed * 0.33
            hills.position.x += player.speed * 0.66
        }
    }

    
    platforms.forEach(platform => {

        // Collision detection
        const groundHeight = 65
        const platformCollisionY = platform.position.y + platform.height - groundHeight

    if (
        player.velocity.y > 0 &&

        player.position.y + player.height <= platformCollisionY &&
        player.position.y + player.height + player.velocity.y >= platformCollisionY &&

        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
    ) {
        player.velocity.y = 0

        player.position.y = platformCollisionY - player.height
    }

        // Win scenario
        if (scrollOffset > 2000) {
            console.log('you win!')
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