

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

const canvas = document.querySelector('canvas')

const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', function (e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
})
