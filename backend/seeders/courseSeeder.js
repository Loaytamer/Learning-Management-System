const mongoose = require('mongoose');
const { Course } = require('../models/Course');
const MOCK_COURSES = require('../../learning-management-sys---DEV/data/courses');

const seedCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bassantmaher:bassantmaher@learnmongodb.ecnkz3s.mongodb.net/EduLearn');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Transform mock courses to match the MongoDB schema
    const coursesToSeed = MOCK_COURSES.map(course => ({
      ...course,
      instructor: new mongoose.Types.ObjectId(course.instructor),
      enrolledStudents: course.enrolledStudents.map(id => new mongoose.Types.ObjectId(id)),
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt)
    }));

    // Insert courses
    await Course.insertMany(coursesToSeed);
    console.log('Successfully seeded courses');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

// Run seeder
seedCourses();