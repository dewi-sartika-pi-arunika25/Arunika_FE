"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader, Code, Users, AlertCircle } from 'lucide-react';
import { getAllSkillGapsForRole } from '@/lib/utils/roleSkillMapping';

/**
 * Hard Skill Assessment Component
 * Menampilkan hard skill berdasarkan role yang cocok dan meminta user untuk rate skill yang sudah dikuasai
 */
export default function HardSkillAssessment({ 
  recommendedRole, 
  onSubmit, 
  onSkip,
  loading = false 
}) {
  const [skillRatings, setSkillRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Get hard skills untuk role yang cocok
  const hardSkills = useMemo(() => {
    if (!recommendedRole || recommendedRole === "Belum Tersedia") {
      return [];
    }
    
    const allSkills = getAllSkillGapsForRole(recommendedRole);
    // Filter hanya hard skills
    return allSkills.filter(skill => skill.category === "hard" || !skill.category);
  }, [recommendedRole]);

  // Handle skill rating (1-5 scale)
  const handleSkillRating = (skillName, rating) => {
    setSkillRatings(prev => ({
      ...prev,
      [skillName]: rating
    }));
  };

  // Calculate progress
  const progress = useMemo(() => {
    if (hardSkills.length === 0) return 0;
    const ratedCount = Object.keys(skillRatings).filter(key => skillRatings[key] > 0).length;
    return Math.round((ratedCount / hardSkills.length) * 100);
  }, [skillRatings, hardSkills.length]);

  // Handle submit
  const handleSubmit = async () => {
    if (hardSkills.length === 0) {
      // Jika tidak ada hard skill, skip saja
      onSkip?.();
      return;
    }

    // Prepare skill assessment data
    const skillAssessment = hardSkills.map(skill => ({
      skill: skill.skill || skill.name,
      description: skill.description || "",
      requiredLevel: skill.priority || 3, // Priority sebagai required level (1-5)
      userLevel: skillRatings[skill.skill || skill.name] || 0, // User rating (0-5)
      category: "hard",
      gap: Math.max(0, (skill.priority || 3) - (skillRatings[skill.skill || skill.name] || 0))
    }));

    setSubmitted(true);
    await onSubmit?.(skillAssessment);
  };

  // Handle skip
  const handleSkip = () => {
    onSkip?.();
  };

  if (hardSkills.length === 0) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Hard Skill Assessment Tidak Tersedia
          </h3>
          <p className="text-gray-600 mb-4">
            Role yang cocok untuk Anda belum memiliki mapping hard skill. Anda dapat melanjutkan ke dashboard.
          </p>
          <Button onClick={handleSkip} className="bg-[#E4B200] hover:bg-[#D4A200] text-white">
            Lanjutkan ke Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ratedCount = Object.keys(skillRatings).filter(key => skillRatings[key] > 0).length;
  const allRated = ratedCount === hardSkills.length;

  return (
    <div className="space-y-6">
      <Card className="border-[#E4B200]/30 bg-gradient-to-br from-[#FFFDF5] to-[#FFF6DC]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Code className="h-6 w-6 text-[#E4B200]" />
            Assessment Hard Skill untuk {recommendedRole}
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Berdasarkan hasil assessment DISC/RIASEC, role yang cocok untuk Anda adalah <strong>{recommendedRole}</strong>.
            Berikut adalah hard skill yang dibutuhkan untuk role ini. Silakan beri rating seberapa baik Anda menguasai setiap skill (1 = Tidak tahu, 5 = Expert).
          </p>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {ratedCount} / {hardSkills.length} skill sudah di-rating
              </span>
              <span className="text-sm font-semibold text-[#E4B200]">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Skill List */}
          <div className="space-y-4">
            {hardSkills.map((skill, index) => {
              const skillName = skill.skill || skill.name;
              const currentRating = skillRatings[skillName] || 0;
              const requiredLevel = skill.priority || 3;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{skillName}</h4>
                      {skill.description && (
                        <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Required Level: {requiredLevel}/5
                        </span>
                        {currentRating > 0 && (
                          <span className={`px-2 py-1 rounded ${
                            currentRating >= requiredLevel
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            Your Level: {currentRating}/5
                            {currentRating < requiredLevel && (
                              <span className="ml-1">⚠️ Gap: {requiredLevel - currentRating}</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleSkillRating(skillName, rating)}
                        disabled={loading || submitted}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          currentRating === rating
                            ? 'bg-[#E4B200] text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${loading || submitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={rating === 1 ? 'Tidak tahu' : rating === 5 ? 'Expert' : `Level ${rating}`}
                      >
                        {rating === 1 && '😕'}
                        {rating === 2 && '😐'}
                        {rating === 3 && '🙂'}
                        {rating === 4 && '😊'}
                        {rating === 5 && '🤩'}
                        <span className="ml-1">{rating}</span>
                      </button>
                    ))}
                    {currentRating === 0 && (
                      <span className="text-xs text-gray-500 self-center ml-2">
                        Belum di-rating
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={loading || submitted}
              className="border-gray-300"
            >
              Lewati (Opsional)
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || submitted || !allRated}
              className="bg-[#E4B200] hover:bg-[#D4A200] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || submitted ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Simpan & Lanjutkan ({ratedCount}/{hardSkills.length})
                </>
              )}
            </Button>
          </div>

          {!allRated && ratedCount > 0 && (
            <p className="text-sm text-orange-600 mt-4 text-center">
              ⚠️ Silakan rate semua skill terlebih dahulu untuk melanjutkan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

