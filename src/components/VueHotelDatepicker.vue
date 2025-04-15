<template>
  <div :class="mobile.toLowerCase()" class="vhd-container">
    <input v-model="value"
           :placeholder="placeholder"
           type="text" class="vhd-input" aria-label="vue-hotel-datepicker-input"
           @mousedown.prevent="toggle"
           @focus.prevent="toggle">
    <div v-if="active" class="vhd-picker">
      <div class="vhd-calendar">
        <div class="vhd-calendar-header">
          <a class="close" @click="close">
            <IconClose />
          </a>
          <span class="info">
            <span v-if="selectStartDate" class="from-text">{{ fromText }}</span>
            <span v-if="selectStartDate" class="from-date"> {{ displayDateText(selectStartDate) }} </span>
            <span v-if="selectEndDate" class="to-text">{{ toText }}</span>
            <span v-if="selectEndDate" class="from-date"> {{ displayDateText(selectEndDate) }} </span>
          </span>
        </div>
        <div class="vhd-calendar-left">
          <div class="calendar-month">
            <a :class="disabledPreviousArrow(startMonthDate)" class="previous-arrow offset-2" @click="updateCalendar(-2)">
              <IconArrowBack class="arrow" />
            </a>
            <a :class="disabledPreviousArrow(startMonthDate)" class="previous-arrow offset-1" @click="updateCalendar(-1)">
              <IconArrowBack class="arrow"/>
            </a>
            <div class="calendar-month-title">
              {{ monthList[startMonthDate.getMonth()] }} {{ startMonthDate.getFullYear() }}
            </div>
            <a class="next-arrow offset-1" @click="updateCalendar(1)">
              <IconArrowForward class="arrow" />
            </a>
          </div>
          <div class="calendar-week">
            <div v-for="(wItem, index) in weekList" :key="index" class="calendar-week-item">
              {{ wItem }}
            </div>
          </div>
          <div class="calendar-date">
            <div v-for="(week, wIndex) in startMonthAry" :key="wIndex" class="week">
              <div v-for="(startDay, dIndex) in week"
                   :key="dIndex"
                   :class="dayStatus(startDay)"
                   class="day"
                   @click="dayOnClick(startDay)">
                <span v-if="startDay">
                  {{ startDay.getDate() }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="vhd-calendar-right">
          <div class="calendar-month">
            <a class="next-arrow" @click="updateCalendar(2)">
              <IconArrowForward class="arrow" />
            </a>
            <div class="calendar-month-title">
              {{ monthList[endMonthDate.getMonth()] }} {{ endMonthDate.getFullYear() }}
            </div>
          </div>
          <div class="calendar-week">
            <div v-for="(wItem, index) in weekList" :key="index" class="calendar-week-item">
              {{ wItem }}
            </div>
          </div>
          <div class="calendar-date">
            <div v-for="(week, wIndex) in endMonthAry" :key="wIndex" class="week">
              <div v-for="(endDay, dIndex) in week" :key="dIndex" :class="dayStatus(endDay)" class="day" @click="dayOnClick(endDay)">
                <span v-if="endDay">
                  {{ endDay.getDate() }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="message" class="vhd-calendar-message">
            {{message}}
        </div>
        <div class="vhd-calendar-footer">
          <div v-if="selectStartDate || selectEndDate" class="reset" @click="reset">{{ resetText }}</div>
          <div v-if="selectStartDate && selectEndDate" class="confirm" @click="confirm">{{ confirmText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconClose from '@/components/icon/IconClose'
import IconArrowBack from '@/components/icon/IconArrowBack'
import IconArrowForward from '@/components/icon/IconArrowForward'

export default {
  name: 'VueHotelDatepicker',
  components: {
    IconClose,
    IconArrowBack,
    IconArrowForward
  },
  directives: {},
  props: {
    placeholder: {
      type: String,
      default: 'Select a date range'
    },
    separator: {
      type: String,
      default: '~'
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD'
    },
    startDate: {
      type: [String, Date],
      default: undefined
    },
    endDate: {
      type: [String, Date],
      default: undefined
    },
    minDate: {
      type: [String, Date],
      default: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
    },
    maxDate: {
      type: [String, Date, Boolean],
      default: false
    },
    minNight: {
      type: Number,
      default: undefined
    },
    maxNight: {
      type: Number,
      default: undefined
    },
    selectForward: { // Note: This prop's effect might need review based on the new logic if used heavily
      type: Boolean,
      default: true
    },
    disabledDates: {
      type: Array,
      default: () => []
    },
    weekList: {
      type: Array,
      default: () => ['Sun.', 'Mon.', 'Tue.', 'Wen.', 'Thu.', 'Fri.', 'Sat.']
    },
    monthList: {
      type: Array,
      default: () => ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct', 'Nov.', 'Dec.']
    },
    fromText: {
      type: String,
      default: 'From'
    },
    toText: {
      type: String,
      default: 'To'
    },
    resetText: {
      type: String,
      default: 'Reset'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    mobile: {
      type: String,
      default: '' // mobile or desktop
    },
    message: {
      type: String,
      default: ''
    },
    useDiagonalStartEnd: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      value: '',
      active: false,
      startMonthDate: undefined,
      endMonthDate: undefined,
      selectStartDate: undefined,
      selectEndDate: undefined,
      selectMinDate: undefined,
      selectMaxDate: undefined,
      startMonthAry: [],
      endMonthAry: [],
      // Removed isSettingStartDate and isSelectingEndDateNow flags
      // Their state can be derived from selectStartDate and selectEndDate
      formattedDisabledDates: [] // Store formatted disabled dates for efficient lookup
    }
  },
  computed: {},
  watch: {
    // Watch disabledDates prop in case it changes dynamically
    disabledDates: {
      immediate: true,
      handler (newVal) {
        // Pre-format disabled dates for consistent comparison
        this.formattedDisabledDates = (newVal || []).map(d => this.displayDateText(new Date(d)))
      }
    }
  },
  created () {
    this.render()
  },
  mounted () {},
  methods: {
    render () {
      // --- Min/Max Date Initialization ---
      if (this.minDate) {
        const minDateValue = typeof (this.minDate) === 'string' ? this.minDate : this.minDate.getTime()
        this.selectMinDate = new Date(minDateValue)
        this.selectMinDate.setHours(0, 0, 0, 0) // Normalize time
      }
      if (this.maxDate) {
        const maxDateValue = typeof (this.maxDate) === 'string' ? this.maxDate : this.maxDate.getTime()
        this.selectMaxDate = new Date(maxDateValue)
        this.selectMaxDate.setHours(0, 0, 0, 0) // Normalize time
      }

      // --- Initial Start/End Date Initialization ---
      let initialStartDate = null
      let initialEndDate = null

      if (this.startDate) {
        const startDateValue = typeof (this.startDate) === 'string' ? this.startDate : this.startDate.getTime()
        initialStartDate = new Date(startDateValue)
        initialStartDate.setHours(0, 0, 0, 0) // Normalize time

        // Adjust minDate if initial startDate is earlier
        if (this.selectMinDate && this.selectMinDate.getTime() > initialStartDate.getTime()) {
          this.selectMinDate = new Date(initialStartDate.getTime())
        }
      }

      if (this.endDate) {
        const endDateValue = typeof (this.endDate) === 'string' ? this.endDate : this.endDate.getTime()
        initialEndDate = new Date(endDateValue)
        initialEndDate.setHours(0, 0, 0, 0) // Normalize time
      } else if (initialStartDate) {
        // Default end date if only start date is provided (e.g., 1 night)
        // Ensure this default doesn't conflict with disabled dates later
        // initialEndDate = new Date(initialStartDate.getTime() + (24 * 60 * 60 * 1000))
      }

      // --- Validate and Set Initial Range ---
      // Important: Validate initial range against disabled dates *before* setting
      if (initialStartDate && initialEndDate) {
        const start = initialStartDate.getTime()
        const end = initialEndDate.getTime()
        const startStr = this.displayDateText(initialStartDate)
        const endStr = this.displayDateText(initialEndDate)

        const startIsDisabled = this.formattedDisabledDates.includes(startStr)
        const endIsDisabled = this.formattedDisabledDates.includes(endStr)

        const interveningDisabled = this.formattedDisabledDates.some(disabledStr => {
          const dTime = new Date(disabledStr).getTime()
          return dTime > start && dTime < end
        })

        // Valid initial range if:
        // 1. Start date is not disabled
        // 2. End date is not disabled OR it's the only disabled date in the range
        // 3. No other disabled dates are strictly between start and end
        if (!startIsDisabled && !interveningDisabled && (!endIsDisabled || (endIsDisabled && !this.formattedDisabledDates.some(dStr => { const dTime = new Date(dStr).getTime(); return dTime > start && dTime < end })))) {
          this.selectStartDate = initialStartDate
          this.selectEndDate = initialEndDate
          this.updateValue()
        } else {
          console.warn('Initial startDate/endDate conflicts with disabledDates or creates an invalid range.')
          // Optionally reset or handle the conflict
          this.selectStartDate = undefined
          this.selectEndDate = undefined
        }
      } else if (initialStartDate) {
        // If only initial start date is provided, check if it's disabled
        const startStr = this.displayDateText(initialStartDate)
        if (!this.formattedDisabledDates.includes(startStr)) {
          this.selectStartDate = initialStartDate
          // Do not set end date yet, let user click
          this.updateValue()
        } else {
          console.warn('Initial startDate conflicts with disabledDates.')
          this.selectStartDate = undefined
        }
      }

      // --- Calendar Rendering ---
      this.updateCalendar() // after setting potential dates
    },

    toggle (e) {
      if (e.type === 'focus') {
        this.$emit('beforeopen')
        this.active = true
        this.$emit('open')
        return true
      }
      this.active = !this.active
      this.$emit(this.active ? 'open' : 'close')
    },
    close () {
      this.active = false
      this.$emit('close')
    },
    open () {
      this.active = true
      this.$emit('open')
    },
    reset () {
      this.selectStartDate = undefined
      this.selectEndDate = undefined
      this.value = ''
      this.$emit('reset')
      this.updateCalendar() // Re-render calendar based on default/minDate
    },
    confirm () {
      // Auto-select next day if only start date is chosen? Maybe not desirable.
      // Let's only confirm if both dates are selected according to rules.
      // if (this.selectStartDate && !this.selectEndDate) {
      //   // Potentially auto-select next valid day here if needed.
      //   // This requires complex logic to find the next non-disabled day respecting min/max nights.
      //   // For now, let's assume confirmation only happens with a valid range.
      // }
      if (this.selectStartDate && this.selectEndDate) {
        const dateResult = {
          start: this.displayDateText(this.selectStartDate),
          end: this.displayDateText(this.selectEndDate)
        }
        this.$emit('confirm', dateResult)
        this.active = false
      } else if (this.selectStartDate && !this.selectEndDate) {
        // Handle case where user tries to confirm with only a start date
        // Maybe show a message or prevent closing? Depends on desired UX.
        console.warn('Please select an end date.')
      }
    },

    displayDateText (datetime) {
      if (!datetime) return undefined
      datetime = typeof (datetime) === 'string' ? new Date(datetime) : new Date(datetime.getTime()) // Clone date
      const yyyy = datetime.getFullYear()
      const mm = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : `0${datetime.getMonth() + 1}`
      const dd = datetime.getDate() > 9 ? datetime.getDate() : `0${datetime.getDate()}`
      const displayStr = (this.format || 'YYYY/MM/DD').replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
      return displayStr
    },

    // generateCalendar remains the same
    generateCalendar (calculateYear = new Date().getFullYear(), calculateMonth = new Date().getMonth(), config = {}) {
      const showPreviousMonthDate = config.showPreviousMonthDate || false
      const showNextMonthDate = config.showNextMonthDate || false
      const baseDateTime = new Date(calculateYear, calculateMonth, 1, 0, 0, 0)
      let countTime = new Date(calculateYear, calculateMonth, 1, 0, 0, 0)
      let tempMonthAry = []
      let tempWeekAry = []
      let nextMonth = false
      let completed = false
      while (!nextMonth || (nextMonth && !completed)) {
        let day = countTime.getDay()
        let date = countTime.getDate()
        let month = countTime.getMonth()
        // check next month
        if (month !== calculateMonth) {
          nextMonth = true
          if (day === 6 || (date === 1 && day === 0)) {
            completed = true
          }
        }
        // Set date
        if (!nextMonth) {
          tempWeekAry[day] = new Date(countTime.getTime()) // date obj
        } else {
          tempWeekAry[day] = showNextMonthDate ? new Date(countTime.getTime()) : false
        }
        // check previous
        if (countTime.getTime() === baseDateTime.getTime() && day !== 0) {
          // Fill previous
          let previousDay = day
          let previousCountTime = new Date(countTime.getTime())
          previousCountTime.setDate(previousCountTime.getDate())
          if (showPreviousMonthDate) {
            while (previousDay !== 0) {
              // let previousDate = previousDateTime.getDate()
              let previousDateTime = new Date(previousCountTime.getTime())
              previousDay = previousDateTime.getDay()
              tempWeekAry[previousDay] = previousDateTime // date obj
              previousCountTime.setDate(previousCountTime.getDate() - 1)
            }
          }
        }
        // check new week
        if ((countTime.getTime() === baseDateTime.getTime() && tempWeekAry.length === 7) ||
                (countTime.getTime() > baseDateTime && day === 6)) {
          // Next week
          tempMonthAry.push(tempWeekAry)
          tempWeekAry = []
        }
        // calculate next day
        countTime.setDate(countTime.getDate() + 1)
      }

      return tempMonthAry
    },
    // updateCalendar remains the same
    updateCalendar (offset = 0) {
      if (!this.startMonthDate) {
        this.startMonthDate = this.selectStartDate
          ? new Date(this.selectStartDate.getFullYear(), this.selectStartDate.getMonth())
          : this.selectMinDate
            ? new Date(this.selectMinDate.getFullYear(), this.selectMinDate.getMonth())
            : new Date(new Date().getFullYear(), new Date().getMonth()) // now
      }

      this.startMonthDate.setMonth(this.startMonthDate.getMonth() + offset)
      // Ensure startMonthDate doesn't go before minDate month if applicable
      if (this.selectMinDate && this.selectForward) {
        const minMonth = new Date(this.selectMinDate.getFullYear(), this.selectMinDate.getMonth())
        if (this.startMonthDate.getTime() < minMonth.getTime()) {
          this.startMonthDate = minMonth
        }
      }

      this.endMonthDate = new Date(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth() + 1)

      this.startMonthAry = []
      this.endMonthAry = []
      this.startMonthAry = this.generateCalendar(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth())
      this.endMonthAry = this.generateCalendar(this.endMonthDate.getFullYear(), this.endMonthDate.getMonth())
    },
    // updateValue remains the same
    updateValue () {
      if (this.selectStartDate && this.selectEndDate) {
        this.value = `${this.displayDateText(this.selectStartDate)} ${this.separator} ${this.displayDateText(this.selectEndDate)}`
      } else if (this.selectStartDate) {
        this.value = `${this.displayDateText(this.selectStartDate)} ${this.separator} `
      } else {
        this.value = ''
      }
    },
    // disabledPreviousArrow remains the same
    disabledPreviousArrow (monthDatetime) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      if (monthDatetime && this.selectForward) {
        if (this.selectMinDate) {
          if (monthDatetime.getFullYear() < this.selectMinDate.getFullYear()) {
            return 'disabled'
          }
          if (monthDatetime.getFullYear() === this.selectMinDate.getFullYear() &&
                    monthDatetime.getMonth() <= this.selectMinDate.getMonth()) {
            return 'disabled'
          }
        } else {
          // If no minDate, disable going before current month? Or allow?
          // Current logic disables if it's the current month of today.
          const currentMonth = new Date(today.getFullYear(), today.getMonth())
          if (monthDatetime.getTime() <= currentMonth.getTime()) {
            return 'disabled'
          }
        }
      }
      return false // Return false instead of undefined for cleaner checks
    },
    dayStatus (datetime) {
      const classList = []
      if (datetime) {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const time = datetime.getTime()
        const display = this.displayDateText(datetime)

        const isBaseDisabled =
            (this.selectMinDate && time < this.selectMinDate.getTime()) ||
            (this.selectMaxDate && time > this.selectMaxDate.getTime())

        const isDisabledByProp = this.formattedDisabledDates.includes(display)

        let isGenerallyDisabled = isBaseDisabled // Start with base disablement

        // Initial state class
        if (time === now.getTime()) {
          classList.push('today')
        }

        // --- Logic when selecting the second date ---
        if (this.selectStartDate && !this.selectEndDate) {
          const startTime = this.selectStartDate.getTime()

          // Check for intervening disabled dates between start and evaluated date
          // Used for general disablement logic below
          const minCheck = Math.min(startTime, time)
          const maxCheck = Math.max(startTime, time)
          const interveningDisabledCheck = this.formattedDisabledDates.some(dStr => {
            const dTime = new Date(dStr).getTime()
            // Check strictly between start and evaluated date
            return dTime > minCheck && dTime < maxCheck
          })

          // Tentatively disable based on min/max nights relative to start date
          const nights = Math.abs(time - startTime) / (1000 * 60 * 60 * 24)
          let violatesNights = false
          if (time !== startTime) { // Don't check nights for start date itself
            if (this.minNight && nights < this.minNight) {
              violatesNights = true
            }
            if (this.maxNight && nights > this.maxNight) {
              violatesNights = true
            }
          }

          // A date is generally disabled if base disabled, violates nights,
          // OR if there's an intervening disabled date between it and the start date.
          // (Except the start date itself)
          if (time !== startTime && (violatesNights || interveningDisabledCheck)) {
            isGenerallyDisabled = true
          }

          // --- Apply 'selectable-disabled' ---
          // Condition:
          // 1. Must be disabled by the prop (`isDisabledByProp`)
          // 2. Must NOT be generally disabled by other rules (`!isGenerallyDisabled`)
          // 3. Must be AFTER the current start date (`time > startTime`) <-- NEW Condition
          // 4. Clicking it must result in a valid range (no intervening disabled dates)
          if (isDisabledByProp && !isGenerallyDisabled && time > startTime) {
            // Check if selecting this date *would* be valid (no intervening disabled)
            // Since we already know time > startTime, potential start is fixed.
            const potentialStartTime = startTime
            const potentialEndTime = time

            const interveningDisabledOnClick = this.formattedDisabledDates.some(dStr => {
              // Exclude the date being checked itself
              if (dStr === display) return false
              const dTime = new Date(dStr).getTime()
              // Check strictly between current start and this potential end
              return dTime > potentialStartTime && dTime < potentialEndTime
            })

            // Add the class only if it passes the intervening check for the final range
            if (!interveningDisabledOnClick) {
              classList.push('selectable-disabled')
            }
          }
          // END Apply 'selectable-disabled'
        }
        // --- END Logic when selecting the second date ---

        // --- Apply Final Disabled/Forbidden Classes ---
        // A date gets 'disabled' if:
        // - It's generally disabled (base, nights, intervening for current selection)
        // - OR it's disabled by prop AND it hasn't been marked as 'selectable-disabled'
        if (isGenerallyDisabled || (isDisabledByProp && !classList.includes('selectable-disabled'))) {
          if (!classList.includes('disabled')) { // Avoid duplicates
            classList.push('disabled')
          }
          // Add 'forbidden' specifically for dates disabled by prop, unless they are 'selectable-disabled'
          if (isDisabledByProp && !classList.includes('selectable-disabled')) {
            if (!classList.includes('forbidden')) {
              classList.push('forbidden')
            }
          }
        }

        // --- Apply Range Selection Styles ---
        // (These can override/coexist with other classes based on the final valid selection)
        if (this.selectStartDate && this.selectStartDate.getTime() === time) {
          // Start date should never be visually disabled
          const disabledIndex = classList.indexOf('disabled')
          if (disabledIndex > -1) classList.splice(disabledIndex, 1)
          const forbiddenIndex = classList.indexOf('forbidden')
          if (forbiddenIndex > -1) classList.splice(forbiddenIndex, 1)
          const selectableIndex = classList.indexOf('selectable-disabled') // Should not happen, but safety
          if (selectableIndex > -1) classList.splice(selectableIndex, 1)

          classList.push(this.useDiagonalStartEnd ? 'start-date-diagonal' : 'start-date')
        } else if (this.selectEndDate && this.selectEndDate.getTime() === time) {
          // End date can be disabled/selectable-disabled, but not forbidden
          const forbiddenIndex = classList.indexOf('forbidden')
          if (forbiddenIndex > -1) classList.splice(forbiddenIndex, 1)

          classList.push(this.useDiagonalStartEnd ? 'end-date-diagonal' : 'end-date')
        } else if (this.selectStartDate && this.selectEndDate && time > this.selectStartDate.getTime() && time < this.selectEndDate.getTime()) {
          // Dates within the selected range should not be disabled
          if (!classList.includes('disabled')) {
            classList.push('in-date-range')
          } else {
            // Log if an in-range date is unexpectedly disabled
            console.warn("In-range date has 'disabled' class:", display)
            // Maybe force remove disabled for in-range?
            const disabledIndex = classList.indexOf('disabled')
            if (disabledIndex > -1) classList.splice(disabledIndex, 1)
            classList.push('in-date-range') // Ensure it has the range class
          }
        }
        // --- END Apply Range Selection Styles ---
      } else {
        classList.push('empty') // Class for empty cells
      }
      // Return unique classes
      return [...new Set(classList)]
    },

    // Keep the previously corrected dayOnClick method here
    dayOnClick (datetime) {
      if (!datetime) return // Clicked on empty cell

      const clickedTime = datetime.getTime()
      const clickedDateStr = this.displayDateText(datetime)
      const isClickedDateDisabled = this.formattedDisabledDates.includes(clickedDateStr)

      // --- Prevent clicking fundamentally disabled dates (min/max date) ---
      if (
        (this.selectMinDate && clickedTime < this.selectMinDate.getTime()) ||
            (this.selectMaxDate && clickedTime > this.selectMaxDate.getTime())
      ) {
        // console.log('Click ignored: Outside min/max date range.');
        return // Ignore click
      }

      // Get current state
      const currentStartDate = this.selectStartDate
      const currentEndDate = this.selectEndDate // Needed to check if we are starting a new selection

      // --- Scenario 1: Start a new selection ---
      if (!currentStartDate || (currentStartDate && currentEndDate)) {
        if (isClickedDateDisabled) {
          // console.log('Click ignored: Cannot start selection with a disabled date.');
          return // Ignore click
        }
        this.selectStartDate = datetime
        this.selectEndDate = null
        // console.log('Selection started/reset:', this.displayDateText(this.selectStartDate));
        this.updateValue()
        this.$emit('update', { start: clickedDateStr, end: null })
        return // Done for this click
      }

      // --- Scenario 2: A start date exists, but no end date (selecting the second date) ---
      if (currentStartDate && !currentEndDate) {
        const currentStartTime = currentStartDate.getTime()

        if (clickedTime === currentStartTime) {
          // console.log('Clicked start date again. Ready for new end date.');
          return
        }

        let potentialStartDate, potentialEndDate
        if (clickedTime < currentStartTime) {
          potentialStartDate = datetime
          potentialEndDate = currentStartDate
        } else {
          potentialStartDate = currentStartDate
          potentialEndDate = datetime
        }

        const potentialStartTime = potentialStartDate.getTime()
        const potentialEndTime = potentialEndDate.getTime()
        const potentialStartDateStr = this.displayDateText(potentialStartDate)
        const potentialEndDateStr = this.displayDateText(potentialEndDate)

        const isPotentialStartDisabled = this.formattedDisabledDates.includes(potentialStartDateStr)
        const isPotentialEndDisabled = this.formattedDisabledDates.includes(potentialEndDateStr)

        // RULE 1: Potential start date cannot be disabled.
        if (isPotentialStartDisabled) {
          // console.log('Selection invalid: Potential start date is disabled.');
          return
        }

        // RULE 2: Check for intervening disabled dates.
        const interveningDisabled = this.formattedDisabledDates.some(disabledStr => {
          if (isPotentialEndDisabled && disabledStr === potentialEndDateStr) {
            return false
          }
          const dTime = new Date(disabledStr).getTime()
          return dTime > potentialStartTime && dTime < potentialEndTime
        })

        if (interveningDisabled) {
          // console.log('Selection invalid: Range includes a disabled date between start and end.');
          return
        }

        // RULE 3: Check Min/Max Nights
        const nights = Math.abs(potentialEndTime - potentialStartTime) / (1000 * 60 * 60 * 24)
        if (this.minNight && nights < this.minNight) {
          // console.warn(`Selection invalid: Violates min nights (${this.minNight}). Need at least ${this.minNight} nights.`);
          this.$emit('error', `Minimum stay is ${this.minNight} nights.`)
          return
        }
        if (this.maxNight && nights > this.maxNight) {
          // console.warn(`Selection invalid: Violates max nights (${this.maxNight}). Cannot exceed ${this.maxNight} nights.`);
          this.$emit('error', `Maximum stay is ${this.maxNight} nights.`)
          return
        }

        // --- Validation passed, commit selection ---
        this.selectStartDate = potentialStartDate
        this.selectEndDate = potentialEndDate
        // console.log('Selection complete:', potentialStartDateStr, '~', potentialEndDateStr);

        this.updateValue()
        this.$emit('update', { start: potentialStartDateStr, end: potentialEndDateStr })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
@mixin mobile-vhd() {
  .vhd {
    &-picker {
      width: 300px;
      padding: 8px;
    }
    &-calendar {
      &-header {
        height: 60px;
        > .info {
          display: block;
          width: 100%;
          height: 60px;
          padding-top: 36px;
        }
      }
      &-left {
        width: 100%;
        margin-right: 0;
      }
      &-right {
        display: none;
      }
      .calendar {
        &-month {
          .previous-arrow.offset-2 {
            display: none;
          }
          .previous-arrow.offset-1 {
            display: inline-block;
          }
          .next-arrow.offset-1 {
            display: inline-block;
          }
        }
        &-week {}
        &-date {
          .week {
            .day {
              width: calc(100% / 7);
              &.start-date {
                color: #ffffff;
                border-left: none;
                // background-color: #B2D7FF;
                background-color: #0088FF;
                transition: all .2s ease;
              }
              &.end-date {
                color: #ffffff;
                border-right: none;
                // background-color: #B2D7FF;
                background-color: #0088FF;
                transition: all .2s ease;
              }
            }
          }
        }
      }
    }
  }
}
* {
  box-sizing: border-box;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
svg {
  fill: #7d7d7d;
  @media (hover: hover) {
    &:hover {
      fill: darken(#7d7d7d, 20%)
    }
  }
}
.vhd {
  &-container.mobile {
    @include mobile-vhd();
  }
  &-container {
    display: inline-block;
    position: relative;
  }
  &-input {
    min-width: 300px;
    padding: 8px;
    border: solid 1px #eeeeee;
    color: #505050;
    font-size: 16px;
    line-height: 32px;
    outline: none;
    &::placeholder {
      color: #cccccc;
    }
  }
  &-picker {
    z-index: 100;
    position: absolute;
    left: 0;
    width: 648px;
    min-height: 420px;
    padding: 24px;
    background-color: #ffffff;
    // border: solid 1px #ececec;
    border-radius: 6px;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.27);
    overflow: hidden;
  }
  &-calendar {
    &-header {
      position: relative;
      width: 100%;
      height: 36px;
      > .info {
        display: inline-block;
        width: calc(100% - 24px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .from-text {
          //
        }
        .from-date,
        .to-date {
          margin: 0 8px;
          font-weight: 700;
        }
        .to-text {
          //
        }
      }
      > a.close {
        position: absolute;
        right: 0;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
    &-footer {
      position: relative;
      width: 100%;
      height: 36px;
      .reset, .confirm {
        position: absolute;
        bottom: 0;
        margin: 8px 0;
        padding: 0 8px;
        font-weight: 500;
        cursor: pointer;
      }
      .reset {
        left: 0;
        color: #7d7d7d;
        @media (hover: hover) {
          &:hover {
            color: darken(#7d7d7d, 20%)
          }
        }
      }
      .confirm {
        right: 0;
        color: #0088ff;
        @media (hover: hover) {
          &:hover {
            color: darken(#0088ff, 20%)
          }
        }
      }
    }
    &-left,
    &-right {
      display: inline-block;
      vertical-align: top;
      width: 280px;
    }
    &-left {
      margin-right: 40px;
    }
    .calendar {
      &-month {
        position: relative;
        height: 32px;
        margin-bottom: 8px;
        .next-arrow,
        .previous-arrow {
          position: absolute;
          top: 0;
          padding-top: 4px;
          // border: solid 1px #0088FF;
          cursor: pointer;
          &.disabled {
            // cursor: not-allowed;
            display: none!important;
          }
        }
        .previous-arrow {
          left: 0;
        }
        .next-arrow {
          right: 0;
        }
        .previous-arrow.offset-1 {
          display: none;
        }
        .next-arrow.offset-1 {
          display: none;
        }
        &-title {
          margin: 8px 0;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.6;
          text-align: center;
          color: #505050;
        }
      }
      &-week {
        width: 100%;
        height: 32px;
        &-item {
          float: left;
          display: inline-block;
          font-size: 12px;
          font-weight: 500;
          width: calc(100% / 7);
          height: 20px;
          color: #505050;
          text-align: center;
          line-height: 20px;
        }
      }
      &-date {
        .week {
          display: block;
          width: 100%;
          height: 40px;
          .day {
            float: left;
            position: relative;
            display: inline-block;
            width: 40px;
            height: 40px;
            font-size: 16px;
            font-weight: 500;
            line-height: 40px;
            color: #505050;
            // border: solid 1px #b2d7ff;
            background-color: transparent;
            text-align: center;
            cursor: pointer;
            transition: background-color .4s cubic-bezier(0.165, 0.84, 0.44, 1);
            &::before,
            &::after{
              content: '';
              position: absolute;
              width: 0px;
              height: 100%;
              left: 0;
              background-color: transparent;
              opacity: 0;
              transition: opacity .4s cubic-bezier(0.165, 0.84, 0.44, 1),
                          background-color .4s cubic-bezier(0.165, 0.84, 0.44, 1),
                          width .4s cubic-bezier(0.165, 0.84, 0.44, 1);
            }
            &::after{
              left: auto;
              right: 0;
            }
            &.disabled {
              color: #ececec;
              pointer-events: none;
            }
            &.selectable-disabled {
              position: relative;
              overflow: hidden;
              border: 1px dashed #e57373;

              &::before,
              &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                opacity: 1;
                z-index: 0; // Background layer
                transition: none;
              }

              // Top-right half
              &::before {
                background-color: #ffe7e7;
                color: #a94442;
                clip-path: polygon(100% 0, 100% 100%, 0 0);
              }

              // Bottom-left half
              &::after {
                background-color: #ffffff;
                clip-path: polygon(0 100%, 0 0, 100% 100%);
              }
              // Ensure text (day number) is on top
              span {
                position: relative;
                z-index: 1;
              }
            }

            /*
            &.selectable-disabled {
              background-color: #ffe7e7;
              border: 1px dashed #e57373;
              color: #a94442;
              cursor: pointer;
            }
            */
            &.in-date-range {
              background-color: #B2D7FF;
            }
            &.start-date {
              position: relative;
              background-color: #B2D7FF;
              // transition: all .2s ease;
              &::before {
                // content: '';
                // position: absolute;
                // width: 4px;
                // height: 100%;
                // left: 0;
                width: 4px;
                background-color: #0088FF;
                opacity: 1;
              }
            }
            &.end-date {
              position: relative;
              background-color: #B2D7FF;
              // transition: all .2s ease;
              &::after {
                // content: '';
                // position: absolute;
                // width: 4px;
                // height: 100%;
                width: 4px;
                background-color: #0088FF;
                opacity: 1;
                transition: opacity .2s cubic-bezier(0.165, 0.84, 0.44, 1),
                            background-color .2s cubic-bezier(0.165, 0.84, 0.44, 1),
                            width .2s cubic-bezier(0.165, 0.84, 0.44, 1);
              }
            }
            &.today {
              border: solid 1px #0088ff;
            }
            &.forbidden {
              // color: #a10903;
              color: #fed9d8;
              cursor: not-allowed;
            }
            &.start-date-diagonal  {
              position: relative;
              overflow: hidden;

              &::before,
              &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                opacity: 1;
                z-index: 0; // Background layer
                transition: none;
              }

              &::before {
                background-color: #ffffff; // Top-left color
                clip-path: polygon(0 0, 100% 0, 0 100%);
              }

              &::after {
                background-color: #B2D7FF; // Bottom-right color
                clip-path: polygon(100% 100%, 0 100%, 100% 0);
              }
              span {
                position: relative;
                z-index: 1;
              }
            }
            &.end-date-diagonal {
              position: relative;
              overflow: hidden;

              &::before,
              &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                opacity: 1;
                z-index: 0; // Background layer
                transition: none;
              }

              // Top-right half
              &::before {
                background-color: #ffffff;
                clip-path: polygon(100% 0, 100% 100%, 0 0);
              }

              // Bottom-left half
              &::after {
                background-color: #B2D7FF;
                clip-path: polygon(0 100%, 0 0, 100% 100%);
              }
              // Ensure text (day number) is on top
              span {
                position: relative;
                z-index: 1;
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767.98px) {
  .vhd {
    &-container:not(.desktop) {
      @include mobile-vhd();
    }
  }
}
</style>
