import VoiceRecorder from "./components/VoiceRecorder";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-white">
      <main className="flex flex-col items-center w-full max-w-sm">
        <VoiceRecorder />
      </main>
    </div>
  );
}