
import {weekMap2} from "./selectDate"

let cycle = (cycleTemp,data) => {
    
    return {
    
        RECURS_DAILY:(data)=>{
            cycleTemp.range = "day";
            cycleTemp.day = {
                range:Number(data.pattern.dailyType)===1 ? "userDefine" : "everyday", //everyday userDefine
                userDefine:data.pattern.interval===null ? 1 : data.pattern.interval,
            };
        },
        RECURS_WEEKLY:(data)=>{
            cycleTemp.range = "week";
            cycleTemp.week = {
                interval:data.pattern.interval,
                dayList:data.pattern.daysOfWeeks.map(item=>weekMap2[item]),
            }
        },
        RECURS_MONTHLY:(data)=>{
            cycleTemp.range = "mounth";
            cycleTemp.mounth.range = '1';
            cycleTemp.mounth["1"] = {
                mounth: data.pattern.interval,
                days: data.pattern.dayOfMonth,
            }
        },
        RECURS_MONTH_NTH:(data)=>{
            cycleTemp.range = "mounth";
            cycleTemp.mounth.range = "2";
            cycleTemp.mounth["2"] = {
                mounth:data.pattern.interval,
                numValue:data.pattern.dayOfWeekIndex,
                daysValue:data.pattern.dayOfWeek,
            }
        },
        RECURS_YEARLY:(data)=>{
            cycleTemp.range = "year";
            cycleTemp.year.range = "1";
            cycleTemp.year.yearsNum = data.pattern.interval;
            cycleTemp.year["1"] = {
                mounth:data.pattern.monthOfYear,
                dayNum:data.pattern.dayOfMonth,
            
            }
        
        },
        RECURS_YEAR_NTH:(data)=>{
            cycleTemp.range = "year";
            cycleTemp.year.range = "2";
            cycleTemp.year.yearsNum = data.pattern.interval;
            cycleTemp.year["2"] = {
                mounth:data.pattern.monthOfYear,
                daysValue:data.pattern.dayOfWeek,
                numValue:data.pattern.dayOfWeekIndex,
            }
        }
    
    }
};

let range = (rangeTemp,data) => {
    
    rangeTemp.range = String(data.range.recurrenceRange);
    rangeTemp.startDate = data.range.rangeStartDate;
    if(Number(data.range.recurrenceRange)===2){
        rangeTemp["2"].repeatNum = data.range.occurrences
    }
    if(Number(data.range.recurrenceRange)===3){
        rangeTemp["3"].endDate = data.range.rangeEndDate
    }
    
};

export const formatToCycleDate = (data, tempDate) =>{
    
    let {cycleTemp,rangeTemp} = tempDate;
    
    let cycleMap = cycle(cycleTemp);
    
    range(rangeTemp,data);
    
    cycleMap[data.pattern.recurrenceType](data);
    
    return {
        cycleMeeting:cycleTemp,
        repeatRange:rangeTemp,
        meetingTime:{
            startDate:data.appointmentTime.startDate,
            startTime:data.appointmentTime.startTime,
            startTimestamp:data.appointmentTime.startDateTimeStampNoDST,
            endDate:data.appointmentTime.endDate,
            endTime:data.appointmentTime.endTime,
            endTimestamp:data.appointmentTime.endDateTimeStampNoDST,
        }
    }
    
};

export default {
    formatToCycleDate,
}
