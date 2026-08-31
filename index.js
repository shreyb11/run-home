const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// img code possibly?
const platformImg = new Image();
platformImg.src = 'Platform.png'; 

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.5

// Player class construction
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0

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
        this.height = 20
    }

    draw() {
            c.fillStyle = 'blue'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
}

const player = new Player()
const platforms = [new Platform({x: 200, y: 300}), new Platform({x: 500, y: 500})]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}

let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    }
    else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        // scroll effect
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
        }
    }

    
    platforms.forEach(platform => {
        // Platform collision detection
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0
        }

        // Win scenario
        if (scrollOffset > 2000) {
            console.log('you win!')
        }
    })
}

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
            player.velocity.y -= 20 
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