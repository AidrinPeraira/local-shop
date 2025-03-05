//the async handler handle s errior onlty. \
// this is to handle errors in express. 
// thi sis given after evreything isd done on the roputes\
// sp we give this right before app.listen

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

