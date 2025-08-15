// import { faker } from '@faker-js/faker';
// import { getAllUsers, getUserById, updateUserProfile } from '../controller/userController';
// import { createJob } from '../controller/jobController';
// import { JobCategory } from '../interface/job/Job';
// import { storage } from '../utils/storage';
// import { message } from 'antd';

// // Ensure required environment variables are available for testing
// const ensureEnvironmentVariables = () => {
//   // Only do this in development
//   if (process.env.NODE_ENV !== 'production') {
//     // Set canister IDs if they're not already set
//     if (!process.env.CANISTER_ID_JOB) {
//       console.log("Setting mock CANISTER_ID_JOB for testing");
//       process.env.CANISTER_ID_JOB = 'br5f7-7uaaa-aaaaa-qaaca-cai';
//     }

//     if (!process.env.CANISTER_ID_JOB_TRANSACTION) {
//       console.log("Setting mock CANISTER_ID_JOB_TRANSACTION for testing");
//       process.env.CANISTER_ID_JOB_TRANSACTION = 'be2us-64aaa-aaaaa-qaabq-cai';
//     }
//   }
// };

// // Mock IDs for testing
// const MOCK_PRINCIPAL_IDS = [
//   "2vxsx-fae", "un4fu-tqaaa", "not54-ayaaa", 
//   "2ibo7-dia", "2ujgw-qqaaa", "htozm-raaa",
//   "x4ooo-zyaaa", "m5jiy-4iaaa", "xylmu-qiaaa"
// ];

// // Common job categories
// const JOB_CATEGORIES: JobCategory[] = [
//   { id: "cat1", jobCategoryName: "Web Development" },
//   { id: "cat2", jobCategoryName: "Mobile Development" },
//   { id: "cat3", jobCategoryName: "UI/UX Design" },
//   { id: "cat4", jobCategoryName: "Data Science" },
//   { id: "cat5", jobCategoryName: "DevOps" },
//   { id: "cat6", jobCategoryName: "Blockchain" },
//   { id: "cat7", jobCategoryName: "Game Development" },
//   { id: "cat8", jobCategoryName: "QA Testing" }
// ];

// // Generator for job tags
// const generateJobTags = (count: number = 3): string[] => {
//   const allTags = [
//     "React", "Angular", "Vue", "TypeScript", "JavaScript", 
//     "Node.js", "Python", "Java", "C#", "PHP", "Ruby", "Go",
//     "Swift", "Kotlin", "Flutter", "React Native", "AWS", 
//     "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Agile",
//     "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST"
//   ];
  
//   const selectedTags: string[] = [];
//   const actualCount = Math.min(count, allTags.length);
  
//   // Select random tags without duplicates
//   while (selectedTags.length < actualCount) {
//     const tag = allTags[Math.floor(Math.random() * allTags.length)];
//     if (!selectedTags.includes(tag)) {
//       selectedTags.push(tag);
//     }
//   }
  
//   return selectedTags;
// };

// /**
//  * Generates a random amount between min and max with a specified precision
//  */
// const randomAmount = (min: number, max: number, precision: number = 2): number => {
//   const value = Math.random() * (max - min) + min;
//   return Number(value.toFixed(precision));
// };

// /**
//  * Generate dummy job description with paragraphs
//  */
// const generateJobDescription = (): string[] => {
//   const paragraphs = [];
//   const paraCount = faker.number.int({ min: 2, max: 4 });
  
//   for (let i = 0; i < paraCount; i++) {
//     paragraphs.push(faker.lorem.paragraph(faker.number.int({ min: 3, max: 6 })));
//   }
  
//   return paragraphs;
// };

// /**
//  * Seeds dummy data using controller functions
//  */
// export const seedDummyDataWithControllers = async (
//   counts: { users: number; jobs: number; }
// ): Promise<{ success: boolean; message: string; data?: any }> => {
//   try {
//     console.log('Starting to seed dummy data...');
    
//     // Ensure environment variables
//     ensureEnvironmentVariables();
    
//     const results = {
//       users: [] as any[],
//       jobs: [] as any[]
//     };

//     // First check if we're already logged in
//     const existingSession = storage.getSession();
//     const existingUser = storage.getUser();
    
//     if (!existingSession || !existingUser) {
//       message.error('Please login first to generate dummy data');
//       return { success: false, message: 'Authentication required. Please login before generating dummy data.' };
//     }

//     // Create dummy jobs
//     console.log(`Creating ${counts.jobs} dummy jobs...`);
//     for (let i = 0; i < counts.jobs; i++) {
//       try {
//         // Use a delay to prevent overwhelming the system
//         await new Promise(resolve => setTimeout(resolve, 300));
        
//         const jobName = faker.company.catchPhrase();
//         const jobDescription = generateJobDescription();
//         const jobTags = generateJobTags(faker.number.int({ min: 1, max: 3 })); // Limit the tags
//         const jobSalary = Math.floor(randomAmount(100, 5000)); // Ensure whole number
//         const jobSlots = Math.max(1, faker.number.int({ min: 1, max: 3 })); // Ensure at least 1 slot
        
//         console.log(`Attempting to create job: ${jobName}`);
//         console.log(`Tags: ${jobTags.join(', ')}`);
//         console.log(`Salary: ${jobSalary}, Slots: ${jobSlots}`);

//         const result = await createJob(
//           jobName,
//           jobDescription,
//           jobTags,
//           jobSalary,
//           jobSlots
//         );
        
//         if (result[0] === "Success") {
//           console.log(`Created job: ${jobName}`);
//           results.jobs.push({
//             name: jobName,
//             id: result[1] // Assuming job ID is returned as second element
//           });
//         } else {
//           console.error(`Failed to create job: ${result[1]}`);
//           // Lets check if this is a canister ID problem
//           if (result[1].includes("undefined")) {
//             return { 
//               success: false, 
//               message: "Error: Missing environment variables for canister IDs. Make sure CANISTER_ID_JOB and CANISTER_ID_JOB_TRANSACTION are set in your environment." 
//             };
//           }
//         }
//       } catch (error) {
//         console.error(`Error creating job:`, error);
//         return { 
//           success: false, 
//           message: `Error while creating jobs: ${error instanceof Error ? error.message : String(error)}` 
//         };
//       }
//     }

//     return {
//       success: true,
//       message: `Successfully created ${results.jobs.length} jobs`,
//       data: results
//     };
//   } catch (error) {
//     console.error('Error seeding dummy data:', error);
//     return {
//       success: false,
//       message: `Error seeding dummy data: ${error instanceof Error ? error.message : String(error)}`
//     };
//   }
// };
