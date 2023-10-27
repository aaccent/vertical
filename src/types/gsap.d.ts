/// <reference path="../../node_modules/gsap/types/index.d.ts" />
/// <reference path="./gsap-filters.d.ts" />

declare namespace gsap.core {
  interface Timeline {
    textAppearing(target: gsap.TweenTarget, config: TextAppearingFilterConfig | gsap.TweenVars, position?: gsap.Position): this
    fadeUp(target: gsap.TweenTarget, config: FadeUpFilterConfig | gsap.TweenVars, position?: gsap.Position): this
    fade(target: gsap.TweenTarget, config: FadeFilterConfig | gsap.TweenVars, position?: gsap.Position): this
  }
}