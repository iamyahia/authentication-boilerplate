

exports.getPrivateData = (req,res,next)=>{
    res.status(200).json({
        success: true,
        data: 'you got access tot he private data in this route .'
    })
}
