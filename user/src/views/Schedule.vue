<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="m-cards">
                    <calendar ref="calendar" :dataList="data" @getPlans="getPlan"></calendar>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import calendar from '@/components/ylCalendar/ylCalendar'
import moment from 'moment'
import * as api from '../api/schedule/'
export default {
    components: {
        calendar,
    },
    data() {
        return {
            dateFormats: [
                "DD/MM/YYYY",
                "DD MMM YYYY",
                "D MMMM YYYY",
                "D/MM/YYYY h:mm a"
            ],
            styleName: {
                width: '200px',
                height: '200px'
            },
            formatters: [
                {
                    id: "C",
                    name: "Currency"
                },
                {
                    id: "DT",
                    name: "Date and Time"
                }
            ],
            columns: [
                {
                    title: 'User ID',
                    field: 'id',
                    sort: true
                },
                {
                    title: 'Age',
                    field: 'pet',
                    sort: true
                },
                {
                    title: 'Email',
                    field: 'birth_date'
                }
            ],
            total: 0,
            query: {},
            rowActionsDef: [],
            columns: ['name', 'pet', 'birth_date'],
            options: {
                dateColumns: ['birth_date'],
                headings: {
                    name: 'Name',
                    birth_date: 'Birth Date',
                    age: 'Age',
                    edit: 'Edit',
                    delete: 'Delete'
                }
            },
            tableData: [],
            text: '',
            mlist: ['预约会议室', '预约视频会议', '加入会议', '控制视频会议'],
            events: [
                {
                    title: 'Event1',
                    start: '2015-10-10 12:30:00',
                    end: '2015-10-10 16:30:00'
                },
                {
                    title: 'Event2',
                    start: '2015-10-07 17:30:00',
                    end: '2015-10-07 21:30:00'
                }
            ],
            data: [],//传入数据
            Max: Math.pow(2, 53) - 1,//js最大安全数
            //                参数请求
            params: {
                "autoCount": true,
                "confTypes": [
                    "NC",
                    "VSC",
                    "VGCP"
                ],
                "data": null,
                "limit": 2147483647,//限制条  TODO最终放置最大数
                "orderbys": [
                    {
                        "field": "conferenceTimePattern.conferenceTime.startDateTimeStamp",
                        "order": 1
                    }
                ],
                "queryEndDate": null,//传入结束时间
                "queryStartDate": null,//传入开始时间
                "role": null,
                "skip": 0,
                "states": [
                    "ready",
                    "create",
                    "ongoing",
                    "end"
                ],
                "total": 0
            },
            items: [],
            itemTest: [],//暂时接收数据的
        }
    },
    computed: {
        selectAll: {
            get: function() {
                return customers.selected.length == customers.rows.length;
            },
            set: function(value) {
                customers.selected = value ? customers.rows : [];
            }
        },
        age: function(row) {
            return this.calcAge(row.birth_date);
        },
        edit: function(row) {
            return `<a href='#!/${row.id}/edit'><i class='glyphicon glyphicon-edit'></i></a>`
        },
        delete: function(row) {
            return `<a href='javascript:void(0);' @click='$parent.deleteMe(${row.id})'><i class='glyphicon glyphicon-erase'></i></a>`

        }
    },
    mounted() {
        //           this.getPlan()
    },
    created() {
        //this.getPlan();
    },
    methods: {
        deleteCustomer: function(customer) {
            var result = window.confirm("You are about to delete " + customer.purchasor_name + ". Are you sure?");
            if (result) {
                var index = customers.rows.indexOf(customer);

                if (index === -1) {
                    return;
                }

                customers.rows.splice(index, 1);
            }
        },
        toTimeZone(time, offset, format) {
            return moment.utc(time).utcOffset(offset).format(format);
        },
        changeTime(start, end) {
            if (!moment(start).isSame(end, 'year')) {
                return this.getFormatTime(start, end, 'YYYY/MM/DD HH:mm');
            }
            if (!moment(start).isSame(end, 'month') || !moment(start).isSame(end, 'day')) {
                return this.getFormatTime(start, end, 'MM/DD HH:mm');
            }
            if (moment(start).isSame(end, 'day') && !this.isToday(start)) {
                return moment(start).format('MM/DD HH:mm') + " - " + moment(end).format('HH:mm');
            }
            if (this.isToday(start) && this.isToday(end)) {
                return this.getFormatTime(start, end, 'HH:mm');
            }
        },
        getFormatTime(start, end, format) {
            return this.toTimeZone(start, moment().utcOffset(), format) + " - " + this.toTimeZone(end, moment().utcOffset(), format);
        },
        isToday(value) {
            return new Date().toDateString() === new Date(value).toDateString();
        },
        getPlan(start, end) {
            this.params.queryEndDate = end;
            this.params.queryStartDate = start;
            let temArray = [];

            api.allConference(this.params).then(json => {
                if (json.ret > -1) {
                    json.data.data.forEach(res => {
                        let rooms = '';
                        if (res.rooms && res.rooms.length > 0) {
                            rooms = res.rooms.map((item) => {
                                return item.name;
                            }).join(",");

                        }
                        let data = {
                            startTime: res.conferenceTimePattern.conferenceTime.startDateTimeStamp,
                            endTime: res.conferenceTimePattern.conferenceTime.endDateTimeStamp,
                            detail: {
                                title: res.conferenceSubject.subject,
                                time: this.changeTime(res.conferenceTimePattern.conferenceTime.startDateTimeStamp, res.conferenceTimePattern.conferenceTime.endDateTimeStamp),
                                position: rooms,
                                speaker: res.organizer.name,//组织者,
                                status: res.state,//状态,
                                round: res.isRecurrence,
                                password: res.communication && res.communication.password || '',//会议密码,
                                confType: res.confType,//会议类型
                                id: res.id,
                                recurrenceId: res.communication && res.communication.conferenceNumber || '',
                                planId: res.conferencePlanId,
                                patern: res.isRecurrence,
                                isOrganizer:res.isOrganizer,
                                isPresenter:res.isPresenter
                            }
                        }
                        temArray.push(data);
                    })
                    this.data = Object.assign([],temArray);
                }
                //this.items =json.data.data;//取获取到的数据



            })

        },
    }
}
</script>
<style scoped="">
.m-cards {
    border: 1px solid #d1dae5;
    border-radius: 4px;
    background-color: #fff;
    padding: 8px 12px 12px 12px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
}
</style>
