//this is is where we add any additional middlewares if  needed.


//async handler. TO handle async functions
/**
 * WHy do we need this funtion?
 *  aync functions will return a promise. so wrapping it inside a promise.resolve doesn't affect it
 *  doing so will allow us to handle error gracefully.
 *  We don't have to create an error handling every time an async function is called
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      res
        .status(500)
        .json({ message: error.message })
    });
  };
};
