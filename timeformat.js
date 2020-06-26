/**
 *
 * @Author: Liuke
 * @StudentID: 1651573
 * @Description: This file defines some functions to help to change the format of time or date.
 *
 */


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

function compareDate(dateOne,dateTwo){
    var diff = (dateOne.getTime()-dateTwo.getTime());
    if(diff<0){
        return 0;
    }else{
        return parseInt(diff/(1000*24*60*60));
    }
}