/*
 * DOM操作
 */

var map = document.querySelector('.map');
var dice = document.querySelector(".dice");
var choosemode = document.querySelector(".choosemode");
var choosebox = document.querySelector(".choosebox");
var choosechr = document.querySelector(".choosechr");
var InputRoomId= document.querySelector(".inputRoom");
var playerWait= document.querySelector(".playerList");
var title = document.querySelector(".title");
var modetitle= document.querySelector(".modetitle");
var info = document.querySelector('.info');
var dialog = document.querySelector(".dialog");
var infobox = document.querySelector(".infobox");
var objbox = document.querySelector(".objbox");
var infoboxchr = document.querySelector(".infoboxchr");
var msgbox = document.querySelector(".msgbox");
var curday = document.querySelector('.num');
var curDOW = document.querySelector('.dow');
var objbar = document.querySelector('.objects');
function createImg(src, className) {
    let img = document.createElement('img');
    if (src) img.src = src;
    if (className) img.className = className;
    return img;
}
function createDiv(className,innerHTML='') {
    let div = document.createElement('div');
    if (className) div.className = className; 
    if (innerHTML) div.innerHTML = innerHTML;
    return div;
}
function createH(tagName, innerHTML) {
    let h = document.createElement(tagName);
    if (innerHTML) h.innerHTML = innerHTML;
    return h;
}
// 禁用选项
function disableBox(node) {
    node.style.pointerEvents = "none";
    node.style.background = "grey";
}
// 更改选择配置时的DOM显示
function writeSetting(title, base, num) {
    choosebox.firstElementChild.innerHTML = title;
    Array.from(choosebox.lastElementChild.children).forEach((node, index) => {
        node.innerHTML = base + index;
        switch (num) {
            case 3:
                choosebox.style.display = "none";
                choosechr.style.display = "block";
                break;
            case 2:
                if (index > 1) disableBox(node);
                break;
            case 1:
                if (index > 2) disableBox(node);
                break;
            case 0:
                if (index < 1) disableBox(node);
                break;
        }
    })
}
// 显示玩家信息
function writeInfo() {
    players.forEach((player) => {
        let node = createDiv('node');
        let str=player.name

        if(player.name==Username)  str+="(me)"
        let h2 = createDiv('nodeName', str);
        player.card=h2;
        let h3 = createDiv('nodeMoney', `$${player.money}`);
        let h4 = createDiv('nodeMoney', `+${estateStatistic(player)}`);
        h2.style.background = player.color;
        h4.style.color = player.color;
        node.append(h2);
        node.append(h3);
        node.append(h4);
        info.append(node);
        
    });
}
function updateObject(){
    objbar.innerHTML='';
    players[s].backpack.forEach(
        (obj)=>{
            let card= createDiv('objCard');
            card.innerHTML=obj.name;    
            objbar.appendChild(card);
            
            card.addEventListener('mouseover', () => {
            objbox.style.display = "block";
            objbox.firstElementChild.innerHTML = obj.name;            
            objbox.lastElementChild.lastElementChild.innerHTML= obj.text;
            });

            card.addEventListener('mouseout', () => {
            objbox.style.display = "none";
             });
        }
    )
    
}
function setInfoBox(node, innerHTML0 = "", innerHTML1 = "", innerHTML2 = "") {
    node.children[0].innerHTML = innerHTML0;
    node.children[1].innerHTML = innerHTML1;
    node.children[2].innerHTML = innerHTML2;
}
// 显示地产信息
function addPlaceInfoListener() {
    places.forEach((place, index) => {
        place.node.addEventListener('mouseover', () => {
            infobox.style.display = "block";
            infobox.style.boxShadow = place.node.style.boxShadow;
            infobox.firstElementChild.className = place.node.firstElementChild.className;
            infobox.firstElementChild.innerHTML = place.name;
            console.info()
            if (place.state==="estate"&& place.level >= 0) {
                setInfoBox(infobox.lastElementChild, `地主：${place.owner}`, `价格：${purchaseCost(place)}`, place.owner ? `住宿：${restCost(place)}` : "");
            } else if (place.state === "goodEvent") {
                setInfoBox(infobox.lastElementChild, `捡到一定量的钱`);
            } else if (place.state === "badEvent") {
                setInfoBox(infobox.lastElementChild, `需要纳税一定量的钱`);
            } else if (place.state === "airport") {
                setInfoBox(infobox.lastElementChild, `传送到${places[busPair(index)].name}`);
            } else if (place.state === "surprise") {
                setInfoBox(infobox.lastElementChild, `会有意想不到的事情发生哦`);
            } else if (place.state === "trip") {
                setInfoBox(infobox.lastElementChild, `花费一定的钱进行若干天的旅行`);
            } else if (place.state === "jail") {
                setInfoBox(infobox.lastElementChild, `没写作业被抓拘留若干天`);
            }
        });
        place.node.addEventListener('mouseout', () => {
            infobox.style.display = "none";
        });
    })
}
function addPlayerInfoListener() {
    players.forEach((player) => {
        player.card.addEventListener('mouseover', () => {
            infoboxchr.style.display = "block";
            infoboxchr.firstElementChild.style.background = player.color;
            infoboxchr.firstElementChild.innerHTML = player.name;
          
            infoboxchr.lastElementChild.lastElementChild.innerHTML= getestatestring(player);
            player.card.addEventListener('mouseout', () => {
            infoboxchr.style.display = "none";
        });
    })
})
}


function rollDice(num) { // 掷骰子
    let index = 0;
    let move = setInterval(() => {
        index ^= 1;
        dice.style.background = `url(img/s${index + 1}.jpg)`;
    }, v / 8);
    setTimeout(() => {
        clearInterval(move);
        dice.style.background = `url(img/${num}.jpg)`;
    }, v * 0.75);
    toggleDice(false);
}
function toggleDice(state) {
    if (state) {
        dice.style.pointerEvents = "auto";
    } else {
        dice.style.pointerEvents = "none";
    }
}
// 当前行动玩家
function updatePlayer(index) {
    title.innerHTML = `${players[index].name}'s turn`;
    title.style.background = players[index].color;
    updateObject();
}
// 当前回合数
function updateRound() {
    curday.innerHTML++;
    switch(curday.innerHTML%7){
        case 0: dow="SUN"; break;
        case 1: dow="MON"; break;
        case 2: dow="TUE";break;
        case 3: dow="WED";break;
        case 4: dow="THUR";break;
        case 5: dow="FRI";break;
        case 6: dow="SAT";break;
    }
    curDOW.innerHTML=dow;
}
// 实时显示金钱和排名
function updateInfo() {
    players.sort(
        function(a,b){
            return b.money+estateStatistic(b)-a.money-estateStatistic(a);
        });
        
    info.innerHTML='';

    writeInfo();
    addPlayerInfoListener();
   players.sort(
            function(a,b){
                return a.index-b.index;
            });
   
    
}
// 判断后把角色挪走
function updateBankrupt(node, index) {
    info.children[index].firstElementChild.style.display = "none";
    info.children[index].append(node);
}
// 格子变色
function purchasePlace(node, color) {
    node.style.boxShadow = `inset 2px 2px 10px ${color}`;
}
// 创建升级造房动画
function construct() {
    let construct = createDiv('construct');
    for (let i = 1; i <= 5; i++) {
        construct.append(createImg(`img/c${i}.png`));
    }
    return construct;
}
// 显示造房动画
function upgradeHouse(node, state) {
    let upgrade = construct();
    node.prepend(upgrade);
    setTimeout(() => {
        node.removeChild(upgrade);
        node.append(createImg(`img/l${state + 1}.png`, 'house'));
        nextPlayer(s);
    }, v * 3);
}
// 显示消息框
function showMsgbox(msg) {
    if (msg === "") return;
    msgbox.style.display = "block";
    msgbox.innerHTML = msg;
    setTimeout(() => {
        msgbox.style.display = "none";
    },v * 2);
}
// 显示购买框
function showDialog(type, allowButton) {
    dialog.style.display = 'block';
    let place = places[players[s].position];
    if (type === "purchase") {
        dialog.children[1].innerHTML = "购买地产";
        dialog.firstElementChild.innerHTML = `请问你要花费$${purchaseCost(place)}来购买${place.name}吗？`;
    } else if (type === "upgrade") {
        dialog.children[1].innerHTML = "升级地产";
        dialog.firstElementChild.innerHTML = `请问你要花费$${upgradeCost(place)}来升级${place.name}吗？`;
    }
    if (allowButton) {
        dialog.children[2].style.pointerEvents = "auto";
        dialog.children[2].style.background = "#f2f2f2";
    } else {
        dialog.children[2].style.pointerEvents = "none";
        dialog.children[2].style.background = "#454545";
    }
    dialog.children[2].onclick = () => { // 确定按钮
        dialogClicked(type , true);
    }
    dialog.children[3].onclick = () => { // 取消按钮
        dialogClicked(type , false);
    }
}
function useObjectDialogue(obj){
    dialog.style.display = 'block';
    dialog.children[1].innerHTML = "使用道具";
    dialog.firstElementChild.innerHTML = `请问你要使用$${obj.name}吗？`;

  
        dialog.children[2].style.pointerEvents = "auto";
        dialog.children[2].style.background = "#f2f2f2";
 
    dialog.children[2].onclick = () => { // 确定按钮
        useObject(obj);
        return true;
    }
    dialog.children[3].onclick = () => { // 取消按钮
        return false;
    }
   

}
function useObject(obj){
    for(let i=0;i<players[s].backpack.length();i++){
        if(players[s].backpack[i]===obj){
            players[s].backpack.splice(i,1);
            break;
        }
    }

}
// 关闭购买框
function closeDialog() {
    dialog.style.display = "none";
}

// 写入地图棋格

    for (let i = 0; i < 66; i++) {
        let box = createDiv('box');
        let h3 = createH('h3');
        box.append(h3);
        map.prepend(box);
    }
    readMapFromFile("defaultMap")

// 绑定选择
Array.from(document.querySelectorAll('.choosebox li')).forEach((node, index) => {
    node.addEventListener('click', () => {
        chooseNumber(index);
    })
})

Array.from(document.querySelectorAll('.choosemode li')).forEach((node, index) => {
    node.addEventListener('click', () => {
        chooseNumber(index);
    })
})



let arrow = createDiv('arrow');
arrow.append(createImg("img/arrow.png"));
// 选择角色
Array.from(choosechr.lastElementChild.children).forEach(item => {
    item.firstElementChild.addEventListener('mouseover', function(){ // 下标箭头
        item.appendChild(arrow);
    })
    item.firstElementChild.addEventListener('click', () => { // 绑定角色
        // 处理选中效果
        item.firstElementChild.style.border = "1px solid #666";
        let index = createDiv('index');
        index.innerHTML = `${players.length + 1}`;
        item.appendChild(index);
        item.removeChild(arrow);
        item.style.pointerEvents = "none";
        // 创建角色对应棋子
        let name = item.children[1].innerHTML;
        let node = createImg(`img/${name}.png`, 'chr');
        places[0].node.append(node);
        let control = players.length < playerNumber ? 1 : 0;
        CreatePlayer(name, players.length, startMoney, "active", 0, control, node);
        if (players.length === (playerNumber + npcNumber)) { // 角色选择完毕
            startGame();
        }
    })
})
// # 界面显示相关

// 掷骰区
dice.style.background = `url(img/${1}.jpg)`;
dice.onclick = () => {
    isRunning = 1;
    game(randInteger(1, 6));
}

// 设置区域
document.querySelectorAll('.status button')[0].addEventListener('click', function() { // 开启指南
    if (this.innerHTML === "规则介绍") {
        this.innerHTML = "收起";
        document.querySelector('.instruction').style.height = "100%";
    } else {
        this.innerHTML = "规则介绍";
        document.querySelector('.instruction').style.height = "0";
    }
})
const speedUp = () => {
    let u = v ^ speed[0] ^ speed[1];
    document.querySelectorAll('.status button')[1].innerHTML = `${v > u ? '正常' : '加快'}速度`;
    v = u;
}
document.querySelectorAll('.status button')[1].addEventListener('click', function() { // 设置速度
    if (startmode === 1) {
        speedUp();
    } else if (startmode >= 2) {
        socket.emit("speed", {
            roomNo: RoomId,
        })
    }
})
document.querySelectorAll('.status button')[2].addEventListener('click', function() { // 托管
    if (startmode === 1) {
        if (this.innerHTML === "开启托管") {
            this.innerHTML = "取消托管";
            players.forEach(player => {
                if (player.control)
                    player.control = "";
            });
            if (!isRunning) game();
        } else {
            this.innerHTML = "开启托管";
            players.forEach(player => {
                if (player.control === "")
                    player.control = 1;
            })
        }
    } else if (startmode >= 2) {
        let pos;
        for (let i = 0; i < userList.length; i++)
            if (userList[i] === Username) {
                pos = i;
            }
        let opt = (this.innerHTML === "开启托管")
        socket.emit("auto", {
            roomNo: RoomId,
            s: pos,
            opt: opt
        })
        if (opt) {
            this.innerHTML = "取消托管";
            if (players[pos].control)
                players[pos].control = "";
            if (!isRunning && pos === s) {
                let num = randInteger(1, 6);
                socket.emit('roll', {
                    number: num,
                    username: Username,
                    roomNo: RoomId
                })
            }
        } else {
            this.innerHTML = "开启托管";
            if (players[pos].control === "")
                players[pos].control = 1;
        }
    }
})
curday.parentElement.style.pointerEvents = "none";

// 预加载图片
window.addEventListener('load', () => {
    let images = [];
    let src = [
        "img/arrow.png", "img/Aatrox.png", "img/Camille.png", "img/Irelia.png", "img/Lucian.png", "img/Yone.png", "img/zed.png",
        "img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg", "img/5.jpg", "img/6.jpg", "img/s1.jpg", "img/s2.jpg",
        "img/c1.png", "img/c2.png", "img/c3.png", "img/c4.png", "img/c5.png", "img/l1.png", "img/l2.png", "img/l3.png"
    ];
    src.forEach((src, index) => {
        images[index] = new Image()
        images[index].src = src
    });
})


function checkLeave(){
    socket.emit('userDisconnect', {
        username: Username,
        roomNo: RoomId
    })
}