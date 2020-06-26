"use strict"


var CL_COMPLETED = 'completed';
var CL_HIDDEN = 'hidden';
var CL_REMOVED = 'removed'
var CL_EMERGENCY = 'E';
var CL_MEDIUM = 'M';
var CL_LOW = 'L';
/*
**  pri 0,1,2 => low , medium , emergency
**  status 0 => actived 1 => completed
 */
function createToDoItem(id,pri,content,status,ddl){
    var item = {
        id:id,
        pri:pri,
        content:content,
        status:status,
        ddl:ddl
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
                if(index>=0){
                    return this.items[index];
                }else{
                    console.error("null index");
                    return null;
                }
            },
            setItem:function (index, itemValue) {
                if(index>=0){
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


    })

    initAddButton();
    initDialog();
    initToggleAll();
    initFirstFilter();
    initSecondFilter();
    initDatePicker();
    initClearButton();

    update();
}


function initDatePicker() {
    var date = document.querySelector("input[type='date']");
    getComponent('pick-date-bn').addEventListener('click',function () {
        if(!date.classList.contains('cur')){
            date.classList.add('cur');
            this.classList.add('selected');
        }else{
            date.classList.remove('cur');
            date.value = null;
            this.classList.remove('selected');
            update();
        }
    })
    date.addEventListener('change',function (e) {
        console.log(date.value);
        update();
    })
}

function initFirstFilter(){
    var firstFilterWrap = getComponent('first-filter');
    var filterArrays = firstFilterWrap.getElementsByTagName('li');

    [].forEach.call(filterArrays,function (item) {
        item.addEventListener('click',selected)
    })

    function selected(e){
        if(this.firstElementChild.classList.contains('selected')){
            return;
        }
        removeSelected();
        console.log(e);
        this.firstElementChild.classList.add('selected');
        if(this.innerText === 'All'){
            window.firstFilterStatus = 0;
        }else if(this.innerText === 'Active'){
            window.firstFilterStatus = 1;
        }else{
            window.firstFilterStatus = 2;
        }
        update();
    }

    function removeSelected(){
        [].forEach.call(filterArrays,function (item) {
            if(item.firstElementChild.classList.contains('selected')){
                item.firstElementChild.classList.remove('selected');
            }
        })
    }
}

function initSecondFilter(){
    var secondFilterWrap = getComponent('second-filter');
    var secondArrays = secondFilterWrap.getElementsByTagName('li');

    [].forEach.call(secondArrays,function (item) {
        item.addEventListener('click',selected);
    })

    function selected(){
        if(this.firstElementChild.classList.contains('hidbc')){
            this.firstElementChild.classList.remove('hidbc');
            secondFilterStatus.push(this.innerText[0]);
        }else{
            this.firstElementChild.classList.add('hidbc');
            secondFilterStatus.splice(secondFilterStatus.indexOf(this.innerText[0]),1);
        }
        update();
    }
}

function initToggleAll(){
    getComponent('toggle-all').addEventListener('click',function () {
        var temp = this;
        filterArray.forEach(function (item) {
            if(temp.checked){
                item.status = 1;
            }else {
                item.status = 0;
            }
        })
        update();
    })
}

function initAddButton() {

    var timer;
    getComponent("add-button").addEventListener('touchstart',function () {
        console.log("start");
        timer = setTimeout(function () {
            var dialog = getComponent("dialog-wrap");
            dialog.classList.remove(CL_HIDDEN);
            dialog.getElementsByTagName('h3')[0].innerHTML = 'Create Todo Item';
            var todoText = getComponent('todo-text');
            if(todoText.value !== ""){
                dialog.querySelector('.dialog').value = todoText.value;
            }
            var inputTimePicker = document.querySelector('input[type="datetime-local"]');
            inputTimePicker.value = getNextHourJsonDate();
            inputTimePicker.min = getCurrentJsonDate();

            setDialogPri(0);
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
        var ddl = document.querySelector('input[type="datetime-local"]').value;
        ddl = jsonFormat2showFormat(ddl);
        if(!window.editValue.isEdit){
            var todoItem = createToDoItem(model.data.id++,editValue.selePri,inputField.value,0,ddl);
            model.data.items.push(todoItem);
        }else{
            var dataIndex = model.data.items.indexOf(editValue.editItem);
            model.data.getItem(dataIndex).content = inputField.value;
            model.data.getItem(dataIndex).pri = editValue.selePri;
            model.data.getItem(dataIndex).ddl = ddl;
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
        })
        editValue.selePri = 0;
        editValue.isEdit = false;
        editValue.editItem = null;
        inputField.value = "";
        getComponent('todo-text').value = '';
        dialog.classList.add(CL_HIDDEN);
    }

}

function initClearButton(){
    getComponent('clear').addEventListener('click',function () {
        filterArray.forEach(function (item) {
            var itemElem = getComponent('todo'+item.id)
            itemElem.classList.add(CL_REMOVED);
            update();
        })
    })
}

function setDialogPri(priIndex){
    var dialog = getComponent('dialog-wrap');
    var priItem = dialog.querySelector('.'+constPri[priIndex]);
    if(priItem.classList.contains('hidbc')){
        priItem.classList.remove('hidbc');
    }
}

function addToDoItem(){
    var todoText = getComponent('todo-text')
    var text = todoText.value;
    if(text === ""){
        return ;
    }
    var ddl = jsonFormat2showFormat(getNextHourJsonDate());
    console.log(text);
    var item = createToDoItem(model.data.id++,0,text,0,ddl);
    model.data.items.push(item);

    todoText.value = "";
    update();
}

function createItemComponent(itemValue){
    var todoItem = document.createElement("li");
    todoItem.classList.add('over-hidden');
    var itemId = 'todo'+ itemValue.id;
    todoItem.id = itemId;
    todoItem.innerHTML = [
        '<div class="view">',
        '  <div class="wrapper E">E</div>',
        '  <div class="wrapper M">M</div>',
        '  <div class="wrapper L">L</div>',
        '  <div class="wrapper min"></div>',
        '  <div class="todo-content">',
        '       <div class="content">'+ itemValue.content+' </div>',
        '       <div class="ddl"> DDL: ' + itemValue.ddl + '</div>',
        '  </div>',
        '</div>'
    ].join('');

    var showPri = todoItem.querySelector('.min');
    showPri.classList.add(constPri[itemValue.pri]);
    showPri.addEventListener('click',function () {
        var itemIndex = model.data.items.indexOf(itemValue);
        model.data.items[itemIndex].status = Math.abs(model.data.items[itemIndex].status-1);
        update();
    })

    if(itemValue.status === 1){
        todoItem.classList.add(CL_COMPLETED);
        showPri.classList.add("checked");
    }

    var startX, startY, moveX, moveY;
    // var canRemove = false;
    var canSelecPri = false;
    var touchTimer = null;



    todoItem.addEventListener('touchstart',function (e) {
        console.log(3);
        console.log(e);
        console.log(moveX);
        moveX = 0;
        var touchPoint = e.touches[0];
        startX = touchPoint.pageX;
        startY = touchPoint.pageY;
        touchTimer = setTimeout(function () {
            var dialog = getComponent("dialog-wrap");
            dialog.classList.remove(CL_HIDDEN);
            dialog.getElementsByTagName('h3')[0].innerHTML = 'Edit Todo Item';
            dialog.querySelector('.dialog').value = todoItem.querySelector('.content').innerHTML;
            var timePicker = document.querySelector('input[type="datetime-local"]');
            timePicker.value = showFormat2jsonFormat(itemValue.ddl);
            timePicker.min = getCurrentJsonDate();
            editValue.isEdit = true;
            editValue.editItem = itemValue;
            editValue.selePri = itemValue.pri;
            setDialogPri(itemValue.pri);
            touchTimer = null;
        },1000)
    })

    todoItem.addEventListener('touchend',function (e) {
        console.log(2);
        console.log(e);
        clearTouchTimer();
        console.log(moveX)
        if(canSelecPri){
            resetPosition();
        }
        if(moveX < 0 && !canSelecPri){
            if(moveX < -screen.width/2 ){
                this.classList.add('over-hidden');
                this.classList.add(CL_REMOVED);
                update();
            }else {
                // this.style.transform = 'translate(' + 0 + 'px, ' + 0+'px)';
                resetPosition();
                this.style.opacity = 1;
            }
        }else if(moveX > 100){
            canSelecPri = true;
            this.classList.remove('over-hidden');
            this.querySelector('.min').classList.add(CL_HIDDEN);
            this.style.transform = 'translateX(' + 240 + 'px)';
        }
        document.addEventListener('touchstart',function tempLis(e) {

            var liX1 = todoItem.offsetLeft;
            var liX2 = todoItem.offsetLeft + todoItem.offsetWidth;
            var liy1 = todoItem.offsetTop;
            var liy2 = todoItem.offsetHeight + todoItem.offsetTop;
            var curX = e.touches[0].pageX;
            var curY = e.touches[0].pageY;
            if(curX < liX1 || curX >liX2 || curY < liy1 || curY > liy2 ){
                resetPosition();
            }
            document.removeEventListener('touchstart',tempLis);
        })
    })

    function resetPosition(){
        setTimeout(function () {
            canSelecPri = false;
        },500)
        moveX = 0;
        todoItem.classList.add('over-hidden');
        todoItem.style.transform = 'translateX(' + 0 + 'px)';
        todoItem.querySelector('.min').classList.remove(CL_HIDDEN);
    }

    todoItem.addEventListener('touchmove',function (e) {
        var touchPoint = e.touches[0];
        moveX = touchPoint.pageX - startX;
        moveY = touchPoint.pageY - startY;
        if(Math.abs(moveY) < 10 && moveX < 0 && !canSelecPri){
            e.preventDefault();
            this.style.transform = 'translate(' + moveX + 'px, ' + 0 + 'px)';
         //   this.style.opacity = (1 - Math.abs(moveX) / screen.width).toFixed(1);
        }
        if(Math.abs(moveX) > 10){
            clearTouchTimer();
        }

    })


    todoItem.querySelectorAll('.wrapper').forEach(function (item) {
        if(item.classList.contains('min')){
            return;
        }
        item.addEventListener('touchstart',function (e) {

            e.preventDefault();
            e.stopPropagation();
            console.log(1);
            console.log(e);
            if(item.classList.contains(CL_EMERGENCY)){
                itemValue.pri = 2;
            }
            if(item.classList.contains(CL_MEDIUM)){
                itemValue.pri = 1;
            }
            if(item.classList.contains(CL_LOW)){
                itemValue.pri = 0;
            }
            resetPosition();
            update();
        })
    })

    var todoList = getComponent('todo-list');
    todoList.insertBefore(todoItem,todoList.firstChild);
    return todoItem;


    function clearTouchTimer() {
        if(touchTimer){
            clearTimeout(touchTimer);
            touchTimer = null;
        }
    }
}

function update(){
    var data = model.data;
    var completed = 0;
    var num = 0;
    var date = document.querySelector('input[type="date"]');
    filterArray = [];
    data.items.forEach(function (itemValue){
        var itemElem = getComponent('todo'+itemValue.id);
        if(itemElem){
            if(itemElem.classList.contains(CL_REMOVED)){
                removeToDoItem(itemElem);
                data.removeItem(itemValue);
                return;
            }
            if(itemElem.querySelector('.content').innerHTML != itemValue.content){
                itemElem.querySelector('.content').innerHTML = itemValue.content;
            }
            var ddl = itemElem.querySelector('.ddl').innerText;
            ddl = ddl.substr(ddl.indexOf(' ')+1);
            if(ddl != itemValue.ddl){
                itemElem.querySelector('.ddl').innerText = 'DDL: ' + itemValue.ddl;
            }
            if(itemValue.status === 1){
                if(!itemElem.classList.contains(CL_COMPLETED)){
                    itemElem.classList.add(CL_COMPLETED);
                    itemElem.querySelector('.min').classList.add("checked");
                }
            }else if(itemValue.status === 0){
                if(itemElem.classList.contains(CL_COMPLETED)){
                    itemElem.classList.remove(CL_COMPLETED);
                    itemElem.querySelector('.min').classList.remove("checked");
                }
            }
            changePri(itemValue.pri,itemElem);
        }else{
            itemElem = createItemComponent(itemValue);
        }
        if(checkDDLFilter(itemValue)){
            if(checkSecondFilter(itemElem)){
                num++;
                if(itemElem.classList.contains(CL_COMPLETED)){
                    completed++;
                }
                if(checkFirstFilter(itemElem)){
                    console.log(3);
                    showToDoItem(itemElem)
                    filterArray.push(itemValue);
                }else{
                    console.log(1);
                    hideToDoItem(itemElem);
                }
            }else{
                console.log(2);
                hideToDoItem(itemElem);
            }
        }else{
            hideToDoItem(itemElem);
        }


    })

    function checkFirstFilter(itemElem) {
        return firstFilterStatus === 0 ||
            (firstFilterStatus === 1 && !itemElem.classList.contains(CL_COMPLETED)) ||
            (firstFilterStatus === 2 && itemElem.classList.contains(CL_COMPLETED));
    }

    function checkSecondFilter(itemElem){
        var judge = false;
        if(secondFilterStatus.length === 0){
            return true;
        }
        secondFilterStatus.forEach(function (item) {
            if(itemElem.querySelector('.min.'+item)!=null){
                judge = true;
            }
        })
        return judge;
    }

    function checkDDLFilter(itemValue) {
        if(date.value === "" || itemValue.ddl.split(' ')[0] === date.value){
            return true;
        }
        return false;
    }

    function changePri(selePri,itemElem){
        var showPri = itemElem.querySelector('.min');
        for(var i =0;i < constPri.length;i++){
            if(i === selePri){
                if(!showPri.classList.contains(constPri[i])){
                    showPri.classList.add(constPri[i]);
                }
            }else{
                if(showPri.classList.contains(constPri[i])){
                    showPri.classList.remove(constPri[i]);
                }
            }
        }
    }

    model.flush();

    getComponent('todo-count').innerHTML = num-completed + ' Items Left';
    getComponent('toggle-all').checked = completed === num && num > 0;
    if(completed > 0 && firstFilterStatus!==1){
        if(getComponent('clear').classList.contains(CL_HIDDEN)){
            getComponent('clear').classList.remove(CL_HIDDEN);
        }
    }else{
        if(!getComponent('clear').classList.contains(CL_HIDDEN)){
            getComponent('clear').classList.add(CL_HIDDEN);
        }
    }
}

function showToDoItem(item){
    while(item.classList.contains(CL_HIDDEN)){
        item.classList.remove(CL_HIDDEN);
    }
    item.style.animation = "addItem 0.5s";
}

function hideToDoItem(item){

    function animationCallback(e){
        console.log(e);
        if(e.animationName == 'hideItem'){
            if(!item.classList.contains(CL_HIDDEN)){
                item.classList.add(CL_HIDDEN);
            }
            item.removeEventListener("animationend", animationCallback)
        }


        console.log("hidden!")
    }

    item.addEventListener("animationend", animationCallback)
    if(!item.classList.contains(CL_HIDDEN)){
        item.style.animation = "hideItem 0.5s";
    }

}

function removeToDoItem(item){
    function animationCallBack(){
        item.removeEventListener("animationend", removeToDoItem)
        item.parentNode.removeChild(item);
    }

    item.addEventListener("animationend",animationCallBack);
    item.style.animation = "hideItem 0.5s";
}