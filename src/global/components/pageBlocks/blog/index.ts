import gsap from 'gsap';



function toggleTextShow() {
    const seoBlock = document.querySelector('.seo-block');
    
    if (!seoBlock) return;

    const seoBlockTextElems = seoBlock.querySelectorAll<HTMLElement>('.seo-block__text p'),
        seoBlockText = seoBlock.querySelector<HTMLDivElement>('.seo-block__text'),
        button = seoBlock.querySelector<HTMLButtonElement>('.seo-block__expand button');

    if (!seoBlockText || !button) return;

    let seoShow = true;

    function animateText() {
        let heightSeoBlock = 0;

        seoBlockTextElems.forEach((seoText, index) => {
            heightSeoBlock += seoText.offsetHeight + parseInt(getComputedStyle(seoText).paddingTop)

            if (index == 0) return

            if (seoShow) {;
                gsap.timeline()
                    .from(seoText, {
                        opacity: 0,
                        y: 20,
                        delay: 0.5,
                    }, index * 0.1)
                    .play();
            } else {
                heightSeoBlock = seoBlockTextElems[0].offsetHeight + (seoBlockText ? parseInt(getComputedStyle(seoBlockText).paddingTop) : 0)
            }
        });

        gsap.to(seoBlockText, {
            height: heightSeoBlock,
            duration: 0.8,
            delay: 0.1,
            onComplete: () => {
                // ScrollTrigger.refresh();
            },
        });
    }

    button?.addEventListener('click', () => {
        animateText();
        seoBlockText.classList.toggle('_seoShow', seoShow)
        button.classList.toggle('_seoHide', seoShow)
        seoShow = !seoShow;
        
        // ScrollTrigger.refresh();

        // scroll.stop();
        // setTimeout(()=> {
        //     scroll.start()
        //     scroll.resize();
        // }, 800)
    });
}

toggleTextShow();
