// PromptAnalyzer.ts
// This component is responsible for analyzing prompts to extract key information
// and track alignment between thoughts and the original prompt.
export class PromptAnalyzer {
    promptContext;
    constructor(promptContext) {
        this.promptContext = promptContext;
    }
    /**
     * Analyzes a prompt to extract key information
     * @param prompt The user's original prompt
     * @returns PromptMetadata object with extracted information
     */
    analyzePrompt(prompt) {
        // Extract goals from the prompt
        const goals = this.extractGoals(prompt);
        // Extract constraints from the prompt
        const constraints = this.extractConstraints(prompt);
        // Extract knowledge domains
        const domains = this.extractDomains(prompt);
        // Extract expected output format
        const expectedOutputFormat = this.extractOutputFormat(prompt);
        // Determine priority
        const priority = this.determinePriority(prompt);
        // Estimate complexity
        const complexity = this.estimateComplexity(prompt);
        // Extract keywords
        const keywords = this.extractKeywords(prompt);
        // Extract entities
        const entities = this.extractEntities(prompt);
        // Determine task type
        const taskType = this.determineTaskType(prompt);
        return {
            originalPrompt: prompt,
            goals,
            constraints,
            domains,
            expectedOutputFormat,
            priority,
            complexity,
            keywords,
            entities,
            taskType
        };
    }
    /**
     * Analyzes a thought to determine how well it aligns with the prompt
     * @param thought The thought text
     * @param promptMetadata The prompt metadata
     * @returns PromptAlignmentData with alignment scores and feedback
     */
    analyzeThoughtAlignment(thought, promptMetadata) {
        // Calculate overall alignment score
        const promptAlignment = this.calculateAlignmentScore(thought, promptMetadata);
        // Calculate relevance to different prompt aspects
        const promptRelevance = this.calculateRelevanceScores(thought, promptMetadata);
        // Check for topic drift
        const driftCheck = this.checkForTopicDrift(thought, promptMetadata);
        // Generate alignment data
        const alignmentData = {
            promptAlignment,
            promptRelevance
        };
        // Add drift warning if detected
        if (driftCheck.hasDrift) {
            alignmentData.driftWarning = driftCheck.warning;
            alignmentData.suggestedCorrections = driftCheck.corrections;
        }
        return alignmentData;
    }
    /**
     * Extracts goals from the prompt
     */
    extractGoals(prompt) {
        const goals = [];
        // Look for goal indicators
        const goalIndicators = [
            "goal is", "objective is", "aim is", "purpose is", "trying to",
            "want to", "need to", "would like to", "goal:", "objective:"
        ];
        // Simple extraction based on indicators
        // In a real implementation, this would use more sophisticated NLP
        const sentences = prompt.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        for (const sentence of sentences) {
            for (const indicator of goalIndicators) {
                if (sentence.toLowerCase().includes(indicator)) {
                    goals.push(sentence);
                    break;
                }
            }
        }
        // If no explicit goals found, use the first sentence as an implicit goal
        if (goals.length === 0 && sentences.length > 0) {
            goals.push(sentences[0]);
        }
        return goals;
    }
    /**
     * Extracts constraints from the prompt
     */
    extractConstraints(prompt) {
        const constraints = [];
        // Look for constraint indicators
        const constraintIndicators = [
            "must", "should", "need to", "have to", "required",
            "necessary", "important", "essential", "critical",
            "cannot", "can't", "don't", "shouldn't", "mustn't"
        ];
        // Simple extraction based on indicators
        const sentences = prompt.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        for (const sentence of sentences) {
            for (const indicator of constraintIndicators) {
                if (sentence.toLowerCase().includes(indicator)) {
                    constraints.push(sentence);
                    break;
                }
            }
        }
        return constraints;
    }
    /**
     * Extracts knowledge domains from the prompt
     */
    extractDomains(prompt) {
        // This is a simplified implementation
        // In a real system, this would use a more sophisticated domain classifier
        const domainKeywords = {
            "programming": ["code", "programming", "software", "development", "algorithm", "function"],
            "math": ["math", "calculation", "formula", "equation", "numerical"],
            "science": ["science", "scientific", "experiment", "hypothesis", "theory"],
            "business": ["business", "market", "strategy", "company", "product", "service"],
            "writing": ["write", "essay", "article", "blog", "content", "story"],
            "design": ["design", "layout", "visual", "UI", "UX", "interface"],
            "data": ["data", "analysis", "statistics", "dataset", "visualization"]
        };
        const domains = [];
        const promptLower = prompt.toLowerCase();
        for (const [domain, keywords] of Object.entries(domainKeywords)) {
            for (const keyword of keywords) {
                if (promptLower.includes(keyword)) {
                    domains.push(domain);
                    break;
                }
            }
        }
        return domains;
    }
    /**
     * Extracts expected output format from the prompt
     */
    extractOutputFormat(prompt) {
        // Look for format indicators
        const formatIndicators = [
            "format:", "in the form of", "as a", "output as", "result as",
            "in markdown", "in json", "in html", "in csv", "in table"
        ];
        const promptLower = prompt.toLowerCase();
        for (const indicator of formatIndicators) {
            const index = promptLower.indexOf(indicator);
            if (index !== -1) {
                // Extract the part after the indicator
                const afterIndicator = prompt.substring(index + indicator.length).trim();
                const formatDescription = afterIndicator.split(/[.!?]/)[0].trim();
                return formatDescription;
            }
        }
        return undefined;
    }
    /**
     * Determines priority level from the prompt
     */
    determinePriority(prompt) {
        const promptLower = prompt.toLowerCase();
        // Check for high priority indicators
        const highPriorityIndicators = [
            "urgent", "immediately", "asap", "critical", "high priority",
            "as soon as possible", "emergency", "deadline"
        ];
        for (const indicator of highPriorityIndicators) {
            if (promptLower.includes(indicator)) {
                return 'high';
            }
        }
        // Check for medium priority indicators
        const mediumPriorityIndicators = [
            "important", "soon", "timely", "needed", "significant"
        ];
        for (const indicator of mediumPriorityIndicators) {
            if (promptLower.includes(indicator)) {
                return 'medium';
            }
        }
        // Default to low priority
        return 'low';
    }
    /**
     * Estimates complexity of the prompt
     */
    estimateComplexity(prompt) {
        // This is a simplified implementation
        // In a real system, this would use more sophisticated metrics
        // Count words as a basic complexity measure
        const wordCount = prompt.split(/\s+/).length;
        // Check for complexity indicators
        const promptLower = prompt.toLowerCase();
        const complexityIndicators = [
            "complex", "complicated", "difficult", "challenging", "advanced",
            "sophisticated", "intricate", "elaborate", "comprehensive"
        ];
        for (const indicator of complexityIndicators) {
            if (promptLower.includes(indicator)) {
                return 'complex';
            }
        }
        // Use word count as a fallback
        if (wordCount > 100) {
            return 'complex';
        }
        else if (wordCount > 30) {
            return 'medium';
        }
        else {
            return 'simple';
        }
    }
    /**
     * Extracts keywords from the prompt
     */
    extractKeywords(prompt) {
        // This is a simplified implementation
        // In a real system, this would use more sophisticated NLP techniques
        // Remove common stop words
        const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "about", "as"];
        // Split into words, convert to lowercase, and filter
        const words = prompt.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3) // Filter out short words
            .filter(word => !stopWords.includes(word)); // Filter out stop words
        // Count word frequency
        const wordCounts = {};
        for (const word of words) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
        // Sort by frequency and take top 10
        return Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }
    /**
     * Extracts entities from the prompt
     */
    extractEntities(prompt) {
        // This is a simplified implementation
        // In a real system, this would use named entity recognition
        // Look for capitalized words as potential entities
        const words = prompt.split(/\s+/);
        const entities = [];
        for (let i = 0; i < words.length; i++) {
            const word = words[i].replace(/[^\w]/g, '');
            // Check if word starts with capital letter and isn't at the beginning of a sentence
            if (word.length > 0 &&
                word[0] === word[0].toUpperCase() &&
                word[0] !== word[0].toLowerCase() &&
                i > 0) {
                entities.push(word);
            }
        }
        return [...new Set(entities)]; // Remove duplicates
    }
    /**
     * Determines the task type from the prompt
     */
    determineTaskType(prompt) {
        const promptLower = prompt.toLowerCase();
        // Check for creative indicators
        const creativeIndicators = [
            "create", "design", "generate", "write", "compose", "imagine", "story"
        ];
        // Check for analytical indicators
        const analyticalIndicators = [
            "analyze", "evaluate", "assess", "compare", "contrast", "examine"
        ];
        // Check for informational indicators
        const informationalIndicators = [
            "explain", "describe", "what is", "how to", "information about", "tell me about"
        ];
        // Check for technical indicators
        const technicalIndicators = [
            "code", "program", "implement", "function", "algorithm", "debug", "fix"
        ];
        // Count matches for each category
        let creativeCount = 0;
        let analyticalCount = 0;
        let informationalCount = 0;
        let technicalCount = 0;
        for (const indicator of creativeIndicators) {
            if (promptLower.includes(indicator))
                creativeCount++;
        }
        for (const indicator of analyticalIndicators) {
            if (promptLower.includes(indicator))
                analyticalCount++;
        }
        for (const indicator of informationalIndicators) {
            if (promptLower.includes(indicator))
                informationalCount++;
        }
        for (const indicator of technicalIndicators) {
            if (promptLower.includes(indicator))
                technicalCount++;
        }
        // Determine the dominant type
        const counts = [
            { type: 'creative', count: creativeCount },
            { type: 'analytical', count: analyticalCount },
            { type: 'informational', count: informationalCount },
            { type: 'technical', count: technicalCount }
        ];
        counts.sort((a, b) => b.count - a.count);
        // If there's a clear winner, return that type
        if (counts[0].count > 0 && counts[0].count > counts[1].count) {
            return counts[0].type;
        }
        // If there's a tie or no clear pattern, return mixed
        return 'mixed';
    }
    /**
     * Calculates alignment score between a thought and the prompt
     */
    calculateAlignmentScore(thought, promptMetadata) {
        // This is a simplified implementation
        // In a real system, this would use more sophisticated semantic similarity
        let score = 5; // Start with a neutral score
        // Check keyword overlap
        const thoughtLower = thought.toLowerCase();
        let keywordMatches = 0;
        for (const keyword of promptMetadata.keywords) {
            if (thoughtLower.includes(keyword)) {
                keywordMatches++;
            }
        }
        // Adjust score based on keyword matches
        const keywordScore = Math.min(10, keywordMatches * 2);
        score = (score + keywordScore) / 2;
        // Check goal alignment
        let goalAlignmentScore = 0;
        for (const goal of promptMetadata.goals) {
            const goalKeywords = goal.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(word => word.length > 3);
            let goalKeywordMatches = 0;
            for (const keyword of goalKeywords) {
                if (thoughtLower.includes(keyword)) {
                    goalKeywordMatches++;
                }
            }
            const goalMatchPercentage = goalKeywords.length > 0 ?
                goalKeywordMatches / goalKeywords.length : 0;
            goalAlignmentScore = Math.max(goalAlignmentScore, goalMatchPercentage * 10);
        }
        // Combine scores
        score = (score + goalAlignmentScore) / 2;
        return Math.round(score);
    }
    /**
     * Calculates relevance scores for different prompt aspects
     */
    calculateRelevanceScores(thought, promptMetadata) {
        const relevanceScores = {};
        const thoughtLower = thought.toLowerCase();
        // Calculate goal relevance
        relevanceScores.goals = this.calculateAspectRelevance(thoughtLower, promptMetadata.goals);
        // Calculate constraint relevance
        relevanceScores.constraints = this.calculateAspectRelevance(thoughtLower, promptMetadata.constraints);
        // Calculate domain relevance
        relevanceScores.domains = this.calculateAspectRelevance(thoughtLower, promptMetadata.domains);
        return relevanceScores;
    }
    /**
     * Calculates relevance score for a specific aspect
     */
    calculateAspectRelevance(thought, aspects) {
        if (aspects.length === 0)
            return 5; // Neutral score if no aspects
        let totalRelevance = 0;
        for (const aspect of aspects) {
            const aspectKeywords = aspect.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(word => word.length > 3);
            let keywordMatches = 0;
            for (const keyword of aspectKeywords) {
                if (thought.includes(keyword)) {
                    keywordMatches++;
                }
            }
            const aspectRelevance = aspectKeywords.length > 0 ?
                (keywordMatches / aspectKeywords.length) * 10 : 5;
            totalRelevance += aspectRelevance;
        }
        return Math.round(totalRelevance / aspects.length);
    }
    /**
     * Checks for topic drift between a thought and the prompt
     */
    checkForTopicDrift(thought, promptMetadata) {
        const alignmentScore = this.calculateAlignmentScore(thought, promptMetadata);
        // Check if alignment score is below threshold
        if (alignmentScore < 4) {
            const corrections = [];
            // Generate corrections based on missing goals
            for (const goal of promptMetadata.goals) {
                const goalKeywords = goal.toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .split(/\s+/)
                    .filter(word => word.length > 3);
                let goalKeywordMatches = 0;
                for (const keyword of goalKeywords) {
                    if (thought.toLowerCase().includes(keyword)) {
                        goalKeywordMatches++;
                    }
                }
                if (goalKeywordMatches < goalKeywords.length * 0.3) {
                    corrections.push(`Consider addressing the goal: "${goal}"`);
                }
            }
            return {
                hasDrift: true,
                warning: `This thought appears to drift from the original prompt (alignment score: ${alignmentScore}/10)`,
                corrections: corrections.length > 0 ? corrections : ['Try to align more closely with the original prompt goals']
            };
        }
        return { hasDrift: false };
    }
}
// PromptContext class to store and manage prompt information
export class PromptContext {
    metadata = null;
    originalPrompt = '';
    constructor() { }
    /**
     * Initializes the prompt context with a new prompt
     * @param prompt The user's original prompt
     * @param analyzer The prompt analyzer to use
     */
    initializeWithPrompt(prompt, analyzer) {
        this.originalPrompt = prompt;
        this.metadata = analyzer.analyzePrompt(prompt);
    }
    /**
     * Gets the current prompt metadata
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the original prompt text
     */
    getOriginalPrompt() {
        return this.originalPrompt;
    }
    /**
     * Checks if the prompt context has been initialized
     */
    isInitialized() {
        return this.metadata !== null;
    }
}
