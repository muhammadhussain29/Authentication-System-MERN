import mongoose from "mongoose";

const connectdb = async () => {

    mongoose.connection.on('connected', ()=>{
        console.log("connected to db");
        
    })

    await mongoose.connect(`${process.env.MONGODB_URL}/Auth-Mern`)
}

export default connectdb;