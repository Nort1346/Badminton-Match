import { Howl } from "howler";

const Sounds = {
  point: new Howl({
    src: ["/sounds/pointSound.mp3"],
  }),
  set: new Howl({
    src: ["/sounds/setSound.mp3"],
  }),
  winning: new Howl({
    src: ["/sounds/winningSound.mp3"],
  }),
  congratulations: new Howl({
    src: ["/sounds/congratulationsSound.mp3"],
  }),
};

export default Sounds;
