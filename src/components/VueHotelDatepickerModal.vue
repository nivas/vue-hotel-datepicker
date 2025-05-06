<template>
  <div v-if="active" class="date-range-picker-modal" @click="handleOverlayClick">
    <div class="date-range-picker-modal-wrapper">
      <div class="date-range-picker-modal-container" @click.stop>
        <div class="date-range-picker-modal-header">
          <a class="close" @click="handleCancel">
            <IconClose />
          </a>
          <!-- Optional: Title or further info can go here -->
        </div>
        <div class="date-range-picker">
          <!-- Adopting vhd-calendar structure for easier style management if desired,
               or keep current .calendar-container and adapt styles below -->
          <div class="calendar-container">
            <div class="vhd-calendar-left"> <!-- Renamed from .left for consistency with new logic if preferred -->
              <div class="calendar-month"> <!-- Was .calendar-month.start -->
                <a :class="disabledPreviousArrow(startMonthDate)" class="previous-arrow offset-2" @click="updateCalendar(-2)">
                  <IconArrowBack class="arrow" />
                </a>
                <a :class="disabledPreviousArrow(startMonthDate)" class="previous-arrow offset-1" @click="updateCalendar(-1)">
                  <IconArrowBack class="arrow"/>
                </a>
                <div class="calendar-month-title"> <!-- Was .display-month -->
                  {{ monthList[startMonthDate.getMonth()] }} {{ startMonthDate.getFullYear() }}
                </div>
                <a class="next-arrow offset-1" @click="updateCalendar(1)">
                  <IconArrowForward class="arrow" />
                </a>
              </div>
              <div class="calendar-week">
                <div v-for="(wItem, index) in weekList" :key="index" class="calendar-week-item"> <!-- Was .week-date -->
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
            <div class="vhd-calendar-right"> <!-- Renamed from .right -->
              <div class="calendar-month"> <!-- Was .calendar-month.end -->
                <a class="next-arrow" @click="updateCalendar(2)">
                  <IconArrowForward class="arrow" />
                </a>
                <div class="calendar-month-title"> <!-- Was .display-month -->
                  {{ monthList[endMonthDate.getMonth()] }} {{ endMonthDate.getFullYear() }}
                </div>
              </div>
              <div class="calendar-week">
                <div v-for="(wItem, index) in weekList" :key="index" class="calendar-week-item"> <!-- Was .week-date -->
                  {{ wItem }}
                </div>
              </div>
              <div class="calendar-date">
                <div v-for="(week, wIndex) in endMonthAry" :key="wIndex" class="week">
                  <div v-for="(endDay, dIndex) in week"
                       :key="dIndex"
                       :class="dayStatus(endDay)"
                       class="day"
                       @click="dayOnClick(endDay)">
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
            <div class="bottom"> <!-- Modal's footer area -->
              <div class="panel">
                <div class="info">
                  <div v-if="selectStartDate" class="from">
                    <div class="text">{{ fromText }}</div>
                    <div :class="{'selected': selectStartDate}" class="date">
                      {{ displayDateText(selectStartDate) }}
                    </div>
                  </div>
                  <div v-if="selectStartDate && selectEndDate" class="from-to-arrow">
                    {{ separator }}
                  </div>
                  <div v-if="selectEndDate" class="to">
                    <div class="text">{{ toText }}</div>
                    <div :class="{'selected': selectEndDate}" class="date">
                      {{ displayDateText(selectEndDate) }}
                    </div>
                  </div>
                </div>
                <div class="ctrl">
                  <a v-if="selectStartDate || selectEndDate" class="reset" @click="handleReset">{{ resetText }}</a>
                  <a class="cancel" @click="handleCancel">{{ cancelText }}</a>
                  <a :class="{disabled: !(selectStartDate && selectEndDate)}" class="apply" @click="handleApply">{{ applyText }}</a>
                </div>
              </div>
            </div>
          </div>
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
  name: 'VueHotelDatepickerModal', // Changed name slightly for clarity if used alongside non-modal
  components: {
    IconClose,
    IconArrowBack,
    IconArrowForward
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    // Initial selected dates
    start: {
      type: [String, Date],
      default: undefined
    },
    end: {
      type: [String, Date],
      default: undefined
    },
    // Configuration props from non-modal
    separator: {
      type: String,
      default: '~'
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD'
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
    // Text props
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
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    applyText: {
      type: String,
      default: 'Apply'
    },
    // Visual/behavioral props
    mobile: { // For potential future styling, not directly used in this modal's base structure
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    useDiagonalStartEnd: {
      type: Boolean,
      default: false
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      startMonthDate: undefined,
      endMonthDate: undefined,
      selectStartDate: undefined,
      selectEndDate: undefined,
      selectMinDate: undefined,
      selectMaxDate: undefined,
      startMonthAry: [],
      endMonthAry: [],
      formattedDisabledDates: []
    }
  },
  watch: {
    active (isActive) {
      if (isActive) {
        this.render()
        // Optionally, add body scroll lock here
      } else {
        // Optionally, remove body scroll lock here
      }
    },
    // Watchers for dynamic prop changes that should trigger a re-render
    start () { if (this.active) this.render() },
    end () { if (this.active) this.render() },
    minDate () { if (this.active) this.render() },
    maxDate () { if (this.active) this.render() },
    disabledDates: {
      immediate: true,
      handler (newVal, oldVal) {
        this.formattedDisabledDates = (newVal || []).map(d => this.displayDateText(new Date(d)))
        if (this.active && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.updateCalendar() // Re-generate calendar arrays and update view
        }
      }
    }
  },
  created () {
    // Initial render if component is created with active=true
    if (this.active) {
      this.render()
    }
  },
  methods: {
    handleOverlayClick () {
      if (this.closeOnOverlayClick) {
        this.handleCancel()
      }
    },
    render () {
      // Min/Max Date Initialization from props
      if (this.minDate) {
        const minDateValue = typeof (this.minDate) === 'string' ? this.minDate : new Date(this.minDate).getTime()
        this.selectMinDate = new Date(minDateValue)
        this.selectMinDate.setHours(0, 0, 0, 0)
      } else {
        this.selectMinDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
      }

      if (this.maxDate) {
        const maxDateValue = typeof (this.maxDate) === 'string' ? this.maxDate : new Date(this.maxDate).getTime()
        this.selectMaxDate = new Date(maxDateValue)
        this.selectMaxDate.setHours(0, 0, 0, 0)
      } else {
        this.selectMaxDate = null
      }

      // Initial Start/End Date Initialization
      let initialStartDate = null
      let initialEndDate = null

      if (this.start) {
        const startDateValue = typeof (this.start) === 'string' ? this.start : new Date(this.start).getTime()
        initialStartDate = new Date(startDateValue)
        initialStartDate.setHours(0, 0, 0, 0)
      }

      if (this.end) {
        const endDateValue = typeof (this.end) === 'string' ? this.end : new Date(this.end).getTime()
        initialEndDate = new Date(endDateValue)
        initialEndDate.setHours(0, 0, 0, 0)
      } else if (initialStartDate && !this.end && !this.minNight && !this.maxNight) { // if only start is provided, and no night restrictions
        // Default end date if only start date is provided (e.g., 1 night) - This was removed in new logic, let user click
      }

      // Reset current selections before applying initial ones
      this.selectStartDate = undefined
      this.selectEndDate = undefined

      // Validate and Set Initial Range
      if (initialStartDate && initialEndDate) {
        const startTs = initialStartDate.getTime()
        const endTs = initialEndDate.getTime()
        const startStr = this.displayDateText(initialStartDate)
        const endStr = this.displayDateText(initialEndDate)

        const startIsDisabledByProp = this.formattedDisabledDates.includes(startStr)
        const endIsDisabledByProp = this.formattedDisabledDates.includes(endStr)

        const interveningDisabled = this.formattedDisabledDates.some(disabledStr => {
          const dTime = new Date(disabledStr).getTime()
          return dTime > startTs && dTime < endTs
        })

        const validAgainstMinMax =
            !(this.selectMinDate && startTs < this.selectMinDate.getTime()) &&
            !(this.selectMaxDate && endTs > this.selectMaxDate.getTime())

        if (validAgainstMinMax && !startIsDisabledByProp && !interveningDisabled && (!endIsDisabledByProp || (endIsDisabledByProp && !this.formattedDisabledDates.some(dStr => { const dTime = new Date(dStr).getTime(); return dTime > startTs && dTime < endTs })))) {
          this.selectStartDate = initialStartDate
          this.selectEndDate = initialEndDate
        } else {
          console.warn('[VHD Modal] Initial start/end props conflict with disabledDates, min/max dates, or create an invalid range.')
        }
      } else if (initialStartDate) {
        const startStr = this.displayDateText(initialStartDate)
        const validAgainstMinMax =
            !(this.selectMinDate && initialStartDate.getTime() < this.selectMinDate.getTime()) &&
            !(this.selectMaxDate && initialStartDate.getTime() > this.selectMaxDate.getTime())

        if (validAgainstMinMax && !this.formattedDisabledDates.includes(startStr)) {
          this.selectStartDate = initialStartDate
        } else {
          console.warn('[VHD Modal] Initial start prop conflicts with disabledDates or min/max dates.')
        }
      }
      this.updateCalendar()
    },

    handleApply () {
      if (this.selectStartDate && this.selectEndDate) {
        const dateResult = {
          start: this.selectStartDate, // Emit actual Date objects or formatted strings
          end: this.selectEndDate,
          startFormatted: this.displayDateText(this.selectStartDate),
          endFormatted: this.displayDateText(this.selectEndDate)
        }
        this.$emit('apply', dateResult)
        // this.$emit('update:active', false); // Or let parent control 'active'
      } else {
        // Optionally show a message if trying to apply without a full selection
        console.warn('[VHD Modal] Apply clicked without a complete date range selected.')
        this.$emit('error', 'Please select a valid start and end date.')
      }
    },
    handleCancel () {
      this.$emit('cancel')
      // this.$emit('update:active', false); // Or let parent control 'active'
      // Optionally, reset selection on cancel:
      // this.handleReset();
    },
    handleReset () {
      this.selectStartDate = undefined
      this.selectEndDate = undefined
      this.$emit('reset-selection')
      this.updateCalendar() // Re-render calendar
    },

    displayDateText (datetime) {
      if (!datetime) return undefined
      const d = typeof (datetime) === 'string' ? new Date(datetime) : new Date(datetime.getTime())
      const yyyy = d.getFullYear()
      const mm = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`
      const dd = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`
      return (this.format || 'YYYY/MM/DD').replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
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
        // let date = countTime.getDate() // Not used
        let month = countTime.getMonth()
        if (month !== calculateMonth) {
          nextMonth = true
          if (day === 6 || (/* date === 1 && */ day === 0)) { // date === 1 check is redundant if month !== calculateMonth
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
          let previousCountTimeInstance = new Date(countTime.getTime()) // Use a new instance
          // previousCountTimeInstance.setDate(previousCountTimeInstance.getDate()) // No effect
          if (showPreviousMonthDate) {
            while (previousDay !== 0) {
              previousCountTimeInstance.setDate(previousCountTimeInstance.getDate() - 1) // Decrement first
              previousDay = previousCountTimeInstance.getDay() // Get day of new date
              tempWeekAry[previousDay] = new Date(previousCountTimeInstance.getTime())
            }
          }
        }
        if ((countTime.getTime() === baseDateTime.getTime() && tempWeekAry.length === 7) ||
                (countTime.getTime() > baseDateTime.getTime() && day === 6)) {
          tempMonthAry.push([...tempWeekAry]) // Push a copy
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

      this.startMonthDate = new Date(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth() + offset, 1)

      if (this.selectMinDate && this.selectForward) {
        const minMonth = new Date(this.selectMinDate.getFullYear(), this.selectMinDate.getMonth())
        if (this.startMonthDate.getTime() < minMonth.getTime()) {
          this.startMonthDate = minMonth
        }
      }

      this.endMonthDate = new Date(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth() + 1, 1)

      this.startMonthAry = this.generateCalendar(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth())
      this.endMonthAry = this.generateCalendar(this.endMonthDate.getFullYear(), this.endMonthDate.getMonth())
    },

    disabledPreviousArrow (monthDatetime) {
      // const now = new Date() // Not strictly needed if selectMinDate is the reference
      // const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      if (monthDatetime && this.selectForward) { // monthDatetime is startMonthDate
        if (this.selectMinDate) {
          // Compare year and month only
          const currentDisplayMonth = new Date(monthDatetime.getFullYear(), monthDatetime.getMonth(), 1)
          const minSelectableMonth = new Date(this.selectMinDate.getFullYear(), this.selectMinDate.getMonth(), 1)
          if (currentDisplayMonth.getTime() <= minSelectableMonth.getTime()) {
            return 'disabled'
          }
        } else {
          const todayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          if (monthDatetime.getTime() <= todayMonth.getTime()) {
            return 'disabled'
          }
        }
      }
      return false
    },

    dayStatus (datetime) {
      let selectableDisabledClassName = this.useDiagonalStartEnd ? 'selectable-disabled-diagonal' : 'selectable-disabled'
      const classList = []
      if (datetime) {
        const now = new Date(); now.setHours(0, 0, 0, 0)
        const time = datetime.getTime()
        const display = this.displayDateText(datetime)

        const isBaseDisabled =
            (this.selectMinDate && time < this.selectMinDate.getTime()) ||
            (this.selectMaxDate && time > this.selectMaxDate.getTime())
        const isDisabledByProp = this.formattedDisabledDates.includes(display)
        let isGenerallyDisabled = isBaseDisabled

        if (time === now.getTime()) classList.push('today')

        if (this.selectStartDate && !this.selectEndDate) {
          const startTime = this.selectStartDate.getTime()
          const minCheck = Math.min(startTime, time)
          const maxCheck = Math.max(startTime, time)
          const interveningDisabledCheck = this.formattedDisabledDates.some(dStr => {
            const dTime = new Date(dStr).getTime()
            return dTime > minCheck && dTime < maxCheck
          })
          let violatesNights = false
          if (time !== startTime) {
            const nights = Math.abs(time - startTime) / (1000 * 60 * 60 * 24)
            if (this.minNight && nights < this.minNight) violatesNights = true
            if (this.maxNight && nights > this.maxNight) violatesNights = true
          }
          if (time !== startTime && (violatesNights || interveningDisabledCheck)) {
            isGenerallyDisabled = true
          }
          if (isDisabledByProp && !isGenerallyDisabled && time > startTime) {
            const potentialStartTime = startTime
            const potentialEndTime = time
            const interveningDisabledOnClick = this.formattedDisabledDates.some(dStr => {
              if (dStr === display) return false
              const dTime = new Date(dStr).getTime()
              return dTime > potentialStartTime && dTime < potentialEndTime
            })
            if (!interveningDisabledOnClick) classList.push(selectableDisabledClassName)
          }
        }

        if (isGenerallyDisabled || (isDisabledByProp && !classList.includes(selectableDisabledClassName))) {
          if (!classList.includes('disabled')) classList.push('disabled')
          if (isDisabledByProp && !classList.includes(selectableDisabledClassName)) {
            if (!classList.includes('forbidden')) classList.push('forbidden')
          }
        }

        if (this.selectStartDate && this.selectStartDate.getTime() === time) {
          ['disabled', 'forbidden', selectableDisabledClassName].forEach(cls => {
            const index = classList.indexOf(cls)
            if (index > -1) classList.splice(index, 1)
          })
          classList.push(this.useDiagonalStartEnd ? 'start-date-diagonal' : 'start-date')
        } else if (this.selectEndDate && this.selectEndDate.getTime() === time) {
          const forbiddenIndex = classList.indexOf('forbidden')
          if (forbiddenIndex > -1) classList.splice(forbiddenIndex, 1)
          classList.push(this.useDiagonalStartEnd ? 'end-date-diagonal' : 'end-date')
        } else if (this.selectStartDate && this.selectEndDate && time > this.selectStartDate.getTime() && time < this.selectEndDate.getTime()) {
          if (!classList.includes('disabled')) {
            classList.push('in-date-range')
          } else {
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
      const isClickedDateDisabledByProp = this.formattedDisabledDates.includes(clickedDateStr)

      // Check against min/max date overall
      if (
        (this.selectMinDate && clickedTime < this.selectMinDate.getTime()) ||
        (this.selectMaxDate && clickedTime > this.selectMaxDate.getTime())
      ) {
        return
      }

      const currentStartDate = this.selectStartDate
      const currentEndDate = this.selectEndDate

      if (!currentStartDate || (currentStartDate && currentEndDate)) { // Scenario 1: Start new selection or reset
        if (isClickedDateDisabledByProp) return // Cannot start on a prop-disabled date
        this.selectStartDate = datetime
        this.selectEndDate = null
        this.$emit('update-selection', { start: this.selectStartDate, end: null })
        return
      }

      // Scenario 2: Start date exists, no end date (selecting second date)
      if (currentStartDate && !currentEndDate) {
        const currentStartTime = currentStartDate.getTime()
        if (clickedTime === currentStartTime) return // Clicked start date again

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
        // const potentialStartDateStr = this.displayDateText(potentialStartDate)
        // const potentialEndDateStr = this.displayDateText(potentialEndDate) // not used with current rules

        // RULE 1: Potential start date cannot be prop-disabled.
        // (If clickedTime < currentStartTime, potentialStartDate is the clicked date)
        if (clickedTime < currentStartTime && isClickedDateDisabledByProp) return

        // RULE 2: Check for intervening disabled dates.
        // An end date can be a disabled date itself if it's selectable-disabled
        const interveningDisabled = this.formattedDisabledDates.some(disabledStr => {
          // If the potential end date is disabled by prop, don't count it as intervening IF it's the one being clicked
          if (this.displayDateText(potentialEndDate) === disabledStr && potentialEndDate.getTime() === clickedTime) {
            return false
          }
          const dTime = new Date(disabledStr).getTime()
          return dTime > potentialStartTime && dTime < potentialEndTime
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

        this.selectStartDate = potentialStartDate
        this.selectEndDate = potentialEndDate
        this.$emit('update-selection', { start: this.selectStartDate, end: this.selectEndDate })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Keep existing modal styles
@keyframes fade-modal {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
* { box-sizing: border-box; }

.date-range-picker-modal {
  animation: fade-modal 0.2s 0s 1 ease-in;
  position: fixed;
  z-index: 90;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .85);
  display: table;
  &-wrapper {
    z-index: 1;
    display: table-cell;
    vertical-align: middle;
  }
  &-container {
    width: 648px; // Default desktop width
    max-height: 90%;
    margin: 0 auto;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.27);
    overflow-y: auto; // For very tall content on small screens
  }
  &-header {
    height: 48px;
    width: 100%;
    position: relative;
    // display: none; // default from old, let's make it always visible
    border-bottom: 1px solid #eee;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end; // Puts close button to the right
    .close {
      font-size: 24px;
      color: #9b9b9b;
      cursor: pointer;
      line-height: 1; // Prevents extra space
      padding: 5px; // Easier to click
      svg { fill: #9b9b9b; }
      &:hover svg { fill: darken(#9b9b9b, 20%); }
    }
  }
}

.date-range-picker { // Main content area within modal container
  padding: 0px 24px 24px 24px; // Padding for the calendar content
}

// Calendar structure styles (can be vhd- specific or current modal's)
// Using current modal structure, adapting new styles to it
.calendar-container{
  position: relative;
  width: 100%; // Takes width from parent
  text-align: left;
  background-color: #ffffff;
  user-select: none;
}

// .vhd-calendar-left, .vhd-calendar-right or .left, .right
.vhd-calendar-left,
.vhd-calendar-right {
  display: inline-block;
  vertical-align: top;
  width: 280px; // From non-modal
}
.vhd-calendar-left {
  margin-right: 40px; // From non-modal
}
.vhd-calendar-right {
  // styles if any specific to right
}

.calendar-month {
  position: relative;
  height: 32px;
  margin-bottom: 16px; // Modal's original
  .next-arrow,
  .previous-arrow {
    position: absolute; // Added for explicit positioning
    top: 50%;
    transform: translateY(-50%);
    width: 24px; // Consistent size
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    svg { width: 20px; height: 20px; fill: #7d7d7d; }
    &:hover svg { fill: darken(#7d7d7d, 20%); }
    &.disabled {
      // display: none !important; // From non-modal, or use opacity
      opacity: 0.3;
      pointer-events: none;
    }
  }
  .previous-arrow { left: 0; }
  .next-arrow { right: 0; }

  // Specific offsets for mobile/single calendar view if needed
  .previous-arrow.offset-1, .next-arrow.offset-1 { /* display: none; by default */ }

  .calendar-month-title { // Was .display-month
    margin: 0; // Reset margin if any
    padding: 0 30px; // Space for arrows
    font-size: 20px;
    font-weight: 500;
    line-height: 32px; // Match height
    text-align: center;
    color: #505050;
  }
}
.calendar-week {
  width: 100%;
  height: 32px;
  display: flex; // Use flex for easy distribution
  .calendar-week-item { // Was .week-date
    flex: 1; // Distribute space equally
    font-size: 12px;
    font-weight: 500;
    color: #7d7d7d;
    text-align: center;
    line-height: 32px; // Vertically center
  }
}
.calendar-date {
  min-height: 240px; // 6 rows * 40px
  .week {
    display: flex; // Use flex for day distribution
    width: 100%;
    height: 40px;
    .day {
      flex: 1; // Distribute space equally, ensures 7 days fit
      min-width: 40px; // Maintain minimum size
      height: 40px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500; // Non-modal used 500, modal used 700. Adjust as preferred.
      color: #505050; // Default day color
      background-color: transparent;
      text-align: center;
      cursor: pointer;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
      outline: none; // remove focus outline if any

      // Base ::before and ::after from non-modal for start/end date indicators
      &::before, &::after {
        content: '';
        position: absolute;
        width: 0px;
        height: 100%;
        top: 0; // Ensure alignment
        background-color: transparent;
        opacity: 0;
        transition: opacity .4s cubic-bezier(0.165, 0.84, 0.44, 1),
                    background-color .4s cubic-bezier(0.165, 0.84, 0.44, 1),
                    width .4s cubic-bezier(0.165, 0.84, 0.44, 1);
      }
      &::before { left: 0; }
      &::after { left: auto; right: 0; }

      // Empty day cells (e.g. from previous/next month if not shown)
      &.empty {
        pointer-events: none;
        background-color: transparent !important; // Ensure no hover effects
        span { display: none; }
      }

      // Disabled state
      &.disabled {
        color: #ececec !important; // Higher specificity
        pointer-events: none !important;
        background-color: transparent !important;
        &.forbidden { // If it's disabled AND forbidden
            color: #fed9d8 !important; // Specific color for forbidden-disabled
        }
      }
      // Forbidden by prop (but not otherwise disabled by min/max/nights)
      &.forbidden:not(.disabled) { // Only if not already .disabled
        color: #fed9d8; // Light red text
        // background-color: #fff0f0; // Very light pink background
        cursor: not-allowed;
        // pointer-events: none; // If truly unclickable
      }

      // Selectable disabled (e.g. end date is a disabled day)
      &.selectable-disabled {
        border: 1px dashed #e57373;
        color: #a94442; // Darker red text
        background-color: #ffe7e7; // Light pink background
        cursor: pointer; // Still clickable
      }
      &.selectable-disabled-diagonal {
        position: relative;
        overflow: hidden;
        border: 1px dashed #e57373;
        cursor: pointer;
        &::before, &::after { // Re-purpose for diagonal background
          content: ''; position: absolute; width: 100%; height: 100%;
          top: 0; left: 0; opacity: 1; z-index: 0; transition: none;
        }
        &::before { background-color: #ffe7e7; clip-path: polygon(100% 0, 100% 100%, 0 0); } // Top-right half pink
        &::after { background-color: #ffffff; clip-path: polygon(0 100%, 0 0, 100% 100%); } // Bottom-left half white
        span { position: relative; z-index: 1; color: #a94442; }
      }

      // Today state
      &.today {
        border: 1px solid #0088ff;
        // If it's also selected, border might be covered by background.
        // Consider box-shadow or outline if border needs to be more prominent.
      }

      // In Range state
      &.in-date-range {
        background-color: #B2D7FF; // Light blue
        color: #0056b3; // Darker blue text for contrast
        border-radius: 0; // Square fill
      }

      // Start Date state
      &.start-date {
        background-color: #0088FF; // Primary blue
        color: #ffffff;
        border-radius: 4px 0 0 4px; // Rounded left corners
        &::before { // Vertical bar indicator from non-modal
          width: 4px; background-color: darken(#0088FF, 10%); opacity: 1;
        }
      }
      &.start-date-diagonal {
        position: relative; overflow: hidden; color: #505050; // Default text color
        &::before, &::after {
          content: ''; position: absolute; width: 100%; height: 100%;
          top: 0; left: 0; opacity: 1; z-index: 0; transition: none;
        }
        &::before { background-color: #ffffff; clip-path: polygon(0 0, 100% 0, 0 100%); } // Top-left white
        &::after { background-color: #B2D7FF; clip-path: polygon(100% 100%, 0 100%, 100% 0); } // Bottom-right light blue
        span { position: relative; z-index: 1; }
         // If start-date-diagonal is also today
        &.today { border-color: transparent; /* Hide border if diagonal bg is used */ }

      }

      // End Date state
      &.end-date {
        background-color: #0088FF; // Primary blue
        color: #ffffff;
        border-radius: 0 4px 4px 0; // Rounded right corners
        &::after { // Vertical bar indicator
          width: 4px; background-color: darken(#0088FF, 10%); opacity: 1;
        }
      }
      &.end-date-diagonal {
        position: relative; overflow: hidden; color: #505050;
        &::before, &::after {
          content: ''; position: absolute; width: 100%; height: 100%;
          top: 0; left: 0; opacity: 1; z-index: 0; transition: none;
        }
        &::before { background-color: #ffffff; clip-path: polygon(100% 0, 100% 100%, 0 0); } // Top-right white
        &::after { background-color: #B2D7FF; clip-path: polygon(0 100%, 0 0, 100% 100%); } // Bottom-left light blue
        span { position: relative; z-index: 1; }
        &.today { border-color: transparent; }
      }

      // When start and end date are the same day (single day selection)
      &.start-date.end-date:not(.start-date-diagonal):not(.end-date-diagonal) {
        border-radius: 4px; // Fully rounded
      }

      // Hover effect for clickable non-disabled days
      &:not(.disabled):not(.in-date-range):not(.start-date):not(.end-date):not(.start-date-diagonal):not(.end-date-diagonal):not(.selectable-disabled):not(.selectable-disabled-diagonal):hover {
        background-color: #e9ecef; // Light grey hover
      }
    }
  }
}

// Message area (from non-modal)
.vhd-calendar-message {
  padding: 8px;
  text-align: center;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 16px; // Space above footer
}

.bottom { // Modal's footer area
  display: block;
  width: 100%;
  min-height: 48px;
  padding-top: 16px; // Space from calendar
  border-top: 1px solid #eee;
  margin-top: 16px;
  .panel {
    position: relative;
    min-height: 48px;
    display: flex; // Use flex for layout
    justify-content: space-between; // Pushes info left, ctrl right
    align-items: center; // Vertically align items
    .info {
      display: flex; // Arrange from/to horizontally
      align-items: center;
      .from, .to {
        .text {
          margin-bottom: 4px; // Smaller gap
          font-size: 10px; // Smaller text
          line-height: 1;
          font-weight: 500;
          color: #7d7d7d;
          text-transform: uppercase;
        }
        .date {
          line-height: 1;
          font-size: 14px; // Slightly smaller date
          font-weight: 700;
          color: #9b9b9b;
          &.selected { color: #505050; }
        }
      }
      .from-to-arrow {
        margin: 0 12px; // Space around separator
        padding-top: 10px; // Align with date text
        color: #7d7d7d;
        font-size: 14px;
      }
    }
    .ctrl {
      display: flex; // Arrange buttons horizontally
      align-items: center;
      > a {
        font-size: 14px; // Slightly smaller buttons
        font-weight: 700;
        line-height: 1.63;
        cursor: pointer;
        padding: 6px 12px; // Add some padding
        border-radius: 4px;
        margin-left: 8px; // Space between buttons
        text-decoration: none;
        transition: background-color 0.2s ease, color 0.2s ease;

        &.reset {
          color: #7d7d7d;
          &:hover { background-color: #f0f0f0; }
        }
        &.cancel {
          color: #9b9b9b;
          &:hover { background-color: #f0f0f0; }
        }
        &.apply {
          color: #ffffff;
          background-color: #0088FF;
          &:hover { background-color: darken(#0088FF, 10%); }
          &.disabled {
            background-color: #cccccc;
            color: #666666;
            cursor: not-allowed;
            pointer-events: none;
          }
        }
      }
    }
  }
}

// Mobile responsiveness (adapt from modal's original and non-modal's hints)
@media only screen and (max-width: 767.98px) {
  .date-range-picker-modal {
    &-container {
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      box-shadow: none;
    }
    &-header {
      // display: block; // Already visible
    }
  }

  .date-range-picker {
     padding: 0px 16px 16px 16px; // Reduce padding on mobile
  }

  .vhd-calendar-left {
    width: 100%;
    margin-right: 0;
  }
  .vhd-calendar-right {
    display: none; // Hide right calendar on mobile
  }

  .calendar-month {
    .previous-arrow.offset-2, .next-arrow.offset-2 /* if exists */ { display: none; }
    .previous-arrow.offset-1, .next-arrow.offset-1 { display: flex; /* Make sure they are visible */ }
  }

  .calendar-date .week .day {
    // width: calc(100% / 7); // Already handled by flex:1
    font-size: 14px; // Slightly smaller day numbers on mobile
    // Mobile specific start/end date styles if different from desktop
    &.start-date, &.end-date {
      // Non-modal had specific border/color changes for mobile, here we rely on desktop's radius
      // color: #ffffff;
      // background-color: #0088FF; // Already set
    }
  }

  .bottom .panel {
    flex-direction: column; // Stack info and ctrl vertically
    .info {
      margin-bottom: 16px; // Space between info and controls
      justify-content: center; // Center the date info
      width: 100%;
    }
    .ctrl {
      width: 100%;
      justify-content: flex-end; // Align buttons to the right
      > a { margin-left: 8px; &:first-child {margin-left: 0;} }
      .reset { order: 1; } // Optional: reorder buttons on mobile
      .cancel { order: 2; }
      .apply { order: 3; }
    }
  }
}
</style>
