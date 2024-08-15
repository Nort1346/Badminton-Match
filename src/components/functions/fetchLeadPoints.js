import GameSettingType from "../enums/GameSettingType";
import DefaultValues from "../DefaultValues.json";

const fetchLeadPoints = () => {
    return localStorage.getItem(GameSettingType.LeadPoint) ?? DefaultValues.LEAD_POINTS;
}

export default fetchLeadPoints;