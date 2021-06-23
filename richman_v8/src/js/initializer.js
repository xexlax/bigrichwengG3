

function chooseNumber(num) { // 选择配置
    console.log(startmode)
    if(startmode===0){
        startmode=1+num;

        if(startmode===1){ //离线模式
            choosemode.style.display="none";
            choosebox.style.display="block";
        }else
        if(startmode===2){ //在线模式
            choosemode.style.display="none";
            InputRoomId.style.display="block";
        }
    }
    else
    if(startmode===3){ //输入完成
        startmode=4;
        InputRoomId.style.display="none";
        playerWait.style.display="block"
    }


        else {
            {choosebox.style.display="block";
                if (!startMoney) { // 选择起始金钱
                    startMoney = num * 5000 + 10000;
                    writeSetting("玩家人数", 1);
                } else if (!playerNumber) { // 选择玩家数量
                    playerNumber = +num + 1;
                    writeSetting("电脑人数", 0, num);
                } else { // 选择npc数量
                    npcNumber = +num;
                    choosebox.style.display = "none";
                    choosechr.style.display = "block";
                }
            }
        }
}
// 开始离线游戏
function startGame() {

    console.log('start outline')
    choosechr.parentElement.style.display = "none";
    title.style.visibility = "visible";
    updatePlayer(s);
    writeInfo();
    addPlaceInfoListener();

}
// 开始在线游戏
function startOnlineGame() {
    modetitle.innerText = "房间号："+RoomId

    const PicName=["Aatrox","Camille","Irelia","Lucian","Yone","Zed"];
    startMoney=20000;
    let idx=0;
    console.log(userList)
    userList.forEach((x)=>{
        let node = createImg(`img/${PicName[idx]}.png`, 'chr');
        places[0].node.append(node);

        CreatePlayer(x,++idx,startMoney,"active", 0, 1, node)
    })
    playerNumber=userList.length
    playerWait.style.display="none";
    playerWait.parentElement.style.display = "none";
    title.style.visibility = "visible";


    updatePlayer(s);
    writeInfo();
    addPlaceInfoListener();
    console.log("gamestart")

}

function startEditor(){

    choosemode.style.display="none";
    choosemode.parentElement.style.display = "none";
    showEditorMenu();
    readNewMap("defaultMap");


}