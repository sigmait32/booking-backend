const Banner = require('../models/banner');


exports.create = async(req,res) =>{
    try{
        const {title,description,urlAddress,picture} = req.body;

        // console.log('req.body is =>',req.body)
        // return;

    
         res.json(await new Banner({title,description,urlAddress,picture}).save());
        
    } catch(err){
        res.status(400).json('Create Banner failed')
    }
}

exports.list = async(req,res) =>{
  
    const banner = await Banner.find({}).sort({createdAt:-1}).exec()

    res.json(banner);
    
}

// exports.clientlist = async(req,res) =>{
  
//   const banner = await Banner.find({}).sort({createdAt:-1}).limit(2).exec()

//   res.json(banner);
  
// }

exports.read = async(req,res) =>{
    const banner = await Banner.findOne({_id:req.params.id}).exec();
    
     res.json(banner);
};

exports.update = async(req,res) =>{
    try{
      // catImg
      const {title,description,urlAddress,picture} = req.body;
        // console.log('update cartegory =>',req.body)
        const updated = await Banner.findOneAndUpdate(
            {_id:req.params.id},
            {title,description,urlAddress,picture},
            {new:true})
            res.json(updated);
    }catch(err){
        res.status(400).send("Banner update failed")
    }
}

exports.remove = async(req,res) =>{
    try{

     
      const deleted = await Banner.findOneAndDelete({ _id: req.params.id });
      res.json(deleted);
      
      
    }catch(error){
        res.status(400).send("Banner delete failed");
    }
}

