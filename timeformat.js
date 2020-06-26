var offet = 8;

function jsonFormatFix(date) {
    var dateJson = date.substr(0,date.lastIndexOf(':'));
    return dateJson;
}

function getCurrentJsonDate(){
    var date = new Date();
    date.setHours(date.getHours()+offet)
    var dateJson = date.toJSON();
    dateJson = jsonFormatFix(dateJson);
    return dateJson;
}

function getNextHourJsonDate() {
    var date = new Date();
    date.setHours(date.getHours()+offet+1);
    var dateJson = date.toJSON();
    dateJson = jsonFormatFix(dateJson);
    return dateJson;
}

function jsonFormat2showFormat(date){
    date = date.replace('T',' ');
    return date;
}

function showFormat2jsonFormat(date){
    date = date.replace(' ','T');
    return date;
}