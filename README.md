# Voice-recognition Discord Bot

A discord music bot capable of performing commands via voice recognition in addition to text commands. Listens to one user in the voice channel only and uses wake word detection to determine when a command is being voiced.

## Built with

- [Typescript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Discord.js](https://discord.js.org/#/)
- [Picovoice Porcupine](https://picovoice.ai/platform/porcupine/) (Wake word detection)
- [Google Cloud Speech](https://cloud.google.com/speech-to-text) (Speech-to-Text)
- [Youtube Data API](https://developers.google.com/youtube/v3/docs) (For song querying)

## Supported Commands (Voice & Text)

Voice commands can be initiated by speaking the hotword ("bumblebee") and pausing for a very short moment before providing the desired command. Text commands can be initiated through the slash "/" command on discord.

- play {song name} - plays the first song/video yielded by a youtube search of the given {song name}. Otherwise, adds to the music queue
- skip - Skips the current song
- pause - Pauses the current song
- resume - Resumes the current song
- disconnect - Disconnects the bot from the voice channel and clears up any resources
- listen - Connects to the voice channel and begins listening to the user (only works as a text command)

After using /listen, please wait a moment to let the voice recognition system initialize, otherwise the first command will take some time to be processed.

## Running the Project

### Requirements

- Discord bot Token (Register a bot [here](https://discord.com/developers/applications))
- Client ID (from bot)
- Guild ID (ID of Guild the bot is located in -> see note)
- Porcupine API Key
- Youtube Data API Key
- Setup Google Cloud Client ADC (see [here](https://cloud.google.com/docs/authentication/provide-credentials-adc) for how to authorize your client. I personally used "User Credentials")

### Hosting Locally

1. Clone the repo

    ```sh
    git clone https://github.com/kmatic/Voice-Recognition-Discord-Bot
    ```

2. Navigate to folder and install any dependencies

    ```sh
    yarn install
    ```

3. Create a .env file in the project's main directory and populate the following parameters with your API Keys

    ```text
    BOT_TOKEN=''
    YOUTUBE_API_KEY=''
    PICOVOICE_ACCESS_KEY=''
    CLIENT_ID=''
    GUILD_ID=''
    ```

4. Compile the .ts files and start the bot

    ```sh
    yarn start
    ```

The bot will now be online and should be able to take in commands after adding it to your discord server with the appropriate permissions. Please take note of the usage limits with the API Keys. While it should be suitable for personal use, if the bot is in more than one guild, the usage limits will be reached quite quickly.

NOTE*: The Guild ID is only required for registering the commands with one specific guild. To register the commands globally for every guild the bot is in, see [here](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration) and modify the deploy-commands.ts file

### Hosting in a Docker Container

1. Build the image and run the container

    ```sh
    docker compose up
    ```

This requires the .env file and an application_default_credentials.json file in your ~/.config/gcloud/ folder which should be there if authorized using the 'User Credentials' method as stated [above](https://cloud.google.com/docs/authentication/provide-credentials-adc)

## Reflection

This was my first project using Typescript and while it took a bit to get used to at first, I will probably use it for all my future personal projects as the idea of having more robust software appeals to me. This bot runs on Node.js and uses the Picovoice Porcupine engine for wakeword detection. Once detected, user audio is sent to the google cloud speech-to-text client for transcription and then to a command dispatcher for execution. I initially implemented only the text commands of the music bot and this was quite simple as there is really good documentation available. Most of my trouble with this project came from receiving user audio and the processing of it as the documentation was poor. More specifically, the most difficult section was implementing the wakeword detection as porcupine required the audio data in a specific frame length. I was initially unable to transcode the audio stream from the user into this format but with more research I finally found resources that helped.

With this project I also began delving into containerized applications with the use of docker. As this was a typescript project, I created a two-step image build process which uses only the necessary files in the final image. Along with this a docker compose file to setup necessary env variables and bind mounts. While running the container works to host the bot, Picovoice only allows a max of 3 users a month for their API key and running a new instance of the container seems to take up this space which is something I didn't take into account.
