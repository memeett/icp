import React, { useState, useEffect } from 'react';
import { updateUserProfile, fetchUserBySession } from '../../controller/userController';
import { User as UserInterface } from '../../interface/User';
import { JobCategory } from '../../interface/job/Job';
import { useJobCategories } from '../../utils/useJobCategories';

// Fallback categories if backend is empty
const FALLBACK_CATEGORIES: JobCategory[] = [
  { id: '1', jobCategoryName: 'Web Development' },
  { id: '2', jobCategoryName: 'Mobile Development' },
  { id: '3', jobCategoryName: 'UI/UX Design' },
  { id: '4', jobCategoryName: 'Data Science' },
  { id: '5', jobCategoryName: 'Digital Marketing' },
  { id: '6', jobCategoryName: 'Content Writing' },
  { id: '7', jobCategoryName: 'Graphic Design' },
  { id: '8', jobCategoryName: 'Video Editing' },
  { id: '9', jobCategoryName: 'Translation' },
  { id: '10', jobCategoryName: 'Virtual Assistant' },
];

const CompleteProfilePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserInterface | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    description: '',
    profilePicture: null as File | null,
    preference: [] as JobCategory[]
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useJobCategories();

  // Use fallback categories if backend categories are empty, error, or still loading
  const availableCategories = (categories && categories.length > 0) ? categories : FALLBACK_CATEGORIES;
  const shouldShowFallback = categoriesLoading || categoriesError || !categories || categories.length === 0;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserBySession();
        if (user) {
          setCurrentUser(user);
          // Check if user already completed profile
          if (user.isProfileCompleted) {
            window.location.href = '/profile';
          }
        } else {
          // No user session, redirect to login
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/';
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Debug logging
    console.log('Categories loading:', categoriesLoading);
    console.log('Categories error:', categoriesError);
    console.log('Categories data:', categories);
    console.log('Available categories:', availableCategories);
    console.log('Should show fallback:', shouldShowFallback);
  }, [categories, categoriesLoading, categoriesError, availableCategories, shouldShowFallback]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (category: JobCategory) => {
    setFormData(prev => ({
      ...prev,
      preference: prev.preference.some(p => p.id === category.id)
        ? prev.preference.filter(p => p.id !== category.id)
        : [...prev.preference, category]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return formData.username.trim().length > 0;
      case 2:
        return formData.dob.trim().length > 0 && formData.description.trim().length > 0;
      case 3:
        return formData.preference.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step) && step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      let profilePictureArray: number[] | undefined;

      if (formData.profilePicture) {
        const arrayBuffer = await formData.profilePicture.arrayBuffer();
        profilePictureArray = Array.from(new Uint8Array(arrayBuffer));
      }

      await updateUserProfile({
        username: [formData.username],
        dob: [formData.dob],
        description: [formData.description],
        profilePicture: profilePictureArray ? [profilePictureArray] : [],
        preference: [formData.preference],
        isFaceRecognitionOn: [],
        isProfileCompleted: [true] // Mark profile as completed
      });

      // Redirect to profile page after successful update
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: 'white',
          fontSize: '18px'
        }}>
          Updating Profile...
        </div>
      )}
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#4f46e5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '32px'
          }}>
            👤
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '32px', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            Complete Your Profile
          </h1>
          <p style={{ color: '#e0e7ff', fontSize: '16px', margin: 0 }}>
            Let's set up your profile to get started on ERGASIA
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '10px' 
          }}>
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  background: stepNum <= step ? '#4f46e5' : '#9ca3af',
                  color: 'white'
                }}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#9ca3af',
            borderRadius: '4px'
          }}>
            <div
              style={{
                width: `${(step / 3) * 100}%`,
                height: '100%',
                background: '#4f46e5',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Basic Information
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  marginBottom: '8px' 
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  marginBottom: '8px' 
                }}>
                  Profile Picture (Optional)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="profile-picture"
                  />
                  <label
                    htmlFor="profile-picture"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    📁 Choose File
                  </label>
                  {formData.profilePicture && (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {formData.profilePicture.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Personal Details
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  marginBottom: '8px' 
                }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  marginBottom: '8px' 
                }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Job Preferences
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Select categories you're interested in:
              </p>
              
              {categoriesLoading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '10px', 
                  fontSize: '14px', 
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Loading backend categories... Using fallback categories for now.
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px'
              }}>
                {availableCategories?.map((category: JobCategory) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: formData.preference.some(p => p.id === category.id)
                          ? '#dbeafe'
                          : '#f9fafb',
                        borderColor: formData.preference.some(p => p.id === category.id)
                          ? '#3b82f6'
                          : '#d1d5db',
                        color: formData.preference.some(p => p.id === category.id)
                          ? '#1d4ed8'
                          : '#374151'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {category.jobCategoryName}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '24px' 
        }}>
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            style={{
              padding: '12px 24px',
              color: '#6b7280',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              opacity: step === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(step)}
              style={{
                padding: '12px 24px',
                background: validateStep(step) ? '#4f46e5' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: validateStep(step) ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(1) || !validateStep(2) || !validateStep(3)}
              style={{
                padding: '12px 24px',
                background: (validateStep(1) && validateStep(2) && validateStep(3)) 
                  ? '#10b981' 
                  : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (validateStep(1) && validateStep(2) && validateStep(3)) 
                  ? 'pointer' 
                  : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Complete Profile ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
