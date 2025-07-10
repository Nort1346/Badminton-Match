import { Howl } from "howler";
import Sounds from "@/enums/Sounds";
import isEmpty from "./isEmpty";

const SoundsHowl = {};

const initializeSounds = () => {
  if (isEmpty(SoundsHowl)) {
    SoundsHowl[Sounds.Point] = new Howl({
      src: ["/sounds/pointSound.mp3"],
    });

    SoundsHowl[Sounds.Set] = new Howl({
      src: ["/sounds/setSound.mp3"],
    });

    SoundsHowl[Sounds.Winning] = new Howl({
      src: ["/sounds/winningSound.mp3"],
    });
  }
};

/**
 * @param {Sounds} sound
 */
const playSound = (sound) => {
  initializeSounds();
  switch (sound) {
    case Sounds.Point: {
      return SoundsHowl.point.play();
    }
    case Sounds.Set: {
      return SoundsHowl.set.play();
    }
    case Sounds.Winning: {
      return SoundsHowl.winning.play();
    }
    default: {
      return SoundsHowl.point.play();
    }
  }
};

export default playSound;
