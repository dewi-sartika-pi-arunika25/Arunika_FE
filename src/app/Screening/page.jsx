// app/Screening/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { GraduationCap, Briefcase, Target, Send, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useScreening, validateScreeningForm } from '@/hooks/useScreening';

const experienceLevels = [
  { label: "Junior (< 1 tahun)", value: "junior" },
  { label: "Senior (1 - 5 tahun)", value: "senior" },
  { label: "Expert (> 5 tahun)", value: "expert" },
];

const educationLevels = ["SMA/SMK", "D3", "S1", "S2", "S3"];
const interests = ["Frontend Developer", "Backend Developer", "UI/UX Designer", "Product Manager"];

export default function ScreeningPage() {
  const router = useRouter();
  const { submitScreening, loading, error, success } = useScreening();

  const [formData, setFormData] = useState({
    latestJob: '',
    experienceLevel: '',
    educationLevel: '',
    major: '',
    interest: '',
    goal: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get from Supabase auth token
        const authKey = Object.keys(localStorage).find(key => 
          key.includes('auth-token') || key.includes('sb-')
        );
        
        if (authKey) {
          const authData = JSON.parse(localStorage.getItem(authKey));
          const extractedUserId = authData?.user?.id;
          console.log('User ID from auth token:', extractedUserId);
          setUserId(extractedUserId);
          return;
        }
        
        // Fallback ke direct keys
        const directId = localStorage.getItem('user_id') || localStorage.getItem('userId');
        if (directId) {
          console.log('User ID from direct key:', directId);
          setUserId(directId);
          return;
        }
        
        console.log('No user ID found anywhere');
        setUserId(null);
      } catch (e) {
        console.error('Error extracting user ID:', e);
        setUserId(null);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleSelectChange = (field, value) => {
    console.log(`${field} changed to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT STARTED ===');
    console.log('Current formData:', formData);

    const { isValid, errors } = validateScreeningForm(formData);
    console.log('Validation result:', { isValid, errors });
    
    if (!isValid) {
      setValidationErrors(errors);
      console.log('❌ Validation failed, errors set:', errors);
      return;
    }

    console.log('✓ Validation passed');
    console.log('userId:', userId);
    
    if (!userId) {
      setValidationErrors({ userId: 'User tidak ditemukan' });
      console.log('❌ No userId found');
      return;
    }

    console.log('✓ userId exists:', userId);
    console.log('Calling submitScreening...');
    await submitScreening(formData, userId);
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-16 text-gray-900 flex items-center justify-center">
      <Head>
        <title>Lengkapi Profil - Arunika</title>
      </Head>

      <Card className="w-full max-w-2xl shadow-xl bg-white border border-yellow-200">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center space-x-3 text-orange-600 mb-2">
            <BookOpen className="h-7 w-7" />
            <CardTitle className="text-3xl font-bold">Lengkapi Profil Awal</CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Isi data berikut untuk mengaktifkan Analisis Karir AI yang dipersonalisasi.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              <p className="font-semibold">Error:</p>
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              <p className="font-semibold">Success:</p>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Pekerjaan & Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latestJob" className="flex items-center space-x-2 mb-2 font-semibold">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                  <span>Pekerjaan Terakhir/Saat Ini</span>
                </Label>
                <Input
                  id="latestJob"
                  type="text"
                  placeholder="Contoh: Junior Web Developer"
                  value={formData.latestJob}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-yellow-100/50 border-yellow-300 ${validationErrors.latestJob ? 'border-red-500' : ''}`}
                />
                {validationErrors.latestJob && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.latestJob}</p>
                )}
              </div>

              <div>
                <Label htmlFor="experienceLevel" className="flex items-center space-x-2 mb-2 font-semibold">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>Lama Pengalaman Kerja</span>
                </Label>
                <Select value={formData.experienceLevel} onValueChange={(value) => handleSelectChange('experienceLevel', value)} disabled={loading}>
                  <SelectTrigger className={`bg-yellow-100/50 border-yellow-300 ${validationErrors.experienceLevel ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih Tingkat Pengalaman" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-yellow-300">
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.experienceLevel && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.experienceLevel}</p>
                )}
              </div>
            </div>

            {/* Row 2: Pendidikan & Jurusan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="educationLevel" className="flex items-center space-x-2 mb-2 font-semibold">
                  <GraduationCap className="h-4 w-4 text-gray-600" />
                  <span>Pendidikan Terakhir</span>
                </Label>
                <Select value={formData.educationLevel} onValueChange={(value) => handleSelectChange('educationLevel', value)} disabled={loading}>
                  <SelectTrigger className={`bg-yellow-100/50 border-yellow-300 ${validationErrors.educationLevel ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih Jenjang" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-yellow-300">
                    {educationLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.educationLevel && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.educationLevel}</p>
                )}
              </div>

              <div>
                <Label htmlFor="major" className="flex items-center space-x-2 mb-2 font-semibold">
                  <BookOpen className="h-4 w-4 text-gray-600" />
                  <span>Jurusan</span>
                </Label>
                <Input
                  id="major"
                  type="text"
                  placeholder="Contoh: Teknik Informatika"
                  value={formData.major}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-yellow-100/50 border-yellow-300 ${validationErrors.major ? 'border-red-500' : ''}`}
                />
                {validationErrors.major && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.major}</p>
                )}
              </div>
            </div>

            {/* Row 3: Minat Karir */}
            <div>
              <Label htmlFor="interest" className="flex items-center space-x-2 mb-2 font-semibold">
                <Target className="h-4 w-4 text-gray-600" />
                <span>Minat Karir Saat Ini</span>
              </Label>
              <Select value={formData.interest} onValueChange={(value) => handleSelectChange('interest', value)} disabled={loading}>
                <SelectTrigger className={`bg-yellow-100/50 border-yellow-300 ${validationErrors.interest ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Pilih Bidang Minat" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-yellow-300">
                  {interests.map(interest => (
                    <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.interest && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.interest}</p>
              )}
            </div>

            {/* Row 4: Tujuan Karir */}
            <div>
              <Label htmlFor="goal" className="flex items-center space-x-2 mb-2 font-semibold">
                <Send className="h-4 w-4 text-gray-600" />
                <span>Tuliskan Tujuan Karir Anda</span>
              </Label>
              <Textarea
                id="goal"
                placeholder="Contoh: Dalam 1 tahun, saya ingin menjadi Frontend Developer di perusahaan startup teknologi dan menguasai React dan TypeScript."
                value={formData.goal}
                onChange={handleChange}
                disabled={loading}
                rows={4}
                className={`bg-yellow-100/50 border-yellow-300 ${validationErrors.goal ? 'border-red-500' : ''}`}
              />
              <p className="text-xs text-gray-600 mt-1">
                Minimal 20 karakter • {formData.goal.length}/100
              </p>
              {validationErrors.goal && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.goal}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 text-lg transition-colors"
            >
              {loading ? 'Memproses...' : 'Lanjut ke SkillMatch'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}