# message-rest-api

This project is a simple REST API. This `node.js` application stores a bunch of messages and allows creation, deletion and retrieval of messages through a REST API. The project also contains a simple user interface for demonstration and a handful of automated tests.

This project was built with `node.js v8.9.1` and `npm v5.5.1`

## Table of Contents
* [Implementation Description](#implementation-description)
* [Installing and Running the Application](#installing-and-running-the-application)
* [Running Automated Tests](#running-automated-tests)
* [REST API Documentation](#rest-api-documentation)
  * [Base URL](#base-url)
  * [Message Object](#message-object)
  * [/api/message](#apimessage)
  * [/api/message/:id](#apimessageid)

## Implementation Description

The web service is made with [node.js](https://nodejs.org/en/) and the [Express](https://expressjs.com/) framework. Messages are stored in a local SQLite database file using [sqlite3](https://www.npmjs.com/package/sqlite3) and the object-relational mapper [Sequelize](http://docs.sequelizejs.com/) to convert models into database objects.

The automated tests are powered by [Mocha](https://mochajs.org/).

The user interface is built using [jQuery](https://jquery.com/) to make REST API calls and styled using [Bootstrap 3.3](https://getbootstrap.com/docs/3.3/).

## Installing and Running the Application

1. Install [node.js](https://nodejs.org/en/) for your platform.

2. Clone or download the repository into a directory then change into the project directory.
```
git clone https://github.com/pdns/message-rest-api.git
cd message-rest-api
```
3. In the project directory, enter the `npm install` command to download the dependencies.

4. Enter the command `npm start` to start the web service. The service runs on port 3000 by default.

5. To access the user interface, open a web browser and go to http://localhost:3000 (assuming the application is running on your local computer).

6. With the user interface, you can submit new messages, select from the list of existing messages to view details, and delete the selected message.

For instructions on accessing the REST API, see the [REST API Documentation](#rest-api-documentation) section.

## Running Automated Tests

The project contains a handful of automated tests. To run the tests, enter the command `npm test` in the project directory after completing steps 1-3 in [Installing and Running the Application](#installing-and-running-the-application). The testing procedure runs its own server process and does not need to be started beforehand.

## REST API Documentation

### Base URL

The REST API's base URL is as follows:
```
http://<host>:<port>/api
```
The API returns responses in JSON format.

### Message Object
The API's Message objects contain the following information:

Key | Data Type | Description
----|-----------|------------
id | UUID | The unique identifier of the object.
message | string | The actual message.
palindrome | boolean | Whether or not the message is a palindrome. Note that it is character based, so case-sensitivity and non-alphanumeric characters are considered when determining if the message is a palindrome.
date_created | string | When the message was created.
url | string | The URL to GET or DELETE this Message object.

### /api/message

#### Method: GET
Returns the list of posted messages. The JSON response is structured as follows: 

Key | Data Type | Description
----|-----------|------------
count | integer | Indicates the number of results.
results | array of Javascript objects | An array of Javascript objects, where each object contains a `message` string, message `id` number, and `url` to GET or DELETE the corresponding [Message Object](#message-object).

#### Method: POST
Creates a new message. The POST body must contain JSON with the message to post as shown below:
```
{ "message": "your message here" }
```
Returns the [Message Object](#message-object) of the newly created message.

### /api/message/:id

#### Method: GET
Returns the requested [Message Object](#message-object). Returns JSON with an `error` key if the Message was not found.

#### Method: DELETE
Deletes the specified Message. Returns JSON with the `success` key if deleted, otherwise returns JSON with an `error` key if the Message was not found.
