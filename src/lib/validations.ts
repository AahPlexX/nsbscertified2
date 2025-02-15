
import { z } from 'zod'

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

export const courseCreationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  price: z.number().int().min(29900, 'Price must be at least $299.00'),
  topics: z.array(z.object({
    title: z.string().min(3, 'Topic title must be at least 3 characters'),
    order: z.number().int().min(0),
    modules: z.array(z.object({
      title: z.string().min(3, 'Module title must be at least 3 characters'),
      content: z.string().min(50, 'Module content must be at least 50 characters'),
      order: z.number().int().min(0)
    })).min(1, 'Each topic must have at least one module')
  })).min(1, 'Course must have at least one topic'),
  examDetails: z.object({
    passScore: z.number().int().min(80).max(80),
    questions: z.array(z.object({
      text: z.string().min(10, 'Question text must be at least 10 characters'),
      options: z.array(z.string().min(1)).length(4, 'Must provide exactly 4 options'),
      correctIndex: z.number().int().min(0).max(3)
    })).length(100, 'Must provide exactly 100 questions')
  })
})

export const examSubmissionSchema = z.record(
  z.string(), // questionId
  z.number().int().min(0).max(3) // selectedIndex
).refine((data) => Object.keys(data).length === 100, {
  message: 'Must answer all 100 questions'
})

export const moduleCompletionSchema = z.object({
  userId: z.string().uuid(),
  enrollmentId: z.string().uuid(),
  moduleId: z.string().uuid()
})
