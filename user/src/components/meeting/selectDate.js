import {t} from '@/i18n'

export const dayNumsList = [
    {label:t('reservation.selectData.No.first'),value:1,},
    {label:t('reservation.selectData.No.second'),value:2,},
    {label:t('reservation.selectData.No.third'),value:3,},
    {label:t('reservation.selectData.No.fourth'),value:4,},
    {label:t('reservation.selectData.No.last'),value:-1,},
];
export const daysList = [
    {label:t('reservation.selectData.day'),  value:"Day",},
    {label:t('reservation.selectData.workDay'),value:"Weekday",},
    {label:t('reservation.selectData.weekend'),value:"WeekendDay",},
    {label:t('reservation.selectData.Sunday'),value:"Sunday",},
    {label:t('reservation.selectData.Monday'),value:"Monday",},
    {label:t('reservation.selectData.Tuesday'),value:"Tuesday",},
    {label:t('reservation.selectData.Wednesday'),value:"Wednesday"},
    {label:t('reservation.selectData.Thursday'),value:"Thursday",},
    {label:t('reservation.selectData.Friday'),value:"Friday",},
    {label:t('reservation.selectData.Saturday'),value:"Saturday"},
];
export const weekList = [
    {label:t('reservation.selectData.Sunday'),value:"Sunday",key:1},
    {label:t('reservation.selectData.Monday'),value:"Monday",key:2},
    {label:t('reservation.selectData.Tuesday'),value:"Tuesday",key:3},
    {label:t('reservation.selectData.Wednesday'),value:"Wednesday",key:4},
    {label:t('reservation.selectData.Thursday'),value:"Thursday",key:5},
    {label:t('reservation.selectData.Friday'),value:"Friday",key:6},
    {label:t('reservation.selectData.Saturday'),value:"Saturday",key:7},
];
export const weekMap = {
    [t('reservation.selectData.Sunday')]:"Sunday",
    [t('reservation.selectData.Monday')]:"Monday",
    [t('reservation.selectData.Tuesday')]:"Tuesday",
    [t('reservation.selectData.Wednesday')]:"Wednesday",
    [t('reservation.selectData.Thursday')]:"Thursday",
    [t('reservation.selectData.Friday')]:"Friday",
    [t('reservation.selectData.Saturday')]:"Saturday",
};

export const weekMap2 = {
    "Sunday":[t('reservation.selectData.Sunday')],
    "Monday":[t('reservation.selectData.Monday')],
    "Tuesday":[t('reservation.selectData.Tuesday')],
    "Wednesday":[t('reservation.selectData.Wednesday')],
    "Thursday":[t('reservation.selectData.Thursday')],
    "Friday":[t('reservation.selectData.Friday')],
    "Saturday":[t('reservation.selectData.Saturday')],
};

export const mounthList = [
    {label:t('reservation.selectData.mounth.00'),value:0,},
    {label:t('reservation.selectData.mounth.01'),value:1,},
    {label:t('reservation.selectData.mounth.02'),value:2,},
    {label:t('reservation.selectData.mounth.03'),value:3,},
    {label:t('reservation.selectData.mounth.04'),value:4,},
    {label:t('reservation.selectData.mounth.05'),value:5,},
    {label:t('reservation.selectData.mounth.06'),value:6,},
    {label:t('reservation.selectData.mounth.07'),value:7,},
    {label:t('reservation.selectData.mounth.08'),value:8,},
    {label:t('reservation.selectData.mounth.09'),value:9,},
    {label:t('reservation.selectData.mounth.10'),value:10,},
    {label:t('reservation.selectData.mounth.11'),value:11,},
];

export default {
    dayNumsList,
    daysList,
    weekList,
    weekMap,
    mounthList,
}
