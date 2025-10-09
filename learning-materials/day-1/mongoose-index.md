# Mongoose — complete, step-by-step practical tutorial

Nice — you’ll get a single, logical walkthrough from **setup → schemas/models → every CRUD & query operation → advanced features → production tips**. I’ll explain *why* each piece exists, give minimal copy-paste code, and flag common pitfalls. Read it top→down; treat it like a reference.

---

## Quick outline (what you’ll learn)

1. Install & connect (safe options + graceful shutdown)
2. Schema & Model basics (types, required, defaults, unique, indexes)
3. Create operations (`save`, `create`, `insertMany`)
4. Read operations (`find`, `findOne`, `findById`, projection, `lean`)
5. Update operations (`updateOne`, `updateMany`, `findByIdAndUpdate`, `findOneAndUpdate`, operators)
6. Delete operations (`deleteOne`, `deleteMany`, `findByIdAndDelete`)
7. Query helpers & chaining, operators, pagination
8. Indexes & text search
9. References & population (refs + virtual populate)
10. Virtuals, getters/setters, schema methods & statics
11. Middleware (pre/post hooks for document/query/aggregate/model)
12. Validation & error handling (runValidators, custom validators, error types)
13. Aggregation pipeline (basic → lookup → group)
14. Transactions & sessions (with `withTransaction`)
15. Bulk writes & upserts
16. Streams & cursors for large datasets
17. Discriminators, embedded docs vs refs, GridFS mention
18. Plugins, testing tips, production considerations & best practices

---

# 1 — Install & connect

### Install

```bash
npm install mongoose
```

### Minimal connection (place in `db.js`)

```js
const mongoose = require("mongoose");

async function connectDB(uri) {
  await mongoose.connect(uri, {
    // modern Mongoose (v6+) has sane defaults, but these are explicit
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // autoIndex: false   // disable in production for performance; create indexes with migrations
  });
  console.log("MongoDB connected");
}

module.exports = connectDB;
```

**Why these options?**

* `useNewUrlParser` & `useUnifiedTopology` avoid legacy parser issues.
* You can tune `serverSelectionTimeoutMS`, `socketTimeoutMS`, `poolSize` (connection pool size) for production.

### Graceful shutdown

```js
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});
```

---

# 2 — Schema & Model basics

### Minimal schema & model

```js
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, min: 0 },
  roles: { type: [String], default: ["user"] },
}, { timestamps: true }); // adds createdAt, updatedAt

const User = model("User", userSchema);
```

**Key ideas:**

* `Schema`: defines shape, types, validators, defaults.
* `model("User", schema)`: compiles a Model (class-like) you use for CRUD.
* `timestamps:true` adds automatic `createdAt`/`updatedAt`.
* `unique: true` creates a unique **index** — not a validation rule by itself (race conditions possible).

**Common field options:** `required`, `default`, `enum`, `min`, `max`, `match` (regex), `immutable`, `select: false` (exclude from queries by default), `get`/`set` (transformers).

---

# 3 — Create operations

### `new` + `.save()`

```js
const u = new User({ name: "Alice", email: "a@x.com" });
await u.save();
```

* Good when you need pre-save middleware or to inspect instance.

### `Model.create(...)`

```js
await User.create({ name: "Bob", email: "b@x.com" });
```

* Convenience wrapper (creates + saves).

### `insertMany([...])`

```js
await User.insertMany([{name:"C1",email:"c1@x.com"}, ...], { ordered: false });
```

* High-performance batch insert. `ordered:false` keeps going on errors (e.g., duplicate keys).

**Pitfalls:** `save()` triggers schema `pre('save')` middleware; `insertMany` does not trigger `save` hooks by default.

---

# 4 — Read operations (queries)

### Basic finds

```js
const all = await User.find();                 // array
const one = await User.findOne({ email: "a@x.com" });
const byId = await User.findById("64...");     // uses _id
```

### Projection (select fields)

```js
await User.find({}, "name email");   // include only name & email
await User.find().select("-__v -createdAt"); // exclude fields
```

### `lean()` for performance

```js
const small = await User.find().lean(); // returns plain JS objects (no Mongoose documents)
```

* `lean()` is much faster, and useful for read-heavy endpoints. But no getters, methods, or `.save()`.

### Sorting / limit / skip

```js
await User.find().sort({ createdAt: -1 }).limit(20).skip(20 * page);
```

---

# 5 — Update operations

### `updateOne` / `updateMany`

```js
await User.updateOne({ email: 'a@x.com' }, { $set: { age: 30 }});
await User.updateMany({ role: 'temp' }, { $unset: { tempProp: "" }});
```

* Returns result metadata, not the updated doc.

### `findByIdAndUpdate` / `findOneAndUpdate`

```js
const updated = await User.findOneAndUpdate(
  { email: 'a@x.com' },
  { $inc: { loginCount: 1 } },
  { new: true, runValidators: true, context: 'query' }
);
```

**Important options:**

* `new: true` → return the updated document (default: old doc).
* `runValidators: true` → run schema validators on update.
* `context: 'query'` → when validators rely on `this` or query context.

### Atomic operators: common ones

* `$set`, `$inc`, `$push`, `$addToSet`, `$pull`, `$unset`, `$rename`, `$mul`, `$bit`.

### Upsert (update or insert)

```js
await User.updateOne({ email }, { $set: { name } }, { upsert: true });
```

* If no document matches, creates one. Use `setDefaultsOnInsert: true` if you want defaults applied on insert.

---

# 6 — Delete operations

```js
await User.deleteOne({ _id: id });
await User.deleteMany({ inactive: true });
const removed = await User.findByIdAndDelete(id);
```

**Soft delete** pattern: instead of removing, set `{ deletedAt: Date.now(), deleted: true }` so you can recover / audit.

---

# 7 — Query helpers, chaining & operators

### Chaining example

```js
const adults = await User.find()
  .where('age').gte(18)
  .where('roles').in(['user', 'admin'])
  .limit(50)
  .sort({ name: 1 })
  .select('name email age')
  .lean();
```

### Useful query operators

* `$or`, `$and`, `$in`, `$nin`, `$exists`, `$regex`, `$gte`, `$lte`, `$ne`, `$nin`
* Example:

```js
await User.find({ $or: [{ age: { $gte: 65 } }, { roles: 'admin' }] });
```

---

# 8 — Indexes & text search

### Define index in schema

```js
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: "text", bio: "text" }); // text index
```

### Why indexes matter

* Speed up reads for large collections.
* `unique` enforces uniqueness at DB level (watch for 11000 duplicate key error).

### Text search example

```js
await User.find({ $text: { $search: "javascript developer" } }, { score: { $meta: "textScore" }})
  .sort({ score: { $meta: "textScore" }});
```

**Tip:** Don’t create indexes in production at app startup (it can block). Use migrations or createIndexes during maintenance.

---

# 9 — References & population

### Define a ref

```js
const postSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});
const Post = model('Post', postSchema);
```

### Populate

```js
const post = await Post.findById(postId).populate('author', 'name email'); // pulls author doc
```

### Nested / multiple levels

```js
await Comment.find().populate({
  path: 'post',
  populate: { path: 'author', select: 'name' }
});
```

### Virtual populate (reverse relation)

```js
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});
const user = await User.findById(id).populate('posts');
```

---

# 10 — Virtuals, getters/setters, methods & statics

### Virtual fullName

```js
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

* Enable virtuals in JSON: `schema.set('toJSON', { virtuals: true })`.

### Instance method

```js
userSchema.methods.sayHi = function() {
  return `Hi ${this.name}`;
};
const u = await User.findById(id);
u.sayHi();
```

### Static method (on model)

```js
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};
await User.findByEmail('a@x.com');
```

---

# 11 — Middleware (hooks)

### Document middleware

```js
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  next();
});
```

### Query middleware (for `findOneAndUpdate`, `find`)

```js
userSchema.pre(/^find/, function(next) {
  this.start = Date.now();
  next();
});
userSchema.post(/^find/, function(docs) {
  console.log('Query took', Date.now() - this.start);
});
```

* Use `pre('findOneAndUpdate')` for query updates (document `save` hooks do NOT run for `findOneAndUpdate`).

### Aggregate middleware

```js
userSchema.pre('aggregate', function() {
  this.pipeline().unshift({ $match: { deleted: { $ne: true } }});
});
```

---

# 12 — Validation & error handling

### Built-in validators

* `required`, `min`, `max`, `enum`, `match` (regex), `maxlength`, `minlength`.

### Custom validator

```js
email: {
  type: String,
  validate: {
    validator: v => /@/.test(v),
    message: props => `${props.value} is not a valid email`
  }
}
```

### Run validators on update

```js
await User.findByIdAndUpdate(id, { age: -5 }, { runValidators: true, new: true });
```

### Errors you’ll see

* `ValidationError` — when schema validation fails.
* `CastError` — invalid ObjectId or wrong type.
* Duplicate key error from MongoDB: error code **11000** (unique index violation).

**Handle errors in Express:**

```js
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") return res.status(400).send(err.message);
  if (err.code === 11000) return res.status(409).send("Duplicate key");
  res.status(500).send("Server error");
});
```

---

# 13 — Aggregation pipeline

### Example: count posts per user

```js
const pipeline = [
  { $match: { published: true } },
  { $group: { _id: "$author", posts: { $sum: 1 } } },
  { $sort: { posts: -1 } }
];
const result = await Post.aggregate(pipeline);
```

### $lookup (join-like)

```js
const pipeline = [
  { $match: {} },
  { $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "authorInfo"
  }},
  { $unwind: "$authorInfo" }
];
await Post.aggregate(pipeline);
```

**When to use aggregation:** when you need grouping, multi-stage transforms, or to avoid N+1 population queries for analytics.

---

# 14 — Transactions & sessions

### When needed

* Multi-document atomicity (e.g., transfer money between accounts in different collections).

### Basic transaction example (requires replica set/Atlas)

```js
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Account.updateOne({ _id: a }, { $inc: { balance: -100 } }, { session });
  await Account.updateOne({ _id: b }, { $inc: { balance: 100 } }, { session });
});
session.endSession();
```

**Important:** Transactions require a replica set (local single-node replica set or Atlas). They are heavier — use only when necessary.

---

# 15 — Bulk operations & upserts

### `bulkWrite`

```js
await User.bulkWrite([
  { insertOne: { document: { name: "X", email: "x@x" } } },
  { updateOne: { filter: { email: "a@x" }, update: { $set: { age: 30 } }, upsert: true } },
]);
```

* Efficient for many mixed operations.

---

# 16 — Streams & cursors

### Cursor for large datasets

```js
const cursor = User.find().cursor();
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  // process doc
}
```

* Avoids loading entire collection into memory.

---

# 17 — Discriminators, embedded docs vs refs, GridFS

### Discriminators (inheritance)

```js
const base = new Schema({ kind: String }, { discriminatorKey: 'kind' });
const Event = model('Event', base);
const Click = Event.discriminator('Click', new Schema({ x: Number }));
```

### Embedded docs vs refs

* Embedding is good for small, tightly coupled data (comments inside post).
* References + populate are better for large or frequently queried independently.

### GridFS

* Use `GridFSBucket` (native driver) or libraries for storing large files in MongoDB.

---

# 18 — Plugins, testing & production tips

### Plugins

```js
userSchema.plugin(require('mongoose-paginate-v2'));
```

* Reusable schema logic (pagination, soft delete, timestamps, unique validation plugin).

### Testing

* Use `mongodb-memory-server` to spin up a real MongoDB in memory for tests.
* Clear DB between tests.

### Production tips

* **Disable autoIndex** in production (`autoIndex: false`) and create indexes with a migration tool.
* Use **connection pool** (`poolSize`) appropriately.
* Use **retryWrites=true** in connection string for transient errors.
* Monitor `slowms` and enable profiling if needed.
* Avoid unbounded `skip` for pagination — prefer range-based pagination on indexed fields.

---

# Quick cheat-sheet of crucial commands/options

* Connect: `mongoose.connect(uri, opts)`
* Define: `new Schema({})`, `model('Name', schema)`
* Create: `Model.create()`, `new Model().save()`, `insertMany()`
* Read: `find()`, `findOne()`, `findById()`, use `.select()`, `.lean()`
* Update: `updateOne`, `updateMany`, `findOneAndUpdate(…, { new:true, runValidators:true })`
* Delete: `deleteOne`, `deleteMany`, `findByIdAndDelete`
* Transactions: `startSession()` + `session.withTransaction(fn)`
* Bulk: `bulkWrite([...])`
* Aggregation: `Model.aggregate([pipeline])`
* Index: `schema.index({ field: 1 })`
* Populate: `.populate('field', 'select fields')`
* Hooks: `schema.pre('save', fn)`, `schema.pre('findOneAndUpdate', fn)`
* Error: duplicate key code **11000**

---

# Example: Express CRUD endpoints (quick practical sample)

```js
// app.js (simplified)
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/user"); // from earlier

const app = express();
app.use(express.json());

app.post("/users", async (req, res, next) => {
  try {
    const u = await User.create(req.body);
    res.status(201).json(u);
  } catch (err) { next(err); }
});

app.get("/users", async (req, res, next) => {
  try {
    const list = await User.find().limit(100).lean();
    res.json(list);
  } catch (err) { next(err); }
});

app.patch("/users/:id", async (req, res, next) => {
  try {
    const u = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!u) return res.status(404).send("Not found");
    res.json(u);
  } catch (err) { next(err); }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  if (err.code === 11000) return res.status(409).json({ error: 'Duplicate key' });
  res.status(500).json({ error: 'Server error' });
});

(async () => {
  await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/testdb");
  app.listen(3000, () => console.log("Listening 3000"));
})();
```

---

# Final notes & learning path

* Start by mastering Schema design, CRUD, population, and validation.
* Then learn aggregation, indexes, and transactions.
* Test locally with `mongodb-memory-server`.
* For production, move indexes into migrations, use Redis for caching, create monitoring/alerts for slow queries.

---

If you want, I can now:

* a) **Produce a compact one-file example** that demonstrates schema, pre-save hook (password hashing), populate, and a transaction; or
* b) **Create a step-by-step lab**: small tasks (make a blog app: create models, endpoints, implement pagination, add text search) so you practice each operation.

Which next step do you want?
