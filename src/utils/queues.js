// const { Queue, Worker } = require("bullmq");
// const EmailService = require("../services/email.service");
// const connection = { host: "127.0.0.1", port: 6379 };

// const emailQueue = new Queue("emailQueue", { connection });

// const worker = new Worker("emailQueue", async (job) => {
//     await EmailService.sendRegistrationVerificationEmail(job.data.email, job.data.token)
// },
//     { connection }
// )

// worker.on("failed", (job, err) => {
//     console.error(`Job ${job.id} failed: ${err.message}`);
// });

// module.exports = emailQueue;