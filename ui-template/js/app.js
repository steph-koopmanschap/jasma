import { scrollableBox } from "./box-scroll"
import { init_dropdowns } from "./dropdown"
import "./sidebar"
import "./theme"


init_dropdowns()

scrollableBox(
    "[data-recommanded-streams]",
    "[data-go-left]",
    "[data-go-right]",
    "[data-hidden-scrollbar]"
)
