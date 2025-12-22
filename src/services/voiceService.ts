// Text to Speech - Instant Web Speech API (Google TTS - No delay)
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = async (text: string, isMuted: boolean = false) => {
    // Stop any current speech
    stopSpeaking();

    if (isMuted || !text || text.trim().length === 0) {
        return;
    }

    if (!window.speechSynthesis) {
        console.warn('🎤 [TTS] Speech synthesis not supported');
        return;
    }

    try {
        // Clean text (remove markdown, emojis, emotion tags)
        const cleanText = text
            .replace(/[#*_`~]/g, '') // Remove markdown
            .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emojis
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
            .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
            .replace(/\[EMOTION:\w+\]/gi, '') // Remove emotion tags
            .trim();

        if (cleanText.length === 0) return;

        currentUtterance = new SpeechSynthesisUtterance(cleanText);

        // Configure for Indonesian
        currentUtterance.lang = 'id-ID';
        currentUtterance.rate = 1.0;
        currentUtterance.pitch = 1.0;
        currentUtterance.volume = 0.9;

        // Try to get Indonesian voice
        const voices = window.speechSynthesis.getVoices();
        const indonesianVoice = voices.find(v =>
            v.lang.includes('id') || v.lang.includes('ID')
        );

        if (indonesianVoice) {
            currentUtterance.voice = indonesianVoice;
        }

        currentUtterance.onend = () => {
            currentUtterance = null;
            console.log('🎤 [TTS] Speech ended');
        };

        currentUtterance.onerror = (e) => {
            console.error('🎤 [TTS] Speech error:', e);
            currentUtterance = null;
        };

        window.speechSynthesis.speak(currentUtterance);
        console.log('🎤 [TTS] Playing instant Google TTS');

    } catch (error) {
        console.error('🎤 [TTS] Error:', error);
    }
};

export const stopSpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (currentUtterance) {
        currentUtterance = null;
    }
};

// ... keep SpeechRecognizer class if needed ...
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
