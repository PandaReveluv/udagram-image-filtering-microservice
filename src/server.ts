import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
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

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let image_url: string
    // validate the image url
    try {
      if (typeof req.query['image_url'] === 'undefined' || req.query['image_url'].toString().trim().length === 0) {
        return res.status(422).send("Missing Image URL")
      }
      image_url = new URL(req.query['image_url'].toString()).href
    } catch {
      return res.status(422).send("Invalid Image URL")
    }

    // start filter image process, then delete the filtered file
    try {
      let filtered_image = await filterImageFromURL(image_url)
      res.sendFile(filtered_image)
      // sleep for 3 second to wait for filter_image to be created
      await sleep(3000)
      let to_be_deleted_files = [filtered_image]
      await deleteLocalFiles(to_be_deleted_files)
    } catch (e) {
      console.log('Filter Image error: ' + e)
      return res.status(500).send("Could not get image data")
    }

    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();