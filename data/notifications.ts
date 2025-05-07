export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'announcement' | 'course_update' | 'reminder' | 'system';
  courseId?: string;
  isRead: boolean;
  createdAt: Date;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    title: 'New lesson available',
    message: 'A new lesson "JavaScript Arrays" has been added to the JavaScript for Beginners course.',
    type: 'course_update',
    courseId: 'course2',
    isRead: false,
    createdAt: new Date('2023-08-25T09:30:00')
  },
  {
    id: 'n2',
    userId: '1',
    title: 'Assignment due tomorrow',
    message: 'Don\'t forget to submit your HTML project for Introduction to Web Development by tomorrow at 11:59 PM.',
    type: 'reminder',
    courseId: 'course1',
    isRead: true,
    createdAt: new Date('2023-08-23T15:45:00')
  },
  {
    id: 'n3',
    userId: '1',
    title: 'New course recommendation',
    message: 'Based on your interests, we recommend checking out our new React Native course.',
    type: 'system',
    isRead: false,
    createdAt: new Date('2023-08-20T11:15:00')
  },
  {
    id: 'n4',
    userId: '2',
    title: 'Course discount available',
    message: 'Use code SUMMER25 for 25% off all marketing courses until the end of the month.',
    type: 'announcement',
    isRead: false,
    createdAt: new Date('2023-08-18T10:00:00')
  },
  {
    id: 'n5',
    userId: '3',
    title: 'Student feedback',
    message: 'You have received new feedback on your "Introduction to Web Development" course.',
    type: 'course_update',
    courseId: 'course1',
    isRead: true,
    createdAt: new Date('2023-08-22T14:30:00')
  },
  {
    id: 'n6',
    userId: '3',
    title: 'New enrollment',
    message: 'A new student has enrolled in your "JavaScript for Beginners" course.',
    type: 'course_update',
    courseId: 'course2',
    isRead: false,
    createdAt: new Date('2023-08-24T09:10:00')
  }
];

export default MOCK_NOTIFICATIONS;