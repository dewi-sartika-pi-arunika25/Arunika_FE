/**
 * Assessment utility functions
 * Reusable functions for assessment logic
 */

import { ASSESSMENT } from '../config/constants.js';

/**
 * Validate answer score
 * @param {number} score - Answer score
 * @returns {boolean}
 */
export function isValidScore(score) {
  return score >= ASSESSMENT.MIN_SCORE && score <= ASSESSMENT.MAX_SCORE;
}

/**
 * Check if all questions are answered
 * @param {Array} questions - Questions array
 * @param {Object} answers - Answers object { questionId: score }
 * @returns {boolean}
 */
export function areAllQuestionsAnswered(questions, answers) {
  if (!questions || questions.length === 0) return false;
  
  return questions.every(q => {
    const answer = answers[q.id];
    return answer && isValidScore(answer);
  });
}

/**
 * Count answered questions
 * @param {Object} answers - Answers object
 * @returns {number}
 */
export function countAnsweredQuestions(answers) {
  if (!answers) return 0;
  
  return Object.keys(answers).filter(
    key => isValidScore(answers[key])
  ).length;
}

/**
 * Calculate progress percentage
 * @param {number} answeredCount - Number of answered questions
 * @param {number} totalQuestions - Total number of questions
 * @returns {number} - Progress percentage (0-100)
 */
export function calculateProgress(answeredCount, totalQuestions) {
  if (!totalQuestions || totalQuestions === 0) return 0;
  return Math.round((answeredCount / totalQuestions) * 100);
}

/**
 * Format responses for API submission
 * @param {Array} questions - Questions array
 * @param {Object} answers - Answers object
 * @returns {Array} - Formatted responses array
 */
export function formatAssessmentResponses(questions, answers) {
  return questions.map(q => ({
    trait: q.trait,
    category: q.category,
    score_value: answers[q.id],
  }));
}

/**
 * Normalize question data from API
 * @param {Array} questionsData - Raw questions from API
 * @returns {Array} - Normalized questions
 */
export function normalizeQuestions(questionsData) {
  if (!Array.isArray(questionsData)) return [];
  
  return questionsData.map((q, idx) => ({
    id: q.id || `q_${idx}`,
    text: q.text,
    trait: q.trait,
    category: q.category,
  }));
}

