import React, { useState } from 'react';
import { seedDummyData } from '../utils/dummyDataGenerator';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as userFactory } from "../../../declarations/user";
import { idlFactory as jobFactory } from "../../../declarations/job";
import { idlFactory as submissionFactory } from "../../../declarations/submission";
import { idlFactory as ratingFactory } from "../../../declarations/rating";
import { _SERVICE as UserService } from "../../../declarations/user/user.did";
import { _SERVICE as JobService } from "../../../declarations/job/job.did";
import { _SERVICE as SubmissionService } from "../../../declarations/submission/submission.did";
import { _SERVICE as RatingService } from "../../../declarations/rating/rating.did";

// Styles
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  header: {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    width: '150px',
    fontWeight: 'bold',
  },
  input: {
    width: '100px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  results: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
  },
  progress: {
    marginTop: '20px',
  },
  progressBar: {
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: (width: number) => ({
    height: '100%',
    width: `${width}%`,
    backgroundColor: '#4285f4',
    transition: 'width 0.3s ease',
  }),
  error: {
    color: 'red',
    marginTop: '10px',
  }
};

const DummyDataGenerator = () => {
  // State
  const [counts, setCounts] = useState({
    users: 5,
    jobs: 10
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get canister actors (adjust based on your actual setup)
  const agent = new HttpAgent({ host: 'http://localhost:4943' });
  
  // Fetch root key for local development
  if (process.env.NODE_ENV !== 'production') {
    try {
      agent.fetchRootKey().catch(err => {
        console.warn('Unable to fetch root key. Error:', err);
        console.warn('Check to ensure that your local replica is running');
      });
    } catch (error) {
      console.error('Error fetching root key:', error);
    }
  }
  
  // Canister IDs - these should match your local or production canister IDs
  const userCanisterId = 'be2us-64aaa-aaaaa-qaabq-cai'; // Update this if needed
  const jobCanisterId = 'br5f7-7uaaa-aaaaa-qaaca-cai';  // Update this if needed
  const submissionCanisterId = 'by6od-d4aaa-aaaaa-qaada-cai'; // Update this if needed
  const ratingCanisterId = 'bw4dl-smaaa-aaaaa-qaacq-cai'; // Update this if needed
  
  const userActor = Actor.createActor<UserService>(userFactory, { agent, canisterId: userCanisterId });
  const jobActor = Actor.createActor<JobService>(jobFactory, { agent, canisterId: jobCanisterId });
  const submissionActor = Actor.createActor<SubmissionService>(submissionFactory, { agent, canisterId: submissionCanisterId });
  const ratingActor = Actor.createActor<RatingService>(ratingFactory, { agent, canisterId: ratingCanisterId });

  const handleCountChange = (field: keyof typeof counts, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCounts(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleGenerateData = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResults(null);
    setError(null);

    try {
      // Validate that we have all the required actors
      if (!userActor || !jobActor || !submissionActor || !ratingActor) {
        throw new Error('One or more canister actors are not available');
      }

      // Set up progress reporting
      const updateProgress = (step: number, total: number) => {
        const newProgress = Math.floor((step / total) * 100);
        setProgress(newProgress);
      };

      // Start the data generation process
      const result = await seedDummyData(
        userActor,
        jobActor,
        submissionActor,
        ratingActor,
        {
          users: counts.users,
          jobs: counts.jobs,
          submissions: 0,  // Not generating submissions for now
          ratings: 0       // Not generating ratings for now
        }
      );

      setResults(result);
    } catch (err) {
      console.error('Error generating dummy data:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
      setProgress(100); // Ensure progress bar completes
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Dummy Data Generator</h1>
        <p>Generate test data for development and testing purposes.</p>
      </div>

      <div style={styles.section}>
        <h2>Data Counts</h2>
        
        <div style={styles.row}>
          <span style={styles.label}>Users:</span>
          <input
            type="number"
            style={styles.input}
            value={counts.users}
            onChange={(e) => handleCountChange('users', e.target.value)}
            disabled={isGenerating}
            min="0"
            max="20"
          />
        </div>
        
        <div style={styles.row}>
          <span style={styles.label}>Jobs:</span>
          <input
            type="number"
            style={styles.input}
            value={counts.jobs}
            onChange={(e) => handleCountChange('jobs', e.target.value)}
            disabled={isGenerating}
            min="0"
            max="30"
          />
        </div>
        
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#fffde7',
          borderRadius: '4px',
          borderLeft: '4px solid #ffeb3b',
        }}>
          <p><strong>Note:</strong> This generator will only create users and jobs for now.</p>
          <p>Submissions and ratings require more complex setup and complete user profiles.</p>
        </div>
      </div>

      <div style={styles.section}>
        <button
          style={{
            ...styles.button,
            ...(isGenerating ? styles.disabledButton : {})
          }}
          onClick={handleGenerateData}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Dummy Data'}
        </button>

        {isGenerating && (
          <div style={styles.progress}>
            <p>Generating data... {progress}% complete</p>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(progress)}></div>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div style={styles.results}>
            <h3>Results:</h3>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DummyDataGenerator;
