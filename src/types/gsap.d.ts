/// <reference path="../../node_modules/gsap/types/index.d.ts" />
/// <reference path="../global/features/animations/text/text.d.ts" />

declare namespace gsap.core {
  interface Timeline {
    textAppearing(target: gsap.TweenTarget, config: TextAppearingConfig | gsap.TweenVars, position?: gsap.Position): this
  }
}