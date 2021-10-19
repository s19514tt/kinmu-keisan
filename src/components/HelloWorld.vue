<template>
  <div>
    <v-card class="ma-4 pa-4">
      <div v-if="beforeStart">
        <v-text-field
          v-model="startDate"
          label="勤務開始時間"
          append-outer-icon="mdi-reload"
          @click:append-outer="reloadBefore"
        ></v-text-field>
        <v-btn color="primary" @click="startWorking">勤務開始</v-btn>
      </div>
      <div v-else>
        <div>勤務開始:{{ startDateSet }}</div>
        <v-text-field
          v-model="finishDate"
          label="勤務終了時間"
          append-outer-icon="mdi-reload"
          @click:append-outer="reloadFinish"
        ></v-text-field>
        <v-text-field label="休憩時間(分)" v-model="kyukei" type="number"></v-text-field>
        <v-btn color="error" @click="cancel">勤務記録取り消し</v-btn>
        <v-btn color="primary" @click="finishWorking">勤務終了</v-btn>
      </div>
    </v-card>
    <v-card class="ma-4 pa-4">
      <v-date-picker v-model="bDate"></v-date-picker>
      <v-date-picker v-model="aDate"></v-date-picker>
      <div>{{ chingin }}</div>
      <div>
        <v-btn @click="calChingin" color="primary">賃金計算</v-btn>
      </div>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios'
export default Vue.extend({
  name: 'App',

  components: {
  },

  data: () => ({
    startDate: new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    startDateSet: localStorage.getItem('start'),
    finishDate: new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    beforeStart: (!localStorage.getItem('start')),
    kyukei: 0,
    bDate: '',
    aDate: '',
    data: [] as {
      start: string;
      finish: string;
      kyukei: number;
    }[],
    chingin: '未計算'
  }),
  mounted: async function () {
    this.aDate = this.formatDate(new Date())
    this.bDate = this.formatDate(new Date())
  },
  methods: {
    reloadBefore: function () {
      this.startDate = new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    reloadFinish: function () {
      this.finishDate = new Date().toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    startWorking: function () {
      localStorage.setItem('start', this.startDate)
      this.startDateSet = localStorage.getItem('start')
      this.beforeStart = !(localStorage.getItem('start'))
    },
    finishWorking: async function () {
      await axios.post('http://192.168.1.30:3232/', {
        start: localStorage.getItem('start'),
        finish: this.finishDate,
        kyukei: this.kyukei
      })
      localStorage.removeItem('start')
      this.startDateSet = localStorage.getItem('start')
      this.beforeStart = !(localStorage.getItem('start'))
    },
    calChingin: async function () {
      const data = await axios.get<{
        start: string;
        finish: string;
        kyukei: number;
      }[]>('http://192.168.1.30:3232/')
      this.data = data.data
      const filteredWorkData = this.data.filter((item) => new Date(item.start).getTime() >= new Date(this.bDate).getTime() - 32400000 && new Date(item.start).getTime() <= new Date(this.aDate).getTime() + 86400000 - 32400000)
      if (filteredWorkData.length !== 0) {
        const d = filteredWorkData.map((item) => (new Date(item.finish).getTime() - new Date(item.start).getTime()) / 60000 - item.kyukei).reduce((a, b) => a + b)
        this.chingin = `勤務時間 ${d}分(${Math.floor(d / 60)}時間${d % 60}分) 給料 ${d * 33.3333333333333333}円`
      } else {
        this.chingin = '対象期間のデータなし'
      }
    },
    cancel: function () {
      localStorage.removeItem('start')
      this.startDateSet = localStorage.getItem('start')
      this.beforeStart = !(localStorage.getItem('start'))
    },
    formatDate: function (date: Date) {
      var y = date.getFullYear();
      var m = ('00' + (date.getMonth() + 1)).slice(-2);
      var d = ('00' + date.getDate()).slice(-2);
      return (y + '-' + m + '-' + d);
    }
  }
});
</script>
