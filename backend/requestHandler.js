// backend/requestHandler.js
import loginSchema from './models/login.model.js';
import userSchema from './models/user.model.js';
import productSchema from './models/product.model.js';
import companySchema from './models/company.model.js';
import categorySchema from './models/category.model.js';
import addressSchema from './models/address.model.js';
import cartSchema from './models/cart.model.js';
import wishlistSchema from './models/wishlist.model.js';
import orderSchema from './models/order.model.js';
import adminSchema from './models/admin.model.js';
import soldproductSchema from './models/soldproduct.model.js'
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import nodemailer from "nodemailer";
const {sign}=pkg;
//mail transport
const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for port 465, false for other ports
    service:"gmail",
    auth: {
      user: "qrfs4444@gmail.com",
      pass: "qetf gphp xrgt penw",
    },
});

export async function home(req,res) {
    try {
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        const products = await productSchema.find({
            sellerId: { $ne: _id },  
            isBlocked: { $ne: true } 
          });
          
        return res.status(200).send({username:user.username,role:user.role,products});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function profile(req,res) {
    try {
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const profile=await userSchema.findOne({userId:_id});
        const address=await addressSchema.findOne({userId:_id},{addresses:1});
        const cart=await cartSchema.countDocuments({buyerId:_id})
        const wishlist=await wishlistSchema.countDocuments({buyerId:_id})
        const orders=await orderSchema.countDocuments({buyerId:_id})
        return res.status(200).send({username:user.username,role:user.role,profile,address,cart,wishlist,orders})
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function editUser(req,res) {
    try {
    const {...user}=req.body;
    const id=req.user.userId
    const check=await userSchema.findOne({userId:id})
    if(check){
        const data=await userSchema.updateOne({userId:id},{$set:{...user}});
    }else{
        const data=await userSchema.create({userId:id,...user});
    }
    return res.status(201).send({msg:"updated"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function editAddress(req,res) {
    try {
    const address=req.body;
    const id=req.user.userId
    const check=await addressSchema.findOne({userId:id})
    if(check){
        const data=await addressSchema.updateOne({userId:id},{$set: { addresses: address }  });
    }else{
        const data=await addressSchema.create({userId:id,addresses:address});
    }
    return res.status(201).send({msg:"updated"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function company(req,res) {
    try {
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const company=await companySchema.findOne({sellerId:_id});
        const category=await categorySchema.find();
        return res.status(200).send({username:user.username,role:user.role,company,category})
        
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function editCompany(req,res) {
    try {
    const {...company}=req.body;
    const id=req.user.userId
    const check=await companySchema.findOne({sellerId:id})
    if(check){
        const data=await companySchema.updateOne({sellerId:id},{$set:{...company}});
    }else{
        const data=await companySchema.create({sellerId:id,...company});
    }
    return res.status(201).send({msg:"updated"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function editCategory(req,res) {
    try {
        
        const {newCategory}=req.body;
    const check=await categorySchema.findOne({})
    
    if(check){
        const data=await categorySchema.updateOne({_id:check._id},{$push:{categories:newCategory}});
    }else{
        const data=await categorySchema.create({categories:[newCategory]});
    }
    return res.status(201).send({msg:"updated"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function addProduct(req,res) {
    try {
        const product=req.body;
        console.log(product);
        const id=req.user.userId;
        const data=await productSchema.create({sellerId:id,...product});
        return res.status(201).send({msg:"Adding complete"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function products(req,res) {
    try {
        const {category}=req.params;
        const _id=req.user.userId;
        
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const products=await productSchema.find({$and:[{sellerId:_id},{category}]});
        return res.status(200).send({username:user.username,role:user.role,products})
        
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function getProduct(req,res) {
    try {
        const {_id}=req.params;
        const id=req.user.userId;
        const user=await loginSchema.findOne({_id:id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const product=await productSchema.findOne({_id});
        const category=await categorySchema.find();
        return res.status(200).send({username:user.username,role:user.role,product,category})
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function editProduct(req,res) {
    try {
        const {...product}=req.body;
        const id=req.user.userId;
        const data=await productSchema.updateOne({_id:product._id},{...product});
        return res.status(201).send({msg:"Updated"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function product(req,res) {
    try {
        const {_id}=req.params;
        const id=req.user.userId;
        let isOnCart=false;
        let isOnWishlist=false;
        const user=await loginSchema.findOne({_id:id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const product=await productSchema.findOne({_id});
        const check1=await cartSchema.findOne({$and:[{"product._id":_id},{buyerId:id}]});
        const check2=await wishlistSchema.findOne({$and:[{productId:_id},{buyerId:id}] })
        if(check1)
            isOnCart=true;
        if(check2)
            isOnWishlist=true;
        return res.status(200).send({username:user.username,role:user.role,product,isOnCart,isOnWishlist})
        
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function blockProduct(req,res) {
    try {
        const {_id}=req.params;
        const {blocked}=req.body
        console.log(blocked);
        
        
        const id=req.user.userId;
        const user=await loginSchema.findOne({_id:id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const product=await productSchema.findOneAndUpdate({_id},{$set:{isBlocked:blocked}});
        if(!product)
            return res.status(404).send({msg:"Product not found"});
        
        return res.status(200).send({username:user.username,role:user.role,product})
        
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function deleteProduct(req,res) {
    try {
        const {_id}=req.params;
        const id=req.user.userId;
        console.log("deleted");
        
        const user=await loginSchema.findOne({_id:id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const product=await productSchema.findOneAndDelete({_id});
        if(!product)
            return res.status(404).send({msg:"Product not found"});
        
        return res.status(200).send({username:user.username,role:user.role,product})
        
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function addToCart(req,res) {
    try {
        const cart=req.body;
        const id=req.user.userId;
        const data=await cartSchema.create({buyerId:id,...cart});
        return res.status(201).send({msg:"Added to Cart"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function removeFromCart(req, res) {
    try {
      const { id } = req.body;
      const userId = req.user.userId;
      
      // Find and delete the cart item
      const deletedItem = await cartSchema.findOneAndDelete({
        _id: id,
        buyerId: userId
      });
      
      if (!deletedItem) {
        return res.status(404).send({ msg: "Item not found in cart" });
      }
      
      return res.status(201).send({ msg: "Removed from Cart" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: "Server error" });
    }
  }

export async function getCart(req,res) {
    try {
        const id=req.user.userId;
        const user=await loginSchema.findOne({_id:id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const cart=await cartSchema.find({buyerId:id});
        const addresses=await addressSchema.findOne({userId:id},{addresses:1})
        return res.status(200).send({username:user.username,role:user.role,cart,addresses})
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function getSingleCart(req,res) {
    try {
        const {pid}=req.params;
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const cart=await cartSchema.findOne({buyerId:_id,'product._id': pid});
        const addresses=await addressSchema.findOne({userId:_id},{addresses:1})
        return res.status(200).send({username:user.username,role:user.role,cart,addresses})
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}


export async function editQuantity(req,res) {
    try {
        const {id,quantity,type}=req.body;
        let newQuantity=0;
        const bid=req.user.userId;
        const user=await loginSchema.findOne({_id:bid})
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        if(type==='increase'){
            newQuantity=quantity+1;
        }else if(type==='decrease' && quantity>0){
            newQuantity=quantity-1
        }else{
            newQuantity=0;
        }
        const data=await cartSchema.updateOne({_id:id},{ $set: { quantity: newQuantity }} );
        return res.status(201).send({msg:"Updated"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function addToWishlist(req,res) {
    try {
        const {id}=req.body;
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id})
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const wishlist=await wishlistSchema.create({buyerId:_id,productId:id});
        return res.status(201).send({msg:"success"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function removeFromWishlist(req,res) {
    try {
        const {id}=req.body;
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id})
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const wishlist=await wishlistSchema.deleteOne({$and:[{buyerId:_id},{productId:id}]});
        return res.status(201).send({msg:"removed"});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function getWishlists(req,res) {
    try {
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const wishlist=await wishlistSchema.find({buyerId:_id});
        const productPromises = wishlist.map(async (list) => {
            return await productSchema.findOne({ _id: list.productId });
        });
        const products = await Promise.all(productPromises);
        return res.status(200).send({username:user.username,role:user.role,products});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function getOrders(req,res) {
    try {
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const orders=await orderSchema.find({buyerId:_id});
        return res.status(200).send({username:user.username,role:user.role,orders});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function getsellOrders(req,res) {
    try {
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const orders=await soldproductSchema.find({sellerId:_id});
        const quat=await productSchema.find({sellerId:_id})
        return res.status(200).send({username:user.username,role:user.role,orders,quat});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function addOrders(req, res) {
    try {
        const {selectedAddress}=req.body;
        const _id = req.user.userId;
        const user = await loginSchema.findOne({ _id });
        if (!user) return res.status(403).send({ msg: "Unauthorized access" });

        const cart = await cartSchema.find({ buyerId: _id }); // Find all cart items for the user
        
        if (!cart || cart.length === 0) {
            return res.status(404).send({ msg: "No cart items found" });
        }

        // Process each cart item in parallel
        const orderPromises = cart.map(async (c) => {
            const size = c.size;
            const field = `sizeQuantities.${size}`; // Dynamic field name for the size
            const quantity = await productSchema.findOne({ _id: c.product._id }, { sizeQuantities: 1 });
            
            if (quantity && quantity.sizeQuantities[size] !== undefined && quantity.sizeQuantities[size] >= c.quantity) {
                const newQuantity = quantity.sizeQuantities[size] - c.quantity;

                // Update the product's quantity
                await productSchema.updateOne({ _id: c.product._id }, { $set: { [field]: newQuantity } });

                // Remove the product from the cart and create an order
                await cartSchema.deleteOne({ buyerId: _id, "product._id": c.product._id });
                await orderSchema.create({ buyerId: _id,size:size, product: c.product});
                await soldproductSchema.create({ buyerId: _id, sellerId: c.product.sellerId,size:size, product: c.product,address:selectedAddress  });
            } else {
                // Handle case when the size or quantity is not sufficient
                throw new Error(`Insufficient stock for product ${c.product}`);
            }
        });

        // Wait for all orderPromises to resolve
        await Promise.all(orderPromises);

        return res.status(201).send({ msg: "Orders placed successfully",msg1:"success" });
    } catch (error) {
        console.error("Error placing orders:", error);
        return res.status(500).send({ msg: "Error occurred while processing the order" });
    }
}


export async function addOrder(req,res) {
    try {
        const {id}=req.body;
        const _id=req.user.userId;
        const user=await loginSchema.findOne({_id})
        if(!user)
            return res.status(403).send({msg:"Unauthorized acces"});
        const cart = await cartSchema.findOne({ buyerId: _id,'product._id': id  });// Find the single cart item   
        if (cart) {
            const product = cart;  // Since there's only one item, no need to loop
            const size = product.size;0
                        const field = `sizeQuantities.${size}`;
            const quantity = await productSchema.findOne({ _id: id },{sizeQuantities:1});
            
            if (quantity && quantity.sizeQuantities[size] !== undefined && quantity.sizeQuantities[size] >= product.quantity) {
                const newQuantity = quantity.sizeQuantities[size] - product.quantity;
                
                // Update the quantity in the database
                productSchema.updateOne({ _id: id }, { $set: { [field]: newQuantity } }).then(async()=>{
                    await cartSchema.deleteOne({$and:[{buyerId:_id},{"product._id":id}]});
                    await orderSchema.create({buyerId:_id,size:size,product:cart.product});
                    await soldproductSchema.create({buyerId:_id,sellerId:cart.product.sellerId,size:size,product:cart.product});
                    return res.status(201).send({msg:"success"});
                }).catch((error)=>{
                    console.log(error);
                    return res.status(201).send({msg:"error occured"});
                })
            } else {
                return res.status(201).send({msg:"Size not found for product"});
            }
        } else {
            return res.status(201).send({msg:"No cart item found for buyer with id"});
        }
        
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

export async function verifyEmail(req,res) {
    try {
        const { email } = req.body;
    
        if (!email) {
          return res.status(400).send({ msg: "Email is required" });
        }
        const userExist = await userSchema.findOne({ email });
        if (userExist) {
          return res.status(400).send({ msg: "Email already exists" });
        }
    
        await sendNotRegisteredEmail(email);
    
        return res.status(200).send({ msg: "Email sent successfully" });
      } catch (error) {
        console.error("Error in signup:", error.message);
        return res.status(500).send({ msg: "An error occurred. Please try again." });
      }
    }
    async function sendNotRegisteredEmail(email) {
        const transporter = nodemailer.createTransport({
          service: "Gmail", 
          auth: {
            user: "qrfs4444@gmail.com",
            pass: "qetf gphp xrgt penw",
          },
        });
      
        const mailOptions = {
          from:  'qrfs4444@gmail.com',
              to: `${email}`, 
              subject: "Please Confirm Your Action",
              html: `
                <p>Dear User,</p>
                <p>To confirm your action, please click the button below:</p>
                <a href="http://localhost:5173/signup" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Confirm</a>
                <p>If you didn't request this, you can ignore this email.</p>`,
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log(`Notification email sent to: ${email}`);
        } catch (error) {
          console.error("Error sending email:", error);
        }
}
export async function signUp(req,res) {
  try {
      const {email,username,password,cpassword,role}=req.body;
      
      if(!(email&&username&&password&&cpassword&&role))
          return res.status(404).send({msg:"fields are empty"});

      if(password!==cpassword)
          return res.status(404).send({msg:"password not matched"})      
      bcrypt.hash(password,10).then((hashedPassword)=>{
        loginSchema.create({email,username,password:hashedPassword,role}).then(()=>{
              return res.status(201).send({msg:"success"});
          }).catch((error)=>{
              return res.status(404).send({msg:"Not registered"})
          })
      }).catch((error)=>{
          return res.status(404).send({msg:"error"}); 
      })
  } catch (error) {
      return res.status(404).send({msg:"error"});
  }
}

export async function signIn(req,res) {
    try {
  const {email,password}=req.body;  

  if(!(email&&password))
      return res.status(404).send({msg:"feilds are empty"})

  const user=await loginSchema.findOne({email})
  if(user===null)
      return res.status(404).send({msg:"invalid email"})

  //convert to hash and compare using bcrypt
  const success=await bcrypt.compare(password,user.password);
  if(success!==true)
      return res.status(404).send({msg:"email or password is invalid"})
  //generate token using sign(JWT key)
  const token=await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"});
  return res.status(200).send({msg:"Succefully logged in",token})
    } catch (error) {
        return res.status(404).send({msg:"error"});
    }
}

export async function searchItemZ(req, res) {

        try {
            const { category } = req.params;
            const { search } = req.query; // Assuming search term comes as a query parameter
            const _id = req.user.userId;
    
            const user = await loginSchema.findOne({ _id });
            // if (!user)
            //     return res.status(403).send({ msg: "Unauthorized access" });
    
            // Build the query for the database
            const searchQuery = {
                sellerId: _id,
                category,
            };
    
            if (search) {
                // If a search term is provided, include it in the query
                searchQuery.name = { $regex: search, $options: 'i' };  // Assuming `name` is the product name field
            }
    
            const products = await productSchema.find(searchQuery);
            return res.status(200).send({ username: user.username, role: user.role, products });
    
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: "Error occurred" });
        }
    
  }

  export async function updateorderstatus(req,res) {
    try {
    const {status}=req.body;
    const  {id}  = req.body; 
    const  {buyerId}  = req.body; 
    console.log(buyerId);
   
        if(status=="approved")
        {
            const useremail=await userSchema.findOne({userId:buyerId})
            console.log(useremail);
            await orderapproveEmail(useremail.email);
            
        }
        if(status=="rejected")
            {
                const useremail=await userSchema.findOne({userId:buyerId })
                console.log(useremail);
                await orderrejectEmail(useremail.email);
            }
        const data=await soldproductSchema.updateOne({_id:id},{$set: { status: status }  }); 

    return res.status(201).send({msg:"updated"});

    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}

async function orderapproveEmail(email) {
    const transporter = nodemailer.createTransport({
      service: "Gmail", 
      auth: {
        user: "qrfs4444@gmail.com",
        pass: "qetf gphp xrgt penw",
      },
    });
  
    const mailOptions = {
      from:  'qrfs4444@gmail.com',
          to: `${email}`, 
          subject: "Your Order has been Shipped Succesfully",
          html: `
            <p>Dear Shoppie User,</p>
            <p>your order from Shoppie has been placed succesfully.hope you are enjoy our produts</p>
            <a href="" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Track Order</a>
            <p>If you didn't Order this, you can ignore this email.</p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notification email sent to: ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
}

async function orderrejectEmail(email) {
    const transporter = nodemailer.createTransport({
      service: "Gmail", 
      auth: {
        user: "qrfs4444@gmail.com",
        pass: "qetf gphp xrgt penw",
      },
    });
  
    const mailOptions = {
      from:  'qrfs4444@gmail.com',
          to: `${email}`, 
          subject: "Your order request has been rejected",
          html: `
            <p>Dear Shoppie User,</p>
            <p>your order from Shoppie has been Cancelled by the seller.you can retry after sometimes</p>
            <p>sorry for the inconvenience caused</p>
            <p>If you didn't Order this, you can ignore this email.</p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notification email sent to: ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
}


export async function createAdmin(req, res) {
    try {
        const { email, username, password } = req.body;
        
        if (!(email && username && password))
            return res.status(400).send({ msg: "Fields are empty" });
        
        // Check if admin already exists
        const adminExists = await adminSchema.countDocuments();
        if (adminExists > 0) {
            return res.status(403).send({ msg: "Admin already exists, only one admin allowed" });
        }
        
        // Hash password and create admin
        const hashedPassword = await bcrypt.hash(password, 10);
        await adminSchema.create({ email, username, password: hashedPassword });
        
        return res.status(201).send({ msg: "Admin created successfully" });
    } catch (error) {
        console.error("Admin creation error:", error);
        return res.status(500).send({ msg: "Error creating admin" });
    }
}

// Admin login
export async function adminSignIn(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!(email && password))
            return res.status(400).send({ msg: "Fields are empty" });
        
        const admin = await adminSchema.findOne({ email });
        if (!admin)
            return res.status(404).send({ msg: "Invalid email" });
        
        const success = await bcrypt.compare(password, admin.password);
        if (!success)
            return res.status(404).send({ msg: "Email or password is invalid" });
        
        // Generate admin token
        const token = await sign(
            { adminId: admin._id, isAdmin: true },
            process.env.ADMIN_JWT_KEY,
            { expiresIn: "24h" }
        );
        
        return res.status(200).send({ msg: "Successfully logged in", token });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).send({ msg: "Error logging in" });
    }
}

// Get all sellers
export async function getAllSellers(req, res) {
    try {
        // Find all users with role 'seller'
        const sellers = await loginSchema.find({ role: "seller" });
        
        // Get company details for each seller
        const sellerDetails = await Promise.all(
            sellers.map(async (seller) => {
                const company = await companySchema.findOne({ sellerId: seller._id });
                const userDetails = await userSchema.findOne({ userId: seller._id });
                
                return {
                    _id: seller._id,
                    email: seller.email,
                    username: seller.username,
                    isBlocked: seller.isBlocked || false,
                    company: company || {},
                    userDetails: userDetails || {}
                };
            })
        );
        
        return res.status(200).send({ sellers: sellerDetails });
    } catch (error) {
        console.error("Error getting sellers:", error);
        return res.status(500).send({ msg: "Error occurred while fetching sellers" });
    }
}

// Get all seller products
export async function getSellerProducts(req, res) {
    try {
        const { sellerId } = req.params;
        
        const products = await productSchema.find({ sellerId });
        const seller = await loginSchema.findOne({ _id: sellerId });
        const company = await companySchema.findOne({ sellerId });
        
        if (!seller) {
            return res.status(404).send({ msg: "Seller not found" });
        }
        
        return res.status(200).send({ 
            sellerName: seller.username,
            company,
            products
        });
    } catch (error) {
        console.error("Error getting seller products:", error);
        return res.status(500).send({ msg: "Error occurred while fetching seller products" });
    }
}

// Block/unblock seller
export async function toggleSellerBlock(req, res) {
    try {
        const { sellerId, isBlocked } = req.body;
        
        // Update the login record to set isBlocked status
        await loginSchema.updateOne(
            { _id: sellerId },
            { $set: { isBlocked: isBlocked } }
        );
        
        // If we're blocking the seller, also notify them via email
        if (isBlocked) {
            const seller = await loginSchema.findOne({ _id: sellerId });
            const userDetails = await userSchema.findOne({ userId: sellerId });
            
            if (userDetails && userDetails.email) {
                await sendSellerBlockedEmail(userDetails.email);
            }
        }
        
        return res.status(200).send({ 
            msg: isBlocked ? "Seller blocked successfully" : "Seller unblocked successfully" 
        });
    } catch (error) {
        console.error("Error toggling seller block status:", error);
        return res.status(500).send({ msg: "Error occurred while updating seller status" });
    }
}

// Email notification for blocked seller
async function sendSellerBlockedEmail(email) {
    try {
        const mailOptions = {
            from: 'qrfs4444@gmail.com',
            to: email,
            subject: "Your Seller Account Has Been Blocked",
            html: `
                <p>Dear Seller,</p>
                <p>We regret to inform you that your seller account has been blocked by the administrator.</p>
                <p>If you believe this is an error, please contact our support team.</p>
                <p>Thank you for your understanding.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Block notification email sent to: ${email}`);
    } catch (error) {
        console.error("Error sending block email:", error);
    }
}

// Admin dashboard stats
export async function getAdminDashboardStats(req, res) {
    try {
        // Count total sellers
        const totalSellers = await loginSchema.countDocuments({ role: "seller" });
        
        // Count total buyers
        const totalBuyers = await loginSchema.countDocuments({ role: "buyer" });
        
        // Count total products
        const totalProducts = await productSchema.countDocuments();
        
        // Count total orders
        const totalOrders = await orderSchema.countDocuments();
        
        // Count blocked sellers
        const blockedSellers = await loginSchema.countDocuments({ 
            role: "seller", 
            isBlocked: true 
        });
        
        // Recent orders (last 10)
        const recentOrders = await soldproductSchema.find()
            .sort({ _id: -1 })
            .limit(10);
            
        return res.status(200).send({
            stats: {
                totalSellers,
                totalBuyers,
                totalProducts,
                totalOrders,
                blockedSellers
            },
            recentOrders
        });
    } catch (error) {
        console.error("Error getting admin dashboard stats:", error);
        return res.status(500).send({ msg: "Error occurred while fetching dashboard statistics" });
    }
}

