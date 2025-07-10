import GameSettingType from "@/enums/GameSettingType";
import DefaultValues from "@/DefaultValues.json";

const fetchPoints = () => {
  return localStorage.getItem(GameSettingType.Points) ?? DefaultValues.POINTS;
};

export default fetchPoints;
