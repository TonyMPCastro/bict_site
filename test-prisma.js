const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient({ url: 'file:./dev.db' });
  console.log("Success with URL");
} catch (e) {
  console.log("Error:", e.message);
}
