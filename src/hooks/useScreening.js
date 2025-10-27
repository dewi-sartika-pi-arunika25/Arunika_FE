// src/hooks/useScreening.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';

/**
 * Hook untuk handle screening logic
 * - Validate form
 * - Save screening data to users table
 * - Store interest to sessionStorage
 * - Redirect to skillmatch
 */
export function useScreening() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitScreening = async (formData, userId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('1. Starting submission with:', { formData, userId });

      // 1. Validation
      if (!formData.latestJob || !formData.experienceLevel || 
          !formData.educationLevel || !formData.major || 
          !formData.interest || !formData.goal) {
        setError('Semua field harus diisi');
        setLoading(false);
        console.log('Validation failed: missing fields');
        return false;
      }

      if (formData.goal.trim().length < 20) {
        setError('Tujuan karir minimal 20 karakter');
        setLoading(false);
        console.log('Validation failed: goal too short');
        return false;
      }

      console.log('2. Validation passed');

      // 2. Save screening data to users table
      const updateRes = await usersAPI.update(userId, {
        pekerjaan: formData.latestJob,
        pendidikan: formData.educationLevel,
        major: formData.major,
        experience_level: formData.experienceLevel,
        career_goal: formData.goal,
      });

      console.log('3. API Response:', updateRes);

      if (!updateRes.data.success) {
        throw new Error('Gagal menyimpan data screening');
      }

      // 3. Store interest & goal ke sessionStorage untuk skillmatch
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skillmatch_interest', formData.interest);
        sessionStorage.setItem('skillmatch_goal', formData.goal);
        sessionStorage.setItem('skillmatch_level', formData.experienceLevel);
        console.log('4. SessionStorage set');
      }

      setSuccess('Data screening berhasil disimpan!');

      // 4. Redirect ke skillmatch
      setTimeout(() => {
        const redirectUrl = `/skill-match?role=${encodeURIComponent(formData.interest)}`;
        console.log('5. Redirecting to:', redirectUrl);
        router.push(redirectUrl);
      }, 500);

      return true;
    } catch (err) {
      console.error('ERROR:', err);
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
      setLoading(false);
      return false;
    }
  };

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');

  return {
    submitScreening,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  };
}

/**
 * Helper untuk validasi screening form
 * @param {Object} formData - Form data object
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateScreeningForm(formData) {
  const errors = {};

  if (!formData.latestJob?.trim()) {
    errors.latestJob = 'Pekerjaan harus diisi';
  }

  if (!formData.experienceLevel) {
    errors.experienceLevel = 'Lama pengalaman harus dipilih';
  }

  if (!formData.educationLevel) {
    errors.educationLevel = 'Pendidikan harus dipilih';
  }

  if (!formData.major?.trim()) {
    errors.major = 'Jurusan harus diisi';
  }

  if (!formData.interest) {
    errors.interest = 'Minat karir harus dipilih';
  }

  if (!formData.goal?.trim()) {
    errors.goal = 'Tujuan karir harus diisi';
  } else if (formData.goal.trim().length < 20) {
    errors.goal = 'Tujuan karir minimal 20 karakter';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}