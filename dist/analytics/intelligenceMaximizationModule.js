// IntelligenceMaximizationModule.ts
// This component is responsible for maximizing AI capabilities based on prompt specifics
// It recommends strategies, estimates complexity, and identifies appropriate reasoning types
export class IntelligenceMaximizationModule {
    /**
     * Generates comprehensive recommendations for maximizing AI intelligence based on prompt
     * @param promptMetadata The analyzed prompt metadata
     * @param currentThoughtNumber The current thought number in the sequence
     * @param totalThoughts The total estimated thoughts
     * @param phase The current thinking phase
     * @returns Intelligence maximization recommendations
     */
    generateRecommendations(promptMetadata, currentThoughtNumber, totalThoughts, phase) {
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
        // New methods
        const cognitiveBiases = this.detectPotentialCognitiveBiases(promptMetadata, phase);
        const metacognitiveStrategies = this.recommendMetacognitiveStrategies(promptMetadata, currentThoughtNumber, totalThoughts);
        const adaptiveSuggestions = this.generateAdaptiveSuggestions(promptMetadata, currentThoughtNumber, totalThoughts, phase);
        const insightGenerationPrompts = this.generateInsightPrompts(promptMetadata, phase);
        return {
            strategies,
            reasoningTypes,
            complexityEstimation,
            toolRecommendations,
            focusAreas,
            potentialPitfalls,
            cognitiveBiases,
            metacognitiveStrategies,
            adaptiveSuggestions,
            insightGenerationPrompts
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
    recommendStrategies(promptMetadata, currentThoughtNumber, totalThoughts, phase) {
        const recommendations = [];
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
        }
        else if (progress > 0.7) {
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
    recommendReasoningTypes(promptMetadata, phase) {
        const recommendations = [];
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
                // New reasoning type
                recommendations.push({
                    reasoningType: 'divergent',
                    description: 'Explore multiple different directions to generate a variety of possibilities',
                    applicability: 8,
                    examples: ['Considering wildly different approaches', 'Suspending judgment to explore unusual ideas']
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
                // New reasoning type
                recommendations.push({
                    reasoningType: 'systems',
                    description: 'Analyze interactions between components in a complex system',
                    applicability: 8,
                    examples: ['Mapping feedback loops', 'Identifying emergent properties']
                });
                break;
            case 'informational':
                recommendations.push({
                    reasoningType: 'inductive',
                    description: 'Draw general conclusions from specific observations',
                    applicability: 9,
                    examples: ['Identifying patterns from examples', 'Generalizing from specific cases']
                });
                // New reasoning type
                recommendations.push({
                    reasoningType: 'hierarchical',
                    description: 'Organize information in levels from general to specific',
                    applicability: 8,
                    examples: ['Creating taxonomies', 'Developing conceptual hierarchies']
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
                // New reasoning type
                recommendations.push({
                    reasoningType: 'modular',
                    description: 'Break down complex systems into independent functional components',
                    applicability: 9,
                    examples: ['Designing with separation of concerns', 'Creating abstraction layers']
                });
                break;
            case 'mixed':
                recommendations.push({
                    reasoningType: 'abductive',
                    description: 'Form the most likely explanation from incomplete information',
                    applicability: 8,
                    examples: ['Developing working hypotheses', 'Making educated guesses with limited data']
                });
                // New reasoning type
                recommendations.push({
                    reasoningType: 'integrative',
                    description: 'Combine insights from multiple reasoning approaches',
                    applicability: 9,
                    examples: ['Synthesizing analytical and creative thinking', 'Balancing quantitative and qualitative factors']
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
                    // New reasoning type
                    recommendations.push({
                        reasoningType: 'strategic',
                        description: 'Focus on long-term goals and high-level approaches',
                        applicability: 8,
                        examples: ['Identifying key leverage points', 'Focusing on highest-impact areas']
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
                    // New reasoning type
                    recommendations.push({
                        reasoningType: 'comparative',
                        description: 'Analyze similarities and differences between options or scenarios',
                        applicability: 8,
                        examples: ['Side-by-side comparison', 'Evaluating trade-offs']
                    });
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
                    // New reasoning type
                    recommendations.push({
                        reasoningType: 'procedural',
                        description: 'Focus on step-by-step processes and implementation details',
                        applicability: 9,
                        examples: ['Creating action sequences', 'Defining workflows']
                    });
                    break;
                case 'Verification':
                    recommendations.push({
                        reasoningType: 'counterfactual',
                        description: 'Test solution against alternative scenarios',
                        applicability: 8,
                        examples: ['Edge case testing', 'What-if analysis']
                    });
                    // New reasoning type
                    recommendations.push({
                        reasoningType: 'evaluative',
                        description: 'Assess solutions against explicit criteria and requirements',
                        applicability: 9,
                        examples: ['Systematic testing', 'Requirements validation']
                    });
                    break;
            }
        }
        // Return top reasoning types (limit to 3 to avoid overwhelming)
        return recommendations.slice(0, 3);
    }
    /**
     * Estimates detailed complexity of the task based on prompt metadata
     * @param promptMetadata The analyzed prompt metadata
     * @returns Detailed complexity estimation
     */
    estimateDetailedComplexity(promptMetadata) {
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
        }
        else if (overallComplexity === 'complex') {
            recommendedThoughtCount = 12;
        }
        // Adjust based on dimensional complexity
        const avgDimensionalComplexity = (conceptualComplexity +
            proceduralComplexity +
            contextualComplexity +
            domainComplexity) / 4;
        // Fine-tune thought count based on dimensional complexity
        recommendedThoughtCount = Math.round(recommendedThoughtCount * (1 + (avgDimensionalComplexity - 5) / 10));
        // Calculate recommended phase distribution
        const recommendedPhaseDistribution = this.calculatePhaseDistribution(overallComplexity, {
            conceptual: conceptualComplexity,
            procedural: proceduralComplexity,
            contextual: contextualComplexity,
            domain: domainComplexity
        });
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
    calculateConceptualComplexity(promptMetadata) {
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
    calculateProceduralComplexity(promptMetadata) {
        let complexity = 5; // Start with medium complexity
        // Adjust based on number of constraints
        complexity += Math.min(promptMetadata.constraints.length, 3);
        // Adjust based on task type
        if (promptMetadata.taskType === 'technical') {
            complexity += 2;
        }
        else if (promptMetadata.taskType === 'analytical') {
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
    calculateContextualComplexity(promptMetadata) {
        let complexity = 5; // Start with medium complexity
        // Adjust based on number of entities
        complexity += Math.min(promptMetadata.entities.length / 2, 3);
        // Adjust based on task type
        if (promptMetadata.taskType === 'mixed') {
            complexity += 2;
        }
        else if (promptMetadata.taskType === 'creative') {
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
    calculateDomainComplexity(promptMetadata) {
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
            }
            else if (mediumDomains.some(d => domain.toLowerCase().includes(d))) {
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
    calculatePhaseDistribution(overallComplexity, dimensionalComplexity) {
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
    recommendTools(promptMetadata, phase) {
        const recommendations = [];
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
    identifyFocusAreas(promptMetadata, currentThoughtNumber, totalThoughts) {
        const focusAreas = [];
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
            }
            else if (promptMetadata.taskType === 'analytical') {
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
    identifyPotentialPitfalls(promptMetadata) {
        const pitfalls = [];
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
    /**
     * Detects potential cognitive biases based on prompt type and phase
     */
    detectPotentialCognitiveBiases(promptMetadata, phase) {
        const biases = [];
        // Add task-specific biases
        switch (promptMetadata.taskType) {
            case 'creative':
                biases.push({
                    biasType: 'Novelty bias',
                    description: 'Favoring ideas that seem new over those that are effective',
                    likelihood: 0.7,
                    mitigationStrategy: 'Balance novelty with practicality by evaluating ideas against concrete criteria'
                });
                break;
            case 'analytical':
                biases.push({
                    biasType: 'Confirmation bias',
                    description: 'Seeking information that confirms existing hypotheses',
                    likelihood: 0.8,
                    mitigationStrategy: 'Actively search for disconfirming evidence and alternative explanations'
                });
                break;
            case 'technical':
                biases.push({
                    biasType: 'Sunk cost fallacy',
                    description: 'Continuing with an approach because of prior investment',
                    likelihood: 0.6,
                    mitigationStrategy: 'Evaluate approaches based on future utility, not past investment'
                });
                break;
        }
        // Add phase-specific biases
        if (phase) {
            switch (phase) {
                case 'Planning':
                    biases.push({
                        biasType: 'Planning fallacy',
                        description: 'Underestimating time and resources needed',
                        likelihood: 0.75,
                        mitigationStrategy: 'Add buffer time and consider past similar tasks as reference points'
                    });
                    break;
                case 'Analysis':
                    biases.push({
                        biasType: 'Anchoring bias',
                        description: 'Over-relying on first piece of information encountered',
                        likelihood: 0.65,
                        mitigationStrategy: 'Consider multiple starting points and diverse information sources'
                    });
                    break;
                case 'Execution':
                    biases.push({
                        biasType: 'Optimism bias',
                        description: 'Overestimating likelihood of positive outcomes',
                        likelihood: 0.7,
                        mitigationStrategy: 'Conduct pre-mortems to identify potential failure points'
                    });
                    break;
                case 'Verification':
                    biases.push({
                        biasType: 'Availability bias',
                        description: 'Judging quality based on easily recalled examples',
                        likelihood: 0.6,
                        mitigationStrategy: 'Use structured evaluation criteria rather than relying on memory'
                    });
                    break;
            }
        }
        // Add complexity-specific biases
        if (promptMetadata.complexity === 'complex') {
            biases.push({
                biasType: 'Simplification bias',
                description: 'Reducing complex problems to simpler models that miss key factors',
                likelihood: 0.8,
                mitigationStrategy: 'Explicitly map out interconnections and feedback loops'
            });
        }
        return biases;
    }
    /**
     * Recommends metacognitive strategies to enhance thinking quality
     */
    recommendMetacognitiveStrategies(promptMetadata, currentThoughtNumber, totalThoughts) {
        const strategies = [];
        const progress = currentThoughtNumber / totalThoughts;
        // General metacognitive strategies
        strategies.push({
            strategyName: 'Explicit assumption testing',
            description: 'Identify and validate key assumptions underlying your thinking',
            applicability: 8,
            expectedBenefit: 'Reduces risk of building on faulty premises'
        });
        strategies.push({
            strategyName: 'Counterfactual thinking',
            description: 'Consider what would happen if key facts or assumptions were different',
            applicability: 7,
            expectedBenefit: 'Reveals dependencies and alternative possibilities'
        });
        // Progress-specific strategies
        if (progress < 0.3) {
            // Early stage
            strategies.push({
                strategyName: 'Problem reframing',
                description: 'Describe the problem in multiple different ways to reveal new aspects',
                applicability: 9,
                expectedBenefit: 'Prevents premature narrowing of problem scope'
            });
        }
        else if (progress < 0.7) {
            // Middle stage
            strategies.push({
                strategyName: 'Intermediate synthesis',
                description: 'Periodically integrate insights from multiple thoughts into coherent models',
                applicability: 9,
                expectedBenefit: 'Prevents fragmentation of thinking across multiple thoughts'
            });
        }
        else {
            // Late stage
            strategies.push({
                strategyName: 'Critical review',
                description: 'Systematically evaluate the strength of your solution against requirements',
                applicability: 9,
                expectedBenefit: 'Identifies gaps before finalizing solution'
            });
        }
        // Task-specific strategies
        switch (promptMetadata.taskType) {
            case 'creative':
                strategies.push({
                    strategyName: 'Constraint relaxation',
                    description: 'Temporarily ignore constraints to explore novel possibilities',
                    applicability: 8,
                    expectedBenefit: 'Generates innovative options that can be refined to meet constraints'
                });
                break;
            case 'analytical':
                strategies.push({
                    strategyName: 'Multiple models analysis',
                    description: 'Apply different analytical frameworks to the same problem',
                    applicability: 8,
                    expectedBenefit: 'Reveals insights that any single model might miss'
                });
                break;
            case 'technical':
                strategies.push({
                    strategyName: 'Edge case identification',
                    description: 'Systematically identify boundary conditions and exceptions',
                    applicability: 9,
                    expectedBenefit: 'Prevents failures in non-standard scenarios'
                });
                break;
        }
        return strategies.slice(0, 3); // Return top 3 strategies
    }
    /**
     * Generates adaptive suggestions based on current context
     */
    generateAdaptiveSuggestions(promptMetadata, currentThoughtNumber, totalThoughts, phase) {
        const suggestions = [];
        const progress = currentThoughtNumber / totalThoughts;
        // Progress-based suggestions
        if (progress < 0.2) {
            suggestions.push('Consider spending more time understanding the problem before diving into solutions');
        }
        else if (progress > 0.8) {
            suggestions.push('Begin synthesizing key insights from your thinking process');
        }
        // Phase transition suggestions
        if (phase === 'Planning' && progress > 0.3) {
            suggestions.push('Consider transitioning from planning to analysis phase');
        }
        else if (phase === 'Analysis' && progress > 0.5) {
            suggestions.push('Consider moving from analysis to execution phase');
        }
        else if (phase === 'Execution' && progress > 0.8) {
            suggestions.push('Begin verification of your solution');
        }
        // Complexity-based suggestions
        if (promptMetadata.complexity === 'complex') {
            suggestions.push('Break down complex aspects into manageable components');
            suggestions.push('Regularly zoom out to maintain perspective on the overall problem');
        }
        // Task-specific adaptive suggestions
        switch (promptMetadata.taskType) {
            case 'creative':
                if (currentThoughtNumber > 3) {
                    suggestions.push('Consider combining elements from your previous thoughts in novel ways');
                }
                break;
            case 'analytical':
                if (currentThoughtNumber > 3) {
                    suggestions.push('Look for patterns or contradictions across your previous analyses');
                }
                break;
            case 'technical':
                suggestions.push('Consider both the implementation details and the user experience');
                break;
            case 'informational':
                suggestions.push('Ensure information is organized in a logical hierarchy');
                break;
        }
        return suggestions;
    }
    /**
     * Generates prompts to stimulate insight generation
     */
    generateInsightPrompts(promptMetadata, phase) {
        const prompts = [];
        // General insight prompts
        prompts.push('What unexpected connections exist between different aspects of this problem?');
        prompts.push('What would an expert in this domain notice that others might miss?');
        // Phase-specific prompts
        if (phase) {
            switch (phase) {
                case 'Planning':
                    prompts.push('What hidden assumptions might be limiting your planning approach?');
                    prompts.push('What would a completely different planning approach look like?');
                    break;
                case 'Analysis':
                    prompts.push('What patterns or anomalies in the data haven', t, been, explained, yet ? ');
                        :
                    , prompts.push('What would change if a key assumption in your analysis was incorrect?'));
                    break;
                case 'Execution':
                    prompts.push('What elegant simplifications could make this solution more robust?');
                    prompts.push('What aspects of the implementation might create unexpected effects?');
                    break;
                case 'Verification':
                    prompts.push('What perspectives or criteria haven', t, been, considered in verification ? ');
                        :
                    , prompts.push('What would be the most surprising way this solution could fail?'));
                    break;
            }
        }
        // Domain-specific prompts
        if (promptMetadata.domains.length > 0) {
            prompts.push(`How might principles from ${promptMetadata.domains[0]} be applied in unexpected ways?`);
        }
        // Task-specific prompts
        switch (promptMetadata.taskType) {
            case 'creative':
                prompts.push('What if you combined seemingly unrelated elements of this problem?');
                prompts.push("How would you approach this if traditional constraints didn't apply?");
                break;
            case 'analytical':
                prompts.push("What alternative explanations haven't been considered yet?");
                prompts.push("What meta-patterns exist across different analyses you've performed?");
                break;
            case 'technical':
                prompts.push('What elegant architectural patterns could simplify this solution?');
                prompts.push('How might this solution evolve or need to adapt in the future?');
                break;
            case 'informational':
                prompts.push("What deeper principles connect the information you've gathered?");
                prompts.push('What context or background would make this information more meaningful?');
                break;
        }
        return prompts.slice(0, 3); // Return top 3 prompts
    }
}
