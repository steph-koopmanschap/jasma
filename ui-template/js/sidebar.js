const sidebar_toggle_btn = document.querySelector("[data-toggle-sidebar]")
const sidebar = document.querySelector("[data-side-bar]")
const sidebar_overlay = document.querySelector("[data-nav-overay]")

if (sidebar && sidebar_overlay && sidebar_toggle_btn) {
    sidebar_toggle_btn.addEventListener("click", e=>{
        e.preventDefault()
        sidebar.classList.toggle("-translate-x-full")
        sidebar_overlay.classList.toggle("hidden")
        document.body.classList.toggle("overflow-y-auto")
    })

    sidebar_overlay.addEventListener("click", e=>{
        e.preventDefault()
        sidebar.classList.add("-translate-x-full")
        sidebar_overlay.classList.add("hidden")
        document.body.classList.add("overflow-y-auto")
    })
}