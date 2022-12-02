# document-parser
A super cool parser

## Requirements
- Node (latest preferably, v16)
- Pandoc (2.19 preferably)

## How to Start
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
