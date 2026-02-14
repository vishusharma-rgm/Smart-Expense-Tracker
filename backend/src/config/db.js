import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    console.log('URI:', process.env.MONGO_URI); // DEBUG (temporary)

    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error); // FULL ERROR OBJECT
    process.exit(1);
  }
};

export default connectDB;
