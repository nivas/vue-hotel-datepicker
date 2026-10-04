<template>
  <div class="demo">
    <h2>Basics</h2>
    <div class="demo-example">
      <p>1. Default range datepicker without any config</p>
      <VueHotelDatepicker />
    </div>
    <div class="demo-example">
      <p>2. Preselected start date <code>{{ displayDateText(testStartDate) }}</code> and end date <code>{{ displayDateText(testEndDate) }}</code></p>
      <VueHotelDatepicker :startDate="testStartDate" :endDate="testEndDate" />
    </div>
    <div class="demo-example">
      <p>3. Mobile layout forced with <code>mobile="mobile"</code> (by default it depends on the browser width)</p>
      <VueHotelDatepicker :startDate="testStartDate" :endDate="testEndDate" mobile="mobile" />
    </div>
    <div class="demo-example">
      <p>4. Limited to min date <code>{{ displayDateText(testMinDate) }}</code> and max date <code>{{ displayDateText(testMaxDate) }}</code></p>
      <VueHotelDatepicker :minDate="testMinDate" :maxDate="testMaxDate" />
    </div>
    <div class="demo-example">
      <p>5. Customized format <code>DD.MM.YYYY</code> and separator <code>-</code></p>
      <VueHotelDatepicker format="DD.MM.YYYY" separator="-" :startDate="testStartDate" :endDate="testEndDate" />
    </div>
    <div class="demo-example">
      <p>6. Minimum number of nights: <code>7</code></p>
      <VueHotelDatepicker :minNight="7" />
    </div>
    <div class="demo-example">
      <p>7. Maximum number of nights: <code>5</code></p>
      <VueHotelDatepicker :maxNight="5" />
    </div>
    <div class="demo-example">
      <p>8. Between <code>4</code> and <code>8</code> nights</p>
      <VueHotelDatepicker :minNight="4" :maxNight="8" />
    </div>
    <div class="demo-example">
      <p>9. Months before the min date can be browsed with <code>:selectForward="false"</code> (their days stay disabled)</p>
      <VueHotelDatepicker :selectForward="false" />
    </div>
    <div class="demo-example">
      <p>10. Another language (ex: 繁體中文). <code>weekList</code> starts with Sunday.</p>
      <VueHotelDatepicker
        placeholder="選擇日期"
        fromText="從" toText="到"
        resetText="重設" confirmText="確認"
        :weekList="['週日', '週一', '週二', '週三', '週四', '週五', '週六']"
        :monthList="['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']"
      />
    </div>
    <div class="demo-example">
      <p>11. Custom <code>message</code> inside the picker, and <code>resetMonthOnOpen</code>: browse a few months ahead, close and open again</p>
      <VueHotelDatepicker message="Check-in from 14:00, check-out until 10:00" :resetMonthOnOpen="true" />
    </div>

    <h2>Events and methods</h2>
    <div class="demo-example">
      <p>
        12. Events. Stay is limited to <code>2</code>&ndash;<code>10</code> nights and <code>{{ eventDisabledDates[0] }}</code> is disabled,
        so a click on a day that is too close, too far or behind the disabled date emits <code>error</code>.
      </p>
      <div class="demo-pair">
        <VueHotelDatepicker
          :minNight="2" :maxNight="10" :disabledDates="eventDisabledDates"
          @beforeopen="log('beforeopen')" @open="log('open')" @close="log('close')"
          @update="log('update', $event)" @confirm="log('confirm', $event)"
          @reset="log('reset')" @error="log('error', $event)"
        />
        <ul class="demo-log">
          <li v-if="!eventLog.length">No events yet.</li>
          <li v-for="(line, index) in eventLog" :key="index"><code>{{ line }}</code></li>
        </ul>
      </div>
    </div>
    <div class="demo-example">
      <p>13. Opened and closed from outside with <code>open()</code> and <code>close()</code> on a template ref</p>
      <button class="btn" @click="$refs.methodsPicker.open()">open()</button>
      <button class="btn" @click="$refs.methodsPicker.close()">close()</button>
      <div>
        <VueHotelDatepicker ref="methodsPicker" />
      </div>
    </div>
    <div class="demo-example">
      <p>
        14. <code>:autoClose="true"</code>: the picker confirms and closes as soon as the second date is selected.
        Last <code>confirm</code>: <code>{{ autoCloseResult ? JSON.stringify(autoCloseResult) : '–' }}</code>
      </p>
      <VueHotelDatepicker :autoClose="true" @confirm="autoCloseResult = $event" />
    </div>
    <div class="demo-example">
      <p>
        15. Two datepickers sharing state: both get the same <code>startDate</code> / <code>endDate</code> and write to it on <code>update</code>.
        Select in one, the other follows.
        Shared range: <code>{{ shared.start || '–' }}</code> <code>{{ shared.end || '–' }}</code>
      </p>
      <div class="demo-pair">
        <VueHotelDatepicker :startDate="shared.start" :endDate="shared.end" @update="onSharedUpdate" @reset="onSharedReset" />
        <VueHotelDatepicker :startDate="shared.start" :endDate="shared.end" @update="onSharedUpdate" @reset="onSharedReset" mobile="mobile" />
      </div>
    </div>

    <h2>Disabled dates</h2>
    <div class="demo-example">
      <p>
        16. Disabled dates
        <span v-for="(date, index) in disabledDates" :key="index">
          <code>{{ date }}</code><span v-if="index !== disabledDates.length - 1">, </span>
        </span>
      </p>
      <p>
        A range cannot start on a disabled date or span one. It can end on the first disabled date after its start:
        the guest checks out on the day the next guest arrives. Select a start date and that day gets a dashed border.
      </p>
      <VueHotelDatepicker :disabledDates="disabledDates" />
    </div>
    <div class="demo-example">
      <p>17. The same dates with <code>:useDiagonalStartEnd="true"</code>: start, end and the selectable disabled day are drawn as half days</p>
      <VueHotelDatepicker :disabledDates="disabledDates" :useDiagonalStartEnd="true" format="DD.MM.YYYY" />
    </div>
    <div class="demo-example">
      <p>
        18. Disabled dates that change while a range is selected. The range
        <code>{{ displayDateText(invalidation.start) }}</code> &ndash; <code>{{ displayDateText(invalidation.end) }}</code>
        is reset and <code>selection-invalidated</code> is emitted when a date inside it becomes disabled.
      </p>
      <button class="btn" :disabled="invalidation.disabledDates.length > 0" @click="disableInsideSelection">
        Disable {{ displayDateText(invalidation.inside) }}
      </button>
      <button class="btn" @click="restoreInvalidation">Start over</button>
      <div>
        <VueHotelDatepicker
          :key="invalidation.key"
          :startDate="invalidation.start" :endDate="invalidation.end"
          :disabledDates="invalidation.disabledDates"
          @selection-invalidated="invalidation.event = $event"
        />
      </div>
      <ul class="demo-log">
        <li v-if="invalidation.event"><code>selection-invalidated {{ JSON.stringify(invalidation.event) }}</code></li>
        <li v-else>No event yet.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueHotelDatepicker from '@/components/VueHotelDatepicker.vue'

const DAY = 1000 * 60 * 60 * 24

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
      disabledDates: [],
      eventDisabledDates: [],
      eventLog: [],
      autoCloseResult: null,
      shared: { start: undefined, end: undefined },
      invalidation: { key: 0, start: undefined, end: undefined, inside: undefined, disabledDates: [], event: null }
    }
  },
  created () {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const inDays = days => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, 0, 0, 0)

    const nextMonOffset = 7 + Math.abs((1 - now.getDay()))
    this.testStartDate = inDays(nextMonOffset)
    this.testEndDate = inDays(nextMonOffset + 5)
    this.testMinDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0)
    this.testMaxDate = new Date(now.getFullYear(), now.getMonth() + 1, 21, 0, 0, 0)

    this.disabledDates = [7, 8, 13, 16, 21].map(days => this.displayDateText(new Date(today.getTime() + DAY * days)))
    this.eventDisabledDates = [this.displayDateText(inDays(6))]

    this.invalidation.start = inDays(3)
    this.invalidation.end = inDays(8)
    this.invalidation.inside = inDays(5)
  },
  methods: {
    log (name, payload) {
      const line = payload === undefined ? name : `${name} ${JSON.stringify(payload)}`
      this.eventLog = [line, ...this.eventLog].slice(0, 6)
    },
    onSharedUpdate ({ start, end }) {
      this.shared.start = start || undefined
      this.shared.end = end || undefined
    },
    onSharedReset () {
      this.shared.start = undefined
      this.shared.end = undefined
    },
    disableInsideSelection () {
      this.invalidation.disabledDates.push(this.displayDateText(this.invalidation.inside))
    },
    restoreInvalidation () {
      this.invalidation.disabledDates = []
      this.invalidation.event = null
      this.invalidation.key += 1
    },
    displayDateText (datetime) {
      if (datetime) {
        datetime = typeof (datetime) === 'string' ? new Date(datetime) : datetime
        const yyyy = datetime.getFullYear()
        const mm = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : `0${datetime.getMonth() + 1}`
        const dd = datetime.getDate() > 9 ? datetime.getDate() : `0${datetime.getDate()}`
        const displayStr = 'YYYY/MM/DD'.replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
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
  margin-bottom: 60px;
  h2 {
    margin-top: 60px;
  }
  &-example {
    margin-bottom: 60px;
  }
  &-pair {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
  // keep the log clear of the open picker (648px wide on desktop)
  &-pair &-log {
    margin: 0 0 0 360px;
    @media only screen and (max-width: 1100px) {
      margin-left: 0;
    }
  }
  &-log {
    min-height: 24px;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    font-size: 14px;
    color: #7d7d7d;
    li {
      margin-bottom: 6px;
    }
  }
  code {
    padding: 4px;
    color: #0088ff;
    font-weight: 700;
    background-color: #ececec;
    border-radius: 4px;
  }
  .btn {
    padding: 8px 15px;
    margin: 0 8px 10px 0;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    &:hover {
      background-color: #0056b3;
    }
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
}
</style>
