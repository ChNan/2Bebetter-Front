<template>
    <tr  class="dotted"
        v-show="!project.hide"
        :class="{
            'highLight-bac':project.highLight,
            'checked-bac':project.checked
        }">
        <td is="td-grid"
            v-for="(item,i) in timeLists"
            @choose-time="chooseTime($event)"
            @highlight-start="highLightTimeStart($event)"
            @highlight-end="highLightTimeEnd($event)"
            :mode="mode"
            :mousefollow-y="mousefollowY"
            :time-checked="timeChecked"
            :key="i"
            :time="item"
            :i="i"
            :index="index"
            :utc-offset="utcOffset"
            :project="project"
            :choose-date="chooseDate">
            
        </td>
    </tr>
</template>

<script>


import tdGrid from "./grid"
import timezone from "./timezone"

export default{
    components:{
        tdGrid
    },
    props:['timeList','project','index','mousefollowY','timeChecked','mode','utcOffset','chooseDate'],
    computed:{
        timeLists () {
        	return this.timeList.map((item)=>{
        		item.isZeroLine = this.isZeroLine(item.timeStamp);
                return item;
            })
        }
    },
    methods:{
        chooseTime (data) {
            this.$emit('choose-time',data)
        },
        highLightTimeStart (data) {
            this.$emit('highlight-start',data)
        },
        highLightTimeEnd (data) {
            this.$emit('highlight-end',data)
        },
        isZeroLine (date) {
            return timezone.getTimezoneTime(date,this.utcOffset)==="00:00"
        }
    },
    data(){
        return {
        
        }
    },
    mounted (){
    
    },
    updated (){
    //    console.log("line更新");
    }
}
</script>

<style scoped>
   
    .highLight-bac {
        background: rgba(26, 188, 156, 0.15);
        color: #fff;
    }

    .checked-bac {
        background: rgba(132, 201, 234, 0.2);
        color: #fff;
    }

  
</style>
