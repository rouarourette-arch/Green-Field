import {product} from "../models/index.js"


export const getAllproducts=async(req, res)=>{
try{
  
const products=await product.findAll()
return res.status(200).json(products)
}
catch(error){console.log("error")
res.status(500).json({message:"error in fetching data"})
}}

export const getproductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await product.findByPk(id); 
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const addproduct=async(req,res)=>{
try{
 const {name,price,stock,images,description,categoryId}=req.body
 const newproduct=await product.create({name,price,stock,images,description,categoryId})
 return res.status(201).json({message:"product created"})
}
catch(error){console.log(error)
res.status(500).json({message:"failed in creating new product"})
}}

export const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await product.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "product not found" });
    }
    return res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.log(error, "error from deleting product");
    return res.status(500).json({ message: "failed to delete product" });
  }
};

export const updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, price } = req.body;

    const [updated] = await product.update({ stock, price },{ where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "product not found" });
    }

    const updatedproduct = await product.findByPk(id);
    return res .status(200).json({ message: "product updated successfully", data: updatedproduct });
  } catch (error) {
    console.log(error, "error from updating product");
    return res.status(500).json({ message: "failed to update product" });
  }
};