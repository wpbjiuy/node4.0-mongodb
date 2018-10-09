var window_width = window.innerWidth,
    window_height = window.innerHeight,
    radius = Math.round(window_width*4/10/108)-1,
    margin_top = 100,
    margin_left = Math.round(window_width/4.5)
var endTime = new Date()
endTime.setTime(endTime.getTime()+3600*1000)
var curShowTimeSeconds = 0

var balls = []
var colors = ['#B06431','#4FB031','#22F431','#FFC100','#22F4AD','#22E3F4','#2274F4','#2922F4','#B622F4','#F4222C']

var canvas = document.getElementById('canvas')

canvas.width = window_width;
canvas.height = window_height;

var cxt = canvas.getContext('2d')

curShowTimeSeconds = getCurrenShowTimeSeconds()

setInterval(function(){
    render(cxt)
    update()
},50)

function update() {
    var nextShowTimeSeconds = getCurrenShowTimeSeconds()

    var nextHours = parseInt(nextShowTimeSeconds/3600),
        nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60),
        nextSeconds = nextShowTimeSeconds%60

    var curHours = parseInt(curShowTimeSeconds/3600),
        curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60),
        curSeconds = curShowTimeSeconds%60

    if(nextSeconds != curSeconds){
        if(parseInt(curHours/10) != parseInt(nextHours/10)){
            addBalls(margin_left+15*(radius+1), margin_top, parseInt(nextHours/10))
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls(margin_left+30*(radius+1), margin_top, parseInt(nextHours%10))
        }

        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
            addBalls(margin_left+39*(radius+1), margin_top, parseInt(nextMinutes/10))
        }
        if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
            addBalls(margin_left+54*(radius+1), margin_top, parseInt(nextMinutes%10))
        }

        if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
            addBalls(margin_left+78*(radius+1), margin_top, parseInt(nextSeconds/10))
        }
        if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
            addBalls(margin_left+93*(radius+1), margin_top, parseInt(nextSeconds%10))
        }

        curShowTimeSeconds = nextShowTimeSeconds
    }

    updateBalls()
}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx
        balls[i].y += balls[i].vy
        balls[i].vy += balls[i].g

        if (balls[i].y >= window_height-radius) {
            balls[i].y = window_height-radius
            balls[i].vy = -balls[i].vy*0.75
        }
    }

    var cnt = 0
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + radius > 0 && balls[i].x - radius < window_width) {
            balls[cnt++] = balls[i]
        }
    }

    while(balls.length > Math.min(500,cnt)){
        balls.pop()
    }
}

function addBalls(x, y, num) {
    
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] == 1){
                var aBall = {
                    x:x+j*2*(radius+1)+(radius+1),
                    y:y+i*2*(radius+1)+(radius+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }

                balls.push(aBall)
            }
        }
    }
}

function getCurrenShowTimeSeconds() {
    var curTime = new Date()
    var ret = endTime.getTime() - curTime.getTime()
    ret = Math.round(ret/1000)

    var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds()

    return ret >= 0 ? ret : 0
}

function render(cxt) {
    cxt.clearRect(0,0,window_width,window_height)

    var hours = parseInt(curShowTimeSeconds/3600),
        minutes = parseInt((curShowTimeSeconds-hours*3600)/60),
        seconds = curShowTimeSeconds%60

    renderDigit(margin_left, margin_top, parseInt(hours/10), cxt)
    renderDigit(margin_left+15*(radius+1), margin_top, parseInt(hours%10), cxt)

    renderDigit(margin_left+30*(radius+1), margin_top, 10, cxt)

    renderDigit(margin_left+39*(radius+1), margin_top, parseInt(minutes/10), cxt)
    renderDigit(margin_left+54*(radius+1), margin_top, parseInt(minutes%10), cxt)

    renderDigit(margin_left+69*(radius+1), margin_top, 10, cxt)

    renderDigit(margin_left+78*(radius+1), margin_top, parseInt(seconds/10), cxt)
    renderDigit(margin_left+93*(radius+1), margin_top, parseInt(seconds%10), cxt)

    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color

        cxt.beginPath()
        cxt.arc(balls[i].x, balls[i].y, radius, 0, 2*Math.PI, true)
        cxt.closePath()

        cxt.fill()
    }
    //console.log(balls.length)
}

function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = '#3390C6'

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] == 1){
                cxt.beginPath()
                cxt.arc(x+j*2*(radius+1)+(radius+1), y+i*2*(radius+1)+(radius+1), radius, 0, 2*Math.PI)
                cxt.closePath()

                cxt.fill()
            }
        }
    }
}