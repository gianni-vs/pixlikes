# Pixlikes - Find pictures you like

## Live demo
You can play with a live instance [here](http://5.161.80.17/).

## Running locally
It is possible to fire up a development environment with Docker Compose, both backend and frontend services will be available for testing.

1. Install the dependencies of both packages with:
```
docker-compose run backend npm i
docker-compose run frontend npm i
```

2. Start a development environment with:
```
docker-compose up
```

4. Now you can reach the web app browsing to ``http://localhost:3000/``

The DB is pre-filled with some data, to play with the app.
Here are the credentials of some account:

| Username           | Password |
|--------------------|----------|
| admin@admin.com    | admin    |
| guybrush@mi.com    | admin    |
| luke@starwars.com  | admin    |
| leila@starwars.com | admin    |
| eric@gmail.com     | admin    |

## Customizing Unsplash Key, service hosts & ports

Unsplash API needs an Access key. It can be supplied by pasting it directly in a file or as environment variable.

Follows a list of useful configuration variables and how to tweak them:

| Description                     | File location                          | Env. Variable | Default                |
|---------------------------------|----------------------------------------|--------------|------------------------|
| Unsplash API key                | src/features/unsplash/unsplashSlice.js | UNSPLASH_KEY | **Required**           |
| Backend Host (used by Frontend) | src/features/pixlikes/pixlikesSlice.js | API_HOST     | http://localhost:8081/ |
| Backend Port (used by backend)  | src/features/unsplash/unsplashSlice.js | PORT         | 8081                   |

## Assumptions and side notes

* The unsplash API is queried from the frontend.
* Likes are stored on the backend.
* Supposing the focus of the test was mostly oriented to the frontend, the backend is really just a mock based on [json-server-auth](https://github.com/jeremyben/json-server-auth), which brings JWT authentication middleware to [json-server](https://github.com/typicode/json-server). All the data is stored in db.json on the backend. 
* To show other users and allow to view other profiles, I created a fake 'Friends' section that provides links to other profiles. However, in this version there is no way to search for profiles and to add friends.
* The frontend prevents toggling likes for other users, but a simple check is performed even on the server, as it should normally be.
* No real tests have been written except for the most basic one that tests if the App renders correctly, runs with ``npm test``

## Future Improvements
* Full screen image view on click
* Rewrite APIs with RTK Query
* Unsplash API could be proxied by the backend, to avoid providing the API key on the frontend.
