# Conference Scheduler
A conference scheduling application built as an open-source, lightweight solution to handling the logics of research conferences.

## Requirements
- NodeJS (v18 currently is supported)
- Pandoc (2.19 preferably)

## How to Install
- Install the packages `npm i`
- Type `npm run local` to start the server

## Create a Registered User
The main database will start with no users by default. You will need to manually create a starting user.
Send a `POST` request to `/api/auth/register` with a JSON body like below:
```JSON
{
    "username": "username",
    "password": "pa33w0rd",
    "firstName": "Liv",
    "lastName": "Bot"
}
```
This will create an admin user with those credentials. You can test if this worked by logging in at the `/login` page.

## Code Info
Main entry point is `index.js` for the app
