import { breakpoint } from "./breakpoint";

const scrollableBox = (
    box_wrapper,
    controlleft,
    controlright,
    boxcontent
) => {
    const scrollbox_wrapper = document.querySelector(`${box_wrapper}`)
    if (scrollbox_wrapper) {
        const btnGoToLeft = scrollbox_wrapper.querySelector(`${controlleft}`)
        const btnGoToRight = scrollbox_wrapper.querySelector(`${controlright}`)
        const scrollbox = scrollbox_wrapper.querySelector(`${boxcontent}`)

        const getScrollAx = ()=>{
            if (breakpoint === "small"|| breakpoint==="xs") {
                return scrollbox.clientWidth
            }
            else {
                return scrollbox.clientWidth - (((scrollbox.clientWidth/3)*2-40) - ((scrollbox.clientWidth/3)))
            }
        }

        const goToLeft = () => {
            scrollbox.scrollLeft -= getScrollAx()
        }

        const goToRight = () => {
            scrollbox.scrollLeft += getScrollAx();
        }

        const handleEventScroll = () => {
            if (scrollbox.scrollLeft <= 0) {
                btnGoToLeft.disabled = true
            } else {
                btnGoToLeft.disabled = false
            }

            if (scrollbox.scrollLeft >= scrollbox.scrollWidth - scrollbox.offsetWidth - 1) {
                btnGoToRight.disabled = true
            } else {
                btnGoToRight.disabled = false
            }
        }

        btnGoToLeft.addEventListener("click", goToLeft)
        btnGoToRight.addEventListener("click", goToRight)

        scrollbox.addEventListener("scroll", handleEventScroll);
        window.addEventListener("load", handleEventScroll);
    }
}

export { scrollableBox }
