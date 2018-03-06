# Notification Microserevice

Notification microservice was created as a server side, event driven messages storage which is able to emit notifications to the client in real time through the web sockets. Exposing easy to use API allows any client to push and receive notifications and display them to the user without significant delay.

## Technology stack
* nodejs.org 
* expressjs.com 
* socket.io
* mongodb.com
* swagger.io

## Available Clients
* [magento 2](https://bartoszherba.github.io/magento2-notifications-service-client/)


## How to run up the service?

Everything required to run up service is available in the package

### Configuration

Configuration sample files are in CONFIG directory. There are different samples for running up service locally and with docker. For any approach simply copy and adjust configuration.

### Local

If you want to run service locally you will likely to use default.json configuration file. There is an assumption that you already have installed mongodb and nodejs.

Update configuration with appropriate details and run:

``npm install && npm start``

### Docker

If you have a docker then the simplest way to run up service is to use docker.json config file. Copy it, rename, adjust details and run:

``docker-compose up -d``

*Note: running up service with docker was tested only in linux environment and therefore might not work in osx or windows*

## Api Documentation

After running up the service Swagger API documentation will be available at http://[hostname:port]/api-docs/index.html (*default: http://localhost:3000/api-docs/index.html)*


# Socket - Client

## Connection
Each connection is expected to be done with IDENTIFIER query parameter. Based on this parameter each client will be put into a different space. Multiple clients can share the same identifier and therefore will receive the same events.

*EXAMPLE CONNECTION:*

```javascript
options = {
    forceNew: true,
    reconnectionAttempts: 5,
    query: {
        identifier: 'some-dientifier',
    },
};

const socket = io('http://yourwebsite.local', options);
```

## Events
* **new-message** - will broadcast new message object along with total messages counter
* **new-message-list** - will broadcast array with all messages objects with a given identifier
* **update-message** - will broadcast updated message object

*EXAMPLE LISTENER*
```javascript
socket.on('new-message', (response) => {
    console.log(response.newMsg);
});
```
