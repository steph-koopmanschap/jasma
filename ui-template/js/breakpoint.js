var breakpoint;

// Get the current breakpoint
var getBreakpoint = function () {
	return window.getComputedStyle(document.body, ':before').content.replace(/\"/g, '');
};

// Calculate breakpoint on page load
breakpoint = getBreakpoint();

// Recalculate breakpoint on resize
window.addEventListener('resize', function () {
	breakpoint = getBreakpoint();
    // console.log('Browser resized')
}, false);


export { breakpoint }
