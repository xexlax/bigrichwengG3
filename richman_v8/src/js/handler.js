function purchaseHandler(place) {
	if(players[s].control) { // 玩家角色才出现选择框
		if(startmode>1){//多人模式
			if(Username!==players[s].name){

				return;
			}
		}
		showDialog("purchase", players[s].money > purchaseCost(place));
	} else { // NPC行为，买了后还有3000保底才决定买

		setTimeout(() => dialogClicked("purchase", (players[s].money - purchaseCost(place)) > 3000), v / 3);
	}
}
function restHandler(place) {
	let owner = players.find((player) => {
		return player.name === place.owner;
	}) // 找到主人
	if (owner.stop) { // 主人不在家
		if (owner.position === jailPos) showMsgbox("主人正在机房写代码，免费过夜一晚！");
		else showMsgbox("主人出去旅行了，免费过夜一晚！");
	} else { // 付地租
		let cost = restCost(place); // 根据地产等级计算房租
		// owner.money += cost;
		transaction(players.indexOf(owner), cost);
		transaction(s, -cost, `${owner.name}感谢${players[s].name}在${place.name}消费$${cost}`)
	}
	nextPlayer(s);

}
function upgradeHandler(place) {
	if (place.level === 3) {
		showMsgbox("房子等级已达上限，无法继续升级");

	} else {
		if (players[s].control){ // 玩家控制
           /*   //使用券
            if(hasObject(objectList[1],player[s]))
                if(useObjectDialogue(objectList[1])){
                    let upgradeMap = ["一座小房子", "一套大别墅", "一栋大酒店"];
		            transaction(s, 0, `恭喜${players[s].name}在${place.name}建了${upgradeMap[place.level]}`);
		            place.level++;
		        // 造房动画效果
		            upgradeHouse(place.node, place.level - 1);
                }
                else showDialog("upgrade", players[s].money > upgradeCost(place));

            else */
			if(startmode>1){//多人模式
				if(Username!==players[s].name){

					return;
				}
			}
			showDialog("upgrade", players[s].money > upgradeCost(place));
            
			
		} else { // NPC行为
          /*  if(hasObject(objectList[1],player[s])){
                useObject(objectList[1]);
                let upgradeMap = ["一座小房子", "一套大别墅", "一栋大酒店"];
		            transaction(s, 0, `恭喜${players[s].name}在${place.name}建了${upgradeMap[place.level]}`);
		            place.level++;
		        // 造房动画效果
		            upgradeHouse(place.node, place.level - 1);
            }
            else */

			dialogClicked("upgrade", (players[s].money - upgradeCost(place)) > 3000); // 大于3000块保底才升级
		}
	}
}
function goodEventHandler(place) {
	let money = 500 * randInteger(1, 7);
	if (startmode === 1) {
		transaction(s, money, `恭喜${players[s].name}捡到了$${money}`);
		nextPlayer(s);
	} else if (startmode >= 2) {
		if (Username === players[s].name) {
			socket.emit("goodEvent", {
				roomNo: RoomId,
				money: money
			})
		}
	}
}
function badEventHandler(place) {
	let money = 500 * randInteger(1, 7);
	if (startmode === 1) {
		transaction(s, -money, `${players[s].name}需要向税务局缴纳税收$${money}`);
		nextPlayer(s);
	} else if (startmode >= 2) {
		if (Username === players[s].name) {
			socket.emit("badEvent", {
				roomNo: RoomId,
				money: money
			})
		}
	}

}
function jailHandler(place) {
	let stop = randInteger(1, 3);
	if (startmode === 1) {
		players[s].stop = stop
		showMsgbox(`大作业没做被抓，抓到机房写代码${stop}天`)
		nextPlayer(s);
	} else if (startmode >= 2) {
		if (Username === players[s].name) {
			socket.emit("jail", {
				roomNo: RoomId,
				stop: stop
			})
		}
	}
}
function surpriseHandler(place) {
	let fate = fates[randInteger(0, fates.length)];
	if (startmode === 1) {
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
	} else if (startmode >= 2) {
		if (Username === players[s].name) {
			socket.emit("fate", {
				roomNo: RoomId,
				fate: fate
			})
		}
	}
}

function airportHandler(place) {
	let money = 800;
	transaction(s, -money, `${players[s].name}花费${money}搭乘巴士前往${places[busPair(players[s].position)].name}`);
	setTimeout(() => {
		playerSetPos(busPair(players[s].position));
		nextPlayer(s);

	},v * 1.5);
}
function tripHandler(place) {
	let stop = randInteger(1, 3);
	if (startmode === 1) {
		players[s].stop = stop
		transaction(s, -players[s].stop * 1000, `${players[s].name}花费${stop * 1000}享受思源湖底${stop}日游`);
		nextPlayer(s);
	} else if (startmode >= 2) {
		if (Username === players[s].name) {
			socket.emit("trip", {
				roomNo: RoomId,
				stop: stop
			})
		}
	}
}

function selectRoomHandler(){

	let roomId = document.getElementById("inputRoom").value
	let username = document.getElementById("inputUser").value
	if (!roomId || !username) {
		alert('请输入用户名或者房间号...')
		return
	}
	RoomId = roomId;
	Username = username;
	startmode = 3;
	if (Number(roomId) > 0) {
		RoomService();
	}else {

	}

}
document.getElementById("inputButton").addEventListener('click',()=>{
	selectRoomHandler();
})

document.getElementById("startButton").addEventListener('click',()=>{
	SendStartGameService();
})
document.getElementById("editButton").addEventListener('click',()=>{
	startEditor();
})
