// Text to Speech
export const speakText = (text: string, isMuted: boolean = false) => {
    if (isMuted || !window.speechSynthesis) return;

    // Cancel current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Indonesian
    utterance.rate = 1;
    utterance.pitch = 1;

    // Fallback to English if ID voice not found (optional logic, but usually browser handles it)
    // We can try to find a specific Google voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(v => v.lang === 'id-ID' || v.lang === 'ind');
    if (indonesianVoice) utterance.voice = indonesianVoice;

    window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
};

// Speech to Text (Simple implementation)
// For React components, it's often better to use a Hook, but we can export a helper here
// or just put the logic in the component. Let's create a class or helper.

export class SpeechRecognizer {
    private recognition: any;
    private isListening: boolean = false;

    constructor() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'id-ID';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
        }
    }

    start(onResult: (text: string) => void, onError: (err: any) => void) {
        if (!this.recognition) {
            onError("Browser not supported");
            return;
        }

        if (this.isListening) return;

        this.recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            onResult(text);
        };

        this.recognition.onerror = (event: any) => {
            onError(event.error);
            this.isListening = false;
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        this.recognition.start();
        this.isListening = true;
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}
