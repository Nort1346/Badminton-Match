const HandleSpeak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en'; 
        utterance.pitch = 1;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Your browser does not support speech synthesizer.');
    }
};

export default HandleSpeak;