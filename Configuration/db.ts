import mongoose from "mongoose";

export async function dbConnection(): Promise<void> {

    try {

        await mongoose.connect("mongodb://localhost:27017/movies");
        console.log("Connected successfully");

    } catch(Error: any) {
        console.log("Unable to connect to the databse", Error);
    }

}
