# Voice-recognition Discord Bot

A discord music bot capable of performing commands via voice recognition and text commands. Listens to one user in the voice channel only and uses wake word detection to determine when a command is being voiced.

## Built with

- [Typescript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Discord.js](https://discord.js.org/#/)
- [Picovoice Porcupine](https://picovoice.ai/platform/porcupine/) (Wake word detection)
- [Google Cloud Speech](https://cloud.google.com/speech-to-text) (Speech-to-Text)
- [Youtube Data API](https://developers.google.com/youtube/v3/docs) (For song querying)

## Supported Commands (Voice & Text)

Voice commands can be initiated by speaking the hotword ("bumblebee") before providing the desired command. Text commands can be initiated through the slash "/" command on discord.

- play {song name} - plays the first song/video yielded by a youtube search of the given {song name}. Otherwise, adds to the music queue
- skip - Skips the current song
- pause - Pauses the current song
- resume - Resumes the current song
- disconnect - Disconnects the bot from the voice channel and clears up any resources
- listen - Connects to the voice channel and begins listening to the user (only works as a text command)

After using /listen, please wait a moment to let the voice recognition system initialize, otherwise the first command will take some time to be processed.

## Reflection

## Hosting

### Requirements

- ffmpeg
- Discord bot Token (Register a bot [here](https://discord.com/developers/applications))
- Porcupine API Key
- Youtube Data API Key
- Setup Google Cloud Client ADC (see [here](https://cloud.google.com/docs/authentication/provide-credentials-adc) for how to authorize your client. I personally used "User Credentials")

### Running the Project

1. Clone the repo

```
git clone https://github.com/kmatic/Voice-Recognition-Discord-Bot
```

2. Navigate to folder and install any dependencies

```
yarn install
```

3. Create a .env file in the project's directory and populate the following parameters with your API Keys

```
BOT_TOKEN=''
YOUTUBE_API_KEY=''
PICOVOICE_ACCESS_KEY=''
```

4. Start the bot locally

```
yarn start
```

The bot will now be online and should be able to take in commands after adding it to your discord server
