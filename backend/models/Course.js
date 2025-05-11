const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'link', 'document'], required: true },
  url: { type: String, required: true }
});

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [QuestionSchema]
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  resources: [ResourceSchema],
  quizzes: [QuizSchema]
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: false },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructorName: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: Number, required: true },
  lessons: [LessonSchema],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CourseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = { Course };