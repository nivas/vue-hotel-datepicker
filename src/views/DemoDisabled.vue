<template>
  <div id="demo" class="demo">
    <div class="demo-example">
      <p>
        Disable some dates
        <span v-for="(date, index) in disabledDates" :key="index">
          <code>{{ date }}</code>
          <span v-if="index !== disabledDates.length - 1">, </span>
        </span>
      </p>
      <VueHotelDatepicker :disabledDates="disabledDates"/>
    </div>
  </div>
</template>

<script>
import VueHotelDatepicker from '@/components/VueHotelDatepicker.vue'

export default {
  name: 'Demo',
  components: {
    VueHotelDatepicker
  },
  data () {
    return {
      testStartDate: undefined,
      testEndDate: undefined,
      testMinDate: undefined,
      testMaxDate: undefined,
      disabledDates: []
    }
  },
  created () {
    const now = new Date()
    const nextMonOffset = 7 + Math.abs((1 - now.getDay()))
    this.testStartDate0 = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate() + nextMonOffset, 0, 0, 0)
    this.testStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + nextMonOffset, 0, 0, 0)
    this.testEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + nextMonOffset + 5, 0, 0, 0)
    this.testMinDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0)
    this.testMaxDate = new Date(now.getFullYear(), now.getMonth() + 1, 21, 0, 0, 0)

    const disableDate1 = now.getTime() + (1000 * 60 * 60 * 24 * 7)
    const disableDate2 = now.getTime() + (1000 * 60 * 60 * 24 * 8)
    const disableDate3 = now.getTime() + (1000 * 60 * 60 * 24 * 13)
    const disableDate4 = now.getTime() + (1000 * 60 * 60 * 24 * 16)
    const disableDate5 = now.getTime() + (1000 * 60 * 60 * 24 * 21)
    this.disabledDates = [
      this.displayDateText(new Date(disableDate1)),
      this.displayDateText(new Date(disableDate2)),
      this.displayDateText(new Date(disableDate3)),
      this.displayDateText(new Date(disableDate4)),
      this.displayDateText(new Date(disableDate5))
    ]
  },
  methods: {
    convertDateString (dateString) {
      const dateAry = dateString.split('-')
      return new Date(dateAry[0], Number.parseInt(dateAry[1] - 1), dateAry[2])
    },
    displayDateText (datetime) {
      if (datetime) {
        datetime = typeof (datetime) === 'string' ? new Date(datetime) : datetime
        const yyyy = datetime.getFullYear()
        const mm = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : `0${datetime.getMonth() + 1}`
        const dd = datetime.getDate() > 9 ? datetime.getDate() : `0${datetime.getDate()}`
        const displayStr = (this.format || 'YYYY/MM/DD').replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
        return displayStr
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss">
.demo {
  margin-bottom: 200px;
  &-example {
    margin-bottom: 60px;
  }
  code {
    padding: 4px;
    color: #0088ff;
    font-weight: 700;
    background-color: #ececec;
    border-radius: 4px;
  }
}
</style>
