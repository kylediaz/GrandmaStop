'use client';

import { useState, useRef } from 'react';
import Keypad from './Keypad';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
        console.log(audioBlob);
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.mp3');
          console.log(formData);
          
          const server = process.env.BACKEND;
          const response = await fetch(server + '/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload audio');
          }

          // Clear the chunks
          chunksRef.current = [];
        } catch (error) {
          setError('Failed to upload recording');
          console.error('Upload error:', error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-centergap-4 p-4 w-full gap-8">
        { !isRecording ? <Keypad /> : '' }
          <button
            onClick={ isRecording ? stopRecording : startRecording }
            className={`w-24 h-24 rounded-full ${
              isRecording 
                ? 'bg-green-500 hover:bg-green-600 animate-[pulse_2s_infinite]' 
                : 'bg-green-500 hover:bg-green-600'
            } flex items-center justify-center self-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
