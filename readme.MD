# Spotify to Youtube Playlist Converter

This is a tool to effortlessly transfer your favorite playlists from Spotify to YouTube! Say goodbye to manual track-by-track copying and hello to seamless playlist migration. With this you can easily convert your curated Spotify playlists into YouTube playlists, preserving your music taste across platforms. Enjoy the convenience of a smooth transition, allowing you to share and discover music on both Spotify and YouTube effortlessly. Start converting now and keep the rhythm going across all your favorite platforms!

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [License](#license)

## Features

- Express.js framework for building web applications.
- `cookie-parser` for handling cookies.
- `dotenv` for loading environment variables from a `.env` file.
- `axios` for performing HTTP functions.
- Templating with `ejs`.
- Development tools like `nodemon`.
- Written in Javascript.

## Prerequisites

Before using this starter template, ensure you have the following software installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- Package manager: npm (v8 or higher) or yarn

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/playlist-converter.git
   cd playlist-converter
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables:

    - **SPOTIFY_CLIENT_ID** : Your Spotify Client ID.
    - **SPOTIFY_CLIENT_SECRET** : Your Spotify  Client Secret.
    - **SPOTIFY_CALLBACK_URL** : Spotify Authetication Callback URL.
    - **GOOGLE_CLIENT_ID** : Your Google Client ID.
    - **GOOGLE_CLIENT_SECRET** : Your Google Client Secret.
    - **GOOGLE_CALLBACK_URL** : Google Authetication Callback URL.
    - **GOOGLE_API_KEY** : Google Authetication Callback URL.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Your Node.js application should now be running at http://localhost:3000.

## Dependencies

This project uses a variety of dependencies. Some of the key ones include:

- `express`: Web framework for building web applications.
- `dotenv`: Loads environment variables from a `.env` file.
- `ejs`: Templating engine for rendering views.
- `axios`: Promise based HTTP client for the browser and node.js.
- `qs`: A querystring parser that supports nesting and arrays, with a depth limit.
- `nodemon`: Monitors for changes and automatically restarts the server.
- And more. Check `package.json` for the full list.

## License

This project is licensed under the [ISC License](LICENSE).