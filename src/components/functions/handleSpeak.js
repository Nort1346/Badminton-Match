import i18n from 'i18next';

const HandleSpeak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = i18n.language;
        console.log(lang);
        utterance.lang = lang; 
        utterance.pitch = 1;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Your browser does not support speech synthesizer.');
    }
};

export default HandleSpeak;