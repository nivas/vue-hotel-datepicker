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
    selectForward: {
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
      default: false
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
      formattedDisabledDates: [], // Store disabled dates as strings in 'this.format'
      disabledDateTimestamps: [] // Store disabled dates as numeric timestamps (normalized)
    }
  },
  computed: {},
  watch: {
    disabledDates: {
      immediate: true,
      handler (newVal, oldVal) { // oldVal is available if needed for comparison
        const rawDates = newVal || []

        // 1. Update internal representations of disabled dates
        this.formattedDisabledDates = rawDates.map(d => {
          const dateObj = new Date(d)
          if (isNaN(dateObj.getTime())) {
            console.error(`VueHotelDatepicker: Invalid date string "${d}" in disabledDates prop. It will be ignored for formatted list.`)
            return null
          }
          return this.displayDateText(dateObj)
        }).filter(Boolean)

        this.disabledDateTimestamps = rawDates.map(d => {
          const dateObj = new Date(d)
          if (isNaN(dateObj.getTime())) {
            console.error(`VueHotelDatepicker: Invalid date string "${d}" in disabledDates prop. It will be ignored for timestamps.`)
            return null
          }
          dateObj.setHours(0, 0, 0, 0)
          return dateObj.getTime()
        }).filter(timestamp => timestamp !== null)

        // 2. Validate current selection against the new disabled dates
        let selectionInvalidated = false

        if (this.selectStartDate) {
          const startDateStr = this.displayDateText(this.selectStartDate)
          // Check if the current selectStartDate is now in the formatted list of disabled dates
          if (this.formattedDisabledDates.includes(startDateStr)) {
            console.warn('VueHotelDatepicker: Current start date became disabled. Resetting selection.')
            this.selectStartDate = undefined
            this.selectEndDate = undefined // If start is invalid, end is too
            selectionInvalidated = true
          }
        }

        if (this.selectEndDate && !selectionInvalidated) { // Only check if start is still valid
          const endDateStr = this.displayDateText(this.selectEndDate)
          // Check if the current selectEndDate is now in the formatted list
          if (this.formattedDisabledDates.includes(endDateStr)) {
            // If the end date becomes disabled, we need to check if the range is still valid.
            // A simple approach is to clear the end date.
            // A more complex one would check if it was a 'selectable-disabled' case,
            // but given the prop changed externally, resetting is safer.
            console.warn('VueHotelDatepicker: Current end date became disabled. Resetting end date.')
            this.selectEndDate = undefined
            selectionInvalidated = true
          }
        }

        // Check for intervening disabled dates in an existing valid selection
        if (this.selectStartDate && this.selectEndDate && !selectionInvalidated) {
          const start = this.selectStartDate.getTime()
          const end = this.selectEndDate.getTime()
          const interveningDisabled = this.disabledDateTimestamps.some(dTimestamp => {
            return dTimestamp > start && dTimestamp < end
          })
          if (interveningDisabled) {
            console.warn('VueHotelDatepicker: Current selection now includes an intervening disabled date. Resetting selection.')
            this.selectStartDate = undefined
            this.selectEndDate = undefined
            selectionInvalidated = true
          }
        }

        if (selectionInvalidated) {
          this.updateValue() // Update the input field display
          this.$emit('selection-invalidated', { start: null, end: null }) // Notify parent
          // The calendar will re-render due to changes in selectStartDate/EndDate
          // and dayStatus will use the new disabled lists.
        }
        // No explicit call to updateCalendar() is strictly necessary here JUST for disabled dates,
        // as the day class re-evaluation handles the visual update of disabled states.
        // If selection was invalidated, changes to selectStartDate/EndDate will also trigger updates.
      }
    }
  },
  created () {
    this.render()
  },
  mounted () {},
  methods: {
    render () {
      // Min/Max Date Initialization
      if (this.minDate) {
        const minDateValue = typeof (this.minDate) === 'string' ? this.minDate : this.minDate.getTime()
        this.selectMinDate = new Date(minDateValue)
        this.selectMinDate.setHours(0, 0, 0, 0)
      }
      if (this.maxDate) {
        const maxDateValue = typeof (this.maxDate) === 'string' ? this.maxDate : this.maxDate.getTime()
        this.selectMaxDate = new Date(maxDateValue)
        this.selectMaxDate.setHours(0, 0, 0, 0)
      }

      let initialStartDate = null
      let initialEndDate = null

      if (this.startDate) {
        const startDateValue = typeof (this.startDate) === 'string' ? this.startDate : this.startDate.getTime()
        initialStartDate = new Date(startDateValue)
        initialStartDate.setHours(0, 0, 0, 0)
        if (this.selectMinDate && this.selectMinDate.getTime() > initialStartDate.getTime()) {
          this.selectMinDate = new Date(initialStartDate.getTime())
        }
      }

      if (this.endDate) {
        const endDateValue = typeof (this.endDate) === 'string' ? this.endDate : this.endDate.getTime()
        initialEndDate = new Date(endDateValue)
        initialEndDate.setHours(0, 0, 0, 0)
      }

      if (initialStartDate && initialEndDate) {
        const start = initialStartDate.getTime()
        const end = initialEndDate.getTime()
        const startStr = this.displayDateText(initialStartDate)
        // const endStr = this.displayDateText(initialEndDate); // Not directly used in the simplified condition

        const startIsDisabledByProp = this.formattedDisabledDates.includes(startStr)
        // const endIsDisabledByProp = this.formattedDisabledDates.includes(endStr); // Not directly used here

        // Check for disabled dates strictly between the initial start and end
        const interveningDisabled = this.disabledDateTimestamps.some(dTimestamp => {
          return dTimestamp > start && dTimestamp < end
        })

        // Valid initial range if:
        // 1. Start date is not disabled by prop.
        // 2. No disabled dates (from prop) are strictly between start and end.
        // (The end date itself being disabled is acceptable for initial load if these conditions are met)
        if (!startIsDisabledByProp && !interveningDisabled) {
          this.selectStartDate = initialStartDate
          this.selectEndDate = initialEndDate
          this.updateValue()
        } else {
          console.warn('Initial startDate/endDate conflicts with disabledDates or creates an invalid range.')
          this.selectStartDate = undefined
          this.selectEndDate = undefined
        }
      } else if (initialStartDate) {
        const startStr = this.displayDateText(initialStartDate)
        if (!this.formattedDisabledDates.includes(startStr)) {
          this.selectStartDate = initialStartDate
          this.updateValue()
        } else {
          console.warn('Initial startDate conflicts with disabledDates.')
          this.selectStartDate = undefined
        }
      }

      this.updateCalendar()
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
      this.updateCalendar()
    },
    confirm () {
      if (this.selectStartDate && this.selectEndDate) {
        const dateResult = {
          start: this.displayDateText(this.selectStartDate),
          end: this.displayDateText(this.selectEndDate)
        }
        this.$emit('confirm', dateResult)
        this.active = false
      } else if (this.selectStartDate && !this.selectEndDate) {
        console.warn('Please select an end date.')
      }
    },

    displayDateText (datetime) {
      if (!datetime) return undefined
      // Ensure datetime is a Date object instance, clone if it is
      const dateObj = datetime instanceof Date ? new Date(datetime.getTime()) : new Date(datetime)

      if (isNaN(dateObj.getTime())) {
        // console.error('displayDateText received an invalid date:', datetime);
        return undefined // Or handle error appropriately
      }

      const yyyy = dateObj.getFullYear()
      const mm = dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0${dateObj.getMonth() + 1}`
      const dd = dateObj.getDate() > 9 ? dateObj.getDate() : `0${dateObj.getDate()}`
      const displayStr = (this.format || 'YYYY/MM/DD').replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
      return displayStr
    },

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
        if (month !== calculateMonth) {
          nextMonth = true
          if (day === 6 || (date === 1 && day === 0)) {
            completed = true
          }
        }
        if (!nextMonth) {
          tempWeekAry[day] = new Date(countTime.getTime())
        } else {
          tempWeekAry[day] = showNextMonthDate ? new Date(countTime.getTime()) : false
        }
        if (countTime.getTime() === baseDateTime.getTime() && day !== 0) {
          let previousDay = day
          let previousCountTime = new Date(countTime.getTime())
          previousCountTime.setDate(previousCountTime.getDate())
          if (showPreviousMonthDate) {
            while (previousDay !== 0) {
              let previousDateTime = new Date(previousCountTime.getTime())
              previousDay = previousDateTime.getDay()
              tempWeekAry[previousDay] = previousDateTime
              previousCountTime.setDate(previousCountTime.getDate() - 1)
            }
          }
        }
        if ((countTime.getTime() === baseDateTime.getTime() && tempWeekAry.length === 7) ||
                (countTime.getTime() > baseDateTime && day === 6)) {
          tempMonthAry.push(tempWeekAry)
          tempWeekAry = []
        }
        countTime.setDate(countTime.getDate() + 1)
      }
      return tempMonthAry
    },

    updateCalendar (offset = 0) {
      if (!this.startMonthDate) {
        this.startMonthDate = this.selectStartDate
          ? new Date(this.selectStartDate.getFullYear(), this.selectStartDate.getMonth())
          : this.selectMinDate
            ? new Date(this.selectMinDate.getFullYear(), this.selectMinDate.getMonth())
            : new Date(new Date().getFullYear(), new Date().getMonth())
      }

      this.startMonthDate.setMonth(this.startMonthDate.getMonth() + offset)
      if (this.selectMinDate && this.selectForward) {
        const minMonth = new Date(this.selectMinDate.getFullYear(), this.selectMinDate.getMonth())
        if (this.startMonthDate.getTime() < minMonth.getTime()) {
          this.startMonthDate = minMonth
        }
      }

      this.endMonthDate = new Date(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth() + 1)
      this.startMonthAry = this.generateCalendar(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth())
      this.endMonthAry = this.generateCalendar(this.endMonthDate.getFullYear(), this.endMonthDate.getMonth())
    },

    updateValue () {
      if (this.selectStartDate && this.selectEndDate) {
        this.value = `${this.displayDateText(this.selectStartDate)} ${this.separator} ${this.displayDateText(this.selectEndDate)}`
      } else if (this.selectStartDate) {
        this.value = `${this.displayDateText(this.selectStartDate)} ${this.separator} `
      } else {
        this.value = ''
      }
    },

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
          const currentMonth = new Date(today.getFullYear(), today.getMonth())
          if (monthDatetime.getTime() <= currentMonth.getTime()) {
            return 'disabled'
          }
        }
      }
      return false
    },

    dayStatus (datetime) {
      let selectableDisabledClassName = 'selectable-disabled'
      if (this.useDiagonalStartEnd) {
        selectableDisabledClassName = 'selectable-disabled-diagonal'
      }
      const classList = []
      if (datetime) {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const time = datetime.getTime() // Timestamp of the current day cell being evaluated
        const display = this.displayDateText(datetime) // Formatted string of the current day cell

        const isBaseDisabled =
            (this.selectMinDate && time < this.selectMinDate.getTime()) ||
            (this.selectMaxDate && time > this.selectMaxDate.getTime())

        // Check if this date is in the disabledDates prop (uses formatted string)
        const isDisabledByProp = this.formattedDisabledDates.includes(display)

        let isGenerallyDisabled = isBaseDisabled // Start with base disablement (min/max date)

        if (time === now.getTime()) {
          classList.push('today')
        }

        // Logic when selecting the second date (end date)
        if (this.selectStartDate && !this.selectEndDate) {
          const startTime = this.selectStartDate.getTime()

          // Check for intervening disabled dates between start and the day cell being evaluated (datetime)
          const minCheck = Math.min(startTime, time)
          const maxCheck = Math.max(startTime, time)

          // Use disabledDateTimestamps for this check
          const interveningDisabledCheck = this.disabledDateTimestamps.some(dTimestamp => {
            return dTimestamp > minCheck && dTimestamp < maxCheck
          })

          const nights = Math.abs(time - startTime) / (1000 * 60 * 60 * 24)
          let violatesNights = false
          if (time !== startTime) {
            if (this.minNight && nights < this.minNight) violatesNights = true
            if (this.maxNight && nights > this.maxNight) violatesNights = true
          }

          if (time !== startTime && (violatesNights || interveningDisabledCheck)) {
            isGenerallyDisabled = true
          }

          // Apply 'selectable-disabled' for dates that are in disabledDates prop but might be selectable as an end date
          if (isDisabledByProp && !isGenerallyDisabled && time > startTime) {
            const potentialStartTime = startTime // This is this.selectStartDate.getTime()
            const potentialEndTime = time // This is datetime.getTime()

            // Check if selecting 'datetime' as an end date would create a range
            // with an intervening disabled date (using timestamps).
            // Exclude 'datetime' itself from this check if it's in disabledDateTimestamps.
            const interveningDisabledOnClick = this.disabledDateTimestamps.some(dTimestamp => {
              if (dTimestamp === potentialEndTime) return false // Don't count the potential end date itself
              return dTimestamp > potentialStartTime && dTimestamp < potentialEndTime
            })

            if (!interveningDisabledOnClick) {
              classList.push(selectableDisabledClassName)
            }
          }
        }

        // Apply Final Disabled/Forbidden Classes
        if (isGenerallyDisabled || (isDisabledByProp && !classList.includes(selectableDisabledClassName))) {
          if (!classList.includes('disabled')) classList.push('disabled')
          if (isDisabledByProp && !classList.includes(selectableDisabledClassName)) {
            if (!classList.includes('forbidden')) classList.push('forbidden')
          }
        }

        // Apply Range Selection Styles
        if (this.selectStartDate && this.selectStartDate.getTime() === time) {
          const disabledIndex = classList.indexOf('disabled')
          if (disabledIndex > -1) classList.splice(disabledIndex, 1)
          const forbiddenIndex = classList.indexOf('forbidden')
          if (forbiddenIndex > -1) classList.splice(forbiddenIndex, 1)
          const selectableIndex = classList.indexOf(selectableDisabledClassName)
          if (selectableIndex > -1) classList.splice(selectableIndex, 1)
          classList.push(this.useDiagonalStartEnd ? 'start-date-diagonal' : 'start-date')
        } else if (this.selectEndDate && this.selectEndDate.getTime() === time) {
          const forbiddenIndex = classList.indexOf('forbidden')
          if (forbiddenIndex > -1) classList.splice(forbiddenIndex, 1)
          classList.push(this.useDiagonalStartEnd ? 'end-date-diagonal' : 'end-date')
        } else if (this.selectStartDate && this.selectEndDate && time > this.selectStartDate.getTime() && time < this.selectEndDate.getTime()) {
          if (!classList.includes('disabled')) {
            classList.push('in-date-range')
          } else {
            console.warn("In-range date has 'disabled' class:", display)
            const disabledIndex = classList.indexOf('disabled')
            if (disabledIndex > -1) classList.splice(disabledIndex, 1)
            classList.push('in-date-range')
          }
        }
      } else {
        classList.push('empty')
      }
      return [...new Set(classList)]
    },

    dayOnClick (datetime) {
      if (!datetime) return

      const clickedTime = datetime.getTime()
      const clickedDateStr = this.displayDateText(datetime)
      // This checks if the *specific clicked day string (in current format)* is in the list of disabled dates (also in current format)
      const isClickedDateItselfDisabledByProp = this.formattedDisabledDates.includes(clickedDateStr)

      if (
        (this.selectMinDate && clickedTime < this.selectMinDate.getTime()) ||
        (this.selectMaxDate && clickedTime > this.selectMaxDate.getTime())
      ) {
        return
      }

      const currentStartDate = this.selectStartDate
      const currentEndDate = this.selectEndDate

      // Scenario 1: Start a new selection
      if (!currentStartDate || (currentStartDate && currentEndDate)) {
        if (isClickedDateItselfDisabledByProp) { // Cannot start selection with a date from disabledDates prop
          return
        }
        this.selectStartDate = datetime
        this.selectEndDate = null
        this.updateValue()
        this.$emit('update', { start: clickedDateStr, end: null })
        return
      }

      // Scenario 2: A start date exists, but no end date (selecting the second date)
      if (currentStartDate && !currentEndDate) {
        const currentStartTime = currentStartDate.getTime()

        if (clickedTime === currentStartTime) {
          return // Clicked start date again, do nothing or allow re-selection of end date
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

        // Check if the chosen start/end points are themselves from disabledDates prop
        const isPotentialStartDisabledByProp = this.formattedDisabledDates.includes(potentialStartDateStr)
        // isPotentialEndDisabledByProp is essentially isClickedDateItselfDisabledByProp if clickedTime > currentStartTime
        // or it refers to the original start date if clickedTime < currentStartTime.
        // const isPotentialEndDisabledByProp = this.formattedDisabledDates.includes(potentialEndDateStr);

        // RULE 1: Potential start date cannot be one from disabledDates prop.
        if (isPotentialStartDisabledByProp) {
          return
        }

        // RULE 2: Check for intervening disabled dates (using timestamps)
        // These are dates from disabledDates prop that fall *strictly between* potentialStart and potentialEnd.
        const interveningDisabled = this.disabledDateTimestamps.some(dTimestamp => {
          return dTimestamp > potentialStartTime && dTimestamp < potentialEndTime
        })

        if (interveningDisabled) {
          this.$emit('error', 'Range includes a disabled date.')
          return
        }

        // RULE 3: Check Min/Max Nights
        const nights = Math.abs(potentialEndTime - potentialStartTime) / (1000 * 60 * 60 * 24)
        if (this.minNight && nights < this.minNight) {
          this.$emit('error', `Minimum stay is ${this.minNight} nights.`)
          return
        }
        if (this.maxNight && nights > this.maxNight) {
          this.$emit('error', `Maximum stay is ${this.maxNight} nights.`)
          return
        }

        // Validation passed, commit selection
        // The clicked date (potentialEndDate if clickedTime > currentStartTime, or potentialStartDate if clickedTime < currentStartTime)
        // might be from disabledDates prop. This is allowed if it had 'selectable-disabled' class.
        // The rules above (especially interveningDisabled) ensure the range itself is valid.
        this.selectStartDate = potentialStartDate
        this.selectEndDate = potentialEndDate

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
              // background-color: #ffe7e7;
              border: 1px dashed #e57373;
              color: #a94442;
              cursor: pointer;
            }
            &.selectable-disabled-diagonal {
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
