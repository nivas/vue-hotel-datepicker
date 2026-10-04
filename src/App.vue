<template>
  <div id="app">
    <h1>Vue Hotel Datepicker</h1>
    <h2>A Vue 3 date range picker for hotel and more.</h2>
    <div>
      <a href="https://github.com/nivas/vue-hotel-datepicker" target="_blank" rel="noopener" title="View on Github" class="app-link">View on Github</a>
      <a href="https://www.npmjs.com/package/@nivashr/vue-hotel-datepicker" target="_blank" rel="noopener" title="View on npm" class="app-link">View on npm</a>
      <a href="https://github.com/nivas/vue-hotel-datepicker/issues" target="_blank" rel="noopener" title="Report issue" class="app-link">Report issue</a>
    </div>
    <hr>
    <Demo />
    <DemoModal />
    <div class="text-center">
      <img alt="Vue logo" src="@/assets/vue-logo.png">
      <div>
        &copy; <a href="https://nivas.hr" target="_blank" rel="noopener" title="copyright" class="app-link">Nivas</a>
        &mdash; based on vue-hotel-datepicker by <a href="https://github.com/northwalker" target="_blank" rel="noopener" title="original author" class="app-link">Northwalker</a> (MIT)
      </div>
    </div>
  </div>
</template>

<script>
import Demo from './views/Demo.vue'
import DemoModal from './views/DemoModal.vue'

export default {
  name: 'app',
  components: {
    Demo,
    DemoModal
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
@use 'sass:color';
* {
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  padding: 60px;
}
a.app-link {
  margin-right: 16px;
  font-weight: 500;
  color: #0088ff;
  text-decoration: none;
  transition: color .4s ease;
  @media (hover: hover) {
    &:hover {
      color: color.adjust(#0088ff, $lightness: -20%)
    }
  }
}
.text-center {
  text-align: center;
}
</style>
