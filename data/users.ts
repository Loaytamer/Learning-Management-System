import { ImageSourcePropType } from 'react-native';

export type Role = 'student' | 'instructor';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  avatar: ImageSourcePropType | null;
  bio: string;
  enrolledCourses: string[];
  createdCourses?: string[];
  lastLogin: Date;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'student1@example.com',
    password: '123456',
    name: 'Alex Johnson',
    role: 'student',
    avatar: { uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300' },
    bio: 'Computer Science major with interest in web development and AI.',
    enrolledCourses: ['course1', 'course2', 'course3'],
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'student2@example.com',
    password: '123456',
    name: 'Morgan Smith',
    role: 'student',
    avatar: { uri: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300' },
    bio: 'Marketing student passionate about digital marketing strategies.',
    enrolledCourses: ['course1', 'course4'],
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'instructor1@example.com',
    password: '123456',
    name: 'Dr. Jamie Miller',
    role: 'instructor',
    avatar: { uri: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=300' },
    bio: 'Professor with 10+ years experience in Computer Science and Machine Learning.',
    enrolledCourses: [],
    createdCourses: ['course1', 'course2'],
    lastLogin: new Date()
  },
  {
    id: '4',
    email: 'instructor2@example.com',
    password: '123456',
    name: 'Dr. Taylor Wilson',
    role: 'instructor',
    avatar: { uri: 'https://images.pexels.com/photos/5952647/pexels-photo-5952647.jpeg?auto=compress&cs=tinysrgb&w=300' },
    bio: 'Digital Marketing expert with industry experience at major tech companies.',
    enrolledCourses: [],
    createdCourses: ['course3', 'course4'],
    lastLogin: new Date()
  }
];

export default MOCK_USERS;