const BOARD = document.querySelector('.board');
const MOVES = document.querySelector('.moves');
const NEWGAME = document.querySelector('.new-game');
const RESTART = document.querySelector('.restart');
const STARTGAME = document.querySelector('.start-game');
const CONTAINER = document.querySelector('.container');
const START = document.querySelector('.start');
const THEMABTN = document.querySelectorAll('.thema button');
const GRIDBTN = document.querySelectorAll('.grid-size button');
const TIME = document.querySelector('.time')

let arr = [];
let arr2 = []
let moves = 0;
let coupled = 0
let mytime = 0

GRIDBTN.forEach(el => {
    el.addEventListener('click', (e) => {
        if (e.target.id == '4*4') {
            localStorage.setItem('myGrid', '4');
            location.reload()
        }
        if (e.target.id == '6*6') {
            localStorage.setItem('myGrid', '6');
            location.reload()
        }
    })
})

let width = Number(localStorage.getItem('myGrid'))
document.documentElement.style.setProperty('--roow', width);

if (width == '4') {
    THEMABTN.forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.id == 'numbers') {
                localStorage.setItem('myThema', 'number.json');
                location.reload()
            }
            if (e.target.id == 'icons') {
                localStorage.setItem('myThema', 'icons.json');
                location.reload()
            }
        })
    })
    var url = localStorage.getItem('myThema') || 'number.json'
}

if (width == '6') {
    THEMABTN.forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.id == 'numbers') {
                localStorage.setItem('myThema6', 'number6.json');
                location.reload()
            }
            if (e.target.id == 'icons') {
                localStorage.setItem('myThema6', 'icons6.json');
                location.reload()
            }
        })
    })
    var url = localStorage.getItem('myThema6') || 'number6.json'
}

const randomItem = (element) => {
    let random = Math.floor(Math.random() * element.length);
    let el = element[random];
    element.splice(random, 1);
    return el;
}

const endGame = () => {
    if (coupled == width * width) {
        alert('You Win');
        clearInterval(progress)
    }
}

const openItem = (e) => {
    let item = e.target.firstElementChild
    moves++;
    time = setTimeout(function () {
        item.style.visibility = 'hidden';
    }, 1000);
    if (item.id && item.id != arr[arr.length - 1]) {
        arr.push(item.id);
        arr2.push(item.innerHTML);
    }
    if (arr2.length === 2) {
        arr = []
        if (arr2[0] === arr2[1]) {
            document.querySelectorAll('.item span').forEach(el => {
                if (el.innerHTML === arr2[0] || el.innerHTML === arr2[1]) {
                    el.parentElement.removeAttribute('onclick');
                    el.parentElement.style.backgroundColor = 'green';
                    coupled++;
                }
            });
            arr2 = [];
        } else {
            item.style.visibility = 'visible';
            arr2 = [];
        }
    }
    item.style.visibility = 'visible';
    MOVES.innerHTML = moves

    endGame()
}

const createItem = (element) => {
    for (let i = 0; i < width * width; i++) {
        const ITEM = document.createElement('div');
        ITEM.classList.add('item');
        ITEM.innerHTML = `<span>${randomItem(element)}</span>`;
        ITEM.setAttribute('onclick', 'openItem(event)');
        ITEM.firstElementChild.setAttribute('id', i);
        BOARD.appendChild(ITEM);
    }
    hideItem()
}

function hideItem() {
    setTimeout(function () {
        document.querySelectorAll('.item span').forEach(el => {
            el.style.visibility = 'hidden';
        })
    }, 2000);
}

async function newGame() {
    clearInterval(progress)
    mytime = 0
    coupled = 0;
    moves = 0;
    BOARD.innerHTML = '';
    const res = await fetch(url)
    const data = await res.json()
    createItem(data.thema);
    MOVES.innerHTML = moves;
    hideItem()
    progress = setInterval(() => {
        timer()
    }, 1000)
}

async function startGame() {
    const res = await fetch(url)
    const data = await res.json()
    createItem(data.thema);
    progress = setInterval(() => {
        timer()
    }, 1000)
    CONTAINER.classList.add('show');
    START.classList.add('end-show');
}

NEWGAME.addEventListener('click', () => {
    location.reload()
    CONTAINER.classList.remove('show');
    START.classList.remove('end-show');
})

STARTGAME.addEventListener('click', startGame)
RESTART.addEventListener('click', newGame)

const timer = () => {
    mytime++
    let min = Math.floor(mytime / 60)
    let sec = mytime % 60
    if (sec < 10) {
        sec = '0' + sec
    }
    if (min < 10) {
        min = '0' + min
    }
    if (min > 59) {
        location.reload()
    }
    TIME.innerHTML = `${min}:${sec}`
}