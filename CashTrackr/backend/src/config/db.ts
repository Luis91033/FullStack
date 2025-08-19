import { Sequelize } from "sequelize-typescript";
const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + "/../models/**/*"],
  logging: false,
  dialectOptions: {
    ssl: { require: false },
  },
});

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log("Conexion buena a la db");
  } catch (error) {
    console.log("Falló la conexión a la db");
  }
}
