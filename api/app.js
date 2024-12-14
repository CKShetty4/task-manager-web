const express = require('express');
const app = express();
//Route handlers

//List Routes

app.get('/', (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    res.send('Hello World');
})
/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 

})

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    // We want to create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
   
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);