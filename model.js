window.model = {
    data:{
        items:[
            //{id:'',pri:'',content:'',status:''}
        ],
        id:0,
        filter:'All',
        priSelector:[],
    },
    TOKEN:'LK-ToDoMVC'
}

window.editValue = {
    isEdit:false,
    selePri:0,
    editItem:null
}

window.constPri = ['L','M','E'];

window.filterArray = [];

window.firstFilterStatus = 0;   // 0-> all  1-> active 2-> completed

window.secondFilterStatus = []  // can contain 'E','M','L'

window.pickDate = null;   // for advanced filter

