import Product from "../models/product.js";
import cloudinary from "../configs/cloudinary.js";


export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    
    console.log("=== ADD PRODUCT DEBUG ===");
    console.log("Received files count:", images?.length || 0);
    console.log("File details:", images?.map(f => ({ name: f.originalname, size: f.size })));
    
    if (!images || images.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }
    
    console.log("Starting Cloudinary upload for", images.length, "images...");
    let imagesUrl = await Promise.all(
      images.map(async (item, index) => {
        console.log(`Uploading image ${index + 1}/${images.length}:`, item.originalname);
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        console.log(`Upload ${index + 1} successful:`, result.secure_url);
        return result.secure_url;
      })
    );
    
    console.log("All images uploaded successfully:", imagesUrl.length, "URLs");
    console.log("Creating product with images:", imagesUrl);
    
    await Product.create({ ...productData, image: imagesUrl });
    
    console.log("Product created successfully with", imagesUrl.length, "images");
    res.json({ success: true, message: "product added", imageCount: imagesUrl.length });
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.json({ success: false, message: error.message });
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// get single product :/api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    
    const product = await Product.findByIdAndUpdate(
      id, 
      { inStock }, 
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.json({ success: true, message: "Stock updated successfully", product });
  } catch (error) {
    console.log("Error in changeStock:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update product :/api/product/update
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.body;
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    
    console.log("=== UPDATE PRODUCT DEBUG ===");
    console.log("Product ID:", id);
    console.log("New files count:", images?.length || 0);
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    // If new images are uploaded, upload to cloudinary and update image URLs
    if (images && images.length > 0) {
      console.log("Uploading new images to Cloudinary...");
      const imagesUrl = await Promise.all(
        images.map(async (item, index) => {
          console.log(`Uploading image ${index + 1}/${images.length}:`, item.originalname);
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          console.log(`Upload ${index + 1} successful:`, result.secure_url);
          return result.secure_url;
        })
      );
      productData.image = imagesUrl;
      console.log("New images uploaded:", imagesUrl.length);
    } else {
      // Keep existing images if no new images uploaded
      productData.image = existingProduct.image;
      console.log("No new images, keeping existing images");
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    );
    
    console.log("Product updated successfully");
    res.json({ 
      success: true, 
      message: "Product updated successfully", 
      product: updatedProduct,
      imageCount: productData.image.length 
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete product :/api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    
    console.log("=== DELETE PRODUCT DEBUG ===");
    console.log("Product ID:", id);
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    console.log("Product deleted successfully:", product.name);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
