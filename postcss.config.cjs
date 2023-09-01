const autoScales = require('./postcss/auto-scales.cjs')

module.exports = {
  plugins: [
    autoScales({
      fontSizeMod: 1,
      dodgeSelectors: [
        { type: 'startsWith', value: '.swiper' },
        { type: 'startsWith', value: '.carousel' },
        { type: 'startsWith', value: '.title' },
        { type: 'startsWith', value: '.page-viewer' },
        { type: 'startsWith', value: '.building-summary__status' },
        { type: 'startsWith', value: '.building-summary__content' },
        { type: 'includes', value: 'fancybox' },
        { type: 'includes', value: 'aos' },
      ],
      initWidth: [
        { width: 1680 },
        { width: 1440, mediaQuery: 'only screen and (max-width: 1600px)' },
      ],
      limitMediaWidth: false
    }),
  ],
}
