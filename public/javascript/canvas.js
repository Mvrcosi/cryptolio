
const options = document.getElementById('datalistOptions')


async function getCoins() {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    return res
}



getCoins().then((res) => {

    for (let i = 0; i < res.data.length; i++) {
        const option = document.createElement('option')
        options.appendChild(option)
        option.value = res.data[i].name

    }
})

if( window.document.location.pathname === '/')  {
const canvas = document.querySelector('canvas')

const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', function (e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
})


const coins = []


async function getCoins() {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    return res
}


getCoins().then((res) => {

    for (let i = 0; i < res.data.length; i++) {
        coins.push(res.data[i])
    }

    function distance(x1, y1, x2, y2) {
        const xDist = x2 - x1;
        const yDist = y2 - y1;

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
    }

    function randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);

    }

    function rotate(velocity, angle) {
        const rotateVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        }

        return rotateVelocities
    }


    function resolveCollision(particle, otherParticle) {
        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            const m1 = particle.mass;
            const m2 = otherParticle.mass;

            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);

            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);

            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;

            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }

    class Bubble {
        constructor(x, y, radius, sAngle, eAngle, coinName, coinPrice, coinImg, bubbleColor, coinImgSize) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.sAngle = sAngle;
            this.eAngle = eAngle;
            this.coinName = coinName;
            this.coinPrice = coinPrice;
            this.coinImg = coinImg;
            this.bubbleColor = bubbleColor;
            this.mass = .5;
            this.velocity = {
                x: (Math.random() - 0.5) * 1,
                y: (Math.random() - 0.5) * 1
            };
            this.coinImgSize = coinImgSize;

        }


        draw() {
            context.beginPath();
            context.strokeStyle = this.bubbleColor;
            context.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
            context.stroke();
        }

        name() {
            context.font = `${this.radius / 3}px serif`;
            context.fillStyle = 'white';
            context.textAlign = 'center'
            context.fillText(this.coinName.toUpperCase(), this.x, this.y - this.radius / 2);
        }
        price() {

            context.font = `${this.radius / 3.5}px serif`;
            context.fillStyle = 'white';
            context.fillText(this.coinPrice, this.x, this.y + this.radius / 1.2);
        }
        image() {
            context.drawImage(this.coinImg, this.x - this.radius / 2, this.y - this.radius / 2, this.coinImgSize, this.coinImgSize)

        }


        update(coinsToRender) {
            this.draw()
            this.name()
            this.price()
            this.image()


            for (let i = 0; i < coinsToRender.length; i++) {

                if (this === coinsToRender[i]) continue;
                if (distance(this.x, this.y, coinsToRender[i].x, coinsToRender[i].y) - this.radius * 2 < 0) {

                    resolveCollision(this, coinsToRender[i])

                }

            }

            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.velocity.x *= -1
            }

            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.velocity.y *= -1
            }
            this.x += this.velocity.x;
            this.y += this.velocity.y

        }

    }



    const coinsToRender = []


    for (let i = 0; i < coins.length; i++) {

        let radius = 0
        let myImage = new Image()
        myImage.src = `${coins[i].image}`
        let x = canvas.width / 2
        let y = canvas.height / 2
        const angle = 0;
        const pi = 2 * Math.PI;
        let coinName = coins[i].symbol;
        let coinCurrentPrice = `$${coins[i].current_price.toLocaleString()}`;
        const coinImg = myImage;
        let bubbleColor = coins[i].price_change_percentage_24h > 0 ? 'green' : 'red';
        let coinImgSize = radius;


        if (coins[i].market_cap_rank > 70) {
            radius = canvas.width / 80
            coinName = ''
            coinCurrentPrice = ''
            coinImgSize = radius / 1
        }

        else if (coins[i].market_cap_rank > 60) {
            radius = canvas.width / 70
            coinImgSize = radius

        }
        else if (coins[i].market_cap_rank > 50) {
            radius = canvas.width / 65
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank > 40) {
            radius = canvas.width / 60
            coinImgSize = radius
        }

        else if (coins[i].market_cap_rank > 30) {
            radius = canvas.width / 50
            coinImgSize = radius
        }

        else if (coins[i].market_cap_rank > 20) {
            radius = canvas.width / 45
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank > 10) {
            radius = canvas.width / 30
            coinImgSize = radius
        }

        else if (coins[i].market_cap_rank === 9) {
            radius = canvas.width / 26
            coinImgSize = radius
        }

        else if (coins[i].market_cap_rank === 8) {
            radius = canvas.width / 24
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 7) {
            radius = canvas.width / 22
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 6) {
            radius = canvas.width / 20
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 5) {
            radius = canvas.width / 18
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 4) {
            radius = canvas.width / 16
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 3) {
            radius = canvas.width / 14
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 2) {
            radius = canvas.width / 12
            coinImgSize = radius
        }
        else if (coins[i].market_cap_rank === 1) {
            radius = canvas.width / 10
            coinImgSize = radius
        }






        if (i !== 0) {
            for (let j = 0; j < coinsToRender.length; j++) {
                if (distance(x, y, coinsToRender[j].x, coinsToRender[j].y) - radius * 2 < 0) {

                    x = randomIntFromRange(radius, canvas.width - radius)
                    y = randomIntFromRange(radius, canvas.height - radius)

                    j = -1;

                }

            }

        }
        coinsToRender.push(new Bubble(x, y, radius, angle, pi, coinName, coinCurrentPrice, coinImg, bubbleColor, coinImgSize))

    }


    function animate() {
        requestAnimationFrame(animate)
        context.clearRect(0, 0, canvas.width, canvas.height);


        coinsToRender.forEach((coin, coinIndex) => {

            coin.update(coinsToRender)

        })

    }

    animate()

})

}
else if(window.document.location.pathname === '/canvas') {

    const coinImage = document.querySelectorAll('img')
    const coin = document.querySelector('.coin')
    const coinName = document.querySelectorAll('.coin-name')
    const currentPrice = document.querySelectorAll('.current-price')
    const profitLoss = document.querySelectorAll('.profit-loss')
    const purchaseFee= document.querySelectorAll('.purchase-fee')
    const purchasePrice = document.querySelectorAll('.purchase-price')
    const quantityPurchased = document.querySelectorAll('.quantity-purchased')

    if(coinName.length > 0) {
    getCoins().then((res) => {
      
        for(let i =0; i < res.data.length; i++) {
           
            for(let j = 0; j< coinName.length; j++) {
                if(res.data[i].name.toLowerCase() === coinName[j].innerText.toLowerCase()) {

                    coinImage[j].src = res.data[i].image
                    for(let k = 0; k < coinImage.length; k++) {
                    }

                    // LEFT OFF HERE/ JUST CAST THE TEXT TO INTS ANC CALCUALTE IT THAT WAY
                    currentPrice[j].innerText =` $${res.data[i].current_price.toLocaleString()}`

    
                    profitLoss[j].innerText = `${purchasePrice[j].innerText + res.data[i].current_price}`

                }
            }
        }


    })
}
  
}