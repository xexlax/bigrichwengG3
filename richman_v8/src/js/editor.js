var Selected=-1;


function showEditorMenu(){
    document.querySelector('.status').style.display="none";
    document.querySelector('.editorMenu').style.display="grid";
}
function hideEditorMenu(){
    document.querySelector('.status').style.display="grid";
    document.querySelector('.editorMenu').style.display="none";
}
function findNearIdx(idx){//获取相邻格子编号
    let res=[]
    if((idx+1)%11!==0) res.push(idx+1);
    if((idx)%11!==0) res.push(idx-1);
    if(idx+11<66) res.push(idx+11) ;
    if(idx-11>=0) res.push(idx-11);
    return res;
}
function getTopIdx(){//获取队列中上一个格子编号
    return mapStruct[mapStruct.length-1].index
}
function BindButtons(){//绑定点击事件
    for (let i = 0; i < 66; i++) {
        map.childNodes[i].addEventListener('click',()=>{Select(i)})
    }
}
function Select(idx){//选中格子
    if(Selected>=0) {
        map.childNodes[Selected].style.transform = "rotate(0deg)";
        findNearIdx(Selected).forEach((i) => {
            map.childNodes[i].style.transform = "rotate(0deg)";
        })
    }
    map.childNodes[idx].style.transform="rotate(6deg)";
    findNearIdx(idx).forEach((i)=>{
        map.childNodes[i].style.transform="rotate(3deg)";
    })
    Selected=idx;
    UpdateMenuList();

}
var applybutton=document.getElementById("applyedition");
var removebutton=document.getElementById("removenode");
var addbutton=document.getElementById("addnode");

function UpdateMenuList(){
    let a=mapStruct.find((x)=>{return x.index===Selected})

    if(a===undefined){
        document.getElementById("editName").innerHTML="--";
        document.getElementById("editType").innerHTML="草地";
        document.getElementById("editValue").innerHTML="--";
        applybutton.style.display="none"
        removebutton.style.display="none"
        addbutton.style.display="block"
        return
    }
    document.getElementById("editName").innerHTML=a.name;
    document.getElementById("editType").innerHTML=a.state;
    document.getElementById("editValue").innerHTML=a.value;
    applybutton.style.display="block"
    removebutton.style.display="block"
    addbutton.style.display="none"


}
function addNode(idx){
    mapStruct.push({
        name: "未命名地产",
        value: 0,
        state: "estate",
        owner: "",
        level: 0,
        node: {},
        index: idx
    })
    map.childNodes[idx].firstElementChild.innerHTML="未命名地产";
    map.childNodes[idx].firstElementChild.className = getH3Style("estate");
    UpdateMenuList()
}
function SaveNode(idx){
    console.log(12)
    if(Selected<0) return
    let a=mapStruct.find((x)=>{return x.index===idx});
    if(a===undefined)return;
    a.name=document.getElementById("editName").innerHTML;
    a.state=document.getElementById("editType").innerHTML;
    a.value=document.getElementById("editValue").innerHTML;
    console.log(a)
    map.childNodes[idx].firstElementChild.innerHTML=a.name;
    map.childNodes[idx].firstElementChild.className = getH3Style(a.state);

}
function removeNode(idx){
    mapStruct=mapStruct.filter((x)=>{return x.index!==idx});
    map.childNodes[idx].firstElementChild.innerHTML="";
    map.childNodes[idx].firstElementChild.className = getH3Style(0);
    UpdateMenuList()
}
applybutton.addEventListener('click',()=>SaveNode(Selected))
addbutton.addEventListener('click',()=>addNode(Selected))
removebutton.addEventListener('click',()=>removeNode(Selected))
function readNewMap(mn){
    map.innerHTML=""
    for (let i = 0; i < 66; i++) {
        let box = createDiv('box');
        let h3 = createH('h3');
        box.append(h3);
        map.prepend(box);
    }
    readMapFromFile(mn)
    BindButtons();
}
function eraseMap(){
    readNewMap("newMap");
}

function saveMap(){
    if(CheckMap()===0) {
        alert("地图不满足条件！")
        return
    }
    reArrange();
    CreatePlaces(mapStruct);
    map_has_varied=1;
    choosemode.parentElement.style.display = "block";
    choosemode.style.display = "block";
    hideEditorMenu();


}
function CheckMap(){
    let start=mapStruct.find((x)=>{
        return x.name==="起点"
    })
    if(start===undefined)return 0
    let startIdx=start.index;
    let nearset
    let nxtidx
    let preidx=startIdx
    while (start!==undefined){
        nearset=findNearIdx(start.index);
        nearset=nearset.filter((x)=>{
            let q=mapStruct.find((y)=>{
                return  y.index===x
            })

            return(q!==undefined )
        })

        if(nearset.length!==2) return 0
        if(nearset[0]===preidx) nxtidx=nearset[1];
        else nxtidx=nearset[0];

        if(nxtidx===startIdx) return 1
        preidx=start.index

        start=mapStruct.find((x)=>{
            return x.index===nxtidx
        })


    }
    return 0
}

function reArrange(){
    let newMapStruct=[]
    let start=mapStruct.find((x)=>{
        return x.name==="起点"
    })
    if(start===undefined)return 0
    let startIdx=start.index;
    let nearset
    let nxtidx
    let preidx=startIdx
    while (start!==undefined){
        newMapStruct.push(start);
        nearset=findNearIdx(start.index);
        nearset=nearset.filter((x)=>{
            let q=mapStruct.find((y)=>{
                return  y.index===x
            })
            return(q!==undefined )
        })

        if(nearset[0]===preidx) nxtidx=nearset[1];
        else nxtidx=nearset[0];
        if(nxtidx===startIdx) break
        preidx=start.index

        start=mapStruct.find((x)=>{
            return x.index===nxtidx
        })


    }
    mapStruct=newMapStruct;
    return

}
document.getElementById("erasemap").addEventListener('click',()=>eraseMap());
document.getElementById("savemap").addEventListener('click',()=>saveMap());
var map_has_varied=0