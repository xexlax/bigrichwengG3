
function RoomService() {
	console.log("roomId:", RoomId);
	console.log("username:", Username);

	let ajax = new XMLHttpRequest()
	ajax.open('get', 'http://127.0.0.1:3000?room=' + RoomId + '&user=' + Username)
	ajax.send()

	ajax.onreadystatechange = function () {
		console.log(ajax)
		if (ajax.readyState === 4 && ajax.status === 200) {
			// 用户请求进入房间

			socket.emit('enter', {
				username: Username,
				roomNo: RoomId,
				hasVaried:map_has_varied,
				MapStruct: mapStruct
			})
		}
	}

// 点击掷骰子
	dice.onclick = () => {
		if (players[s].name !== Username) return;
		isRunning = 1;
		console.log("dice")

		let num = randInteger(1, 6);
		socket.emit('roll', {
			number: num,
			username: Username,
			roomNo: RoomId
		})
	}
}

function SendStartGameService(){
	if (userList.length < 2) {
		alert("人数不足两人！")
	} else if (userList[s] !== Username) {
		alert("需要房主权限才能开启游戏！")
	} else {
		socket.emit("start",{
			roomNo:RoomId
		})
	}

}
//接收广播
socket.on("startInfo",(data)=>{
	if(data.roomNo===RoomId){
		startOnlineGame()
		console.log("received")
	}
})

function DiceService(){
	isRunning = 1;
	console.log("dice")
	let num = randInteger(1, 6);
	socket.emit('roll', {
		number: num,
		username: Username,
		roomNo: RoomId

	})
}

function NextTurnService(){//确认后发送信息

}
function NextDayService(){//新一轮
}
function SendConfirm(type,tof){
	console.log("sendconf"+tof)
	socket.emit('confirmS',{
		roomNo:RoomId,
		accept:tof,
		player:Username,
		type:type
	})
}

socket.on('confirmR', (data) => {
	console.log(data);
	if(data.roomNo===RoomId&&players[s].name!==Username) {
		dialogClicked(data.type, data.accept)

	}
})

socket.on("tripInfo", (data) => {
	if (data.roomNo === RoomId) {
		let stop = data.stop
		players[s].stop = stop
		transaction(s, -players[s].stop * 1000, `${players[s].name}花费${stop * 1000}享受思源湖底${stop}日游`);
		nextPlayer(s);
	}
})

socket.on("goodEventInfo", (data) => {
	if (data.roomNo === RoomId) {
		let money = data.money
		transaction(s, money, `恭喜${players[s].name}捡到了$${money}`);
		nextPlayer(s);
	}
})

socket.on("badEventInfo", (data) => {
	if (data.roomNo === RoomId) {
		let money = data.money
		transaction(s, -money, `${players[s].name}需要向税务局缴纳税收$${money}`);
		nextPlayer(s);
	}
})

socket.on("jailInfo", (data) => {
	if (data.roomNo === RoomId) {
		let stop = data.stop
		players[s].stop = stop
		showMsgbox(`大作业没做被抓，抓到机房写代码${stop}天`)
		nextPlayer(s);
	}
})

socket.on("fateInfo", (data) => {
	if (data.roomNo === RoomId) {
		console.log("fateInfo:", data)
		let fate = data.fate
		transaction(s, fate.value, fate.text);
		// 道具事件
		if(fate.id>100){
			attainObject(players[s],fate.id-101);
			updateObject();
		}
		// 坐牢事件
		if (fate.stop) {
			setTimeout(function(){
				players[s].stop = fate.stop;
				playerSetPos(jailPos);
				nextPlayer(s);
			},v * 1.5);
		} else {
			nextPlayer(s);
		}
	}
})

socket.on("speedInfo", (data) => {
	if (data.roomNo === RoomId) {
		speedUp()
	}
})

socket.on("userWinInfo", (data) => {
	if (data.roomNo === RoomId) {
		alert(`${winner.name}赢啦！恭喜${winner.name}成为最有钱的人！`);
		location.reload();
	}
})

socket.on("autoInfo", (data) => {
	if (data.roomNo === RoomId) {
		let pos;
		for (let i = 0; i < userList.length; i++)
			if (userList[i] === Username) {
				pos = i;
			}
		console.log("autoInfo")
		if (data.opt) {
			if (players[pos].control)
				players[pos].control = "";
		} else {
			if (players[pos].control === "")
				players[pos].control = 1;
		}
	}
})

socket.on("msgInfo", (data) => {
	if (data.roomNo === RoomId) {
		let index = data.index
		if (index === (playerNumber + npcNumber) - 1) {
			index = 0;
			if (Username === players[s].name) {
				socket.emit('day', {
					roomNo: RoomId
				})
			}
		} else {
			index++;
		}
		setTimeout(() => {
			if (!checkPlayerState(index)) nextPlayer(index);
		}, v * 2);
	}
})

socket.on("dayInfo", (data) => {
	if (data.roomNo === RoomId) {
		updateRound();
		players.forEach((player, index) => {
			transaction(index, data.sum);
		})
		updateInfo();
		setTimeout(() => {
			showMsgbox(data.msg);
		}, v * 2);
	}
})


// 返回用户信息
socket.on('userInfo', (data) => {
	console.log('userInfo:', data);
})
// 返回房间信息
socket.on('roomInfo', (data) => {
	if (data.roomNo === RoomId) {
		let userL=document.getElementById('waitList');
		console.log('roomInfo:', data);
		userList = data.roomInfo.order;
		console.log("userList", userList);
		map.innerHTML=""
		for (let i = 0; i < 66; i++) {
			let box = createDiv('box');
			let h3 = createH('h3');
			box.append(h3);
			map.prepend(box);
		}
		CreatePlaces(data.roomInfo.mapstruct);
		userL.innerHTML = ''
		let idx = 0
		userList.forEach((x, idx) => {
			idx++
			let node = document.createElement("div")
			node.className = "playerW"
			node.innerHTML = 'P' + String(idx) +"   " + x
			if(idx===1)
				node.innerHTML+="(房主)"

			userL.appendChild(node)
		})
		if (!isWaiting) {
			isWaiting = 1;
			chooseNumber(0);
		}

	}
})
// 返回掷骰子信息
socket.on('rollInfo', (data) => {
	console.log('rollInfo:', data);
	if (data.roomNo === RoomId) {
		rollDice(data.number)
		game(data.number)
	}
})
socket.on('roomFull', (data) => {
	if (data.roomNo === RoomId) {
		alert("房间已满！")
		Username = ""
		RoomId = -1
	}
})
socket.on('userExisted', (data) => {
	if (data.roomNo === RoomId) {
		alert("用户名已存在！")
		Username = ""
		RoomId = -1
	}
})
socket.on('isRunning', (data) => {
	if (data.roomNo === RoomId) {
		alert("该房间正在进行游戏中！")
		Username = ""
		RoomId = -1
	}
})
socket.on('bankruptInfo', (data) => {
	if (data.roomNo === RoomId) {
		for (let i = 0; i < userList.length; i++)
			if (userList[i] === data.username) {
				players[i].money = 0;
				checkBankrupt(i);
			}
	}
})