exports.apiResponse = (args) => {
    const responseResult = {}
    Object.keys(args).forEach( (key) => {
    responseResult[key] = args[key]
    })
    return responseResult;
}