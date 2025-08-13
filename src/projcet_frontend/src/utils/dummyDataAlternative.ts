import { faker } from '@faker-js/faker';
import { storage } from '../utils/storage';
import { message } from 'antd';
import { job } from "../../../declarations/job";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as jobFactory } from "../../../declarations/job";
import { JobCategory } from '../interface/job/Job';

// Generate simple job categories
const generateJobCategories = (count: number = 3): JobCategory[] => {
  const categories: JobCategory[] = [];
  const possibleCategories = [
    'Web Development', 'Mobile Development', 'Design', 'Marketing',
    'Writing', 'Admin Support', 'Customer Service', 'Sales',
    'Accounting', 'Legal', 'Engineering', 'Translation'
  ];
  
  for (let i = 0; i < Math.min(count, possibleCategories.length); i++) {
    categories.push({
      id: `cat-${i + 1}`,
      jobCategoryName: possibleCategories[i]
    });
  }
  
  return categories;
};

/**
 * Generate simple job description
 */
const generateJobDescription = (paraCount: number = 2): string[] => {
  const paragraphs = [];
  for (let i = 0; i < paraCount; i++) {
    paragraphs.push(faker.lorem.paragraph(3));
  }
  return paragraphs;
};

/**
 * Seeds dummy data using direct canister access with simplified payload
 */
export const seedDummyDataAlternative = async (
  counts: { jobs: number; }
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('Starting alternative dummy data generation...');
    
    // Get user session
    const existingSession = storage.getSession();
    const existingUser = storage.getUser();
    
    if (!existingSession || !existingUser) {
      message.error('Please login first to generate dummy data');
      return { success: false, message: 'Authentication required. Please login before generating dummy data.' };
    }
    
    // Setup agent and actor
    const agent = new HttpAgent({ host: 'http://localhost:4943' });
    
    // For local development only
    if (process.env.NODE_ENV !== 'production') {
      try {
        await agent.fetchRootKey();
      } catch (error) {
        console.warn('Could not fetch root key. If you are not in a local development environment, this is expected.');
      }
    }
    
    // Setup job actor
    const jobActor = Actor.createActor(jobFactory, { 
      agent, 
      canisterId: 'br5f7-7uaaa-aaaaa-qaaca-cai'  // Hardcoded for demo purpose
    });
    
    // Results container
    const results = {
      jobs: [] as any[]
    };
    
    // Create jobs
    console.log(`Creating ${counts.jobs} jobs (alternative method)...`);
    for (let i = 0; i < counts.jobs; i++) {
      try {
        // Wait briefly between operations
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create simple job
        const jobName = faker.company.catchPhrase().substring(0, 30); // Keep job name short
        const jobDescription = generateJobDescription(1); // Just one paragraph
        const jobTags = generateJobCategories(1); // Just one category
        const jobSalary = 100; // Simple fixed salary
        const jobSlots = 1; // Just one slot
        const userId = existingUser.id || ''; // Get from current user
        
        console.log(`Creating simplified job: ${jobName}`);
        
        // Create simplified payload
        const payload = {
          jobName,
          jobDescription,
          jobTags,
          jobSalary,
          jobSlots: BigInt(jobSlots),
          userId
        };
        
        // Direct actor call - no environment vars needed
        try {
          const result = await jobActor.createJob(
            payload, 
            'br5f7-7uaaa-aaaaa-qaaca-cai', // Hardcoded for demo purpose
            'br5f7-7uaaa-aaaaa-qaaca-cai'  // Hardcoded for demo purpose
          );
          
          if ("ok" in result) {
            console.log(`Created job successfully: ${jobName}`);
            results.jobs.push({
              name: jobName,
              id: "ok" in result ? result.ok : "unknown"
            });
          } else {
            console.error(`Failed to create job:`, result.err);
          }
        } catch (error) {
          console.error('Direct canister call error:', error);
        }
      } catch (error) {
        console.error(`Error in job creation loop:`, error);
      }
    }
    
    return {
      success: results.jobs.length > 0,
      message: `Created ${results.jobs.length} jobs using alternative method`,
      data: results
    };
  } catch (error) {
    console.error('Alternative data generation error:', error);
    return {
      success: false,
      message: `Error in alternative generation: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
