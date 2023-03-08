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

As an avid user of Discord, I have always thought about creating a music bot with voice recognition. With the recent development of my software development skillset, I finally felt up to the challenge. This was also my first project using Typescript and while it took a bit to get used to at first, I will probably use it for all my future personal projects as the idea of having more robust software appeals to me. This bot runs on Node.js and uses the Picovoice Porcupine engine for wakeword detection. Once detected, user audio is sent to the google cloud speech-to-text client for transcription and then to a command dispatcher for execution. I initially implemented only the text commands of the music bot and this was quite simple as there is really good documentation available. Most of my trouble with this project came from receiving user audio and the processing of it as the documentation was poor. More specifically, the most difficult section was implementing the wakeword detection as porcupine required the audio data in a specific frame length. I was initially unable to transcode the audio stream from the user into this format but with more research I finally found resources that helped

## Hosting

### Requirements

- ffmpeg
- Discord bot Token (Register a bot [here](https://discord.com/developers/applications))
- Client ID (from bot)
- Guild ID (ID of Guild the bot is located in)
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
CLIENT_ID=''
GUILD_ID=''
```
4. Deploy the slash commands to discord so that the bot has its commands registered on the Guild

```
ts-node src/deploy-commands.ts
```

5. Start the bot locally

```
yarn start
```

The bot will now be online and should be able to take in commands after adding it to your discord server. Please take note of the usage limits with the API Keys. While it should be suitable for personal use, if the bot is in more than one guild, the usage limits will be reached quite quickly.

NOTE*: The Guild ID is only required for registering the commands with one specific guild. To register the commands globally for every guild the bot is in, see [here](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration)
