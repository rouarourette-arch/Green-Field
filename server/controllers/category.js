import {category} from "../models/index.js"


export const getAllcategorys=async(req, res)=>{
try{
  
const categorys=await category.findAll()
return res.status(200).json(categorys)
}
catch(error){console.log("error")
res.status(500).json({message:"error in fetching data"})
}}


export const addcategory=async(req,res)=>{
try{
 const {name,description}=req.body
 const newcategory=await category.create({name,description})
 return res.status(201).json({message:"category created"})
}
catch(error){console.log(error)
res.status(500).json({message:"failed in creating new category"})
}}

export const deletecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await category.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "category not found" });
    }
    return res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.log(error, "error from deleting category");
    return res.status(500).json({ message: "failed to delete category" });
  }
};

