import Colors from "../enums/Colors";

const getRandomColor = () => {
  const random = Math.floor(Math.random() * 2 + 1);
  return random === 1 ? Colors.Red : Colors.Blue;
};

export default getRandomColor;