import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  // Root Endpoint
  // Endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req, res) => {
    const image_url: string = req.query.image_url;
    const regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (!regex.test(image_url)) {
      res.send("Please use a valid image_url query");
    } else {
      return filterImageFromURL(image_url)
        .then((filteredpath) => {
          res.sendFile(filteredpath);
          setTimeout(deleteLocalFile, 2000);
          function deleteLocalFile() {
            deleteLocalFiles([filteredpath]);
          }
        })
        .catch((error) => {
          if(error = 'Error: Could not find MIME for Buffer <null>') {
            res.status(422).send({
              status_code: 422,
              message: "url passed contains no valid image",
              error
            });
          } else {
            res.status(422).send({
              status_code: 500,
              message: "internal server error",
              error
            });
          }
        });
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();