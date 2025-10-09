const { model, Schema, connect } = require("mongoose");
const logger = require("../../src/utils/logger");

const connectToDatabase = async () => {
  try {
    await connect("mongodb://localhost:27017/ecommerce");
  } catch (error) {
    logger.error("Error connecting to database", error);
  }
};

connectToDatabase();

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email),
      message: (email) => `${email} is not a valid email`,
    },
  },
  password : {
    type : String,
    minLength : 8,
    maxLength : 50,
    validate : {
        validator : (password) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password),
        message : "This password is not valid"
    }
  }
});

const ProductSchema = new Schema({
    name : {type : String,required : true},
    category : {type : String,enum:["food","medicine","hygene","wellness","drinks","hardware"]}
});

const OrderItemSchema = new Schema({
    product : {type : Schema.Types.ObjectId,ref:"Product"},
    name : {type : String,required : true},
    quantity : {type : Number,required : true,min : 1},
    price : {type : Number,required : true,min : 0},
    options : {
        color : String,
        size : String
    }
},{_id : false});

const AddressSchema = new Schema({
street: String,
city: String,
state: String,
zip: String,
geolocation: {
lat: Number,
lng: Number,
}
}, { _id: false });

const StatusSchema = new Schema({
status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
note: String,
at: { type: Date, default: Date.now },
by: { type: Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const OrderSchema = new Schema({
customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
items: { type: [OrderItemSchema], default: [] },
shippingAddress: AddressSchema,
billingAddress: AddressSchema,
statusLog: { type: [StatusSchema], default: [] },
totalAmount: { type: Number, default: 0, min: 0 },
currency: { type: String, default: 'INR' },
payment: {
method: { type: String, enum: ['card', 'netbanking', 'cod', 'upi'], default: 'card' },
status: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
transactionId: String,
},
coupons: [String],
metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });


OrderSchema.index({ customer: 1, createdAt: -1 });

OrderSchema.pre("save",function(next){
    if(this.items && this.items.length){
        this.totalAmount = this.items.reduce((sum,it)=>sum + (it.quantity * it.price), 0)
    }
    else{
        this.totalAmount = 0
    }
    next()
})

OrderSchema.methods.recalculateTotal = function() {
this.totalAmount = (this.items || []).reduce((s, i) => s + i.quantity * i.price, 0);
return this.totalAmount;
}

OrderSchema.statics.findByCustomer = function(customerId) {
return this.find({ customer: customerId }).sort({ createdAt: -1 });
}

const Order = new model("Order",OrderSchema)
const User = new model("User",UserSchema)
const Product = new model("Product",ProductSchema)

const createUser = async(name,email,password) => {
    const user = await User.create({name,email,password})
    console.log(user)
}

// createUser("Partha Saradhi","parthasaradhimunakala@gmail.com","Parthu12345@")


const createOrder = async() => {
    try {
        const orderData = {
            customer : "68e774679413b2f19c2df7f7",
            items: [
                    { "product": "64f0a1c9f3a6b1a2b3c4d000", "name": "T-Shirt", "quantity": 2, "price": 499, "options": { "color": "red", "size": "L" } },
                    { "product": "64f0a1c9f3a6b1a2b3c4d111", "name": "Jeans", "quantity": 1, "price": 1499 }
                    ],
            shippingAddress: { "street": "MG Road", "city": "Bengaluru", "state": "KA", "zip": "560001" },
            payment: { "method": "card", "status": "paid", "transactionId": "txn_123" }
        }
        const order = await Order.create(orderData)
        console.log(order)
    } catch (error) {
        logger.error("There was an error while creating the order")
    }
}

// createOrder()

//read
const search = async() => {
    try {
        const orderData = await Order.find({"items.name":"T-Shirt"}).populate("customer")
        console.log(orderData)
    } catch (error) {
        logger.error("There was an error while searching")
    }
}

const addCoupon= async(coupon) =>{
    try {
        const updatedOrder = await Order.updateMany({},{$push : {coupons : "lsknvlsknldkmvs;"}})
        console.log(updatedOrder)
    } catch (error) {
        logger.error("There was an error while adding the coupon",error)
    }
} 

// search()

addCoupon("100RS67Y")

