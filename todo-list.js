"use strict"


var CL_COMPLETED = 'completed';
var CL_SELECTED = 'selected';
var CL_EDITING = 'editing';
var CL_HIDDEN = 'hidden';
var CL_REMOVED = 'removed'
/*
**  pri 0,1,2 => low , medium , emergency
**  status 0 => actived 1 => completed
 */
function createToDoItem(id,pri,content,status){
    var item = {
        id:id,
        pri:pri,
        content:content,
        status:status
    }
    return item
}

function getComponent(s){
    return document.getElementById(s);
}

window.onload = () =>{

    model.init(()=>{
        Object.assign(model.data,{
            getItem:function (index) {
                if(index){
                    return this.items[index];
                }else{
                    console.error("null index");
                    return null;
                }
            },
            setItem:function (index, itemValue) {
                if(index){
                    this.items[index] = itemValue;
                }else{
                    console.error("null index");
                    return null;
                }
            },
            removeItem:function (itemValue) {
                var index = this.items.findIndex(i => i.id === itemValue.id)
                if(index >=0 && index < this.items.length){
                    this.items.splice(index,1);
                }else{
                    console.error("index error");
                    return null;
                }
            }
        });

        var data = model.data;

    })

    initAddButton();
    initDialog();


    update();
}

function initAddButton() {

    var timer;
    getComponent("add-button").addEventListener('touchstart',function () {
        console.log("start");
        timer = setTimeout(function () {
            var dialog = getComponent("dialog-wrap");
            dialog.classList.remove('hidden');
            dialog.getElementsByTagName('h3')[0].innerHTML = 'Create Todo Item';
            var todoText = getComponent('todo-text');
            if(todoText.value !== ""){
                dialog.querySelector('.dialog').value = todoText.value;
            }
            timer = null;
        },1000)
    });

    getComponent('add-button').addEventListener('touchend',function () {
        console.log("1111");
        if(!timer){
            return ;
        }else{
            clearTimeout(timer);
            addToDoItem();
        }
    })

}


function initDialog() {
    var dialog = getComponent('dialog-wrap');
    var inputField = dialog.querySelector('.dialog');
    var liArray = dialog.querySelector('.filters').getElementsByTagName('li');
    [].forEach.call(liArray,function (item) {
        console.log(item);
        item.addEventListener('click',changeSelecPri);
    })

    getComponent('apply').addEventListener('click',function () {
        if(!window.editValue.isEdit){
            var todoItem = createToDoItem(model.data.id++,editValue.selePri,inputField.value,0);
            model.data.items.push(todoItem);
        }else{
            var dataIndex = model.data.items.indexOf(editValue.editItem);
            model.data.items[dataIndex].content = inputField.value;
            model.data.items[dataIndex].pri = editValue.selePri;
        }


        resetDialog();
        update();
    })

    getComponent('cancel').addEventListener('click',function () {
        resetDialog();
    })

    function changeSelecPri() {
        [].forEach.call(liArray,function (item) {
            //TODO change hidden and value
            if (!item.firstElementChild.classList.contains('hidbc')){
                item.firstElementChild.classList.add('hidbc')
            }
        })
        if(this.firstElementChild.classList.contains('hidbc')){
            this.firstElementChild.classList.remove('hidbc');
        }
        if(this.innerText === 'Emergency'){
            window.editValue.selePri =2;
        }else if(this.innerText === 'Medium'){
            window.editValue.selePri = 1;
        }else if(this.innerText === 'Low'){
            window.editValue.selePri = 0;
        }

    }

    function resetDialog(){
        [].forEach.call(liArray,function (item) {
            //TODO change hidden and value
            if (!item.firstElementChild.classList.contains('hidbc')){
                item.firstElementChild.classList.add('hidbc')
            }
            if(item.innerText === 'Low'){
                if(item.firstElementChild.classList.contains("hidbc")){
                    item.firstElementChild.classList.remove('hidbc');
                }
            }
        })
        editValue.selePri = 0;
        editValue.isEdit = false;
        editValue.editItem = null;
        inputField.value = "";
        getComponent('todo-text').value = '';
        dialog.classList.add('hidden');
    }

}

function addToDoItem(){
    var todoText = getComponent('todo-text')
    var text = todoText.value;
    if(text === ""){
        return ;
    }
    console.log(text);
    var item = createToDoItem(model.data.id++,0,text,0);
    model.data.items.push(item);

    todoText.value = "";
    update();
}

function createItemComponent(itemValue){
    var todoItem = document.createElement("li");
    var itemId = 'todo'+ itemValue.id;
    todoItem.id = itemId;
    todoItem.innerHTML = [
        '<div class="view">',
        '  <div class="wrapper E">E</div>',
        '  <div class="wrapper M">M</div>',
        '  <div class="wrapper L">L</div>',
        '  <div class="wrapper min"></div>',
        '  <div class="todo-content">' + itemValue.content + '</div>',
        '</div>'
    ].join('');

    var showPri = todoItem.querySelector('.min');
    if(itemValue.pri === 0){
        showPri.classList.add('L');
    }else if(itemValue.pri === 1){
        showPri.classList.add('M');
    }else if(itemValue.pri === 2){
        showPri.classList.add('E');
    }

    if(itemValue.status === 1){
        todoItem.classList.add('completed')
    }

    var startX, startY, moveX, moveY;
    var canRemove = false;
    var touchTimer = null;

    todoItem.addEventListener('touchstart',function (e) {
        var touchPoint = e.touches[0];
        startX = touchPoint.pageX;
        startY = touchPoint.pageY;
        touchTimer = setTimeout(function () {
            var dialog = getComponent("dialog-wrap");
            dialog.classList.remove('hidden');
            dialog.getElementsByTagName('h3')[0].innerHTML = 'Edit Todo Item';
            dialog.querySelector('.dialog').value = todoItem.querySelector('.todo-content').innerHTML;
            editValue.isEdit = true;
            editValue.editItem = itemValue;
            editValue.selePri = itemValue.pri;
            touchTimer = null;
        },1000)
    })

    todoItem.addEventListener('touchend',function (e) {
        if(touchTimer){
            clearTimeout(touchTimer);
            touchTimer = null;
        }
        if(moveX < -screen.width/2 && !canRemove){
            canRemove = true;
            this.classList.add(CL_REMOVED);
            update();
        }else if(!canRemove){
            this.style.transform = 'translate(' + 0 + 'px, ' + 0+'px)';
            this.style.opacity = 1;
        }
    })

    todoItem.addEventListener('touchmove',function (e) {
        var touchPoint = e.touches[0];
        moveX = touchPoint.pageX - startX;
        moveY = touchPoint.pageY - startY;
        if(Math.abs(moveY) < 15){
            e.preventDefault();
            this.style.transform = 'translate(' + moveX + 'px, ' + 0 + 'px)';
         //   this.style.opacity = (1 - Math.abs(moveX) / screen.width).toFixed(1);
        }
    })



    var todoList = getComponent('todo-list');
    todoList.insertBefore(todoItem,todoList.firstChild);
    return todoItem;
}

function update(){
    var data = model.data;

    data.items.forEach(function (itemValue){
        var itemElem = getComponent('todo'+itemValue.id);
        if(itemElem){
            if(itemElem.classList.contains(CL_REMOVED)){
                removeToDoItem(itemElem);
                data.removeItem(itemValue);
                return;
            }
            if(itemElem.querySelector('.todo-content').innerHTML != itemValue.content){
                itemElem.querySelector('.todo-content').innerHTML = itemValue.content;
            }

            changePri(itemValue.pri,itemElem);
        }else{
            itemElem = createItemComponent(itemValue);
        }
        showToDoItem(itemElem);
    })

    function changePri(selePri,itemElem){
        var showPri = itemElem.querySelector('.min');
        var colorList = ['L','M','E'];
        for(var i =0;i < colorList.length;i++){
            if(i === selePri){
                if(!showPri.classList.contains(colorList[i])){
                    showPri.classList.add(colorList[i]);
                }
            }else{
                if(showPri.classList.contains(colorList[i])){
                    showPri.classList.remove(colorList[i]);
                }
            }
        }
    }

    model.flush();

    var num = data.items.length;
    getComponent('todo-count').innerHTML = num + ' Items Left';
}

function showToDoItem(item){
    if(item.classList.contains(CL_HIDDEN)){
        item.classList.remove(CL_HIDDEN);
    }
    item.style.animation = "addItem 0.5s";
}

function hideToDoItem(item){

    item.addEventListener("animationend",function lis(){
        item.removeEventListener("animationend", lis)
        item.classList.add(CL_HIDDEN);
    })
    item.style.animation = "hideItem 0.5s";
}

function removeToDoItem(item){
    item.addEventListener("animationend",function lis(){
        item.removeEventListener("animationend", lis)
        item.parentNode.removeChild(item);
    })
    item.style.animation = "hideItem 0.5s";
}