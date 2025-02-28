// IntelligenceMaximizationModule.ts
// This component is responsible for maximizing AI capabilities based on prompt specifics
// It recommends strategies, estimates complexity, and identifies appropriate reasoning types

import { PromptMetadata } from './promptAnalyzer.js';

// Define interfaces for the module

// Strategy recommendation based on prompt type
export interface StrategyRecommendation {
  strategyName: string;
  description: string;
  reasonForRecommendation: string;
  estimatedEffectiveness: number; // 0-10 score
  applicablePhases: Array<'Planning' | 'Analysis' | 'Execution' | 'Verification'>;
}

// Reasoning type recommendation
export interface ReasoningTypeRecommendation {
  reasoningType: 'deductive' | 'inductive' | 'abductive' | 'analogical' | 'causal' | 'counterfactual' | 'creative';
  description: string;
  applicability: number; // 0-10 score
  examples: string[];
}

// Complexity estimation result
export interface ComplexityEstimation {
  overallComplexity: 'simple' | 'medium' | 'complex';
  dimensionalComplexity: {
    conceptual: number; // 0-10 score
    procedural: number; // 0-10 score
    contextual: number; // 0-10 score
    domain: number; // 0-10 score
  };
  recommendedThoughtCount: number;
  recommendedPhaseDistribution: {
    Planning: number;
    Analysis: number;
    Execution: number;
    Verification: number;
  };
}

// Intelligence maximization recommendations
export interface IntelligenceMaximizationRecommendations {
  strategies: StrategyRecommendation[];
  reasoningTypes: ReasoningTypeRecommendation[];
  complexityEstimation: ComplexityEstimation;
  toolRecommendations: string[];
  focusAreas: string[];
  potentialPitfalls: string[];
}

export class IntelligenceMaximizationModule {
  /**
   * Generates comprehensive recommendations for maximizing AI intelligence based on prompt
   * @param promptMetadata The analyzed prompt metadata
   * @param currentThoughtNumber The current thought number in the sequence
   * @param totalThoughts The total estimated thoughts
   * @param phase The current thinking phase
   * @returns Intelligence maximization recommendations
   */
  public generateRecommendations(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): IntelligenceMaximizationRecommendations {
    // Generate strategy recommendations
    const strategies = this.recommendStrategies(promptMetadata, currentThoughtNumber, totalThoughts, phase);
    
    // Recommend reasoning types
    const reasoningTypes = this.recommendReasoningTypes(promptMetadata, phase);
    
    // Estimate complexity
    const complexityEstimation = this.estimateDetailedComplexity(promptMetadata);
    
    // Recommend tools
    const toolRecommendations = this.recommendTools(promptMetadata, phase);
    
    // Identify focus areas
    const focusAreas = this.identifyFocusAreas(promptMetadata, currentThoughtNumber, totalThoughts);
    
    // Identify potential pitfalls
    const potentialPitfalls = this.identifyPotentialPitfalls(promptMetadata);
    
    return {
      strategies,
      reasoningTypes,
      complexityEstimation,
      toolRecommendations,
      focusAreas,
      potentialPitfalls
    };
  }

  /**
   * Recommends strategies based on prompt type and current phase
   * @param promptMetadata The analyzed prompt metadata
   * @param currentThoughtNumber The current thought number
   * @param totalThoughts The total estimated thoughts
   * @param phase The current thinking phase
   * @returns Array of strategy recommendations
   */
  private recommendStrategies(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): StrategyRecommendation[] {
    const recommendations: StrategyRecommendation[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Add task-type specific strategies
    switch (promptMetadata.taskType) {
      case 'creative':
        recommendations.push({
          strategyName: 'Divergent Thinking',
          description: 'Generate multiple diverse ideas before converging on solutions',
          reasonForRecommendation: 'Creative tasks benefit from exploring multiple possibilities',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis']
        });
        
        recommendations.push({
          strategyName: 'Analogical Reasoning',
          description: 'Draw parallels from different domains to inspire novel solutions',
          reasonForRecommendation: 'Analogies can spark creative insights',
          estimatedEffectiveness: 8,
          applicablePhases: ['Analysis', 'Execution']
        });
        break;
        
      case 'analytical':
        recommendations.push({
          strategyName: 'Systematic Decomposition',
          description: 'Break down the problem into clearly defined components',
          reasonForRecommendation: 'Analytical tasks benefit from structured problem decomposition',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis']
        });
        
        recommendations.push({
          strategyName: 'Evidence-Based Reasoning',
          description: 'Support each conclusion with specific evidence',
          reasonForRecommendation: 'Analytical tasks require rigorous justification',
          estimatedEffectiveness: 8,
          applicablePhases: ['Analysis', 'Execution', 'Verification']
        });
        break;
        
      case 'informational':
        recommendations.push({
          strategyName: 'Comprehensive Coverage',
          description: 'Ensure all relevant aspects of the topic are addressed',
          reasonForRecommendation: 'Informational tasks benefit from breadth of coverage',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Execution']
        });
        
        recommendations.push({
          strategyName: 'Hierarchical Organization',
          description: 'Structure information from general to specific',
          reasonForRecommendation: 'Hierarchical organization improves information accessibility',
          estimatedEffectiveness: 8,
          applicablePhases: ['Execution', 'Verification']
        });
        break;
        
      case 'technical':
        recommendations.push({
          strategyName: 'Precision-First Approach',
          description: 'Focus on technical accuracy and precise terminology',
          reasonForRecommendation: 'Technical tasks require domain-specific precision',
          estimatedEffectiveness: 9,
          applicablePhases: ['Analysis', 'Execution']
        });
        
        recommendations.push({
          strategyName: 'Implementation Planning',
          description: 'Develop detailed step-by-step implementation plans',
          reasonForRecommendation: 'Technical tasks benefit from explicit implementation details',
          estimatedEffectiveness: 8,
          applicablePhases: ['Planning', 'Execution']
        });
        break;
        
      case 'mixed':
        recommendations.push({
          strategyName: 'Adaptive Approach',
          description: 'Flexibly switch between creative and analytical modes',
          reasonForRecommendation: 'Mixed tasks require adaptability between thinking styles',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis', 'Execution']
        });
        break;
    }
    
    // Add phase-specific strategies
    if (phase) {
      switch (phase) {
        case 'Planning':
          recommendations.push({
            strategyName: 'Goal Decomposition',
            description: 'Break down the main goal into sub-goals',
            reasonForRecommendation: 'Planning phase benefits from clear goal hierarchy',
            estimatedEffectiveness: 8,
            applicablePhases: ['Planning']
          });
          break;
          
        case 'Analysis':
          recommendations.push({
            strategyName: 'Multi-perspective Analysis',
            description: 'Analyze the problem from multiple stakeholder perspectives',
            reasonForRecommendation: 'Analysis phase benefits from diverse viewpoints',
            estimatedEffectiveness: 8,
            applicablePhases: ['Analysis']
          });
          break;
          
        case 'Execution':
          recommendations.push({
            strategyName: 'Incremental Development',
            description: 'Build the solution in incremental steps with validation',
            reasonForRecommendation: 'Execution phase benefits from iterative approach',
            estimatedEffectiveness: 8,
            applicablePhases: ['Execution']
          });
          break;
          
        case 'Verification':
          recommendations.push({
            strategyName: 'Criteria-Based Evaluation',
            description: 'Evaluate the solution against explicit success criteria',
            reasonForRecommendation: 'Verification phase benefits from objective assessment',
            estimatedEffectiveness: 8,
            applicablePhases: ['Verification']
          });
          break;
      }
    }
    
    // Add progress-specific strategies
    if (progress < 0.3) {
      recommendations.push({
        strategyName: 'Exploratory Breadth',
        description: 'Explore the problem space broadly before diving deep',
        reasonForRecommendation: 'Early thoughts benefit from broad exploration',
        estimatedEffectiveness: 8,
        applicablePhases: ['Planning', 'Analysis']
      });
    } else if (progress > 0.7) {
      recommendations.push({
        strategyName: 'Convergent Synthesis',
        description: 'Synthesize insights from previous thoughts into cohesive solution',
        reasonForRecommendation: 'Later thoughts benefit from synthesis of earlier insights',
        estimatedEffectiveness: 8,
        applicablePhases: ['Execution', 'Verification']
      });
    }
    
    // Add complexity-specific strategies
    switch (promptMetadata.complexity) {
      case 'complex':
        recommendations.push({
          strategyName: 'Iterative Refinement',
          description: 'Continuously refine understanding through multiple passes',
          reasonForRecommendation: 'Complex problems benefit from iterative approaches',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis', 'Execution', 'Verification']
        });
        break;
    }
    
    // Return top strategies (limit to 3 to avoid overwhelming)
    return recommendations.slice(0, 3);
  }

  /**
   * Recommends appropriate reasoning types based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @param phase The current thinking phase
   * @returns Array of reasoning type recommendations
   */
  private recommendReasoningTypes(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): ReasoningTypeRecommendation[] {
    const recommendations: ReasoningTypeRecommendation[] = [];
    
    // Add task-type specific reasoning types
    switch (promptMetadata.taskType) {
      case 'creative':
        recommendations.push({
          reasoningType: 'creative',
          description: 'Generate novel ideas by combining existing concepts in new ways',
          applicability: 9,
          examples: ['Brainstorming multiple solutions', 'Using metaphors to reframe the problem']
        });
        
        recommendations.push({
          reasoningType: 'analogical',
          description: 'Draw parallels between the current problem and similar situations',
          applicability: 8,
          examples: ['Applying solutions from one domain to another', 'Using metaphors to generate insights']
        });
        break;
        
      case 'analytical':
        recommendations.push({
          reasoningType: 'deductive',
          description: 'Draw specific conclusions from general principles',
          applicability: 9,
          examples: ['Applying established rules to specific cases', 'Using logical inference']
        });
        
        recommendations.push({
          reasoningType: 'causal',
          description: 'Identify cause-effect relationships',
          applicability: 8,
          examples: ['Analyzing root causes', 'Predicting outcomes based on actions']
        });
        break;
        
      case 'informational':
        recommendations.push({
          reasoningType: 'inductive',
          description: 'Draw general conclusions from specific observations',
          applicability: 9,
          examples: ['Identifying patterns from examples', 'Generalizing from specific cases']
        });
        break;
        
      case 'technical':
        recommendations.push({
          reasoningType: 'deductive',
          description: 'Apply established principles to specific technical problems',
          applicability: 9,
          examples: ['Applying technical standards', 'Following established procedures']
        });
        
        recommendations.push({
          reasoningType: 'causal',
          description: 'Analyze technical cause-effect relationships',
          applicability: 8,
          examples: ['Debugging by tracing effects to causes', 'Predicting system behavior']
        });
        break;
        
      case 'mixed':
        recommendations.push({
          reasoningType: 'abductive',
          description: 'Form the most likely explanation from incomplete information',
          applicability: 8,
          examples: ['Developing working hypotheses', 'Making educated guesses with limited data']
        });
        break;
    }
    
    // Add phase-specific reasoning types
    if (phase) {
      switch (phase) {
        case 'Planning':
          recommendations.push({
            reasoningType: 'counterfactual',
            description: 'Consider alternative scenarios and their implications',
            applicability: 7,
            examples: ['What if analysis', 'Considering edge cases']
          });
          break;
          
        case 'Analysis':
          if (!recommendations.some(r => r.reasoningType === 'causal')) {
            recommendations.push({
              reasoningType: 'causal',
              description: 'Identify cause-effect relationships in the problem domain',
              applicability: 8,
              examples: ['Root cause analysis', 'Impact assessment']
            });
          }
          break;
          
        case 'Execution':
          if (!recommendations.some(r => r.reasoningType === 'deductive')) {
            recommendations.push({
              reasoningType: 'deductive',
              description: 'Apply established principles to implementation',
              applicability: 8,
              examples: ['Following best practices', 'Applying domain principles']
            });
          }
          break;
          
        case 'Verification':
          recommendations.push({
            reasoningType: 'counterfactual',
            description: 'Test solution against alternative scenarios',
            applicability: 8,
            examples: ['Edge case testing', 'What-if analysis']
          });
          break;
      }
    }
    
    // Return top reasoning types (limit to 2 to avoid overwhelming)
    return recommendations.slice(0, 2);
  }

  /**
   * Estimates detailed complexity of the task based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Detailed complexity estimation
   */
  private estimateDetailedComplexity(promptMetadata: PromptMetadata): ComplexityEstimation {
    // Start with the basic complexity from prompt metadata
    const overallComplexity = promptMetadata.complexity;
    
    // Calculate dimensional complexity scores
    const conceptualComplexity = this.calculateConceptualComplexity(promptMetadata);
    const proceduralComplexity = this.calculateProceduralComplexity(promptMetadata);
    const contextualComplexity = this.calculateContextualComplexity(promptMetadata);
    const domainComplexity = this.calculateDomainComplexity(promptMetadata);
    
    // Calculate recommended thought count based on complexity
    let recommendedThoughtCount = 5; // Default for simple tasks
    
    if (overallComplexity === 'medium') {
      recommendedThoughtCount = 8;
    } else if (overallComplexity === 'complex') {
      recommendedThoughtCount = 12;
    }
    
    // Adjust based on dimensional complexity
    const avgDimensionalComplexity = (
      conceptualComplexity + 
      proceduralComplexity + 
      contextualComplexity + 
      domainComplexity
    ) / 4;
    
    // Fine-tune thought count based on dimensional complexity
    recommendedThoughtCount = Math.round(
      recommendedThoughtCount * (1 + (avgDimensionalComplexity - 5) / 10)
    );
    
    // Calculate recommended phase distribution
    const recommendedPhaseDistribution = this.calculatePhaseDistribution(
      overallComplexity,
      {
        conceptual: conceptualComplexity,
        procedural: proceduralComplexity,
        contextual: contextualComplexity,
        domain: domainComplexity
      }
    );
    
    return {
      overallComplexity,
      dimensionalComplexity: {
        conceptual: conceptualComplexity,
        procedural: proceduralComplexity,
        contextual: contextualComplexity,
        domain: domainComplexity
      },
      recommendedThoughtCount,
      recommendedPhaseDistribution
    };
  }

  /**
   * Calculates conceptual complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Conceptual complexity score (0-10)
   */
  private calculateConceptualComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Adjust based on number of goals
    complexity += Math.min(promptMetadata.goals.length - 1, 3);
    
    // Adjust based on number of domains
    complexity += Math.min(promptMetadata.domains.length - 1, 2);
    
    // Adjust based on task type
    if (promptMetadata.taskType === 'analytical' || promptMetadata.taskType === 'technical') {
      complexity += 1;
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates procedural complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Procedural complexity score (0-10)
   */
  private calculateProceduralComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Adjust based on number of constraints
    complexity += Math.min(promptMetadata.constraints.length, 3);
    
    // Adjust based on task type
    if (promptMetadata.taskType === 'technical') {
      complexity += 2;
    } else if (promptMetadata.taskType === 'analytical') {
      complexity += 1;
    }
    
    // Adjust based on priority
    if (promptMetadata.priority === 'high') {
      complexity += 1;
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates contextual complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Contextual complexity score (0-10)
   */
  private calculateContextualComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Adjust based on number of entities
    complexity += Math.min(promptMetadata.entities.length / 2, 3);
    
    // Adjust based on task type
    if (promptMetadata.taskType === 'mixed') {
      complexity += 2;
    } else if (promptMetadata.taskType === 'creative') {
      complexity += 1;
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates domain complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Domain complexity score (0-10)
   */
  private calculateDomainComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Domain-specific complexity adjustments
    const complexDomains = [
      'quantum physics', 'machine learning', 'artificial intelligence',
      'cryptography', 'medicine', 'law', 'finance', 'mathematics'
    ];
    
    const mediumDomains = [
      'programming', 'engineering', 'biology', 'chemistry', 'psychology',
      'economics', 'business', 'education'
    ];
    
    // Check for complex domains
    for (const domain of promptMetadata.domains) {
      if (complexDomains.some(d => domain.toLowerCase().includes(d))) {
        complexity += 2;
        break;
      } else if (mediumDomains.some(d => domain.toLowerCase().includes(d))) {
        complexity += 1;
        break;
      }
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates recommended phase distribution based on complexity
   * @param overallComplexity The overall complexity rating
   * @param dimensionalComplexity The dimensional complexity scores
   * @returns Recommended phase distribution
   */
  private calculatePhaseDistribution(
    overallComplexity: 'simple' | 'medium' | 'complex',
    dimensionalComplexity: {
      conceptual: number;
      procedural: number;
      contextual: number;
      domain: number;
    }
  ): {
    Planning: number;
    Analysis: number;
    Execution: number;
    Verification: number;
  } {
    // Default distributions based on overall complexity
    let distribution = {
      Planning: 0,
      Analysis: 0,
      Execution: 0,
      Verification: 0
    };
    
    switch (overallComplexity) {
      case 'simple':
        distribution = {
          Planning: 1,
          Analysis: 1,
          Execution: 2,
          Verification: 1
        };
        break;
        
      case 'medium':
        distribution = {
          Planning: 2,
          Analysis: 2,
          Execution: 3,
          Verification: 1
        };
        break;
        
      case 'complex':
        distribution = {
          Planning: 3,
          Analysis: 3,
          Execution: 4,
          Verification: 2
        };
        break;
    }
    
    // Adjust based on dimensional complexity
    if (dimensionalComplexity.conceptual > 7) {
      distribution.Planning += 1;
      distribution.Analysis += 1;
    }
    
    if (dimensionalComplexity.procedural > 7) {
      distribution.Execution += 1;
    }
    
    if (dimensionalComplexity.contextual > 7) {
      distribution.Analysis += 1;
    }
    
    if (dimensionalComplexity.domain > 7) {
      distribution.Analysis += 1;
      distribution.Verification += 1;
    }
    
    return distribution;
  }

  /**
   * Recommends tools based on prompt metadata and current phase
   * @param promptMetadata The analyzed prompt metadata
   * @param phase The current thinking phase
   * @returns Array of recommended tool names
   */
  private recommendTools(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): string[] {
    const recommendations: string[] = [];
    
    // Always recommend sequential thinking
    recommendations.push('sequentialthinking');
    
    // Task-type specific tool recommendations
    switch (promptMetadata.taskType) {
      case 'creative':
        recommendations.push('brainstorming');
        recommendations.push('analogyMapping');
        break;
        
      case 'analytical':
        recommendations.push('dataAnalysis');
        recommendations.push('logicalReasoning');
        break;
        
      case 'informational':
        recommendations.push('informationRetrieval');
        recommendations.push('factChecking');
        break;
        
      case 'technical':
        recommendations.push('codeGeneration');
        recommendations.push('technicalDocumentation');
        break;
    }
    
    // Phase-specific tool recommendations
    if (phase) {
      switch (phase) {
        case 'Planning':
          recommendations.push('goalDecomposition');
          break;
          
        case 'Analysis':
          recommendations.push('rootCauseAnalysis');
          break;
          
        case 'Execution':
          recommendations.push('stepByStepImplementation');
          break;
          
        case 'Verification':
          recommendations.push('qualityAssessment');
          break;
      }
    }
    
    // Filter out duplicates and return
    return [...new Set(recommendations)];
  }

  /**
   * Identifies key focus areas based on prompt metadata and progress
   * @param promptMetadata The analyzed prompt metadata
   * @param currentThoughtNumber The current thought number
   * @param totalThoughts The total estimated thoughts
   * @returns Array of focus areas
   */
  private identifyFocusAreas(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): string[] {
    const focusAreas: string[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Early stage focus areas
    if (progress < 0.3) {
      focusAreas.push('Ensure comprehensive understanding of the problem');
      focusAreas.push('Identify key constraints and requirements');
      
      if (promptMetadata.complexity === 'complex') {
        focusAreas.push('Break down the problem into manageable components');
      }
    }
    // Middle stage focus areas
    else if (progress >= 0.3 && progress < 0.7) {
      focusAreas.push('Develop detailed solution approaches');
      focusAreas.push('Address the most challenging aspects first');
      
      if (promptMetadata.taskType === 'creative') {
        focusAreas.push('Explore multiple alternative approaches');
      } else if (promptMetadata.taskType === 'analytical') {
        focusAreas.push('Ensure logical consistency in your analysis');
      }
    }
    // Late stage focus areas
    else {
      focusAreas.push('Synthesize insights from previous thoughts');
      focusAreas.push('Verify solution against original requirements');
      
      if (promptMetadata.priority === 'high') {
        focusAreas.push('Ensure solution addresses highest priority aspects');
      }
    }
    
    // Add focus areas based on prompt goals
    if (promptMetadata.goals.length > 0) {
      // Add the first goal as a focus area
      focusAreas.push(`Address the key goal: ${promptMetadata.goals[0]}`);
    }
    
    return focusAreas;
  }

  /**
   * Identifies potential pitfalls based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Array of potential pitfalls
   */
  private identifyPotentialPitfalls(promptMetadata: PromptMetadata): string[] {
    const pitfalls: string[] = [];
    
    // Task-type specific pitfalls
    switch (promptMetadata.taskType) {
      case 'creative':
        pitfalls.push('Focusing too narrowly on conventional solutions');
        pitfalls.push('Failing to validate creative ideas against practical constraints');
        break;
        
      case 'analytical':
        pitfalls.push('Making unwarranted assumptions without evidence');
        pitfalls.push('Overlooking important variables or factors');
        break;
        
      case 'informational':
        pitfalls.push('Providing excessive detail without clear organization');
        pitfalls.push('Failing to prioritize the most relevant information');
        break;
        
      case 'technical':
        pitfalls.push('Overlooking edge cases or error conditions');
        pitfalls.push('Focusing on implementation details before understanding requirements');
        break;
        
      case 'mixed':
        pitfalls.push('Inconsistent approach across different aspects of the problem');
        pitfalls.push('Failing to integrate creative and analytical components');
        break;
    }
    
    // Complexity-specific pitfalls
    switch (promptMetadata.complexity) {
      case 'complex':
        pitfalls.push('Getting lost in details without maintaining big-picture view');
        pitfalls.push('Failing to recognize interdependencies between components');
        break;
    }
    
    // Constraint-related pitfalls
    if (promptMetadata.constraints.length > 0) {
      pitfalls.push('Developing solutions that violate key constraints');
    }
    
    // Domain-specific pitfalls
    if (promptMetadata.domains.includes('technical') || 
        promptMetadata.domains.includes('programming') ||
        promptMetadata.domains.includes('engineering')) {
      pitfalls.push('Proposing technically infeasible solutions');
    }
    
    return pitfalls;
  }
} 