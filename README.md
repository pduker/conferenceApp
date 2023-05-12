# Conference Scheduler
A conference scheduling application built as an open-source, lightweight solution to handling the logistics of research conferences.

## Requirements
- NodeJS (v18 currently is supported)
- Pandoc (2.19 preferably)

## How to Install
- Install the packages `npm i`
- Type `npm run local` to start the server

## Build the Docker Container
The application can be fully packaged into a Docker container for easier deployment. You can build the image by running `npm run build`. 
This will create the containerized application which can be shipped to various cloud providers or a local server.

## Code Info
Main entry point is `index.js` for the app
