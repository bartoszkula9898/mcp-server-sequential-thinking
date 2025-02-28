import { ThoughtData } from '../types/ThoughtData.js';
import { SemanticAnalyzer } from './semanticAnalyzer.js';
import { PromptMetadata } from './promptAnalyzer.js';

export class ContradictionDetector {
  private semanticAnalyzer: SemanticAnalyzer;

  constructor() {
    this.semanticAnalyzer = new SemanticAnalyzer();
  }

  /**
   * Checks for contradictions between a new thought and existing thoughts
   */
  public checkContradictions(newThought: ThoughtData, existingThoughts: ThoughtData[]): {
    hasContradictions: boolean;
    details: { thoughtNumber: number; explanation: string }[];
  } {
    const contradictions: { thoughtNumber: number; explanation: string }[] = [];

    // Skip if the new thought is a revision
    if (newThought.isRevision) {
      return { hasContradictions: false, details: [] };
    }

    existingThoughts.forEach(existingThought => {
      // Skip comparing with revisions or the same thought
      if (existingThought.isRevision || existingThought.thoughtNumber === newThought.thoughtNumber) {
        return;
      }

      const contradiction = this.detectContradiction(newThought, existingThought);
      if (contradiction) {
        contradictions.push({
          thoughtNumber: existingThought.thoughtNumber,
          explanation: contradiction
        });
      }
    });

    return {
      hasContradictions: contradictions.length > 0,
      details: contradictions
    };
  }

  /**
   * Analyzes potential contradictions in assumptions
   */
  public analyzeAssumptionContradictions(thoughts: ThoughtData[]): {
    thoughtNumber: number;
    conflictingAssumptions: string[];
  }[] {
    const conflicts: {
      thoughtNumber: number;
      conflictingAssumptions: string[];
    }[] = [];

    thoughts.forEach(thought => {
      if (!thought.assumptions || thought.assumptions.length === 0) return;

      const conflictingAssumptions = this.findConflictingAssumptions(
        thought,
        thoughts.filter(t => t.thoughtNumber !== thought.thoughtNumber)
      );

      if (conflictingAssumptions.length > 0) {
        conflicts.push({
          thoughtNumber: thought.thoughtNumber,
          conflictingAssumptions
        });
      }
    });

    return conflicts;
  }

  /**
   * Checks for contradictions between a thought and prompt requirements
   * @param thought The thought to analyze
   * @param promptMetadata The prompt metadata for context
   * @returns Object with contradiction information
   */
  public checkPromptContradictions(thought: ThoughtData, promptMetadata: PromptMetadata): {
    hasContradictions: boolean;
    details: Array<{
      type: 'goal' | 'constraint' | 'domain';
      element: string;
      explanation: string;
    }>;
    resolutionStrategies: string[];
  } {
    const contradictions: Array<{
      type: 'goal' | 'constraint' | 'domain';
      element: string;
      explanation: string;
    }> = [];
    
    // Check for contradictions with goals
    promptMetadata.goals.forEach(goal => {
      const contradiction = this.detectPromptElementContradiction(thought.thought, goal);
      if (contradiction) {
        contradictions.push({
          type: 'goal',
          element: goal,
          explanation: contradiction
        });
      }
    });
    
    // Check for contradictions with constraints
    promptMetadata.constraints.forEach(constraint => {
      const contradiction = this.detectPromptElementContradiction(thought.thought, constraint);
      if (contradiction) {
        contradictions.push({
          type: 'constraint',
          element: constraint,
          explanation: contradiction
        });
      }
    });
    
    // Generate resolution strategies
    const resolutionStrategies = this.generateResolutionStrategies(contradictions, thought, promptMetadata);
    
    return {
      hasContradictions: contradictions.length > 0,
      details: contradictions,
      resolutionStrategies
    };
  }

  /**
   * Analyzes prompt-based consistency across multiple thoughts
   * @param thoughts Array of thoughts to analyze
   * @param promptMetadata The prompt metadata for context
   * @returns Analysis of prompt-based consistency
   */
  public analyzePromptConsistency(thoughts: ThoughtData[], promptMetadata: PromptMetadata): {
    overallConsistency: number;
    inconsistentThoughts: Array<{
      thoughtNumber: number;
      inconsistencyReason: string;
    }>;
    consistencyTrend: 'improving' | 'declining' | 'stable';
    recommendations: string[];
  } {
    // Track consistency scores for each thought
    const consistencyScores: Array<{
      thoughtNumber: number;
      score: number;
      reason?: string;
    }> = [];
    
    // Analyze each thought for prompt consistency
    thoughts.forEach(thought => {
      const contradictions = this.checkPromptContradictions(thought, promptMetadata);
      const alignmentScore = this.calculatePromptAlignmentScore(thought, promptMetadata);
      
      // Calculate consistency score (0-1, where 1 is fully consistent)
      const consistencyScore = Math.max(0, 1 - (contradictions.details.length * 0.2)) * alignmentScore;
      
      // Add to scores with reason if inconsistent
      if (consistencyScore < 0.7 && contradictions.details.length > 0) {
        consistencyScores.push({
          thoughtNumber: thought.thoughtNumber,
          score: consistencyScore,
          reason: contradictions.details[0].explanation
        });
      } else {
        consistencyScores.push({
          thoughtNumber: thought.thoughtNumber,
          score: consistencyScore
        });
      }
    });
    
    // Calculate overall consistency
    const overallConsistency = consistencyScores.reduce((sum, item) => sum + item.score, 0) / 
                              Math.max(1, consistencyScores.length);
    
    // Identify inconsistent thoughts
    const inconsistentThoughts = consistencyScores
      .filter(item => item.score < 0.7 && item.reason)
      .map(item => ({
        thoughtNumber: item.thoughtNumber,
        inconsistencyReason: item.reason!
      }));
    
    // Analyze trend (are later thoughts more consistent?)
    let consistencyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (consistencyScores.length >= 3) {
      const firstHalf = consistencyScores.slice(0, Math.floor(consistencyScores.length / 2));
      const secondHalf = consistencyScores.slice(Math.floor(consistencyScores.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.score, 0) / secondHalf.length;
      
      if (secondHalfAvg > firstHalfAvg + 0.1) {
        consistencyTrend = 'improving';
      } else if (firstHalfAvg > secondHalfAvg + 0.1) {
        consistencyTrend = 'declining';
      }
    }
    
    // Generate recommendations
    const recommendations = this.generateConsistencyRecommendations(
      inconsistentThoughts, 
      consistencyTrend,
      promptMetadata
    );
    
    return {
      overallConsistency,
      inconsistentThoughts,
      consistencyTrend,
      recommendations
    };
  }

  private detectContradiction(thought1: ThoughtData, thought2: ThoughtData): string | null {
    // Check for semantic similarity first
    const similarity = this.semanticAnalyzer.analyzeSemanticSimilarity(thought1, thought2);
    
    if (similarity > 0.5) { // Only check similar thoughts for contradictions
      // Check for opposing classifications
      if (this.hasOpposingClassifications(thought1, thought2)) {
        return `Opposing classifications: ${thought1.classification} vs ${thought2.classification}`;
      }

      // Check for conflicting conclusions
      if (this.hasConflictingConclusions(thought1, thought2)) {
        return 'Conflicting conclusions detected';
      }

      // Check for assumption conflicts
      const assumptionConflicts = this.checkAssumptionConflicts(thought1, thought2);
      if (assumptionConflicts) {
        return `Conflicting assumptions: ${assumptionConflicts}`;
      }
    }

    return null;
  }

  private hasOpposingClassifications(thought1: ThoughtData, thought2: ThoughtData): boolean {
    const opposingPairs = new Set([
      'hypothesis:conclusion',
      'question:solution',
      'observation:conclusion'
    ]);

    if (thought1.classification && thought2.classification) {
      const pair = `${thought1.classification}:${thought2.classification}`;
      return opposingPairs.has(pair) || opposingPairs.has(pair.split(':').reverse().join(':'));
    }

    return false;
  }

  private hasConflictingConclusions(thought1: ThoughtData, thought2: ThoughtData): boolean {
    if (thought1.classification !== 'conclusion' || thought2.classification !== 'conclusion') {
      return false;
    }

    // Simple negation detection
    const negationWords = new Set(['not', 'never', 'no', 'cannot', "don't", "doesn't"]);
    const hasNegation1 = this.containsNegation(thought1.thought, negationWords);
    const hasNegation2 = this.containsNegation(thought2.thought, negationWords);

    return hasNegation1 !== hasNegation2;
  }

  private containsNegation(text: string, negationWords: Set<string>): boolean {
    return text.toLowerCase().split(' ').some(word => negationWords.has(word));
  }

  private checkAssumptionConflicts(thought1: ThoughtData, thought2: ThoughtData): string | null {
    if (!thought1.assumptions || !thought2.assumptions) return null;

    const conflicts = thought1.assumptions.filter(assumption1 =>
      thought2.assumptions!.some(assumption2 =>
        this.areAssumptionsConflicting(assumption1, assumption2)
      )
    );

    return conflicts.length > 0 ? conflicts.join(', ') : null;
  }

  private findConflictingAssumptions(
    thought: ThoughtData,
    otherThoughts: ThoughtData[]
  ): string[] {
    if (!thought.assumptions) return [];

    const conflictingAssumptions: string[] = [];

    thought.assumptions.forEach(assumption => {
      otherThoughts.forEach(otherThought => {
        if (!otherThought.assumptions) return;

        otherThought.assumptions.forEach(otherAssumption => {
          if (this.areAssumptionsConflicting(assumption, otherAssumption)) {
            conflictingAssumptions.push(
              `"${assumption}" conflicts with "${otherAssumption}" in thought ${otherThought.thoughtNumber}`
            );
          }
        });
      });
    });

    return conflictingAssumptions;
  }

  private areAssumptionsConflicting(assumption1: string, assumption2: string): boolean {
    // Simple negation check
    const negated1 = assumption1.toLowerCase().startsWith('not ');
    const negated2 = assumption2.toLowerCase().startsWith('not ');
    const base1 = negated1 ? assumption1.slice(4) : assumption1;
    const base2 = negated2 ? assumption2.slice(4) : assumption2;

    return base1.toLowerCase() === base2.toLowerCase() && negated1 !== negated2;
  }

  /**
   * Detects contradictions between a thought and a prompt element
   */
  private detectPromptElementContradiction(thoughtText: string, promptElement: string): string | null {
    // Convert to lowercase for comparison
    const thought = thoughtText.toLowerCase();
    const element = promptElement.toLowerCase();
    
    // Check for direct negation of the prompt element
    const negationWords = new Set(['not', 'never', 'no', 'cannot', "don't", "doesn't", "won't", "shouldn't"]);
    
    // Extract key phrases from the prompt element
    const keyPhrases = element.split(/[,.]/).map(phrase => phrase.trim()).filter(phrase => phrase.length > 0);
    
    for (const phrase of keyPhrases) {
      // Skip very short phrases
      if (phrase.length < 4) continue;
      
      // Check if the thought contains the phrase
      if (thought.includes(phrase)) {
        // Look for negations near the phrase
        const words = thought.split(/\s+/);
        const phraseIndex = words.findIndex(word => word.includes(phrase.split(/\s+/)[0]));
        
        if (phraseIndex >= 0) {
          // Check for negation words within 3 words before the phrase
          const startIndex = Math.max(0, phraseIndex - 3);
          const contextWords = words.slice(startIndex, phraseIndex);
          
          if (contextWords.some(word => negationWords.has(word))) {
            return `Thought negates the prompt element: "${phrase}"`;
          }
        }
      }
      
      // Check for statements that directly contradict the element
      if (this.containsContradictoryStatement(thought, phrase)) {
        return `Thought contains a statement contradicting: "${phrase}"`;
      }
    }
    
    return null;
  }

  /**
   * Checks if a text contains statements contradicting a given phrase
   */
  private containsContradictoryStatement(text: string, phrase: string): boolean {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated NLP techniques
    
    // Check for opposite meaning phrases
    const oppositePairs = [
      ['increase', 'decrease'],
      ['more', 'less'],
      ['high', 'low'],
      ['good', 'bad'],
      ['positive', 'negative'],
      ['include', 'exclude'],
      ['allow', 'prevent'],
      ['enable', 'disable'],
      ['start', 'stop'],
      ['begin', 'end'],
      ['create', 'destroy'],
      ['add', 'remove'],
      ['accept', 'reject']
    ];
    
    for (const [term1, term2] of oppositePairs) {
      if (phrase.includes(term1) && text.includes(term2)) {
        // Check that they're referring to the same subject
        const phraseWords = phrase.split(/\s+/);
        const textWords = text.split(/\s+/);
        
        // Find common words (potential subjects)
        const commonWords = phraseWords.filter(word => 
          word.length > 3 && textWords.includes(word) && word !== term1 && word !== term2
        );
        
        if (commonWords.length > 0) {
          return true;
        }
      }
      
      if (phrase.includes(term2) && text.includes(term1)) {
        // Same check for the reverse case
        const phraseWords = phrase.split(/\s+/);
        const textWords = text.split(/\s+/);
        
        const commonWords = phraseWords.filter(word => 
          word.length > 3 && textWords.includes(word) && word !== term1 && word !== term2
        );
        
        if (commonWords.length > 0) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Generates strategies to resolve contradictions
   */
  private generateResolutionStrategies(
    contradictions: Array<{
      type: 'goal' | 'constraint' | 'domain';
      element: string;
      explanation: string;
    }>,
    thought: ThoughtData,
    promptMetadata: PromptMetadata
  ): string[] {
    if (contradictions.length === 0) {
      return [];
    }
    
    const strategies: string[] = [];
    
    // Generate specific strategies based on contradiction types
    contradictions.forEach(contradiction => {
      if (contradiction.type === 'goal') {
        strategies.push(`Revise thought to align with the goal: "${contradiction.element}"`);
        strategies.push(`Consider how to achieve the goal while maintaining your current approach`);
      } else if (contradiction.type === 'constraint') {
        strategies.push(`Modify approach to respect the constraint: "${contradiction.element}"`);
        strategies.push(`Find alternative solutions that don't violate this constraint`);
      } else if (contradiction.type === 'domain') {
        strategies.push(`Incorporate knowledge from the domain: "${contradiction.element}"`);
      }
    });
    
    // Add general strategies
    strategies.push(`Review the original prompt to ensure alignment with all requirements`);
    
    // Add thought-specific strategies
    if (thought.phase === 'Planning') {
      strategies.push(`Adjust your planning to incorporate the prompt requirements`);
    } else if (thought.phase === 'Execution') {
      strategies.push(`Modify your implementation approach to resolve these contradictions`);
    } else if (thought.phase === 'Verification') {
      strategies.push(`Verify your solution against all prompt requirements`);
    }
    
    return [...new Set(strategies)]; // Remove duplicates
  }

  /**
   * Calculates a prompt alignment score for consistency analysis
   */
  private calculatePromptAlignmentScore(thought: ThoughtData, promptMetadata: PromptMetadata): number {
    // This is a simplified implementation
    // In a real system, this would use the full prompt alignment calculation
    
    const thoughtText = thought.thought.toLowerCase();
    let score = 0;
    
    // Check for goal alignment
    const goalMatches = promptMetadata.goals.filter(goal => 
      thoughtText.includes(goal.toLowerCase())
    ).length;
    
    score += (goalMatches / Math.max(1, promptMetadata.goals.length)) * 0.5;
    
    // Check for constraint alignment
    const constraintMatches = promptMetadata.constraints.filter(constraint => 
      thoughtText.includes(constraint.toLowerCase())
    ).length;
    
    score += (constraintMatches / Math.max(1, promptMetadata.constraints.length)) * 0.3;
    
    // Check for domain alignment
    const domainMatches = promptMetadata.domains.filter(domain => 
      thoughtText.includes(domain.toLowerCase())
    ).length;
    
    score += (domainMatches / Math.max(1, promptMetadata.domains.length)) * 0.2;
    
    return score;
  }

  /**
   * Generates recommendations for improving prompt consistency
   */
  private generateConsistencyRecommendations(
    inconsistentThoughts: Array<{
      thoughtNumber: number;
      inconsistencyReason: string;
    }>,
    trend: 'improving' | 'declining' | 'stable',
    promptMetadata: PromptMetadata
  ): string[] {
    const recommendations: string[] = [];
    
    // Add recommendations based on inconsistent thoughts
    if (inconsistentThoughts.length > 0) {
      recommendations.push(`Revise thoughts ${inconsistentThoughts.map(t => t.thoughtNumber).join(', ')} to align with prompt requirements`);
      
      // Group by common reasons
      const reasonGroups: Record<string, number[]> = {};
      inconsistentThoughts.forEach(thought => {
        if (!reasonGroups[thought.inconsistencyReason]) {
          reasonGroups[thought.inconsistencyReason] = [];
        }
        reasonGroups[thought.inconsistencyReason].push(thought.thoughtNumber);
      });
      
      // Add specific recommendations for each reason group
      Object.entries(reasonGroups).forEach(([reason, thoughtNumbers]) => {
        if (reason.includes('negates')) {
          recommendations.push(`Thoughts ${thoughtNumbers.join(', ')} contradict prompt requirements - consider alternative approaches`);
        } else if (reason.includes('contradicting')) {
          recommendations.push(`Thoughts ${thoughtNumbers.join(', ')} contain statements that conflict with prompt goals`);
        }
      });
    }
    
    // Add recommendations based on trend
    if (trend === 'declining') {
      recommendations.push('Recent thoughts are becoming less aligned with the prompt - refocus on the original requirements');
    } else if (trend === 'improving') {
      recommendations.push('Continue the improving trend of prompt alignment in future thoughts');
    }
    
    // Add general recommendations
    recommendations.push(`Ensure all thoughts address the primary goals: ${promptMetadata.goals.slice(0, 3).join(', ')}`);
    
    if (promptMetadata.constraints.length > 0) {
      recommendations.push(`Maintain awareness of key constraints: ${promptMetadata.constraints.slice(0, 3).join(', ')}`);
    }
    
    return recommendations;
  }
} 