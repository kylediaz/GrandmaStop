from flask import Flask, request
from flask_cors import CORS
import assemblyai as aai
import os

app = Flask(__name__)
CORS(app)

# Set your AssemblyAI API key
aai.settings.api_key = "a8414083bc4b4e298baf9d23e128da59"

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        return 'No file part', 400
    audio_file = request.files['file']
    if audio_file.filename == '':
        return 'No selected file', 400

    # Save the uploaded file temporarily
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, audio_file.filename)
    audio_file.save(file_path)

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

        # Flagged content will be written to this text file
        output_dir = "flagged_content"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{audio_file.filename}_flagged.txt")

        # Open the text file for writing
        with open(output_path, "w") as text_file:
            flagged_found = False
            # Loop through detected entities
            for entity in transcript.entities:
                if entity.entity_type == "credit_card_cvv":
                    text_file.write(f"Entity Detected: {entity.text}\n")
                    text_file.write(f"Entity Type: {entity.entity_type}\n")
                    text_file.write(f"Timestamp: {entity.start} - {entity.end}\n")
                    text_file.write("\n")
                    flagged_found = True

            # If no 'credit_card_cvv' entity is found, inform the user
            if not flagged_found:
                text_file.write("No credit_card_cvv entity detected.\n")

        # Return success message
        return f"Flagged content (if any) has been saved to {output_path}", 200

    except Exception as e:
        return f"An error occurred: {str(e)}", 500

    finally:
        # Clean up temporary file
        os.remove(file_path)

if __name__ == '__main__':
    app.run(debug=True, port=5001)