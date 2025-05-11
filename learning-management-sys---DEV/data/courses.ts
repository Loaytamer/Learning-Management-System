export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  videoUrl: string;
  resources?: Resource[];
  quizzes?: Quiz[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'document';
  url: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string; // instructor id
  instructorName: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // total hours
  lessons: Lesson[];
  enrolledStudents: string[]; // student ids
  rating: number;
  reviews: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// const MOCK_COURSES: Course[] = [
//   {
//     id: 'course1',
//     title: 'Introduction to Web Development',
//     description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course is designed for absolute beginners and will give you the foundation needed to start building your own websites.',
//     thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600',
//     instructor: '3',
//     instructorName: 'Dr. Jamie Miller',
//     category: 'Web Development',
//     level: 'Beginner',
//     duration: 12,
//     lessons: [
//       {
//         id: 'lesson1-1',
//         title: 'HTML Basics',
//         description: 'Learn the fundamentals of HTML including tags, attributes, and document structure.',
//         duration: 45,
//         videoUrl: 'https://example.com/videos/html-basics',
//         resources: [
//           {
//             id: 'resource1-1',
//             title: 'HTML Cheat Sheet',
//             type: 'pdf',
//             url: 'https://example.com/resources/html-cheatsheet.pdf'
//           }
//         ]
//       },
//       {
//         id: 'lesson1-2',
//         title: 'CSS Fundamentals',
//         description: 'Learn how to style your HTML documents using CSS.',
//         duration: 60,
//         videoUrl: 'https://example.com/videos/css-fundamentals',
//         resources: [
//           {
//             id: 'resource1-2',
//             title: 'CSS Reference',
//             type: 'link',
//             url: 'https://example.com/resources/css-reference'
//           }
//         ],
//         quizzes: [
//           {
//             id: 'quiz1-1',
//             title: 'CSS Basics Quiz',
//             questions: [
//               {
//                 id: 'q1',
//                 text: 'Which property is used to change the text color?',
//                 options: ['text-color', 'color', 'font-color', 'text-style'],
//                 correctAnswer: 1
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     enrolledStudents: ['1', '2'],
//     rating: 4.7,
//     reviews: 152,
//     price: 49.99,
//     createdAt: new Date('2023-01-15'),
//     updatedAt: new Date('2023-06-20')
//   },
//   {
//     id: 'course2',
//     title: 'JavaScript for Beginners',
//     description: 'Master the basics of JavaScript programming language. You\'ll learn variables, functions, loops, and more to start building interactive web applications.',
//     thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
//     instructor: '3',
//     instructorName: 'Dr. Jamie Miller',
//     category: 'Programming',
//     level: 'Beginner',
//     duration: 15,
//     lessons: [
//       {
//         id: 'lesson2-1',
//         title: 'JavaScript Syntax',
//         description: 'Learn the basic syntax of JavaScript including variables, types, and operators.',
//         duration: 50,
//         videoUrl: 'https://example.com/videos/js-syntax'
//       },
//       {
//         id: 'lesson2-2',
//         title: 'Functions in JavaScript',
//         description: 'Understand how to create and use functions in JavaScript.',
//         duration: 55,
//         videoUrl: 'https://example.com/videos/js-functions'
//       }
//     ],
//     enrolledStudents: ['1'],
//     rating: 4.5,
//     reviews: 98,
//     price: 59.99,
//     createdAt: new Date('2023-02-10'),
//     updatedAt: new Date('2023-05-15')
//   },
//   {
//     id: 'course3',
//     title: 'Digital Marketing Fundamentals',
//     description: 'Learn the core concepts of digital marketing including SEO, social media marketing, email campaigns, and analytics.',
//     thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600',
//     instructor: '4',
//     instructorName: 'Dr. Taylor Wilson',
//     category: 'Marketing',
//     level: 'Beginner',
//     duration: 10,
//     lessons: [
//       {
//         id: 'lesson3-1',
//         title: 'SEO Basics',
//         description: 'Learn the fundamentals of Search Engine Optimization.',
//         duration: 45,
//         videoUrl: 'https://example.com/videos/seo-basics'
//       },
//       {
//         id: 'lesson3-2',
//         title: 'Social Media Marketing',
//         description: 'Explore strategies for effective social media marketing.',
//         duration: 60,
//         videoUrl: 'https://example.com/videos/social-media-marketing'
//       }
//     ],
//     enrolledStudents: ['1'],
//     rating: 4.8,
//     reviews: 120,
//     price: 69.99,
//     createdAt: new Date('2023-03-05'),
//     updatedAt: new Date('2023-07-12')
//   },
//   {
//     id: 'course4',
//     title: 'Advanced Email Marketing',
//     description: 'Take your email marketing skills to the next level with advanced strategies, automation, and analytics.',
//     thumbnail: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=600',
//     instructor: '4',
//     instructorName: 'Dr. Taylor Wilson',
//     category: 'Marketing',
//     level: 'Intermediate',
//     duration: 8,
//     lessons: [
//       {
//         id: 'lesson4-1',
//         title: 'Email Automation',
//         description: 'Learn how to set up effective email automation workflows.',
//         duration: 55,
//         videoUrl: 'https://example.com/videos/email-automation'
//       },
//       {
//         id: 'lesson4-2',
//         title: 'Email Analytics',
//         description: 'Understand how to analyze email campaign performance.',
//         duration: 45,
//         videoUrl: 'https://example.com/videos/email-analytics'
//       }
//     ],
//     enrolledStudents: ['2'],
//     rating: 4.6,
//     reviews: 85,
//     price: 79.99,
//     createdAt: new Date('2023-04-20'),
//     updatedAt: new Date('2023-06-30')
//   }
// ];

// export default MOCK_COURSES;