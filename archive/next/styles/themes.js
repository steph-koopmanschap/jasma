const lightStyleObj = {
    name: "light",
    styles: {
        primary: {
            background: "white",
            color: "black"
        },
        secondary: {
            background: "white",
            color: "black"
        },
        tertiary: {
            background: "white",
            color: "black"
        },
        quaternary: {
            background: "white",
            color: "black"
        }
    }
};

const darkStyleObj = {
    name: "dark",
    styles: {
        primary: {
            background: "black",
            color: "white"
        },
        secondary: {
            background: "black",
            color: "white"
        },
        tertiary: {
            background: "black",
            color: "white"
        },
        quaternary: {
            background: "black",
            color: "white"
        }
    }
};

class Themes {
    constructor() {
        this._light = lightStyleObj;
        this._dark = darkStyleObj;
    }

    get light() {
        return this._light;
    }

    get dark() {
        return this._dark;
    }
}

const themes = new Themes();
export default themes;
