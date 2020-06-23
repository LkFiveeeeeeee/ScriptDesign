"use strict"

var _todoId = 0;

var _todoItems = [];

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

    getComponent("add-button").addEventListener('click',addToDoItem);
    update();
}

function addToDoItem(){
    var todoText = getComponent('todo-text')
    var text = todoText.value;
    console.log(text);
    var item = createToDoItem(model.data.id++,0,text,0);
    model.data.items.push(item);

    todoText.value = "";
    update();
}

function createItemComponent(id,content){
    var todoItem = document.createElement("li");
    var itemId = 'todo'+id;
    todoItem.id = itemId;
    todoItem.innerHTML = [
        '<div class="view">',
        '  <input class="toggle" type="checkbox">',
        '  <label class="todo-label">' + content + '</label>',
        '  <button class="destroy"></button>',
        '</div>'
    ].join('');


    var startX, startY, moveX, moveY;
    var canRemove = false;

    todoItem.addEventListener('touchstart',function (e) {
        var touchPoint = e.touches[0];
        startX = touchPoint.pageX;
        startY = touchPoint.pageY;
    })

    todoItem.addEventListener('touchend',function (e) {
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
            this.style.opacity = (1 - Math.abs(moveX) / screen.width).toFixed(1);
        }
    })

    var completeElem = todoItem.querySelector('.toggle');
    completeElem.addEventListener('click',function () {
        todoItem.classList.add(CL_COMPLETED);
    })

    var editElem = todoItem.querySelector('.todo-label');
    editElem.addEventListener('dbclick',function () {
        todoItem.classList.add(CL_EDITING);
    })

    var deleteElem = todoItem.querySelector('.destroy');
    deleteElem.addEventListener('click',function () {
        removeTodoItemFromArray(todoItem.id);
        todoItem.parentNode.removeChild(todoItem);
        update();
    })

    var todoList = getComponent('todo-list');
    todoList.insertBefore(todoItem,todoList.firstChild);
    return todoItem;
}

function update(){
    var data = model.data;

    data.items.forEach(function (itemValue){
        var itemElem = getComponent('todo'+itemValue.id);
        var item = itemValue;
        if(itemElem){
            if(itemElem.classList.contains(CL_REMOVED)){
                removeToDoItem(itemElem);
                data.removeItem(itemValue);
                return;
            }
            if(itemElem.querySelector('.todo-label').innerHTML != item.content){
                itemElem.querySelector('.todo-label').innerHTML = item.content;
            }
        }else{
            itemElem = createItemComponent(itemValue.id,item.content);
        }
        showToDoItem(itemElem);
    })

    model.flush();

    var num = data.items.length;
    getComponent('todo-count').innerHTML = num + ' Items Left';
}

function removeTodoItemFromArray(id){
    var numId = parseInt(id.substring(4));
    _todoItems.splice(_todoItems.findIndex(i => i.id === numId),1);
    console.log(_todoItems);
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