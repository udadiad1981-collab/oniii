const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
(async () => {
  const p = new PrismaClient();
  const user = await p.user.findUnique({ where: { email: "admin@eqfrs.com" } });
  console.log("User found:", !!user);
  if (user) {
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    const match = await bcrypt.compare("admin123", user.password);
    console.log("Password match:", match);
  }
  await p.$disconnect();
})();
