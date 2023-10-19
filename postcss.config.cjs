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
        { type: 'startsWith', value: '.article__list' },
        { type: 'startsWith', value: '.building-summary__content' },
        { type: 'includes', value: '.lead-section__mobile' },
        { type: 'includes', value: '.button-switch' },
        { type: 'includes', value: '.quick-filter_border-left' },
        { type: 'includes', value: '.quick-filter_border-right' },
        { type: 'startsWith', value: '.button_social' },
        { type: 'startsWith', value: '.project-list' },
        { type: 'includes', value: 'fancybox' },
        { type: 'includes', value: 'aos' },
      ],
      initWidth: [
        { width: 1680 },
        { width: 375, mediaQuery: 'only screen and (max-width: 900px)' },
        { width: 800, mediaQuery: 'only screen and (max-width: 1200px)' },
        { width: 1200, mediaQuery: 'only screen and (max-width: 1440px)' },
        { width: 1440, mediaQuery: 'only screen and (max-width: 1600px)' },
      ],
      limitMediaWidth: false,
    }),
  ],
}
