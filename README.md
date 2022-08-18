# Webservices API
## Info student

* Voornaam: Pieter

* Naam : Bommele

* Klas : G2B4

## API
To start this API, create a `.env` file in the root of this folder with this content

```
NODE_ENV="development"
DATABASE_USERNAME="root"
DATABASE_PASSWORD=""
JWT_Secret=""
```

Update the username and password with the credentials of your local database.

You can also extend the .env file with these configurations, only if the database host/port are different than our default.

```
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

## How to start

Run the app with `npm start`.

## Common errors

* Modules not found errors, try this and run again:

```
npm install
```

* Migrations failed, try dropping the existing `webservices` database and run again


* Others: Google is your friend

## Online

You can find this API online at: https://webserviceshogent.herokuapp.com/

You can find this API documentation online at: https://webserviceshogent.herokuapp.com/swagger 

The Database for this online API is hosted on 213.119.50.145:3306

## Contact

Pieter Bommele - pieter.bommele@student.hogent.be

