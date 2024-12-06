import Image from "next/image";
import VoiceRecorder from "./components/VoiceRecorder";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">Voice Recorder</h1>
        <VoiceRecorder />
      </main>
    </div>
  );
}