let express = require('express')
let http = require('http')
let app = express()
let path = require('path')
let server = http.createServer(app)
let io = require('socket.io').listen(server)

let port = process.env.PORT || 3000
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

//响应前端页面的request请求，并返回hello
app.get('/', (req, res) => {
	console.log(req.query)
	res.send('hello socket.io')
})

server.listen(port, () => {
	console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')))

let connectRoom = {}

function randInteger(min, max) { // 生成随机数
	return Math.floor(Math.random() * (max - min)) + min;
}
const changeAuth = (roomNo) => {
	if (connectRoom[roomNo].activeNumber === 0)
		return
	do {

		connectRoom[roomNo][connectRoom[roomNo].order[connectRoom[roomNo].curTurn]].turn = false
		connectRoom[roomNo].curTurn = (connectRoom[roomNo].curTurn + 1) % connectRoom[roomNo].number

		connectRoom[roomNo][connectRoom[roomNo].order[connectRoom[roomNo].curTurn]].turn = true

	} while (connectRoom[roomNo][connectRoom[roomNo].order[connectRoom[roomNo].curTurn]].isBankrupt)
}
Array.prototype.indexOf = function(val) {
	for (let i = 0; i < this.length; i++) {
		if (this[i] === val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	let index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
const bankrupt = (roomNo, username) => {
	if (!connectRoom[roomNo][username].isBankrupt)
		connectRoom[roomNo].activeNumber--
	connectRoom[roomNo][username].isBankrupt = true
}

io.on('connection', (socket) => {
	console.log('connected')

	// 进入房间
	socket.on('enter', (data) => {
		console.log("enter:", data);
		//第一个用户进入，新建房间
		if (connectRoom[data.roomNo] === undefined) {
			connectRoom[data.roomNo] = {}
			connectRoom[data.roomNo].order = []
			connectRoom[data.roomNo].number = 0
			connectRoom[data.roomNo].activeNumber = 0
			connectRoom[data.roomNo].full = false
			connectRoom[data.roomNo].canStart = false
			connectRoom[data.roomNo].curTurn = 0
			connectRoom[data.roomNo].running = false
			connectRoom[data.roomNo].owner =data.username
			connectRoom[data.roomNo].mapHasVaried=data.hasVaried
			connectRoom[data.roomNo].mapstruct=data.MapStruct

		}
		//游戏进行中
		if (connectRoom[data.roomNo].running) {
			socket.emit('isRunning', data)
		} //房间已满
		else if (connectRoom[data.roomNo].full) {
			socket.emit('roomFull', data)
		} //第n个用户进入且不重名
		else if (connectRoom[data.roomNo][data.username] === undefined) {
			connectRoom[data.roomNo].order.push(data.username)
			connectRoom[data.roomNo].number++
			connectRoom[data.roomNo].activeNumber++
			connectRoom[data.roomNo][data.username] = {}
			connectRoom[data.roomNo][data.username].isOwner = false
			connectRoom[data.roomNo][data.username].turn = false

			if(connectRoom[data.roomNo].owner===data.username) {
				connectRoom[data.roomNo][data.username].isOwner = true
				connectRoom[data.roomNo][data.username].turn = true
			}

			connectRoom[data.roomNo][data.username].isBankrupt = false
			connectRoom[data.roomNo].full = (connectRoom[data.roomNo].number >= 4)
			connectRoom[data.roomNo].canStart = (connectRoom[data.roomNo].number >= 2)
			socket.emit('userInfo', {
				userInfo: connectRoom[data.roomNo][data.username]
			})
			socket.emit('roomInfo', {
				roomNo: data.roomNo,
				roomInfo: connectRoom[data.roomNo]
			})
			socket.broadcast.emit('roomInfo', {
				roomNo: data.roomNo,
				roomInfo: connectRoom[data.roomNo]
			})
		} //第n个用户进入但重名
		else if (connectRoom[data.roomNo][data.username]) {
			socket.emit('userExisted', data)
		}
		console.log("connectRoom:", connectRoom)
	})

	// 游戏开始
	socket.on('start', (data) => {
		console.log("start:", data);
		// console.log(connectRoom[data.roomNo])
		if (connectRoom[data.roomNo].canStart && !connectRoom[data.roomNo].running) {
			socket.emit('startInfo', {
				roomNo: data.roomNo,
				roomInfo: connectRoom[data.roomNo]
			})
			socket.broadcast.emit('startInfo', {
				roomNo: data.roomNo,
				roomInfo: connectRoom[data.roomNo]
			})
			connectRoom[data.roomNo].running = 1;
		}
	})

	// 掷骰子
	socket.on('roll', (data) => {
		console.log("roll:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('rollInfo', {
				number: data.number,
				username: data.username,
				roomNo: data.roomNo
			})
			socket.broadcast.emit('rollInfo', {
				number: data.number,
				username: data.username,
				roomNo: data.roomNo
			})
		}
	})
	//等待其他玩家确认
	socket.on('confirmS',(data)=>{
		console.log("confirmS:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('confirmR', data)
			socket.broadcast.emit('confirmR', data)
		}
	})

	// 玩家变更
	socket.on('msg', (data) => {
		console.log("msg:", data);
		if (connectRoom[data.roomNo]) {


			socket.emit('msgInfo', data)
			socket.broadcast.emit('msgInfo', data)
			changeAuth(data.roomNo)
		}
	})

	// 日期变更
	socket.on('day', (data) => {
		console.log("day:", data);
		if (connectRoom[data.roomNo]) {
			let sum = 0, msg = ''
			if (data.day % 7 === 4) { // 每周工资
				let money = randInteger(20, 30) * 100;
				sum += money;
				msg += `又到了每周的发薪日啦！每位玩家获得$${money}。`;
			}
			if (data.day % 7 === 1) { // 每周交税
				let money = randInteger(10, 20) * 100;
				sum -= money;
				msg += `又到了每周的交税日啦！每位玩家失去$${money}。`;
			}
			if (randInteger(0, 15) === 0) { // 随机丢钱
				let money = randInteger(20, 30) * 100;
				sum -= money;
				msg += `突发地震！每位玩家失去$${money}。`;
			}
			socket.emit('dayInfo', {
				sum: sum,
				msg: msg,
				roomNo: data.roomNo
			})
			socket.broadcast.emit('dayInfo', {
				sum: sum,
				msg: msg,
				roomNo: data.roomNo
			})
		}
	})

	// 捡到钱
	socket.on('goodEvent', (data) => {
		console.log("goodEvent:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('goodEventInfo', data)
			socket.broadcast.emit('goodEventInfo', data)
		}
	})

	// 交所得税
	socket.on('badEvent', (data) => {
		console.log("badEvent:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('badEventInfo', data)
			socket.broadcast.emit('badEventInfo', data)
		}
	})

	// 入狱
	socket.on('jail', (data) => {
		console.log("jail:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('jailInfo', data)
			socket.broadcast.emit('jailInfo', data)
		}
	})

	// 旅行
	socket.on('trip', (data) => {
		console.log("trip:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('tripInfo', data)
			socket.broadcast.emit('tripInfo', data)
		}
	})

	// 命运
	socket.on('fate', (data) => {
		console.log("fate:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('fateInfo', data)
			socket.broadcast.emit('fateInfo', data)
		}
	})

	// 托管
	socket.on('auto', (data) => {
		console.log("auto:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('autoInfo', data)
			socket.broadcast.emit('autoInfo', data)
		}
	})

	// 托管
	socket.on('speed', (data) => {
		console.log("speed:", data);
		if (connectRoom[data.roomNo]) {
			socket.emit('speedInfo', data)
			socket.broadcast.emit('speedInfo', data)
		}
	})

	socket.on('bankrupt', (data) => {
		console.log("bankrupt:", data);
		if (connectRoom[data.roomNo]) {
			bankrupt(data.roomNo, data.username)
			socket.emit('bankruptInfo', {
				username: data.username,
				roomNo: data.roomNo
			})
			socket.broadcast.emit('bankruptInfo', {
				username: data.username,
				roomNo: data.roomNo
			})
		}
	})

	socket.on('userWin', (data) => {
		console.log("userWin:", data);
		socket.emit('userWinInfo', {
			username: data.username,
			roomNo: data.roomNo
		})
		socket.broadcast.emit('userWinInfo', {
			username: data.username,
			roomNo: data.roomNo
		})
		if (connectRoom[data.roomNo])
			delete connectRoom[data.roomNo]
	})

	socket.on('userDisconnect', (data) => {
		console.log("userDisconnect:", data);
		if (connectRoom[data.roomNo] && connectRoom[data.roomNo][data.username]) {
			socket.broadcast.emit('userEscape', {
				username: data.username,
				roomNo: data.roomNo
			})
			if (connectRoom[data.roomNo].running) {
				bankrupt(data.roomNo, data.username)
				socket.broadcast.emit('bankruptInfo', {
					username: data.username,
					roomNo: data.roomNo
				})
				if (connectRoom[data.roomNo].activeNumber === 0)
					delete connectRoom[data.roomNo]
			} else {
				connectRoom[data.roomNo].order.remove(data.username)
				delete connectRoom[data.roomNo][data.username]
				connectRoom[data.roomNo].number--
				connectRoom[data.roomNo].activeNumber--
				connectRoom[data.roomNo].full = (connectRoom[data.roomNo].number >= 4)
				connectRoom[data.roomNo].canStart = (connectRoom[data.roomNo].number >= 2)
				if (connectRoom[data.roomNo].number === 0 || connectRoom[data.roomNo].activeNumber === 0) {
					delete connectRoom[data.roomNo]
				} else {
					socket.broadcast.emit('roomInfo', {
						roomNo: data.roomNo,
						roomInfo: connectRoom[data.roomNo]
					})
				}
			}
		}
		console.log(connectRoom)
	})
})