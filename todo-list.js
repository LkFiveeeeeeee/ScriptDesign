"use strict"

var _todoId = 0;

var _todoItems = [];

var CL_COMPLETED = 'completed';
var CL_SELECTED = 'selected';
var CL_EDITING = 'editing';
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
            removeItem:function (index) {
                if(index && index < this.items.length){
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
}

function update(){
    var data = model.data;

    data.items.forEach(function (itemValue){
        var itemElem = document.getElementById('todo'+itemValue.id);
        var item = itemValue;
        if(itemElem){
            if(itemElem.querySelector('.todo-label').innerHTML != item.content){
                itemElem.querySelector('.todo-label').innerHTML = item.content;
            }
        }else{
            createItemComponent(itemValue.id,item.content);
        }
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