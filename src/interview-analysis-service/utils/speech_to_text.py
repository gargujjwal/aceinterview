import logging
import os

import assemblyai as aai
from config import Config
from pydub import AudioSegment

logger = logging.getLogger(__name__)


class TranscriptionService:
    def __init__(self, api_key):
        """
        Initialize the transcription service with the provided API key.

        Args:
            api_key (str): The AssemblyAI API key
        """
        self.api_key = api_key
        aai.settings.api_key = api_key

    def transcribe_video_file(self, video_file_path):
        """
        Transcribe audio from a video file.

        Args:
            video_file_path (str): Path to the video file

        Returns:
            tuple[str, str]: [Transcribed text from the video, audio path]
        """
        logger.info(f"Transcribing video file: {video_file_path}")

        try:
            # Extract audio from video
            audio_path = self._extract_audio_from_video(video_file_path)

            # Transcribe the audio
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(audio_path)

            return (transcript.text, audio_path)

        except Exception as e:
            logger.error(f"Error transcribing video: {str(e)}")
            raise

    def _extract_audio_from_video(self, video_path):
        """
        Extract audio from video file and save as WAV.

        Args:
            video_path (str): Path to the video file

        Returns:
            str: Path to the extracted audio file
        """
        try:
            # Create a unique filename using the original filename plus a timestamp
            filename = os.path.basename(video_path)
            base_name = os.path.splitext(filename)[0]
            audio_path = os.path.join(
                Config.TEMPORARY_ARTIFACTS_PATH, f"temp_{base_name}.wav"
            )

            # Load the video file and extract audio
            video = AudioSegment.from_file(video_path, format="mp4")
            audio = video.set_channels(1).set_frame_rate(16000).set_sample_width(2)
            audio.export(audio_path, format="wav")

            return audio_path

        except Exception as e:
            logger.error(f"Error extracting audio: {str(e)}")
            raise
