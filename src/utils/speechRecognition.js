/**
 * Web Speech API Voice Controller for ResumeXpert AI Mock Interviews.
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS) with graceful fallbacks.
 */

// Check browser support
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis);
}

// Request microphone access
export async function requestMicrophonePermission() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return { granted: false, error: 'Media devices API not available in this browser.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Release immediately after checking permission
    stream.getTracks().forEach((track) => track.stop());
    return { granted: true };
  } catch (err) {
    return { granted: false, error: err.message || 'Microphone access denied by user.' };
  }
}

// Speech to Text Controller
export class VoiceRecognitionController {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.finalTranscript = '';
    this.interimTranscript = '';

    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  start({ onInterim, onFinal, onError, onEnd } = {}) {
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition is not supported in this browser. Please use text mode.'));
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    this.finalTranscript = '';
    this.interimTranscript = '';

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript + ' ';
          if (onFinal) onFinal(this.finalTranscript.trim());
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      this.interimTranscript = interim;
      if (onInterim) onInterim(interim);
    };

    this.recognition.onerror = (event) => {
      console.warn('[Voice Recognition Error]', event.error);
      if (onError) onError(new Error(`Speech recognition error: ${event.error}`));
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd(this.finalTranscript.trim());
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.warn('[Voice Recognition Start Failed]', err);
      if (onError) onError(err);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.isListening = false;
    return this.finalTranscript.trim();
  }
}

// Text to Speech Helper
export function speakQuestion(text, { onStart, onEnd } = {}) {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis unsupported');
    if (onEnd) onEnd();
    return false;
  }

  // Cancel any active speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.warn('[TTS Error]', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function cancelSpeech() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

