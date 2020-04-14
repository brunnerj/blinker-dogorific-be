Project submission from [James Brunner](mailto://james.jack.brunner@gmail.com) for Blinker tech assessment.

## Dog-O-Rific

This is a simple `node/express` API router implementation to supply a collection
of dog breeds to clients (e.g., the Blinker _dogorific_ front-end client) and
allow breeds to be chosen (or unchosen) as favorites.

Dog breeds in the backend repository can be requested by the whole collection
(`HTTP GET <server>/breeds`), or by the individual breed ID
property (`HTTP GET <server>/breeds/<id>`).

Breeds can be marked as a _favorite_ (`HTTP POST <server>/favorites/add`, with
json request body of `{"breed_id": <breed id>}`), and separately queried as the whole
collection (`HTTP GET <server>/favorites`). Breeds can also be removed
from the favorites collection (`HTTP DELETE <server>/favorites/<id>`).

### Install/Run/Test

**Note: This requires [node](https://nodejs.org/en/download/) v12+ to be installed.**

1. Clone this repository [https://github.com/brunnerj/blinker-dogorific-be.git](https://github.com/brunnerj/blinker-dogorific-be.git).

2. Run `npm install && npm start` in the top-level repository folder.

3. Use an application like [Postman](https://www.postman.com) or CLI tool
   like `curl` to make requests to the API service running at
   [http://localhost:4000](http://localhost:4000).

4. Use the Blinker front-end implementation to test the API by launching
   the front-end docker and browsing to [http://localhost:8000](http://localhost:8000).

### Ideas for Improvement

The API satisfies the requirements for the assessment assignment, however,
were this a real-world API , there are several areas that
could be improved upon.

This simple example API suffers from:

-   **Scalability**

    The API persists the collections of dog breeds and favorites in plain
    JSON files. Reads are slow and not cached, multi-user access is not
    supported and complex query scenarios (e.g., multi-collection joins)
    would have to be manually coded from scratch.

    A better approach would be to use a database (along with an
    API with flexible data source support, see below) to persist data
    on the backend.

-   **Maintainability**

    The API router, models and data sources are currently tightly coupled,
    and logic and objects overlap a lot in the source modules. A better
    approach for longer-term maintainability would be to utilize a more
    sophisticated API framework, for example [LoopBack 4](https://loopback.io),
    that provides for greater out-of-the-box separation of concerns as well
    as support for various backend data sources.

-   **Security**

    Ultimately all modern APIs should use an encrypted protocol (e.g. `https`)
    to provide for a secure data channel as well as definitive host identification.
    A session manager and user authentication could be added to the API to
    keep track of specific users' favorite breeds (as well as to support
    an expanding feature set for the API).
