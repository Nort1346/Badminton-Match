import i18n from "i18next";

const HandleSpeak = (text) => {
  if ("speechSynthesis" in window) {
    const synth = window.speechSynthesis;
    const lang = i18n.language;
    let selectVoice;

    const setVoiceAndSpeak = () => {
      const voices = synth.getVoices();
      if (lang === "pl") {
        selectVoice =
          voices.find(
            (voice) =>
              voice.name ===
              "Microsoft Marek Online (Natural) - Polish (Poland)"
          ) || voices.find((voice) => voice.name === "Google polski");
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = 1;
      utterance.rate = 0.9;
      if (selectVoice) {
        utterance.voice = selectVoice;
      }
      synth.cancel();
      synth.speak(utterance);
    };

    if (synth.getVoices().length) {
      setVoiceAndSpeak();
    } else {
      synth.onvoiceschanged = setVoiceAndSpeak;
    }
  } else {
    console.log("Web Speech API is not supported in this browser.");
  }
};

export default HandleSpeak;
