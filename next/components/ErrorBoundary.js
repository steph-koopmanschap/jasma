import React from "react";

/* 
    This error boundery class component works similar to 
    a try - catch block in javascript.
    Wrap this component around another component like so

    <ErrorBoundary>
        <YourComponent />
    </ErrorBoundary>

    This will prevent the entire app from crashing if there is an error in the <YourComponent />
    However the <YourComponent /> will no longer render and instead the render function of this component will render instead.
*/

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {     
        console.log("ERROR: " + error);
        // Update state so the next render will show the fallback UI.  
        return { hasError: true };  
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI

            //return this.props.fallback
            return (
            <div>
                <h1>Something went wrong here.</h1>
                <p></p>
            </div>);
        }
        return this.props.children; 
    }
}

export default ErrorBoundary;

