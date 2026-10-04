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
    <footer class="app-footer">
      <a href="https://www.nivas.hr" target="_blank" rel="noopener" title="NIVAS - The Digital Agency" class="app-footer-brand">
        <img alt="NIVAS" src="@/assets/nivas-brand.png" width="153" height="41">
      </a>
      <p>
        Made and maintained by <a href="https://www.nivas.hr" target="_blank" rel="noopener">NIVAS</a>, the digital agency
        behind the booking sites this datepicker runs on.
      </p>
      <p class="app-footer-built">
        <img alt="Vue logo" src="@/assets/vue-logo.png" width="24" height="24"> Built with Vue 3
      </p>
      <p class="app-footer-credit">
        &copy; <a href="https://www.nivas.hr" target="_blank" rel="noopener">NIVAS</a> &mdash;
        based on vue-hotel-datepicker by <a href="https://github.com/northwalker" target="_blank" rel="noopener">Northwalker</a> (MIT)
      </p>
    </footer>
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
.app-footer {
  padding: 48px 24px 32px;
  border-radius: 12px;
  text-align: center;
  color: rgba(255, 255, 255, .8);
  background: linear-gradient(135deg, #1c042a, #3f0063);
  p {
    margin: 0 0 12px;
  }
  a {
    color: #0fc5d0;
    text-decoration: none;
    @media (hover: hover) {
      &:hover {
        color: #ffffff;
      }
    }
  }
  &-brand {
    display: inline-block;
    margin-bottom: 24px;
    img {
      display: block;
    }
  }
  &-built {
    img {
      margin-right: 4px;
      vertical-align: middle;
    }
  }
  &-credit {
    margin-top: 24px;
    font-size: 13px;
    color: rgba(255, 255, 255, .55);
  }
}
</style>
