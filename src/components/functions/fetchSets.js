import GameSettingType from "../enums/GameSettingType";
import DefaultValues from "../DefaultValues.json";

const fetchSets = () => {
    return localStorage.getItem(GameSettingType.Sets) ?? DefaultValues.SETS;
}

export default fetchSets;