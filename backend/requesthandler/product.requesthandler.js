import productSchema from "../model/model.product.js";

export async function addProduct(req, res) {
    try {
        const { productname, price, description, image, category } = req.body;

        if (!(productname && price && description && image && category)) {
            return res.status(400).send({ message: "All fields are required." });
        }   

        const data = await productSchema.create({ productname, price, description, image, category });

        if (!data) {
            return res.status(400).send({ message: "Product addition failed." });
        }
    
        return res.status(200).send({ message: "Product added successfully." });
    } catch (error) {
        console.error("Error during product addition:", error);
        res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
    
}


export async function getProducts(req, res) {
    try {
        const data = await productSchema.find({}).populate("category");
        if (!data) {
            return res.status(404).send({ message: "No products found." });
        }
        return res.status(200).send({message: "Products fetched successfully.", data });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
}

export async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const data = await productSchema.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);        
        res.status(500).send({ message: "Something went wrong. Please try again later." });        
    }
}

export async function updateProduct(req,res) {
    try{
        const { productname, price, description, image, category, id}=req.body
        const data=await productSchema.updateOne({_id:id},{$set:{productname, price, description, image, category}});
        if (!data) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send({ message: "Product updated successfully." });

    } catch (error) {
        console.log(error);
        
    }
}