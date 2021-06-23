//
function game(num=0) { // 掷骰子至一名玩家操作结束
	console.log("a"+num)
	if(num===0) num=randInteger(1,6)
	rollDice(num);
	let move = setInterval(() => { // 每次移动一格
		playerStepNext();
		num--;
		if (num === 0) {
			clearInterval(move);
			setTimeout(() => {
				let place = places[players[s].position];
				if (place.state==="estate"&&!place.owner) { // 买房
					purchaseHandler(place);
				} else if (place.state==="estate"&& place.owner && place.owner !== players[s].name && place.owner !== "banned") { // 住房
					restHandler(place);
				} else if (place.owner === players[s].name) { // 升级
					upgradeHandler(place);
				} else if (place.state === "goodEvent") { // 捡到钱
					goodEventHandler(place);
				} else if (place.state === "badEvent") { // 交税
					badEventHandler(place);
				} else if (place.state === "jail") { // 入狱
					jailHandler(place);
				} else if (place.state === "surprise") { // 机会命运
					surpriseHandler(place);
				} else if (place.state === "airport") { // 飞机
					airportHandler(place);
				} else if (place.state === "trip") { // 旅游度假
					tripHandler(place);
				}
				updateInfo();

			}, v * 0.6);
		}
	}, v);
}