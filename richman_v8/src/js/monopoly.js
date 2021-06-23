// 游基础戏逻辑
function randInteger(min, max) { // 生成随机数
	return Math.floor(Math.random() * (max - min)) + min;
}
function restCost(place) {
	if (place.level === 0) return place.value / 5;
	if (place.level === 1) return place.value / 2;
	if (place.level === 2) return place.value;
	return place.value * 2;
}

function purchaseCost(place) {
	return place.value * (place.level + 1);
}
function upgradeCost(place) {
	return place.value / 2;
}
//不动产统计
function estateStatistic(player){
	let sum=0;
	player.estate.forEach(function(place){
		sum+=place.value+upgradeCost(place)*place.level;
		
	})
	return sum/2;
}
function getestatestring(player){
	let str="";
	player.estate.forEach(function(place){
		str+=place.name+"  ";
	})
	
	return str;
}
function attainObject(player,id){
	player.backpack.push(objectList[id]);
/*	msg=`恭喜${players[s].name}获得了${objectList[i].name}`;
	setTimeout(() => {
		showMsgbox(msg);
	}, v * 2);*/
}
function hasObject(obj,player){
	id=player.backpack.findIndex(
		(item,index)=>{
			item===obj
		}
	);
	if(id>=0)return true;
	else return false;
}
function transaction(index, value, msg) {
	if(players[index].state!=="bankrupt"){
	players[index].money += value;
	if (msg) showMsgbox(msg);
	checkBankrupt(index);
	updateInfo();
	updateObject();
}
}
function updateRoundAnnounce() {
	let num = +curday.innerHTML;
	let msg = "";
	let sum = 0;
	if (num % 7 === 4) { // 每周工资
		let money = randInteger(20, 30) * 100;
		sum += money;
		msg += `又到了每周的发薪日啦！每位玩家获得$${money}。`;
	}
	if (num % 7 === 1) { // 每周交税
		let money = randInteger(10, 20) * 100;
		sum -= money;
		msg += `又到了每周的交税日啦！每位玩家失去$${money}。`;
	}
	if (randInteger(0, 15) === 0) { // 随机丢钱
		let money = randInteger(20, 30) * 100;
		sum -= money;
		msg += `突发地震！每位玩家失去$${money}。`;
	}
	players.forEach((player, index) => {
		transaction(index, sum);
	})
	updateInfo();
	setTimeout(() => {
		showMsgbox(msg);
	}, v * 2);
}
// 轮骰顺序
function nextPlayer(index) {
	if (startmode === 1) {
		if (index === (playerNumber + npcNumber) - 1) {
			index = 0;
			updateRound();
			updateRoundAnnounce();
		} else {
			index++;
		}
		setTimeout(() => {
			if (!checkPlayerState(index)) nextPlayer(index);
		}, v * 2);
	} else if (startmode >= 2) {
		console.log("nextPlayer")
		if (Username === players[s].name) {
			socket.emit('msg', {
				roomNo: RoomId,
				index: index
			})
		}
	}
}

function playerSetPos(position) { // 设置角色位置
	players[s].position = position;

	places[position].node.append(players[s].node);
}

function playerStepNext() { // 角色移动一步
	if (players[s].position === places.length) {
		players[s].position = -1;
		// places[0].node.append(players[index].node);
		players[s].money += 1000;
		updateInfo();
	}

	playerSetPos((players[s].position + 1)%places.length);
}

function busPair(Pos) {
	let a=0
	busPos.forEach((x,i)=>{

		if(x===Pos)
			a=busPos[(i+1)%busPos.length];
	})

	return a;
}
function dialogClicked(type, action) { // 购买或取消

	if(startmode>1) {
		if (Username === players[s].name) {

			SendConfirm(type,action);
		}

	}
	let place = places[players[s].position];
	if (!action) { // 关闭对话框: 通过action模拟NPC购买与否
		closeDialog();
		nextPlayer(s);
		return;
	}
	if (type === "purchase") { // 购买
		place.owner = players[s].name;
		players[s].estate.push(place);
		purchasePlace(place.node, players[s].color);
		transaction(s, -purchaseCost(place), `恭喜${players[s].name}获得了${place.name}`);

		
		nextPlayer(s);
	} else { // 升级
		let upgradeMap = ["一座小房子", "一套大别墅", "一栋大酒店"];
		transaction(s, -upgradeCost(place), `恭喜${players[s].name}在${place.name}建了${upgradeMap[place.level]}`);
		place.level++;
		// 造房动画效果
		upgradeHouse(place.node, place.level - 1);
	}
	closeDialog();
	updateInfo();
}
