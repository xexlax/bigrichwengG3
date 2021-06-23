/*
 * 地图、命运、玩家数据默认值
 */

var players = [];
function CreatePlayer(name, index, money, state, stop, control, node) {

	let colorp=0;
	switch(name){
		case "Aatrox": colorp=0; break;
		case "Camille": colorp=1; break;
		case "Irelia": colorp=2; break;
		case "Lucian": colorp=3; break;
		case "Yone": colorp=4; break;
		case "Zed": colorp=5; break;
		default: colorp=index;break;
	}
	console.log(colorp)
	players.push({
		name: name,
		index: index,
		money: money,
		state: state,
		stop: stop,
		control: control,
		node: node,
		card:null,
		position: 0,
		color: colorScheme[colorp],
		estate:[],
		backpack:[]
	});
}
var places = [];
var mapStruct=[];
var jailPos = -1;
var busPos1 = -1, busPos2 = -1;
var busPos=[]
function getH3Style(state) {
	switch (state) {
		case "goodEvent": return "c1";
		case 0: return "c0";
		case "estate": return "c4";
		case "surprise": return "c11";
		case "airport": return "c12";
		case "badEvent": return "c2";
		case "jail": return "c13";
		case "trip": return "c3";
		default: return "c11";
	}
}
function CreateBox(name, value, state, owner, index) {

	document.querySelectorAll('.map>div')[index].firstElementChild.append(name);
	document.querySelectorAll('.map>div')[index].firstElementChild.className = getH3Style(state);
	places.push({
		name: name,
		value: value,
		state: state,
		owner: owner,
		level: 0,
		node: document.querySelectorAll('.map>div')[index],
	});
}
var fates = [];
function CreateFate(id,text, value, stop) {
	fates.push({
		id:id,
		text: text,
		value: value,
		stop: stop,
	});
}
var objectList = [];
function CreateObject(name,text){
	objectList.push({
		name: name,
		text: text
	})
}
/*
CreateBox("起点", 2000, "goodEvent", "banned", 55); // 0
CreateBox("东上院", 600, "estate", "", 56); // 1
CreateBox("东中院", 1000, "estate", "", 57); // 2
CreateBox("东下院", 1300, "estate", "", 58); // 3
CreateBox("机会", 1000, "surprise", "banned", 59); // 4
CreateBox("上院", 1600, "estate", "",60); // 5
CreateBox("中院", 1800, "estate", "", 61); // 6
CreateBox("巴士站1", 1000, "airport", "banned", 62); // 7
CreateBox("交所得税", 1000, "badEvent", "banned", 63); // 8
CreateBox("命运", 1000, "surprise", "banned", 64); // 9
CreateBox("下院", 1900, "estate", "", 65); // 10
CreateBox("软院机房", 0, "jail", "banned", 54); // 11
CreateBox("电信学院", 2400, "estate", "", 43); // 12
CreateBox("机动学院", 2200, "estate", "", 32); // 13
CreateBox("材料学院", 2000, "estate", "", 21); // 14
CreateBox("航天学院", 2700, "estate", "", 10); // 15
CreateBox("机会", 1000, "surprise", "banned",9); // 16
CreateBox("捡到钱", 1000, "goodEvent", "banned", 8); // 17
CreateBox("船建学院", 2100, "estate", "", 7); // 18
CreateBox("生医工学院", 2500, "estate", "", 6); // 19
CreateBox("物理学院", 3300, "estate", "", 5); // 20
CreateBox("化学学院", 3500, "estate", "",4); // 21
CreateBox("数学学院", 3000, "estate", "", 3); // 22
CreateBox("巴士站2", 1000, "airport", "banned", 2); // 23
CreateBox("致远学院", 3600, "estate", "", 1); // 24
CreateBox("命运", 1000, "surprise", "banned", 0); // 25
CreateBox("思源湖", 1000, "trip", "banned", 11); // 26
CreateBox("药学院", 3400, "estate", "", 22); // 27
CreateBox("法学院", 3200, "estate", "", 33); // 28
CreateBox("人文学院", 2800, "estate", "", 44); // 29
*/

CreateFate(1,"喝了一杯小眷村，花费$30", -30, 0);
CreateFate(2,"路边捡到$500", 500, 0);
CreateFate(3,"吃魔鬼辣嫩牛五方吃坏肚子，去医院花了$800", -800, 0);
CreateFate(4,"钱包落在共享单车里，丢失$1000", -1000, 0);
CreateFate(5,"空闲时间去兼职家教，收获$2000", 2000, 0);
CreateFate(6,"体测1km时摔跤了，买药花了$100", -100, 0);
CreateFate(7,"手机突然坏了，换了部最新款HUAWEI，花费$6499", -6499, 0);
CreateFate(8,"去五餐吃火锅，花费$500", -500, 0);
CreateFate(9,"去看石楠，如痴如醉，误入软院机房一天", 0, 1);
CreateFate(10,"什么也没有发生，但不知道为什么钱包里少了$800", -800, 0);
CreateFate(11,"什么也没有发生, 但不知道为什么钱包里多了$1000", 1000, 0);
CreateFate(12,"去朝花夕拾卖二手书，获得$300", 300, 0);
CreateFate(13,"在校门口发传单，得到$100", 100, 0);
CreateFate(14,"抢了个微信红包，获得$1", 1, 0);
CreateFate(15,"梦见得到$8000国奖，醒来决定花$50去拜神", -50, 0);
CreateFate(16,"获得$8000国奖！", 8000, 0);
CreateFate(17,"交友不慎，-$8000", -8000, 0);
CreateFate(18,"什么也没有发生", 0, 0);
CreateFate(19,"看电影花费了$100", -100, 0);
CreateFate(20,"还花呗欠款$999", -999, 0);
CreateFate(21,"一年一度的双十一到了，剁手花了$2000", -2000, 0);
CreateFate(22,"突然很渴想买瓶农夫果园，花费$5", -5, 0);
CreateFate(23,"去实验室搬砖赚了$500", 500, 0);
CreateFate(24,"偷税漏税罚款$1000，惩罚写1天代码", -1000, 1);
CreateFate(25,"校园内超速行驶被罚款$2000，惩罚写2天代码", -2000, 2);
CreateFate(26,"被查水表发现有违建，罚款$1000并惩罚写3天代码", -1000, 3);
CreateFate(27,"考试作弊被惩罚写5天代码", 0, 5);
CreateFate(101,"获得请假条一张",0,0);
CreateFate(102,"获得建筑券一张",0,0);
CreateFate(103,"获得公交卡一张",0,0);
CreateFate(104,"获得任意骰子",0,0);
CreateFate(105,"获得水，不知道有什么用",0,0);

CreateObject('请假条','可以减少写一天的代码');//0
CreateObject('建筑券','可以免费升级一次地皮');//1
CreateObject('公交卡','乘坐校园巴士免费');
CreateObject('任意骰子','可以指定一次骰点');
CreateObject('水','氵氵氵');

function CreatePlaces(jsonf){
	places=[]
	mapStruct=jsonf
	let json;

	for (let i = 0; i < jsonf.length; i++) {
		json = jsonf[i]
		if(json.state==="jail") jailPos=i;
		if(json.state==="airport") {
			busPos.push(i)
		}

		map.childNodes[json.index].firstElementChild.append(json.name);
		map.childNodes[json.index].firstElementChild.className = getH3Style(json.state);
		places.push({
			name: json.name,
			value: json.value,
			state: json.state,
			owner: json.owner,
			level: 0,
			node: map.childNodes[json.index],

		});

	}
}

function readMapFromFile(mapName){
	const url = "./data/" + mapName + ".json";
	const request = new XMLHttpRequest();
	request.open("get", url);/*设置请求方法与路径*/
	request.send(null);/*不发送数据到服务器*/
	request.onload = function () {/*XHR对象获取到返回信息后执行*/
		if (request.status === 200) {/*返回状态为200，即为数据获取成功*/
			var jsonf = JSON.parse(request.responseText);
			CreatePlaces(jsonf)
		}
	}
}

var s = 0; // 初始化玩家顺序 / sequence
var playerNumber = 0; // 玩家数量
var npcNumber = 0; // npc数量
var startMoney = 0; // 初始化金钱
var startmode = 0; //初始化进度 1离线 2在线 3在线进入房间 4等待其他玩家进入
var RoomId = -1;
var Username = "";
var startOnline = 0;//联机初始选项
var v = 800; // 800, 500
var colorPointer = 0;
var colorScheme = ["#990000", "green", "#CC3366", "#646464", "#0066CC", "black", "#5FAE2E"];
var speed = [500, 800];
var isRunning = 0;
var isWaiting = 0;

let socket = io.connect('http://127.0.0.1:3000')

var userList = []; // 房间内所有人的username