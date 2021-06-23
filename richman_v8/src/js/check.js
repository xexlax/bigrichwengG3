
// 判断相关
// 判断轮到的下个玩家是否处在停止状态
function checkPlayerState(index) {
	let player = players[index]
	if (player.stop) { // 停止状态
		if (places[player.position].state === "jail") {
			showMsgbox(`${player.name}还有${player.stop}天可以离开机房`);
		} else if (places[player.position].state === "trip") {
			showMsgbox(`${player.name}离难得的旅行结束还有${player.stop}天`);
		}
		player.stop--;
		return false;
	} else if (player.state === "bankrupt") {
		return false;
	} else {
		console.log(player.control)
		if (!player.control) { // NPC行动的地方
			console.log("NPC")
			setTimeout(() => {
				if (startmode === 1) {
					game();
				} else {
					let num = randInteger(1, 6);
					socket.emit('roll', {
						number: num,
						username: Username,
						roomNo: RoomId
					})
				}
			},v * 2);
		} else { // 解锁骰子，玩家行动
			isRunning = 0;
			toggleDice(true);
		}
		// 轮到下一玩家
		s = index;
		updatePlayer(s);
		return true;
	}
}
// 判断胜利条件
function checkTerminated(){
	let count = 0;
	let winner;
	players.forEach(player => { // 数还有多少人处于活跃状态
		if (player.state === "active") {
			count ++;
			winner = player;
		}
	});
	if (count === 1) { // 只有一个人活跃的话
		setTimeout(() => {
			socket.emit('userWin', {
				username: Username,
				roomNo: RoomId
			})
		}, v * 2);
	}
}
// 判断破产
function checkBankrupt(index) {
	if (players[index].money <= 0) { // 当前玩家的钱<=0
		setTimeout(() => {
			players[index].stop = 0;
			if(players[index].state!=="bankrupt"){
			alert(`很遗憾，${players[index].name}破产了，所有地产将归还学校。`);
			players[index].state = "bankrupt";
			players[index].money = 0;
			players[index].estate= [];
			}
			updateBankrupt(players[index].node, index);
			places.forEach(place => { // 地产充公
				if (place.owner === players[index].name) {
					place.owner = "";
					place.node.style.boxShadow = "1px 1px 1px inset #454545, 1px -1px 1px inset #454545, -1px 1px 1px inset #454545, -1px -1px 1px inset #454545";
				}
			})
			checkTerminated(); // 每当有人破产就判断是否结束
		}, v / 2);
	}
}