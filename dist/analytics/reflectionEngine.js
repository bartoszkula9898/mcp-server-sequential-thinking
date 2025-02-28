import { SemanticAnalyzer } from './semanticAnalyzer.js';
export class ReflectionEngine {
    semanticAnalyzer;
    reflectionTemplates = [
        "How does this thought relate to the initial problem?",
        "What assumptions underlie this thinking?",
        "What evidence supports or challenges this thought?",
        "What alternative perspectives could be considered?",
        "What are the potential implications of this thought?",
        "How does this connect to previous thoughts?",
        "What gaps or uncertainties remain in this thinking?",
        "How might this thought be tested or validated?",
    ];
    constructor() {
        this.semanticAnalyzer = new SemanticAnalyzer();
    }
    /**
     * Generates reflection prompts based on thought content and context
     */
    generateReflectionPrompts(thoughts) {
        const prompts = [];
        const latestThought = thoughts[thoughts.length - 1];
        // Add context-aware prompts
        prompts.push(...this.generateContextAwarePrompts(latestThought, thoughts));
        // Add phase-specific prompts
        if (latestThought.phase) {
            prompts.push(...this.generatePhaseSpecificPrompts(latestThought.phase));
        }
        // Add classification-specific prompts
        if (latestThought.classification) {
            prompts.push(...this.generateClassificationPrompts(latestThought.classification));
        }
        // Add quality-based prompts
        if (latestThought.quality) {
            prompts.push(...this.generateQualityBasedPrompts(latestThought.quality));
        }
        return this.prioritizePrompts(prompts);
    }
    /**
     * Generates prompt-aware reflection prompts based on thought content, context, and prompt metadata
     * @param thoughts Array of thoughts
     * @param promptMetadata The prompt metadata for context
     * @returns Array of reflection prompts
     */
    generatePromptAwareReflectionPrompts(thoughts, promptMetadata) {
        const prompts = [];
        const latestThought = thoughts[thoughts.length - 1];
        // Add standard reflection prompts
        prompts.push(...this.generateReflectionPrompts(thoughts));
        // Add prompt-specific reflection prompts
        prompts.push(...this.generatePromptSpecificReflectionPrompts(latestThought, promptMetadata));
        // Add prompt alignment prompts if there's drift
        if (latestThought.promptAlignment !== undefined && latestThought.promptAlignment < 7) {
            prompts.push(...this.generatePromptAlignmentPrompts(latestThought, promptMetadata));
        }
        // Add task-type specific prompts
        prompts.push(...this.generateTaskTypePrompts(latestThought, promptMetadata.taskType));
        // Add complexity-based prompts
        prompts.push(...this.generateComplexityBasedPrompts(latestThought, promptMetadata.complexity));
        return this.prioritizePrompts(prompts);
    }
    /**
     * Identifies assumptions in a thought
     */
    identifyAssumptions(thought) {
        const assumptions = [];
        const text = thought.thought.toLowerCase();
        // Check for common assumption indicators
        const assumptionIndicators = [
            'assume', 'assuming', 'must be', 'should be', 'probably',
            'likely', 'always', 'never', 'everyone', 'nobody', 'clearly',
            'obviously', 'naturally', 'of course'
        ];
        // Extract sentences containing assumption indicators
        const sentences = text.split(/[.!?]+/);
        sentences.forEach(sentence => {
            if (assumptionIndicators.some(indicator => sentence.includes(indicator))) {
                assumptions.push(this.cleanAssumption(sentence));
            }
        });
        // Add implicit assumptions based on thought classification
        if (thought.classification) {
            assumptions.push(...this.getImplicitAssumptions(thought.classification));
        }
        return [...new Set(assumptions)];
    }
    /**
     * Suggests alternative perspectives for a thought
     */
    suggestAlternativePerspectives(thought) {
        const perspectives = [];
        // Generate opposing viewpoints
        if (thought.classification === 'conclusion') {
            perspectives.push('Consider the opposite conclusion');
            perspectives.push('What if this conclusion is premature?');
        }
        // Generate methodological alternatives
        if (thought.classification === 'hypothesis') {
            perspectives.push('Consider alternative hypotheses');
            perspectives.push('What other factors might explain this?');
        }
        // Generate scope-based alternatives
        perspectives.push('How might this look from a broader perspective?');
        perspectives.push('What if we focused on a more specific aspect?');
        // Generate stakeholder perspectives
        perspectives.push('How might different stakeholders view this?');
        perspectives.push('What concerns might others raise about this?');
        return perspectives;
    }
    /**
     * Suggests corrective actions when thoughts drift from the prompt
     * @param thought The thought to analyze
     * @param promptMetadata The prompt metadata for context
     * @returns Array of corrective action suggestions
     */
    suggestCorrectiveActions(thought, promptMetadata) {
        const actions = [];
        // Skip if no prompt alignment data
        if (thought.promptAlignment === undefined) {
            return actions;
        }
        // Check for significant drift
        if (thought.promptAlignment < 5) {
            actions.push(`Revise this thought to better align with the prompt's main goals: ${promptMetadata.goals.slice(0, 3).join(', ')}`);
            // Add specific corrections based on drift type
            if (thought.driftWarning) {
                if (thought.driftWarning.includes('main goals')) {
                    actions.push(`Refocus on addressing the primary goals of the prompt`);
                }
                else if (thought.driftWarning.includes('terminology')) {
                    actions.push(`Use terminology more consistent with the prompt's domain: ${promptMetadata.domains.join(', ')}`);
                }
                else if (thought.driftWarning.includes('diverging')) {
                    actions.push(`Reconnect this line of thinking to the original prompt requirements`);
                }
            }
            // Add suggested corrections if available
            if (thought.suggestedCorrections && thought.suggestedCorrections.length > 0) {
                actions.push(...thought.suggestedCorrections);
            }
        }
        else if (thought.promptAlignment < 7) {
            // Moderate drift
            actions.push(`Consider how this thought could better address the prompt's requirements`);
            // Check for missing aspects
            const missingGoals = promptMetadata.goals.filter(goal => !thought.thought.toLowerCase().includes(goal.toLowerCase()));
            if (missingGoals.length > 0) {
                actions.push(`Incorporate these missing goals: ${missingGoals.slice(0, 2).join(', ')}`);
            }
        }
        // Add phase-specific corrective actions
        if (thought.phase) {
            actions.push(...this.getPhaseSpecificCorrections(thought.phase, promptMetadata));
        }
        return actions;
    }
    /**
     * Dynamically adjusts reflection strategy based on prompt type
     * @param thoughts Array of thoughts
     * @param promptMetadata The prompt metadata for context
     * @returns Adjusted reflection strategy
     */
    adjustReflectionStrategy(thoughts, promptMetadata) {
        // Default strategy
        const strategy = {
            focusAreas: ['consistency', 'completeness', 'quality'],
            recommendedApproach: 'balanced',
            reflectionFrequency: 'medium',
            reflectionDepth: 'balanced'
        };
        // Adjust based on task type
        switch (promptMetadata.taskType) {
            case 'analytical':
                strategy.focusAreas = ['logical consistency', 'evidence quality', 'alternative explanations'];
                strategy.reflectionDepth = 'deep';
                break;
            case 'creative':
                strategy.focusAreas = ['originality', 'practicality', 'impact'];
                strategy.reflectionFrequency = 'low'; // Less frequent to allow creative flow
                break;
            case 'technical':
                strategy.focusAreas = ['correctness', 'efficiency', 'edge cases'];
                strategy.reflectionFrequency = 'high';
                break;
            case 'informational':
                strategy.focusAreas = ['accuracy', 'completeness', 'relevance'];
                strategy.reflectionDepth = 'balanced';
                break;
        }
        // Adjust based on complexity
        switch (promptMetadata.complexity) {
            case 'complex':
                strategy.reflectionFrequency = 'high';
                strategy.reflectionDepth = 'deep';
                strategy.recommendedApproach = 'systematic';
                break;
            case 'simple':
                strategy.reflectionFrequency = 'low';
                strategy.reflectionDepth = 'light';
                strategy.recommendedApproach = 'streamlined';
                break;
        }
        // Adjust based on priority
        if (promptMetadata.priority === 'high') {
            strategy.reflectionFrequency = 'high';
            strategy.focusAreas.unshift('alignment with goals');
        }
        // Adjust based on thought history
        const recentThoughts = thoughts.slice(-3);
        const avgAlignment = recentThoughts
            .filter(t => t.promptAlignment !== undefined)
            .reduce((sum, t) => sum + (t.promptAlignment || 0), 0) /
            recentThoughts.filter(t => t.promptAlignment !== undefined).length || 5;
        if (avgAlignment < 6) {
            // If recent thoughts have low alignment, increase reflection frequency
            strategy.reflectionFrequency = 'high';
            strategy.focusAreas.unshift('prompt alignment');
        }
        return strategy;
    }
    generateContextAwarePrompts(currentThought, allThoughts) {
        const prompts = [];
        // Check for connection to previous thoughts
        if (currentThought.dependencies && currentThought.dependencies.length > 0) {
            prompts.push('How do the dependencies influence this thought?');
        }
        else {
            prompts.push('How does this thought connect to previous thinking?');
        }
        // Check for potential contradictions
        const similarThoughts = allThoughts.filter(t => t.thoughtNumber !== currentThought.thoughtNumber &&
            this.semanticAnalyzer.analyzeSemanticSimilarity(t, currentThought) > 0.5);
        if (similarThoughts.length > 0) {
            prompts.push('How does this thought align with or differ from similar previous thoughts?');
        }
        return prompts;
    }
    generatePhaseSpecificPrompts(phase) {
        const phasePrompts = {
            'Planning': [
                'What potential obstacles have been considered?',
                'Are there any missing steps in the plan?',
                'How flexible is this plan to changes?'
            ],
            'Analysis': [
                'What other angles of analysis could be explored?',
                'Are there any hidden patterns or relationships?',
                'What methods of analysis might yield different insights?'
            ],
            'Execution': [
                'What risks or challenges might arise during execution?',
                'Are there alternative approaches to implementation?',
                'How can the execution be optimized?'
            ],
            'Verification': [
                'What criteria are being used for verification?',
                'How comprehensive is the verification process?',
                'What edge cases should be considered?'
            ]
        };
        return phasePrompts[phase] || [];
    }
    generateClassificationPrompts(classification) {
        const classificationPrompts = {
            'hypothesis': [
                'What evidence would support or refute this hypothesis?',
                'What alternative hypotheses should be considered?'
            ],
            'observation': [
                'What factors might influence this observation?',
                'How reliable is this observation?'
            ],
            'conclusion': [
                'What assumptions led to this conclusion?',
                'How strong is the evidence supporting this conclusion?'
            ],
            'question': [
                'What assumptions underlie this question?',
                'Are there related questions to consider?'
            ],
            'solution': [
                'What are the limitations of this solution?',
                'How might this solution be improved?'
            ]
        };
        return classificationPrompts[classification] || [];
    }
    generateQualityBasedPrompts(quality) {
        const prompts = [];
        if (!quality)
            return prompts;
        if (quality.coherence < 7) {
            prompts.push('How could this thought be better connected to the overall context?');
        }
        if (quality.depth < 7) {
            prompts.push('What deeper aspects of this thought could be explored?');
        }
        if (quality.relevance < 7) {
            prompts.push('How could this thought be made more relevant to the main goal?');
        }
        return prompts;
    }
    /**
     * Generates prompt-specific reflection prompts
     */
    generatePromptSpecificReflectionPrompts(thought, promptMetadata) {
        const prompts = [];
        // Goal-oriented prompts
        if (promptMetadata.goals.length > 0) {
            prompts.push(`How does this thought contribute to the goal of ${promptMetadata.goals[0]}?`);
            if (promptMetadata.goals.length > 1) {
                prompts.push(`Does this thought address multiple goals (${promptMetadata.goals.slice(0, 3).join(', ')}) or focus on one?`);
            }
        }
        // Constraint-oriented prompts
        if (promptMetadata.constraints.length > 0) {
            prompts.push(`Does this thought respect the constraint: ${promptMetadata.constraints[0]}?`);
            if (promptMetadata.constraints.length > 1) {
                prompts.push(`How does this thought balance multiple constraints?`);
            }
        }
        // Domain-oriented prompts
        if (promptMetadata.domains.length > 0) {
            prompts.push(`How well does this thought incorporate knowledge from ${promptMetadata.domains[0]}?`);
            if (promptMetadata.domains.length > 1) {
                prompts.push(`Could insights from other domains (${promptMetadata.domains.slice(1).join(', ')}) enhance this thought?`);
            }
        }
        // Output format prompts
        if (promptMetadata.expectedOutputFormat) {
            prompts.push(`Is this thought aligned with the expected output format: ${promptMetadata.expectedOutputFormat}?`);
        }
        return prompts;
    }
    /**
     * Generates prompts focused on prompt alignment
     */
    generatePromptAlignmentPrompts(thought, promptMetadata) {
        const prompts = [];
        // Basic alignment prompt
        prompts.push('How well does this thought align with the original prompt?');
        // Add specific alignment prompts based on alignment score
        if (thought.promptAlignment !== undefined) {
            if (thought.promptAlignment < 5) {
                // Significant drift
                prompts.push('What aspects of the original prompt are being overlooked in this thought?');
                prompts.push('How could this thought be reframed to better address the prompt requirements?');
            }
            else if (thought.promptAlignment < 7) {
                // Moderate drift
                prompts.push('Which aspects of the prompt could be more thoroughly addressed in this thought?');
                prompts.push('Is there a way to make this thought more directly relevant to the prompt?');
            }
        }
        // Add prompts based on relevance scores if available
        if (thought.promptRelevance) {
            const lowRelevanceAspects = Object.entries(thought.promptRelevance)
                .filter(([_, score]) => score < 0.5)
                .map(([aspect]) => aspect);
            if (lowRelevanceAspects.length > 0) {
                prompts.push(`How could this thought better address: ${lowRelevanceAspects.join(', ')}?`);
            }
        }
        return prompts;
    }
    /**
     * Generates task-type specific prompts
     */
    generateTaskTypePrompts(thought, taskType) {
        const taskTypePrompts = {
            'analytical': [
                'Is the analysis sufficiently rigorous?',
                'Have alternative explanations been considered?',
                'What additional data would strengthen this analysis?'
            ],
            'creative': [
                'How original is this idea?',
                'What makes this approach innovative?',
                'How could this idea be made more unique or impactful?'
            ],
            'technical': [
                'Is this solution technically sound?',
                'What edge cases need to be considered?',
                'How could this be implemented more efficiently?'
            ],
            'informational': [
                'Is this information accurate and complete?',
                'Is the information presented clearly?',
                'What additional context would be helpful?'
            ],
            'mixed': [
                'Does this balance analytical rigor with creative thinking?',
                'Are both practical and theoretical aspects addressed?',
                'How could this be more comprehensive?'
            ]
        };
        return taskTypePrompts[taskType] || [];
    }
    /**
     * Generates complexity-based prompts
     */
    generateComplexityBasedPrompts(thought, complexity) {
        const complexityPrompts = {
            'simple': [
                'Is this solution straightforward enough?',
                'Could this be explained more simply?',
                'Are there unnecessary complications in this approach?'
            ],
            'medium': [
                'Does this approach balance simplicity with thoroughness?',
                'Are there aspects that need more detailed exploration?',
                'Is the level of detail appropriate for this problem?'
            ],
            'complex': [
                'Has this complex problem been broken down effectively?',
                'Are there interconnections or dependencies being overlooked?',
                'Does this approach address the full complexity of the problem?',
                'Would a more systematic approach be beneficial?'
            ]
        };
        return complexityPrompts[complexity] || [];
    }
    /**
     * Provides phase-specific corrective actions
     */
    getPhaseSpecificCorrections(phase, promptMetadata) {
        const corrections = {
            'Planning': [
                `Ensure your plan directly addresses the main goals: ${promptMetadata.goals.slice(0, 2).join(', ')}`,
                `Consider how your plan accounts for constraints: ${promptMetadata.constraints.slice(0, 2).join(', ')}`
            ],
            'Analysis': [
                `Focus your analysis on aspects most relevant to the prompt goals`,
                `Consider analyzing from the perspective of ${promptMetadata.domains.join(' and ')}`
            ],
            'Execution': [
                `Ensure your implementation approach aligns with the prompt requirements`,
                `Check that your execution addresses the priority level (${promptMetadata.priority}) appropriately`
            ],
            'Verification': [
                `Verify against all prompt goals and constraints`,
                `Ensure the verification is appropriate for the task type (${promptMetadata.taskType})`
            ]
        };
        return corrections[phase] || [];
    }
    cleanAssumption(text) {
        return text
            .trim()
            .replace(/^(assuming|we assume|it is assumed|clearly|obviously|naturally|of course|must be|should be)/i, '')
            .trim();
    }
    getImplicitAssumptions(classification) {
        const implicitAssumptions = {
            'hypothesis': ['The variables being considered are the most relevant ones'],
            'observation': ['The observation is representative of the general case'],
            'conclusion': ['The available evidence is sufficient for this conclusion'],
            'question': ['This question addresses a significant aspect of the problem'],
            'solution': ['The solution is feasible to implement']
        };
        return implicitAssumptions[classification] || [];
    }
    prioritizePrompts(prompts) {
        // Remove duplicates
        const uniquePrompts = [...new Set(prompts)];
        // Sort by specificity (longer prompts tend to be more specific)
        return uniquePrompts
            .sort((a, b) => b.length - a.length)
            .slice(0, 5); // Return top 5 most specific prompts
    }
}
