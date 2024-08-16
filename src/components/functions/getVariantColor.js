import Colors from "../enums/Colors";

const getVariantColor = (color) => {
    switch (color) {
        case Colors.Red:
            return "danger";
        case Colors.Blue:
            return "primary";
        default:
            return "primary";
    }
};

export default getVariantColor;