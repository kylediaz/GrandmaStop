from flask import Flask, request
from flask_cors import CORS
import assemblyai as aai
import os
from sms import send_sms  # Import the function from sms.py

app = Flask(__name__)
CORS(app)

# Set your AssemblyAI API key
aai.settings.api_key = "a8414083bc4b4e298baf9d23e128da59"

@app.route('/upload', methods=['POST'])
def upload_audio():
    print(request.values)
    if 'file' not in request.values:
        return 'No file part', 400
    audio_blob = request.values['file']

    # Save the uploaded file temporarily
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, "temp.mp3")

    with open(file_path, 'w') as file:
        file.write(audio_blob)

    # Set the content safety and entity detection config
    config = aai.TranscriptionConfig(
        entity_detection=True,  # Enable entity detection
        content_safety=True,
        content_safety_confidence=60  # 60% confidence threshold
    )

    try:
        # Transcribe the audio file with entity detection enabled
        transcript = aai.Transcriber().transcribe(file_path, config)

        # Debug: Check the transcript response
        print(f"Transcript Response: {transcript}")

        # Check if entities exist in the transcript
        if not transcript.entities:
            return "No entities detected in the transcript.", 400

        # content to look out for
        flagged_content = ["credit_card_cvv"]

        flagged_found = False
        # Loop through detected entities
        for entity in transcript.entities:
            if entity.entity_type in flagged_content:
                flagged_found = True
                break

        # If flagged entity is found, trigger SMS and summarize the audio
        if flagged_found:
            # Call the send_sms function from sms.py
            send_sms(f"Flagged content detected in {audio_file.filename}")

            # Set summarization config
            summary_config = aai.TranscriptionConfig(
                summarization=True,
                summary_model=aai.SummarizationModel.informative,
                summary_type=aai.SummarizationType.bullets
            )
            # Transcribe with summarization enabled
            summary_transcript = aai.Transcriber().transcribe(file_path, summary_config)

            # You can print the summary or use it as needed
            print(f"Summary of the Audio: {summary_transcript.summary}")

        # If no flagged entity is found, print in the terminal
        if not flagged_found:
            print(f"No 'credit_card_cvv' entity detected in {audio_file.filename}.")

        # Return success message
        return "Processed the audio file successfully", 200

    except Exception as e:
        return f"An error occurred: {str(e)}", 500

    finally:
        # Clean up temporary file
        os.remove(file_path)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
