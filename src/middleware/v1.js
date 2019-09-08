'use strict';

/**
 *
 */

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

const router = express.Router();

router.param('model', modelFinder.load);

router.get('/api/v1/models', (request, response) => {
  modelFinder.list()
    .then(models => response.status(200).json(models));
});

router.get('/api/v1/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});


router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);
router.get('/api/v1/:model/:id', handleGetOne);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);

/**
 *This function takes in a request response and next and returns all of the data from the get model and a 200 message to the browser. Its output is the number of objects in the database as well as the data object.
 * @param request
 * @param response
 * @param next
 */

// Route Handlers
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 *This function takes in a request response and next and returns one piece of data from the get model and a 200 message to the browser. Its output is the first piece of JSON from the result object.
 * @param request
 * @param response
 * @param next
 */

function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}


/**
 *This function takes in a request response and next. The function adds one piece of data from the results object from the database. it returns the json object and a 200 message to the browser. Its output is the object that has been added in the database.
 * @param request
 * @param response
 * @param next
 */
function handlePost(request,response,next) {
  request.model.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *This function takes in a request response and next. The function updated one piece of data from the results object from the database. it returns the json object and a 200 message to the browser. Its output is the object that has been updated in the database.
 * @param request
 * @param response
 * @param next
 */
function handlePut(request,response,next) {
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *This function takes in a request response and next. The function deleted one piece of data from the results object from the database. it returns the json object and a 200 message to the browser. Its output is the object that has been deleted in the database.
 * @param request
 * @param response
 * @param next
 */
function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;
