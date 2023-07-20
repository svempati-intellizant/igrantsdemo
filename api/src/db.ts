import { connect } from "mongoose";
export async function setUpDataBase() {
  try {
    console.log(process.env.DB_USERNAME,process.env.DB_PASSWORD);
    await connect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
  }
}
