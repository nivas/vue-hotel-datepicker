<template>
  <div id="demoModal" class="demoModal">
    <h2>Modal</h2>
    <div>
      <h3>Modal 1: Default (with initial selection)</h3>
      <button class="btn" @click="toggleModal1">Toggle Modal 1</button>
      <VueHotelDatepickerModal
        :active="activeModal1"
        @apply="result => handleApply(result, 1)"
        @cancel="() => handleCancel(1)"
        @reset-selection="() => handleReset(1)"
        @error="handleError"
        :startDate="initialStartDateForModal1"
        :endDate="initialEndDateForModal1"
        :minDate="minDateForModal1"
        :maxDate="maxDateForModal1"
        :minNight="1"
        :maxNight="30"
        message="Modal 1 with pre-selected dates."
        :resetMonthOnOpen=true
      />
      <p v-if="selection1.start">Selected for Modal 1: {{ selection1.startFormatted }} to {{ selection1.endFormatted }}</p>
    </div>

    <hr style="margin: 20px 0;">

    <div>
      <h3>Modal 2: With Disabled Dates & Diagonal Style (no initial selection)</h3>
      <button class="btn" @click="toggleModal2">Toggle Modal 2</button>
      <p>
        Disabled Dates:
        <span v-for="(date, index) in disabledDatesForModal2" :key="index">
          <code>{{ displayDateText(date) }}</code>
          <span v-if="index !== disabledDatesForModal2.length - 1">, </span>
        </span>
      </p>
      <VueHotelDatepickerModal
        :active="activeModal2"
        @apply="result => handleApply(result, 2)"
        @cancel="() => handleCancel(2)"
        @reset-selection="() => handleReset(2)"
        @error="handleError"
        :useDiagonalStartEnd="true"
        :disabledDates="disabledDatesForModal2"
        :minNight="2"
        :minDate="minDateForModal2"
        :format="'DD.MM.YYYY'"
        message="Modal 2 starts empty. Select a range."
      />
      <p v-if="selection2.start">Selected for Modal 2: {{ selection2.startFormatted }} to {{ selection2.endFormatted }}</p>
    </div>

    <hr style="margin: 20px 0;">

    <div>
      <h3>Modal 3: <code>:autoClose="true"</code> applies as soon as the second date is selected</h3>
      <button class="btn" @click="toggleModal3">Toggle Modal 3</button>
      <VueHotelDatepickerModal
        :active="activeModal3"
        @apply="result => handleApply(result, 3)"
        @cancel="() => handleCancel(3)"
        @reset-selection="() => handleReset(3)"
        @error="handleError"
        :autoClose="true"
        :startDate="selection3.start"
        :endDate="selection3.end"
        message="Modal 3 closes on the second date, without the Apply button."
      />
      <p v-if="selection3.start">Selected for Modal 3: {{ selection3.startFormatted }} to {{ selection3.endFormatted }}</p>
    </div>

    <hr style="margin: 20px 0;">

    <div>
      <h3>Modal 4: Day prices, half days and a legend (<code>prices</code>, <code>showHalfDays</code>, <code>legend</code>), localized</h3>
      <button class="btn" @click="toggleModal4">Toggle Modal 4</button>
      <VueHotelDatepickerModal
        :active="activeModal4"
        @apply="result => handleApply(result, 4)"
        @cancel="() => handleCancel(4)"
        @reset-selection="() => handleReset(4)"
        @error="handleError"
        :useDiagonalStartEnd="true"
        :prices="pricesForModal4"
        :legend="[
          { type: 'available', label: 'Dostupno' },
          { type: 'arrival', label: 'Dolazak' },
          { type: 'departure', label: 'Odlazak' },
          { type: 'occupied', label: 'Zauzeto' },
          { type: 'checkout', label: 'Samo odlazak' },
          { type: 'checkin', label: 'Samo dolazak' }
        ]"
        :showHalfDays="true"
        :disabledDates="disabledDatesForModal2"
        :startDate="selection4.start"
        :endDate="selection4.end"
        :format="'DD.MM.YYYY'"
        message="* U kalendaru je prikazana najniža cijena po noćenju."
      />
      <p v-if="selection4.start">Selected for Modal 4: {{ selection4.startFormatted }} to {{ selection4.endFormatted }}</p>
    </div>

    <div v-if="errorMessage" style="color: red; margin-top: 10px;">
      Error: {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import VueHotelDatepickerModal from './../components/VueHotelDatepickerModal.vue'

export default {
  name: 'DemoModal',
  components: {
    VueHotelDatepickerModal
  },
  data () {
    return {
      activeModal1: false,
      activeModal2: false,
      activeModal3: false,
      activeModal4: false,
      pricesForModal4: {},
      disabledDatesForModal2: [],
      selection1: { start: null, end: null, startFormatted: '', endFormatted: '' },
      selection2: { start: null, end: null, startFormatted: '', endFormatted: '' },
      selection3: { start: null, end: null, startFormatted: '', endFormatted: '' },
      selection4: { start: null, end: null, startFormatted: '', endFormatted: '' },

      initialStartDateForModal1: null,
      initialEndDateForModal1: null,
      minDateForModal1: null,
      maxDateForModal1: null,

      minDateForModal2: null, // Example: you might want a minDate for modal2 as well
      errorMessage: ''
    }
  },
  created () {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    // Config for Modal 1
    this.initialStartDateForModal1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)
    this.initialEndDateForModal1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
    this.minDateForModal1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5)
    this.maxDateForModal1 = new Date(now.getFullYear(), now.getMonth() + 2, 0) // Last day of next month

    // Config for Modal 2
    this.minDateForModal2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // e.g., cannot select past dates

    const disableDateValues = [
      now.getTime() + (1000 * 60 * 60 * 24 * 7),
      now.getTime() + (1000 * 60 * 60 * 24 * 8),
      now.getTime() + (1000 * 60 * 60 * 24 * 13),
      now.getTime() + (1000 * 60 * 60 * 24 * 16),
      now.getTime() + (1000 * 60 * 60 * 24 * 21)
    ]
    this.disabledDatesForModal2 = disableDateValues.map(ts => new Date(ts))

    // Config for Modal 4: a made-up rate per night, none for the disabled days
    const disabledDays = this.disabledDatesForModal2.map(date => this.displayDateText(date, 'YYYY-MM-DD'))
    for (let days = 0; days < 150; days++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days)
      const key = this.displayDateText(date, 'YYYY-MM-DD')
      if (disabledDays.includes(key)) continue
      const weekend = date.getDay() === 5 || date.getDay() === 6 ? 35 : 0
      this.pricesForModal4[key] = 85 + weekend + (date.getDate() * 7) % 13 + Math.floor(days / 30) * 6
    }
  },
  methods: {
    toggleModal1 () {
      this.activeModal1 = !this.activeModal1
      if (this.activeModal1) this.activeModal2 = false
      this.errorMessage = ''
    },
    toggleModal2 () {
      this.activeModal2 = !this.activeModal2
      if (this.activeModal2) this.activeModal1 = false
      this.errorMessage = ''
    },
    toggleModal4 () {
      this.activeModal4 = !this.activeModal4
      this.errorMessage = ''
    },
    toggleModal3 () {
      this.activeModal3 = !this.activeModal3
      this.errorMessage = ''
    },
    handleApply (result, modalNumber) {
      console.log(`Apply from Modal ${modalNumber}:`, result)
      if (modalNumber === 1) {
        this.selection1 = result
        this.activeModal1 = false
      } else if (modalNumber === 2) {
        this.selection2 = result
        this.activeModal2 = false
      } else if (modalNumber === 3) {
        this.selection3 = result
        this.activeModal3 = false
      } else if (modalNumber === 4) {
        this.selection4 = result
        this.activeModal4 = false
      }
      this.errorMessage = ''
    },
    handleCancel (modalNumber) {
      console.log(`Cancel from Modal ${modalNumber}`)
      if (modalNumber === 1) {
        this.activeModal1 = false
      } else if (modalNumber === 2) {
        this.activeModal2 = false
      } else if (modalNumber === 3) {
        this.activeModal3 = false
      } else if (modalNumber === 4) {
        this.activeModal4 = false
      }
      this.errorMessage = ''
    },
    handleReset (modalNumber) {
      console.log(`Reset selection for Modal ${modalNumber}`)
      if (modalNumber === 1) {
        this.selection1 = { start: null, end: null, startFormatted: '', endFormatted: '' }
      } else if (modalNumber === 2) {
        this.selection2 = { start: null, end: null, startFormatted: '', endFormatted: '' }
      } else if (modalNumber === 3) {
        this.selection3 = { start: null, end: null, startFormatted: '', endFormatted: '' }
      } else if (modalNumber === 4) {
        this.selection4 = { start: null, end: null, startFormatted: '', endFormatted: '' }
      }
      this.errorMessage = ''
    },
    handleError (message) {
      console.error('Datepicker Error:', message)
      this.errorMessage = message
    },
    displayDateText (datetime, format = 'YYYY/MM/DD') {
      if (!datetime) return null
      const d = (typeof datetime === 'string' || typeof datetime === 'number') ? new Date(datetime) : datetime
      const yyyy = d.getFullYear()
      const mm = (d.getMonth() + 1).toString().padStart(2, '0')
      const dd = d.getDate().toString().padStart(2, '0')
      return format.replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
    }
  }
}
</script>

<style lang="scss">
#demoModal {
  margin-bottom: 120px;
}
.btn {
  padding: 8px 15px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
.btn:hover {
  background-color: #0056b3;
}
code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
}
hr {
    border: 0;
    height: 1px;
    background: #ddd;
}
</style>
