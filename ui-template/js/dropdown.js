const init_dropdowns =() => {
    const elements = document.querySelectorAll(`[data-dropdown-element]`);
    if (elements) {
        elements.forEach((element) => {
            const trigger = element.querySelector("[data-trigger]");
            const toggleDrop = () => {
                const setTo =
                    element.getAttribute("data-is-open") === "true"
                        ? "false"
                        : "true";
                element.setAttribute("data-is-open", setTo);
            }

            const closeDrop = () => {
                element.setAttribute("data-is-open", "false");
            }

            trigger.addEventListener("click", () => {
                toggleDrop()
            })

            document.addEventListener("mousedown", (e) => {
                const target = e.target;
                if (element && !element.contains(target)) {
                    closeDrop()
                }
            })
        })
    }
}


export { init_dropdowns }