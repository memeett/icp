import { faker } from '@faker-js/faker';
import { Actor } from '@dfinity/agent';

import { _SERVICE as UserService } from "../../../declarations/user/user.did";
import { _SERVICE as JobService } from "../../../declarations/job/job.did";
import { _SERVICE as SubmissionService } from "../../../declarations/submission/submission.did";
import { _SERVICE as RatingService } from "../../../declarations/rating/rating.did";

interface JobCategory {
  id: string;
  jobCategoryName: string;
}

interface User {
  id: string;
  dob: string;
  username: string;
  isFaceRecognitionOn: boolean;
  createdAt: bigint;
  isProfileCompleted: boolean;
  description: string;
  preference: JobCategory[];
  updatedAt: bigint;
  wallet: number;
  rating: number;
  profilePicture: Uint8Array | number[];
}

interface CreateJobPayload {
  jobName: string;
  jobTags: JobCategory[];
  userId: string;
  jobDescription: string[];
  jobSalary: number;
  jobSlots: bigint;
}

interface Job {
  id: string;
  jobRating: number;
  jobName: string;
  jobTags: JobCategory[];
  userId: string;
  jobDescription: string[];
  createdAt: bigint;
  jobStatus: string;
  jobSalary: number;
  updatedAt: bigint;
  wallet: number;
  jobSlots: bigint;
}

// Utility functions for generating random data
const getRandomSkills = (): JobCategory[] => {
  const allSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 
    'Motoko', 'Rust', 'Python', 'Java', 'C++', 
    'UI/UX Design', 'Graphic Design', 'Content Writing', 
    'SEO', 'Marketing', 'Data Analysis', 'Blockchain'
  ];
  
  const count = Math.floor(Math.random() * 5) + 1; // 1 to 5 skills
  const skills: JobCategory[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allSkills.length);
    const skill = allSkills[randomIndex];
    
    const exists = skills.some(s => s.jobCategoryName === skill);
    if (!exists) {
      // Generate a random ID for the category
      const id = faker.string.uuid();
      skills.push({
        id,
        jobCategoryName: skill
      });
    }
  }
  
  return skills;
};

const generateEmptyProfilePicture = (): Uint8Array => {
  // Create a minimal empty image byte array (can be replaced with actual image data)
  return new Uint8Array(10);
};

// Main function to seed data
export const seedDummyData = async (
  userActor: Actor & UserService,
  jobActor: Actor & JobService,
  submissionActor: Actor & SubmissionService,
  ratingActor: Actor & RatingService,
  counts = { users: 10, jobs: 20, submissions: 15, ratings: 10 }
) => {
  try {
    console.log('Starting to seed dummy data...');
    
    // Step 1: Create dummy users
    console.log(`Generating ${counts.users} users...`);
    const userIds: string[] = [];
    const users: User[] = [];
    
    for (let i = 0; i < counts.users; i++) {
      try {
        const username = faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '');
        const emptyProfilePic = generateEmptyProfilePicture();
        
        // Create user with username and empty profile picture
        const user = await userActor.createUser(username, emptyProfilePic);
        console.log(`Created user: ${username}`, user.id);
        userIds.push(user.id);
        users.push(user);
      } catch (error) {
        console.error(`Error creating user:`, error);
      }
    }
    
    // Exit if no users were created
    if (userIds.length === 0) {
      console.error('No users were created, stopping data generation');
      return {
        success: false,
        error: 'Failed to create users'
      };
    }

    // Step 2: Create job categories first (if they don't exist)
    console.log('Creating job categories...');
    const jobCategories: JobCategory[] = [];
    const categoryNames = [
      'Development', 'Design', 'Writing', 'Marketing', 'Data', 
      'Admin', 'Customer Support', 'Sales', 'Legal', 'Finance'
    ];
    
    for (const name of categoryNames) {
      try {
        const result = await jobActor.createJobCategory(name);
        if ('ok' in result) {
          console.log(`Created job category: ${name}`);
          jobCategories.push(result.ok);
        }
      } catch (error) {
        console.error(`Error creating job category:`, error);
      }
    }
    
    // Step 3: Create dummy jobs
    console.log(`Generating ${counts.jobs} jobs...`);
    const jobIds: string[] = [];
    
    for (let i = 0; i < counts.jobs; i++) {
      try {
        // Random client user
        const randomUserIndex = Math.floor(Math.random() * userIds.length);
        const clientId = userIds[randomUserIndex];
        
        // Random job categories (1-3)
        const catCount = Math.floor(Math.random() * 3) + 1;
        const randomCategories: JobCategory[] = [];
        for (let j = 0; j < catCount; j++) {
          const randomCatIndex = Math.floor(Math.random() * jobCategories.length);
          randomCategories.push(jobCategories[randomCatIndex]);
        }
        
        const jobPayload: CreateJobPayload = {
          jobName: faker.company.catchPhrase(),
          jobTags: randomCategories,
          userId: clientId,
          jobDescription: [
            faker.lorem.paragraph(3),
            faker.lorem.paragraph(2),
            faker.lorem.paragraph(1)
          ],
          jobSalary: parseFloat(faker.finance.amount(100, 10000, 2)),
          jobSlots: BigInt(Math.floor(Math.random() * 5) + 1) // 1-5 slots
        };
        
        // Create job - needs payload, user ID, and an authorization token (empty for testing)
        const result = await jobActor.createJob(jobPayload, clientId, "");
        
        if ('ok' in result) {
          console.log(`Created job: ${jobPayload.jobName}`);
          jobIds.push(result.ok.id);
        } else {
          console.error(`Failed to create job:`, result.err);
        }
      } catch (error) {
        console.error(`Error creating job:`, error);
      }
    }
    
    // Exit if no jobs were created
    if (jobIds.length === 0) {
      console.error('No jobs were created, stopping data generation');
      return {
        success: false,
        error: 'Failed to create jobs'
      };
    }

    // For now, we'll skip submissions and ratings as they require more complex setup
    // Users would need complete profiles, proper files for submissions, etc.
    
    console.log('Dummy data generation completed successfully!');
    
    return {
      success: true,
      stats: {
        users: userIds.length,
        jobs: jobIds.length,
        submissions: 0,
        ratings: 0
      }
    };
    
  } catch (error) {
    console.error('Error in dummy data generation:', error);
    return {
      success: false,
      error: String(error)
    };
  }
};
