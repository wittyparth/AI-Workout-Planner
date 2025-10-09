Perfect 👌 — here’s the full **“Mongoose — Part 1: CREATE Complex Documents”** tutorial, written to teach you real-world schema design, validation, hooks, and transactions — step by step.

---

# 🧠 Mongoose — Part 1: CREATE Complex Documents

## 🏗️ Overview

In this part, you’ll learn how to **create complex documents** using Mongoose — including schema setup, embedded and referenced data, validation, and advanced create operations.

---

## ⚙️ Step 1: Basic Setup

**Install dependencies**

```bash
npm install mongoose
```

**Connect to MongoDB**

```js
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongoose_tutorial");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  }
}

connectDB();
```

---

## 🧩 Step 2: Defining a Complex Schema

We’ll model a **User** with embedded **Address** and referenced **Orders**.

```js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, match: /^[0-9]{5}$/ }
});

const orderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  price: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  age: { type: Number, min: 13, max: 120 },
  address: addressSchema,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
export const Order = mongoose.model("Order", orderSchema);
```

---

## 🧠 Step 3: Creating and Saving Documents

```js
import { User, Order } from "./models.js";

async function createUserAndOrder() {
  const order = await Order.create({
    product: "Laptop",
    price: 1250
  });

  const user = new User({
    name: "Alice",
    email: "alice@example.com",
    age: 29,
    address: {
      street: "123 Main St",
      city: "New York",
      zip: "10001"
    },
    orders: [order._id]
  });

  await user.save();
  console.log("✅ User created:", user);
}

createUserAndOrder();
```

---

## 🧲 Step 4: Using Pre/Post Hooks

Hooks let you run logic before or after certain actions (e.g., before saving).

```js
userSchema.pre("save", function (next) {
  console.log(`🪄 Preparing to save user: ${this.name}`);
  next();
});

userSchema.post("save", function (doc, next) {
  console.log(`✅ User ${doc.name} saved successfully`);
  next();
});
```

Now every time you call `user.save()`, these hooks run automatically.

---

## 💣 Step 5: Handling Errors Gracefully

```js
try {
  await User.create({
    name: "Bob",
    email: "invalid_email",
    age: 25
  });
} catch (err) {
  if (err.name === "ValidationError") {
    console.log("❌ Validation Error:", err.message);
  } else if (err.code === 11000) {
    console.log("⚠️ Duplicate email detected");
  } else {
    console.log("🚨 Unexpected Error:", err);
  }
}
```

---

## 💼 Step 6: Using Transactions

When creating related documents, ensure **atomicity** with transactions.

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  const order = await Order.create([{ product: "Phone", price: 800 }], { session });

  const user = await User.create([{
    name: "Charlie",
    email: "charlie@example.com",
    age: 33,
    address: {
      street: "45 Ocean Drive",
      city: "Miami",
      zip: "33101"
    },
    orders: [order[0]._id]
  }], { session });

  await session.commitTransaction();
  console.log("✅ Transaction committed:", user);
} catch (err) {
  await session.abortTransaction();
  console.error("❌ Transaction aborted:", err);
} finally {
  session.endSession();
}
```

---

## 🧪 Step 7: Exercises

Try these on your own:

1. Create a schema for `Product` with nested `reviews` (array of objects).
2. Add a custom validator to ensure `price` is always > 0.
3. Create a transaction that:

   * Creates a `Product`
   * Adds it to a `User`’s wishlist array
4. Add a `pre("validate")` hook that logs before validation occurs.

Perfect 🔥 — here’s the complete **“Mongoose — Part 2: READ, Query & Populate Deeply”** tutorial, continuing exactly from where Part 1 left off.

---

# 📘 Mongoose — Part 2: READ, Query & Populate Deeply

## 🧠 Overview

In this part, you’ll master **reading and querying documents** with Mongoose — including filters, projections, sorting, population, pagination, and basic aggregation.

---

## ⚙️ Step 1: Setup Recap

We’ll reuse the same `User` and `Order` models from **Part 1**.

```js
import { User, Order } from "./models.js";
```

---

## 🔍 Step 2: Basic Read Queries

### 1️⃣ Find All Users

```js
const users = await User.find();
console.log(users);
```

### 2️⃣ Find One by Field

```js
const user = await User.findOne({ email: "alice@example.com" });
```

### 3️⃣ Find by ID

```js
const user = await User.findById("66fdf301a01ef40007f5c9a1");
```

### 4️⃣ Projections (select specific fields)

```js
const user = await User.findOne(
  { email: "alice@example.com" },
  "name email age"
);
```

### 5️⃣ Sorting

```js
const sortedUsers = await User.find().sort({ age: -1 }); // descending
```

---

## 🎯 Step 3: Filtering with Operators

Mongoose supports MongoDB’s query operators directly.

```js
const teens = await User.find({ age: { $gte: 13, $lte: 19 } });
const gmailUsers = await User.find({ email: /@gmail\.com$/i });
const usersWithOrders = await User.find({ orders: { $exists: true, $ne: [] } });
const specific = await User.find({ $or: [{ city: "Miami" }, { age: { $lt: 25 } }] });
```

---

## 🔗 Step 4: Population (JOIN-like behavior)

### 1️⃣ Basic populate

```js
const user = await User.findOne({ email: "alice@example.com" }).populate("orders");
```

### 2️⃣ Select fields from populated docs

```js
const user = await User.findOne({ email: "alice@example.com" })
  .populate({ path: "orders", select: "product price" });
```

### 3️⃣ Nested populate (when orders have references to another model)

```js
const user = await User.findOne({ email: "alice@example.com" })
  .populate({
    path: "orders",
    populate: { path: "productId", select: "name category" }
  });
```

---

## 📄 Step 5: Pagination

### 1️⃣ Using `skip()` and `limit()`

```js
const page = 2;
const limit = 5;
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });
```

### 2️⃣ Paginated API Example

```js
app.get("/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit);
  const total = await User.countDocuments();

  res.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: users
  });
});
```

---

## 📊 Step 6: Aggregation Basics

Aggregation lets you analyze or transform data on the server side.

### 1️⃣ Simple pipeline

```js
const result = await Order.aggregate([
  { $match: { price: { $gte: 500 } } },
  { $group: { _id: "$product", totalRevenue: { $sum: "$price" } } },
  { $sort: { totalRevenue: -1 } }
]);
```

### 2️⃣ Aggregating with lookup (JOIN)

```js
const result = await User.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "orders",
      foreignField: "_id",
      as: "orderDetails"
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      "orderDetails.product": 1,
      "orderDetails.price": 1
    }
  }
]);
```

---

## ⚙️ Step 7: Lean Queries

If you don’t need Mongoose document methods, use `.lean()` for better performance.

```js
const users = await User.find().lean();
```

This returns plain JS objects instead of heavy Mongoose document instances — great for APIs.

---

## 🧠 Step 8: Common Pitfalls

* ❌ Using `populate()` inside loops — use `populate()` once with multiple paths instead.
* ❌ Populating too deeply — affects performance; consider denormalization for frequent joins.
* ⚡ Always use indexes for frequently queried fields (e.g., email, createdAt).
* 🧹 Use `.select()` to limit data transfer.

---

## 🧪 Step 9: Practice Challenges

1. Write a query to fetch all users **older than 25** who have **at least one order**.
2. Fetch the **total number of orders** per user using an **aggregation pipeline**.
3. Implement an **infinite scroll pagination API** for `Orders`.
4. Use `populate` to get users along with **order count and total spent**.

---

## ✅ Summary

You’ve mastered:

* `find()`, `findOne()`, and projections
* Filtering and sorting with MongoDB operators
* Populating referenced documents (nested and selective)
* Pagination patterns
* Aggregation basics
* Lean queries and performance tips

Perfect ✅ — here’s the full **“Mongoose — Part 3: UPDATE, Hooks & Middleware”** tutorial, continuing seamlessly from Parts 1 and 2.

---

# 📝 Mongoose — Part 3: UPDATE, Hooks & Middleware

## 🧠 Overview

In this part, you’ll learn how to **update documents**, leverage **Mongoose middleware**, and implement **validation during updates**. These are essential for maintaining data integrity in real-world apps.

---

## ⚙️ Step 1: Basic Update Operations

Mongoose provides several ways to update documents.

### 1️⃣ `updateOne()` and `updateMany()`

```js
// Update a single user
await User.updateOne(
  { email: "alice@example.com" },
  { $set: { age: 30 } }
);

// Update multiple users
await User.updateMany(
  { age: { $lt: 18 } },
  { $set: { isMinor: true } }
);
```

### 2️⃣ `findOneAndUpdate()`

```js
const updatedUser = await User.findOneAndUpdate(
  { email: "alice@example.com" },
  { $inc: { age: 1 } }, // increment age by 1
  { new: true, runValidators: true } // return updated doc & run validators
);
console.log(updatedUser);
```

### 3️⃣ Document `.save()` after modifying fields

```js
const user = await User.findOne({ email: "alice@example.com" });
user.age = 31;
await user.save(); // triggers pre/post save hooks
```

---

## 🔧 Step 2: Mongoose Middleware (Hooks)

Middleware allows you to **run logic before or after certain operations**.

### 1️⃣ Pre-hooks

```js
userSchema.pre("updateOne", function(next) {
  console.log("⚡ About to update a user:", this.getQuery());
  next();
});

userSchema.pre("save", function(next) {
  this.name = this.name.trim();
  next();
});
```

### 2️⃣ Post-hooks

```js
userSchema.post("updateOne", function(result, next) {
  console.log("✅ Update complete:", result);
  next();
});
```

### 3️⃣ Query Middleware

```js
userSchema.pre(/^find/, function(next) {
  console.log("🔍 Running a find query:", this.getQuery());
  next();
});
```

> `^find` regex ensures the hook runs for `find`, `findOne`, `findById`, etc.

---

## 🛡️ Step 3: Validation During Updates

Mongoose **does not automatically run validators** on `updateOne()` / `updateMany()` unless you enable it:

```js
await User.updateOne(
  { email: "bob@example.com" },
  { $set: { age: -5 } },
  { runValidators: true } // validates min/max
);
```

Custom validation example:

```js
userSchema.path("age").validate(function(value) {
  return value >= 0 && value <= 120;
}, "Age must be between 0 and 120");
```

---

## 🔄 Step 4: Atomic Updates

Use **update operators** to modify arrays or embedded documents safely.

### 1️⃣ Add to array

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $push: { orders: newOrder._id } }
);
```

### 2️⃣ Remove from array

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $pull: { orders: oldOrderId } }
);
```

### 3️⃣ Update nested fields

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $set: { "address.city": "Los Angeles" } }
);
```

---

## 🧩 Step 5: Transactions with Updates

Combine multiple updates in a **transaction**:

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.updateOne(
    { email: "alice@example.com" },
    { $set: { age: 32 } },
    { session }
  );

  await Order.updateOne(
    { _id: orderId },
    { $set: { price: 1400 } },
    { session }
  );

  await session.commitTransaction();
  console.log("✅ Transaction committed successfully");
} catch (err) {
  await session.abortTransaction();
  console.error("❌ Transaction aborted:", err);
} finally {
  session.endSession();
}
```

---

## ⚡ Step 6: Pre/Post Hooks for Updates

```js
userSchema.pre("findOneAndUpdate", function(next) {
  console.log("Updating user with:", this.getQuery());
  next();
});

userSchema.post("findOneAndUpdate", function(doc, next) {
  console.log("Updated document:", doc);
  next();
});
```

> Remember: Document middleware (`save`, `validate`) only runs for `.save()`. Query middleware is needed for `updateOne`, `updateMany`, `findOneAndUpdate`.

---

## 🧪 Step 7: Exercises

1. Write a query to **increment the age** of all users by 1 using `updateMany()`.
2. Add a **pre-save hook** to automatically lowercase emails before saving.
3. Update an embedded address field and ensure **validation** runs.
4. Write a transaction that **updates a user** and **adds an order** atomically.
5. Use `findOneAndUpdate` with **post hook** to log every updated user.

---

## ✅ Summary

You’ve now learned how to:

* Perform all types of **update operations** (`updateOne`, `updateMany`, `findOneAndUpdate`, `.save()`)
* Use **pre/post hooks** for save and update operations
* Apply **validation during updates**
* Safely manipulate arrays and nested fields
* Use **transactions** to keep related updates atomic
* Avoid pitfalls with query vs document middleware

Perfect ✅ — here’s the full **“Mongoose — Part 4: DELETE & Data Cleanup”** tutorial, completing the CRUD workflow.

---

# 🗑️ Mongoose — Part 4: DELETE & Data Cleanup

## 🧠 Overview

In this part, you’ll learn how to **delete documents**, manage **referential cleanup**, and ensure **data integrity** when removing documents in real-world applications.

---

## ⚙️ Step 1: Basic Delete Operations

### 1️⃣ Delete One Document

```js
await User.deleteOne({ email: "alice@example.com" });
```

### 2️⃣ Delete Many Documents

```js
await User.deleteMany({ age: { $lt: 18 } }); // remove all minors
```

### 3️⃣ Find and Delete

```js
const deletedUser = await User.findOneAndDelete({ email: "bob@example.com" });
console.log("Deleted user:", deletedUser);
```

> ⚠️ `findOneAndDelete` returns the deleted document; `deleteOne` / `deleteMany` return an object with `deletedCount`.

---

## 🔧 Step 2: Middleware for Cleanup

When deleting a document, you often need to **clean up references** in other collections.

### 1️⃣ Pre-hooks for remove

```js
userSchema.pre("remove", async function(next) {
  console.log(`Cleaning up orders for user: ${this._id}`);
  await Order.deleteMany({ _id: { $in: this.orders } });
  next();
});
```

### 2️⃣ Post-hooks

```js
userSchema.post("findOneAndDelete", async function(doc) {
  if (doc) {
    await Order.deleteMany({ _id: { $in: doc.orders } });
    console.log(`Orders cleaned up for deleted user: ${doc._id}`);
  }
});
```

> Use pre/post hooks to **automate cleanup**, preventing orphaned documents.

---

## 🧩 Step 3: Soft Delete Pattern

Instead of physically deleting documents, mark them as inactive:

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
});

// Soft delete
await User.updateOne(
  { email: "alice@example.com" },
  { isDeleted: true, deletedAt: new Date() }
);

// Query excluding deleted users
const activeUsers = await User.find({ isDeleted: false });
```

> Soft deletes are safer for **audit trails** and **undelete scenarios**.

---

## ⚡ Step 4: Cascade Delete with References

### Scenario:

* `User` has multiple `Orders`.
* Deleting a user should delete all their orders.

```js
userSchema.pre("findOneAndDelete", async function(next) {
  const user = await this.model.findOne(this.getQuery());
  if (user) {
    await Order.deleteMany({ _id: { $in: user.orders } });
  }
  next();
});
```

> Always fetch the document first in query middleware because `this` only contains the query, not the document.

---

## 🛡️ Step 5: Transactions for Deletes

Combine multiple deletions atomically:

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  const user = await User.findOne({ email: "charlie@example.com" }).session(session);
  
  if (user) {
    await Order.deleteMany({ _id: { $in: user.orders } }, { session });
    await User.deleteOne({ _id: user._id }, { session });
  }

  await session.commitTransaction();
  console.log("✅ Transaction completed: user and orders deleted");
} catch (err) {
  await session.abortTransaction();
  console.error("❌ Transaction aborted:", err);
} finally {
  session.endSession();
}
```

---

## 🧪 Step 6: Exercises

1. Write a **soft delete** function for users and update your queries to exclude deleted users.
2. Implement **cascade deletion** for orders when a user is deleted.
3. Write a transaction that **deletes a user** and **removes all associated orders** atomically.
4. Add a **post-delete hook** that logs the deleted document’s email and deletion timestamp.
5. Create a **scheduled cleanup** function that permanently deletes users who were soft-deleted more than 30 days ago.

---

## ✅ Summary

You’ve now completed **full CRUD with Mongoose**:

* **CREATE**: Complex documents, embedded and referenced, hooks, transactions.
* **READ**: Advanced queries, populate, pagination, aggregation, lean queries.
* **UPDATE**: `$set`, `$push`, `$pull`, nested fields, hooks, validation, transactions.
* **DELETE**: `deleteOne`, `deleteMany`, `findOneAndDelete`, soft deletes, cascade deletes, cleanup hooks, transactions.

You now have a **production-ready understanding of Mongoose CRUD operations**.

Perfect 🔥 — let’s dive into **Advanced Aggregation in Mongoose/MongoDB**, building on your CRUD knowledge. This goes beyond the basics and covers real-world analytics patterns.

---

# 📊 Mongoose — Advanced Aggregation & Analytics

## 🧠 Overview

Aggregation pipelines allow you to **analyze, transform, and summarize data** in MongoDB. Advanced pipelines combine multiple stages, conditional logic, and even nested lookups for production-grade analytics.

---

## ⚙️ Step 1: Aggregation Pipeline Basics

A pipeline is an **array of stages**, executed sequentially.

```js
const result = await Order.aggregate([
  { $match: { price: { $gte: 100 } } }, // filter
  { $group: { _id: "$product", totalRevenue: { $sum: "$price" }, count: { $sum: 1 } } },
  { $sort: { totalRevenue: -1 } } // sort descending
]);
```

**Common stages:**

* `$match` → filter documents
* `$group` → aggregate, sum, count, avg
* `$sort` → order results
* `$project` → reshape fields
* `$limit` & `$skip` → pagination
* `$lookup` → join with other collections
* `$unwind` → flatten arrays
* `$addFields` → create new computed fields
* `$facet` → multiple pipelines in one query

---

## 🔗 Step 2: Lookup & Join Multiple Collections

### 1️⃣ Basic `$lookup`

```js
const usersWithOrders = await User.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "orders",
      foreignField: "_id",
      as: "orderDetails"
    }
  }
]);
```

### 2️⃣ Nested `$lookup`

```js
const analytics = await User.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "orders",
      foreignField: "_id",
      as: "orders"
    }
  },
  { $unwind: "$orders" },
  {
    $lookup: {
      from: "products",
      localField: "orders.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  }
]);
```

> Nested lookups allow full relational-like analytics.

---

## 🧮 Step 3: Conditional Aggregation

Use `$cond` or `$switch` inside `$project` to create computed fields:

```js
const result = await Order.aggregate([
  {
    $project: {
      product: 1,
      price: 1,
      category: {
        $cond: { if: { $gte: ["$price", 1000] }, then: "Premium", else: "Standard" }
      }
    }
  }
]);
```

---

## 🏗️ Step 4: Faceted Pipelines

Run **multiple aggregations in one query** with `$facet`:

```js
const stats = await Order.aggregate([
  {
    $facet: {
      totalRevenue: [{ $group: { _id: null, revenue: { $sum: "$price" } } }],
      topProducts: [
        { $group: { _id: "$product", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ],
      expensiveOrders: [{ $match: { price: { $gte: 1000 } } }]
    }
  }
]);
```

> `$facet` is perfect for dashboards: multiple analytics in a single query.

---

## 📈 Step 5: Bucket & Histogram

### 1️⃣ `$bucket`

```js
const buckets = await Order.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 500, 1000, 1500, 2000],
      default: "Other",
      output: { count: { $sum: 1 }, totalRevenue: { $sum: "$price" } }
    }
  }
]);
```

### 2️⃣ `$bucketAuto`

Automatically creates equal-sized buckets:

```js
const autoBuckets = await Order.aggregate([
  { $bucketAuto: { groupBy: "$price", buckets: 4 } }
]);
```

---

## ⚡ Step 6: Array Aggregation

### 1️⃣ `$unwind` arrays

```js
const exploded = await User.aggregate([
  { $unwind: "$orders" }, // flatten orders array
  { $group: { _id: "$_id", totalSpent: { $sum: "$orders.price" } } }
]);
```

### 2️⃣ Combine with `$lookup`

```js
const userAnalytics = await User.aggregate([
  { $lookup: { from: "orders", localField: "orders", foreignField: "_id", as: "orderDetails" } },
  { $unwind: "$orderDetails" },
  { $group: { _id: "$_id", totalRevenue: { $sum: "$orderDetails.price" } } }
]);
```

---

## 🧪 Step 7: Real-World Analytics Examples

1. **Top 5 selling products**

```js
const topProducts = await Order.aggregate([
  { $group: { _id: "$product", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 }
]);
```

2. **Monthly revenue**

```js
const monthlyRevenue = await Order.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      revenue: { $sum: "$price" },
      orders: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);
```

3. **Customer spending leaderboard**

```js
const leaderboard = await User.aggregate([
  { $lookup: { from: "orders", localField: "orders", foreignField: "_id", as: "orderDetails" } },
  { $unwind: "$orderDetails" },
  { $group: { _id: "$name", totalSpent: { $sum: "$orderDetails.price" } } },
  { $sort: { totalSpent: -1 } }
]);
```

---

## ✅ Step 8: Tips for Production

* Use **indexes** on fields used in `$match` for speed.
* Prefer **pipeline aggregation** over fetching data and processing in Node.js.
* Limit **deep `$lookup`** for large collections to avoid memory overhead.
* Use **`$facet`** to combine multiple analytics queries in dashboards.
* `$project` early in the pipeline to reduce document size.

---

## 🧪 Exercises

1. Show total revenue **per product category** for the last 6 months.
2. Create a **tiered customer leaderboard** using `$cond` based on total spent.
3. Generate a **monthly order histogram** with `$bucketAuto`.
4. Find users with **more than 3 orders above $1000** using `$lookup` and `$group`.
5. Build a **dashboard query** returning total revenue, top products, and average order value using `$facet`.

---

You now have **full advanced aggregation mastery**: multi-stage pipelines, conditional logic, array unwinding, faceted pipelines, bucketing, and real-world dashboard queries.


## Cornerstone Project

Absolutely! Let’s design a **comprehensive, real-world Mongoose/Express project** that forces you to use **everything you’ve learned in Parts 1–4 + Advanced Aggregation**. I’ll give **detailed instructions, specifications, and guidance**, but I won’t give the code — this will be your mission to solve. 🚀

---

# 🏗️ Mission: “Smart E-Commerce Dashboard API”

## 🎯 Project Goal

Build a **backend API** for a simplified e-commerce platform that manages **users, products, orders, and analytics**. You will implement **full CRUD**, **validation**, **transactions**, **hooks**, **population**, **pagination**, **soft deletes**, and **advanced aggregation** for analytics.

---

## 📝 Entities & Schema Guidelines

### 1️⃣ **User**

* Fields: `name`, `email`, `age`, `address` (embedded), `orders` (array of ObjectId referencing Orders), `isDeleted`, `createdAt`
* Validations: `email` unique & lowercase, `age` 13–120, `zip` regex
* Hooks:

  * Pre-save → trim `name`
  * Pre-find → exclude soft-deleted users
* Methods/Statics (optional) → calculate total spent

---

### 2️⃣ **Product**

* Fields: `name`, `category`, `price`, `stock`, `reviews` (array of embedded docs: `{ userId, rating, comment }`), `createdAt`
* Validations: `price > 0`, `stock >= 0`
* Hooks:

  * Pre-save → capitalize product name
* Features: Track average rating from `reviews`

---

### 3️⃣ **Order**

* Fields: `user` (ref User), `products` (array of `{ productId, quantity }`), `totalPrice`, `status`, `createdAt`
* Validations: `totalPrice >= 0`, `status` in `["pending","shipped","delivered","cancelled"]`
* Hooks:

  * Pre-save → calculate `totalPrice` based on `products` array & product prices
  * Post-save → push order `_id` into `User.orders` (transaction recommended)

---

### 4️⃣ Optional: **Analytics Collection**

* Not required; can be derived via aggregation pipelines
* You’ll generate analytics dynamically: revenue, top products, top users, monthly stats

---

## ⚡ API Requirements

### CRUD Routes

#### **Users**

* Create user with address and validation
* Read users (filter, paginate, exclude soft-deleted)
* Update user (nested fields, validation, hooks)
* Soft delete user (with cascade delete of orders optionally)

#### **Products**

* Create product with validation and hooks
* Read products (filter by category/price, paginate)
* Update product (price/stock, hooks, validation)
* Delete product (hard delete okay)

#### **Orders**

* Create order (transaction: reduce product stock, push order to user)
* Read order (populate user and products, filter by status)
* Update order (status only, track history optional)
* Delete order (optional)

---

### Advanced Features

#### **Population**

* Populate orders in User queries
* Populate product details in Orders

#### **Pagination**

* Users and Products list APIs must be paginated with query params: `?page=1&limit=10`

#### **Validation & Hooks**

* Implement pre/post save/update hooks for all entities
* Validate fields (email regex, stock ≥ 0, price > 0)
* Pre-find hook to exclude soft-deleted users

#### **Transactions**

* Create order → reduce product stock + push order to user → must be atomic

#### **Soft Delete**

* Users soft-deleted with `isDeleted` flag
* Optional cleanup cron for soft-deleted users after 30 days

#### **Advanced Aggregation & Analytics**

1. **Total revenue per month**
2. **Top 5 products by sales**
3. **Top 5 users by total spent**
4. **Orders grouped by status with counts**
5. **Category-wise revenue distribution**
6. Optional: **tiered users** (Premium, Standard) based on total spent

#### **Array Aggregation**

* Unwind products in orders to calculate totals
* Compute average rating per product

---

## 🧩 Suggested Workflow

1. **Setup**

   * Create Express server + MongoDB connection
   * Define Mongoose models for User, Product, Order
   * Test connection with a simple seed script

2. **CRUD Implementation**

   * Start with Products → Users → Orders
   * Implement hooks & validations as you go
   * Use transactions where needed

3. **Population & Pagination**

   * Add population for Orders and Users
   * Implement pagination query params

4. **Soft Delete & Cleanup**

   * Soft delete Users
   * Implement pre-find hook to ignore soft-deleted users

5. **Advanced Aggregation**

   * Write aggregation pipelines for analytics endpoints
   * Test with realistic seed data (5–10 users, 10–15 products, 20+ orders)

6. **Testing**

   * Seed database with dummy data
   * Test all endpoints with Postman or Insomnia
   * Ensure hooks, transactions, and validations work correctly

---

## 🚀 Extra Challenge (Optional)

* Implement a **dashboard route** `/analytics` that returns:

  ```json
  {
    "totalRevenue": 100000,
    "topProducts": [...],
    "topUsers": [...],
    "monthlyRevenue": [...],
    "ordersByStatus": [...]
  }
  ```
* Must use `$facet` and aggregation pipelines in a **single query**.

---

## 📌 Mission Rules

* **Do not copy code**; build from scratch using your understanding.
* Each step should **exercise the concepts**: hooks, transactions, aggregation, soft delete, population, validation, nested updates, pagination.
* Use **seed scripts** to populate data for testing.
* Document your endpoints with **request examples** and **expected responses**.

---

If you complete this project fully, you’ll have **mastered Mongoose CRUD, advanced aggregation, hooks, transactions, population, pagination, and data integrity practices** — everything we covered.

Perfect! Let’s design a **detailed “mission guide checklist”** for your **Smart E-Commerce Dashboard API** project. This checklist is **step-by-step**, specifying exactly what you need to implement at each stage for **CRUD, updates, hooks, transactions, population, soft delete, and advanced aggregation** — but without giving any code. This is your full mission roadmap.

---

# 🏗️ Smart E-Commerce API — Mission Guide Checklist

## 🔹 Project Overview

Your task: Build a **full backend API** with **Users, Products, Orders**, supporting:

* **Full CRUD**
* **Nested updates & array manipulations**
* **Validation & hooks**
* **Transactions for multi-document operations**
* **Soft deletes**
* **Population & pagination**
* **Advanced aggregation pipelines for analytics**

---

## 🔹 STEP 1: Setup

1. Initialize **Node + Express + Mongoose** project.
2. Connect to MongoDB.
3. Create Mongoose **models** for:

   * `User` (fields: name, email, age, address, orders, isDeleted, createdAt)
   * `Product` (fields: name, category, price, stock, reviews, createdAt)
   * `Order` (fields: user, products, totalPrice, status, createdAt)
4. Create a **seed script** to populate 5–10 users, 10–15 products, and 20+ orders.

---

## 🔹 STEP 2: User Endpoints

### 2.1 Create User

* Validate email uniqueness and lowercase.
* Validate age (13–120) and zip code format.
* Trim names using a pre-save hook.
* Return the created user.

### 2.2 Read Users

* Exclude soft-deleted users (`isDeleted: true`).
* Support **filtering** (e.g., age range, city).
* Support **pagination** (`?page=&limit=`).
* Populate `orders` optionally.

### 2.3 Update User

* Update nested fields (e.g., `address.city`).
* Update array fields (e.g., push new orders).
* Validate fields on update (`runValidators: true`).
* Implement **soft delete** with `isDeleted` + `deletedAt`.

### 2.4 Delete User

* Soft delete user (`isDeleted: true`)
* Optional: cascade delete all related orders via pre/post hooks.
* Ensure deleted users are **excluded from all queries**.

---

## 🔹 STEP 3: Product Endpoints

### 3.1 Create Product

* Validate price > 0 and stock ≥ 0.
* Add reviews as an embedded array (optional).
* Pre-save hook: capitalize product name.

### 3.2 Read Products

* Filter by category, price range.
* Pagination support.
* Optionally populate reviews with user info.

### 3.3 Update Product

* Update price, stock, or category.
* Update nested review rating or comment.
* Validate fields with `runValidators: true`.

### 3.4 Delete Product

* Hard delete or soft delete (optional).
* Ensure deletion does not break existing orders.

---

## 🔹 STEP 4: Order Endpoints

### 4.1 Create Order

* Include multiple products with quantities.
* Calculate `totalPrice` based on product prices (pre-save hook).
* Push order `_id` into `User.orders` (use transaction).
* Decrement product stock atomically.

### 4.2 Read Orders

* Populate user and product details.
* Filter by status (`pending`, `shipped`, `delivered`, `cancelled`).
* Pagination support.

### 4.3 Update Order

* Only allow **status updates**.
* Optionally track status history.
* Use validation to restrict allowed statuses.

### 4.4 Delete Order

* Optional: remove order reference from user orders array.
* Ensure data consistency.

---

## 🔹 STEP 5: Advanced Updates & Arrays

1. Add an order ID to a user’s orders **only if it doesn’t exist** (`$addToSet`).
2. Remove multiple orders from a user (`$pull` + `$in`).
3. Update a specific review in `Product.reviews` array using positional `$`.
4. Update nested address fields with dot notation (`$set`).
5. Ensure all updates run **validators** and, if necessary, **hooks**.

---

## 🔹 STEP 6: Transactions

1. Create an order:

   * Decrease product stock
   * Push order `_id` to user
   * Calculate totalPrice
   * All in a **single transaction**

2. Update multiple related documents (e.g., user + orders) atomically.

---

## 🔹 STEP 7: Population & Pagination

1. Populate orders in user queries (`User.orders`).
2. Populate products in orders.
3. Implement query params for pagination:

   * `?page=1&limit=10`
   * Calculate `skip` and `limit` dynamically.

---

## 🔹 STEP 8: Soft Delete & Cleanup

1. Soft delete users: mark `isDeleted: true` + `deletedAt`.
2. Pre-find hook: exclude soft-deleted users automatically.
3. Optional: scheduled cleanup to permanently delete users after 30 days.

---

## 🔹 STEP 9: Advanced Aggregation & Analytics

Create endpoints to return **dashboard analytics** using aggregation pipelines:

1. **Total revenue per month**
2. **Top 5 products by sales**
3. **Top 5 users by total spent**
4. **Orders grouped by status**
5. **Category-wise revenue distribution**
6. **Tiered users** (Premium/Standard) based on total spent
7. Combine multiple analytics in **one endpoint** using `$facet`.
8. Use `$unwind` to flatten product arrays in orders for calculations.
9. Bucket revenues with `$bucket` or `$bucketAuto`.

---

## 🔹 STEP 10: Testing & Validation

1. Seed realistic test data (users, products, orders).

2. Test **all endpoints** with Postman / Insomnia:

   * CRUD operations
   * Nested updates
   * Array updates
   * Transactions
   * Soft deletes
   * Aggregation dashboards

3. Confirm hooks, validators, transactions, and cascading actions work correctly.

---

## 🔹 Optional Extra Challenges

1. Add **average product rating** calculation in aggregation.
2. Implement **soft delete for products** and exclude from orders analytics.
3. Track **order history per user** with timestamps.
4. Return a **single `/analytics` endpoint** that combines revenue, top products, top users, and order status counts using **one aggregation pipeline with `$facet`**.

---

✅ Completing this **mission guide checklist** ensures you’ve exercised **all concepts**:

* CREATE, READ, UPDATE, DELETE (CRUD)
* Nested updates, arrays, and operators (`$set`, `$push`, `$pull`, `$addToSet`)
* Validation & pre/post hooks
* Transactions and atomic operations
* Population & pagination
* Soft deletes
* Advanced aggregation pipelines for real-world analytics


## Advanced update 

Got it! You want the **UPDATE guide** rewritten in the same style and flow as the **CREATE guide** we did in Part 1 — step-by-step, example-focused, easy to follow, with explanation and exercises, all in **chat-ready format**. Here’s the full **Mongoose — Part 2 (UPDATE)** in that style:

---

# 📝 Mongoose — Part 2: UPDATE Documents In-Depth

## 🧠 Overview

In this part, we’ll cover **everything about updating documents in Mongoose**: operators, nested fields, arrays, validators, hooks, transactions, and best practices. By the end, you’ll be confident updating **any document safely and efficiently**.

---

## ⚙️ Step 1: Basic Update Methods

### 1️⃣ `updateOne(filter, update, options)`

Updates the **first document** matching the filter.

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $set: { age: 31 } },
  { runValidators: true } // ensures validation runs
);
```

* ✅ Use for simple single-document updates
* ⚠️ Does **not** return the updated document by default

---

### 2️⃣ `updateMany(filter, update, options)`

Updates **all documents** matching the filter.

```js
await User.updateMany(
  { age: { $lt: 18 } },
  { $inc: { age: 1 } }, // increment age by 1
  { runValidators: true }
);
```

---

### 3️⃣ `findOneAndUpdate(filter, update, options)`

Updates **one document** and returns it.

```js
const updatedUser = await User.findOneAndUpdate(
  { email: "alice@example.com" },
  { $inc: { age: 1 } },
  { new: true, runValidators: true } // return updated doc
);
console.log(updatedUser);
```

* `new: true` → returns **updated document**
* `runValidators: true` → enforces schema validations

---

### 4️⃣ Document `.save()`

Fetch a document, modify fields, then save it. Triggers **pre/post save hooks** automatically.

```js
const user = await User.findById(userId);
user.age += 1;
await user.save(); // validators and hooks run automatically
```

---

## 🔧 Step 2: Update Operators

| Operator          | Purpose                            | Example                                        |
| ----------------- | ---------------------------------- | ---------------------------------------------- |
| `$set`            | Set field values                   | `{ $set: { age: 32, name: "Alice A" } }`       |
| `$inc`            | Increment/decrement numeric fields | `{ $inc: { age: 1 } }`                         |
| `$unset`          | Remove a field                     | `{ $unset: { tempField: "" } }`                |
| `$push`           | Add element to array               | `{ $push: { orders: orderId } }`               |
| `$push` + `$each` | Add multiple elements              | `{ $push: { orders: { $each: [id1, id2] } } }` |
| `$pull`           | Remove from array                  | `{ $pull: { orders: orderId } }`               |
| `$addToSet`       | Add if not exists                  | `{ $addToSet: { roles: "admin" } }`            |
| `$rename`         | Rename field                       | `{ $rename: { oldField: "newField" } }`        |

---

## 🔄 Step 3: Nested & Array Updates

### 1️⃣ Nested Object Fields

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $set: { "address.city": "Los Angeles" } }
);
```

### 2️⃣ Specific Array Element

```js
await Product.updateOne(
  { _id: productId, "reviews._id": reviewId },
  { $set: { "reviews.$.rating": 5 } }
);
```

> `$` → positional operator for the matched element

### 3️⃣ Update Multiple Array Elements

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $pull: { orders: { $in: [id1, id2] } } } // remove multiple
);
```

---

## 🛡️ Step 4: Validation During Updates

* `updateOne`, `updateMany`, `findOneAndUpdate` **do not run validators by default**
* Always use `{ runValidators: true }`

```js
await User.updateOne(
  { email: "alice@example.com" },
  { $set: { age: -5 } },
  { runValidators: true } // throws validation error
);
```

* Custom validators also work:

```js
userSchema.path("age").validate(value => value >= 0 && value <= 120, "Age must be 0-120");
```

---

## ⚡ Step 5: Transactions for Updates

When updating **multiple collections** atomically, use sessions:

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.updateOne({ _id: userId }, { $inc: { age: 1 } }, { session });
  await Order.updateOne({ _id: orderId }, { $set: { status: "shipped" } }, { session });

  await session.commitTransaction();
  console.log("✅ Transaction successful");
} catch (err) {
  await session.abortTransaction();
  console.error("❌ Transaction failed", err);
} finally {
  session.endSession();
}
```

---

## ⚠️ Step 6: Common Pitfalls & Tips

1. Validators **must be enabled** for updates.
2. Document middleware **does not run** on `updateOne/updateMany`; use query middleware.
3. Use **atomic operators** (`$inc`, `$push`, `$pull`) instead of fetching & saving manually for performance.
4. For nested/array fields, always use **dot notation** or **positional `$` operator**.
5. Use **transactions** when multiple related updates must be consistent.

---

## 🧪 Step 7: Practice Challenges

1. Increment age of all users under 25.
2. Add a new order to a user only if it doesn’t exist.
3. Update the city of a user’s address.
4. Update a specific review rating in a product.
5. Perform a transaction: increment user age **and** mark all pending orders as shipped.
6. Rename a field in all documents.
7. Remove multiple orders from a user’s orders array.

---

