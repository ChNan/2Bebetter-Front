
import moment from "moment";

function checkDate(date) {
    return typeof date === "undefined" || date === '' || date === null ? new Date() : new Date(date);
}

function getTimezoneDate(date,utcOffset) {
    date = checkDate(date);
    date = getTimezone(date,utcOffset);
    let year = date.format("Y");
    let month = date.format("MM");
    let day = date.format("DD");
    
    return year + "/" + month + "/" + day;
}

function getTimezoneTime(date,utcOffset) {
    
    date = checkDate(date);
    date = getTimezone(date.valueOf(),utcOffset);
    let H = date.format("HH");
    let M = date.format("mm");
    return H+":"+M
    
}

function getTimezone(time, offset) {
    return moment.utc(time).utcOffset(offset)
}

function getTimezoneNum(utcOffset) {
    
    function formatMin(utcOffset) {
        return formatToDouble(Math.abs(utcOffset)%60);
    }
    
    function formatHour(utcOffset,dir) {
        return dir+Math.abs(parseInt(utcOffset/60))
    }
    
    function formatDate(utcOffset,dir) {
        let val = Math.abs(parseInt(utcOffset/60))<10 ? "0":"";
        return formatHour(utcOffset,dir+val)+":"+formatMin(utcOffset)
    }
    if(utcOffset<0){
        return formatDate(utcOffset,"-");
        
    }else if (utcOffset>0){
        return formatDate(utcOffset,"+");
        
    }else if(utcOffset===0){
        return "Z"
    }
}

function getUtcOffsetTime(utcOffset) {
    let Time = getTimezoneNum(utcOffset);
    return Time === "Z"
        ?"+00:00"
        :Time;
}


function getTimezoneTimeToInteger(date,utcOffset) {  //需要重写
    
    date = checkDate(date);
    date = getTimezone(date.valueOf(),utcOffset);
    let H = date.format("HH");
    let M = date.format("mm");
    
    if(Number(M)<30){
        M = "30";
    }else if(Number(M)>30){
        M = "00";
        if(Number(H)<9){
            H = "0"+(Number(H)+1);
        }else if(Number(H)>=9&&Number(H)<23){
            H = String(Number(H)+1);
        }else if(Number(H)===23){
            H = "00"
        }
    }
    return H+":"+M
}

function getUtcOffset() {
   return moment().utcOffset();
}



function getDate(date) {
    
    date = checkDate(date);
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();
    
    month = formatToDouble(month);
    day = formatToDouble(day);
    
    return year + "/" + month + "/" + day;
}

function getTimestampByTimezone(date,utcOffset) {
    return new Date (moment(date).zone(utcOffset).format())
        .valueOf();
}

function getIntergeTimeStamp(date,utcOffset) {
    let stamp = date.valueOf();
    let halfHour = 1000*60*30;
    
    let floatStamp = parseFloat(stamp/10000000)*10000000;
    let intStamp = parseInt(stamp/10000000)*10000000;
    
    let result =  floatStamp>halfHour?intStamp+halfHour:intStamp;
    return getTimestampByTimezone(result,utcOffset);
}

function format(type) {
   
    let formatMap = {
        "yyyy-mm-dd 00:00:00" (date) {
            return getDate(date).replace(/\//g,"-")+" "+"00:00:00"
        },
        "yyyy-mm-dd" (date) {
            return getDate(date).replace(/\//g,"-")
        },
        "yyyy/mm/dd" (date) {
            return getDate(date)
        },
        "yyyy-mm-ddThh:mm:ss-zone" (utcOffset,date) {
            return date.replace(" ","T")+getTimezoneNum(utcOffset);
        },
        "hh:mm:ss" (utcOffset,date) {
            return getTimezoneTime(utcOffset,date)
        },
        "yyyy-mm-dd hh:mm:ss" (date) {
            return getDate(date).replace(/\//g,"-")+" " + getTime(date)
        },
        "yyyy/mm/dd hh:mm:ss" (date) {
            return getDate(date)+" " + getTime(date)
        }
        
    };
    return formatMap[type]
}

function getTimestamp (date,time) {
    return new Date(date+" "+time).valueOf();
}

function getTime (date) {
    date = moment(date);
    let h = date.format("HH");
    let m = date.format("mm");
    return h+":"+m;
}

function formatToDouble (num) {
    return Number(num)<10?"0"+num:String(num);
}

export const isDST = ()=>{
  return moment().isDST();
};

export default {
    getTimezoneDate,
    getTimezoneTime,
    getTimezone,
    getTimezoneNum,
    getTimezoneTimeToInteger,
    getIntergeTimeStamp,
    getUtcOffset,
    getUtcOffsetTime,
    getDate,
    getTimestampByTimezone,
    format,
    getTimestamp,
    getTime,
    isDST,
}
