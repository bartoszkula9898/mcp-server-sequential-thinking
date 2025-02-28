// Mock implementation of natural and stopword for TypeScript
// In a real implementation, you would install these packages
const natural = {
    WordTokenizer: class {
        tokenize(text) {
            return text.split(/\s+/);
        }
    },
    TfIdf: class {
        documents = [];
        addDocument(doc) {
            const tokens = typeof doc === 'string' ? doc.split(/\s+/) : doc;
            this.documents.push(tokens);
        }
        tfidf(term, documentIndex) {
            // Simple implementation for TypeScript compatibility
            if (!this.documents[documentIndex])
                return 0;
            const doc = this.documents[documentIndex];
            const tf = doc.filter(t => t === term).length / doc.length;
            const idf = Math.log(this.documents.length /
                (1 + this.documents.filter(d => d.includes(term)).length));
            return tf * idf;
        }
        listTerms(documentIndex) {
            if (!this.documents[documentIndex])
                return [];
            const doc = this.documents[documentIndex];
            const uniqueTerms = [...new Set(doc)];
            return uniqueTerms.map(term => ({
                term,
                tfidf: this.tfidf(term, documentIndex)
            })).sort((a, b) => b.tfidf - a.tfidf);
        }
    },
    PorterStemmer: {
        stem(word) {
            // Very simplified stemming for TypeScript compatibility
            if (word.endsWith('ing'))
                return word.slice(0, -3);
            if (word.endsWith('ed'))
                return word.slice(0, -2);
            if (word.endsWith('s'))
                return word.slice(0, -1);
            return word;
        }
    },
    LevenshteinDistance: (str1, str2) => {
        // Simple implementation for TypeScript compatibility
        if (str1 === str2)
            return 0;
        if (str1.length === 0)
            return str2.length;
        if (str2.length === 0)
            return str1.length;
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                const cost = str2[i - 1] === str1[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }
        return matrix[str2.length][str1.length];
    }
};
const stopword = {
    removeStopwords: (tokens) => {
        const stopwords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'is',
            'are', 'was', 'were', 'this', 'that', 'these', 'those'];
        return tokens.filter(token => !stopwords.includes(token.toLowerCase()));
    }
};
export class SemanticAnalyzer {
    vectorDimension = 300; // Increased dimension for semantic vectors
    wordVectors = new Map(); // Cache for word vectors
    tokenizer = new natural.WordTokenizer();
    stemmer = natural.PorterStemmer;
    tfidf = new natural.TfIdf();
    // Initialize with pre-trained word vectors if available
    constructor(wordVectorsPath) {
        if (wordVectorsPath) {
            this.loadWordVectors(wordVectorsPath);
        }
    }
    /**
     * Loads pre-trained word vectors from file
     * @param path Path to word vectors file (GloVe or Word2Vec format)
     */
    async loadWordVectors(path) {
        try {
            // Implementation would load vectors from file
            // This is a placeholder for the actual implementation
            console.log(`Loading word vectors from ${path}`);
        }
        catch (error) {
            console.error('Error loading word vectors:', error);
        }
    }
    /**
     * Analyzes semantic similarity between two thoughts using advanced techniques
     */
    analyzeSemanticSimilarity(thought1, thought2) {
        // Try different similarity measures and use a weighted approach
        const vector1 = thought1.vector || this.buildThoughtVectors(thought1);
        const vector2 = thought2.vector || this.buildThoughtVectors(thought2);
        const cosineSim = this.cosineSimilarity(vector1, vector2);
        // Also calculate Jaccard similarity for keywords
        const keywords1 = new Set(this.extractKeywords(thought1.thought));
        const keywords2 = new Set(this.extractKeywords(thought2.thought));
        const jaccardSim = this.jaccardSimilarity(keywords1, keywords2);
        // Calculate contextual similarity using TF-IDF
        const tfidfSim = this.calculateTfidfSimilarity(thought1.thought, thought2.thought);
        // Weighted combination of similarity measures
        return (cosineSim * 0.5) + (jaccardSim * 0.2) + (tfidfSim * 0.3);
    }
    /**
     * Builds semantic vectors for a thought using word embeddings
     */
    buildThoughtVectors(thought) {
        const tokens = this.tokenizeAndNormalize(thought.thought);
        const vector = new Array(this.vectorDimension).fill(0);
        let wordCount = 0;
        // Use word embeddings with IDF weighting
        for (const token of tokens) {
            const wordVector = this.getWordVector(token);
            if (wordVector) {
                // Apply IDF weighting if calculated
                const idfWeight = this.getIdfWeight(token);
                for (let i = 0; i < this.vectorDimension; i++) {
                    vector[i] += wordVector[i] * idfWeight;
                }
                wordCount++;
            }
        }
        // Average the vectors or use zero vector if no words found
        if (wordCount > 0) {
            for (let i = 0; i < this.vectorDimension; i++) {
                vector[i] /= wordCount;
            }
        }
        // Normalize the vector
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return vector.map(val => magnitude === 0 ? 0 : val / magnitude);
    }
    /**
     * Get word vector from pre-trained vectors or generate using hashing
     */
    getWordVector(word) {
        // Check cache first
        if (this.wordVectors.has(word)) {
            return this.wordVectors.get(word);
        }
        // If not in cache, generate using enhanced hashing technique
        const vector = new Array(this.vectorDimension).fill(0);
        // More sophisticated hash-based vector with multiple hash functions
        const seedPrimes = [31, 101, 257, 401, 631];
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < seedPrimes.length; j++) {
                const char = word.charCodeAt(i);
                const index = (char * seedPrimes[j] + i + j) % this.vectorDimension;
                vector[index] += 1 / (i + 1); // Diminishing impact for later positions
            }
        }
        // Normalize
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        const normalized = vector.map(val => magnitude === 0 ? 0 : val / magnitude);
        // Cache for future use
        this.wordVectors.set(word, normalized);
        return normalized;
    }
    /**
     * Get IDF weight for a word
     */
    getIdfWeight(word) {
        // Default weight if TF-IDF not initialized
        return 1.0;
    }
    /**
     * Calculate similarity using TF-IDF
     */
    calculateTfidfSimilarity(text1, text2) {
        // Create temporary TF-IDF for these texts
        const tempTfidf = new natural.TfIdf();
        tempTfidf.addDocument(this.tokenizeAndNormalize(text1).join(' '));
        tempTfidf.addDocument(this.tokenizeAndNormalize(text2).join(' '));
        // Calculate similarity based on TF-IDF vectors
        const vector1 = {};
        const vector2 = {};
        // Extract unique terms from both documents
        const terms = new Set();
        [text1, text2].forEach((text, docIndex) => {
            const tokens = this.tokenizeAndNormalize(text);
            tokens.forEach(token => {
                terms.add(token);
            });
        });
        // Build TF-IDF vectors
        terms.forEach(term => {
            vector1[term] = tempTfidf.tfidf(term, 0);
            vector2[term] = tempTfidf.tfidf(term, 1);
        });
        // Calculate cosine similarity between vectors
        return this.cosineSimilarityObjects(vector1, vector2);
    }
    /**
     * Calculate cosine similarity between two objects representing sparse vectors
     */
    cosineSimilarityObjects(vec1, vec2) {
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        // Compute dot product and magnitudes
        for (const term of Object.keys({ ...vec1, ...vec2 })) {
            const val1 = vec1[term] || 0;
            const val2 = vec2[term] || 0;
            dotProduct += val1 * val2;
            magnitude1 += val1 * val1;
            magnitude2 += val2 * val2;
        }
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);
        if (magnitude1 === 0 || magnitude2 === 0)
            return 0;
        return dotProduct / (magnitude1 * magnitude2);
    }
    /**
     * Clusters thoughts by topic using LDA (Latent Dirichlet Allocation)
     */
    clusterThoughtsByTopic(thoughts) {
        const clusters = {};
        const processedThoughts = new Set();
        // Prepare documents for LDA-like processing
        const documents = thoughts.map(t => this.tokenizeAndNormalize(t.thought));
        // Build document-term matrix and calculate TF-IDF
        const tempTfidf = new natural.TfIdf();
        documents.forEach(doc => tempTfidf.addDocument(doc.join(' ')));
        // Get all terms with their document frequencies
        const terms = new Set();
        documents.forEach(doc => doc.forEach(term => terms.add(term)));
        // Build similarity matrix between thoughts
        const similarityMatrix = [];
        for (let i = 0; i < thoughts.length; i++) {
            similarityMatrix[i] = [];
            for (let j = 0; j < thoughts.length; j++) {
                if (i === j) {
                    similarityMatrix[i][j] = 1.0; // Self-similarity
                }
                else {
                    similarityMatrix[i][j] = this.analyzeSemanticSimilarity(thoughts[i], thoughts[j]);
                }
            }
        }
        // Hierarchical clustering approach
        let clusterCount = 0;
        thoughts.forEach((thought, index) => {
            if (processedThoughts.has(thought.thoughtNumber))
                return;
            // Find similar thoughts based on similarity matrix
            const cluster = thoughts.filter((t, j) => !processedThoughts.has(t.thoughtNumber) &&
                similarityMatrix[index][j] > 0.6 // Adjusted threshold
            );
            if (cluster.length > 0) {
                const topicKeywords = this.extractTopicKeywords(cluster);
                const topicName = topicKeywords.length > 0
                    ? topicKeywords.slice(0, 2).join('_')
                    : `topic_${clusterCount + 1}`;
                clusters[topicName] = cluster;
                clusterCount++;
                cluster.forEach(t => processedThoughts.add(t.thoughtNumber));
            }
        });
        return clusters;
    }
    /**
     * Extracts key concepts from a thought using advanced NLP techniques
     */
    extractConcepts(thought) {
        const text = thought.thought;
        const tokens = this.tokenizeAndNormalize(text);
        const concepts = new Set();
        // Extract n-grams (1-3 word phrases)
        const ngrams = [];
        // Unigrams
        tokens.forEach(token => {
            if (this.isSignificantConcept(token)) {
                ngrams.push(token);
            }
        });
        // Bigrams
        for (let i = 0; i < tokens.length - 1; i++) {
            const bigram = `${tokens[i]} ${tokens[i + 1]}`;
            if (this.isSignificantConcept(bigram)) {
                ngrams.push(bigram);
            }
        }
        // Trigrams
        for (let i = 0; i < tokens.length - 2; i++) {
            const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
            if (this.isSignificantConcept(trigram)) {
                ngrams.push(trigram);
            }
        }
        // Score n-grams based on TF-IDF and add top ones as concepts
        const tempTfidf = new natural.TfIdf();
        tempTfidf.addDocument(tokens.join(' '));
        // Score each n-gram
        const scoredNgrams = ngrams.map(ngram => {
            const ngramTokens = ngram.split(' ');
            // Average TF-IDF of component words
            let score = 0;
            for (const token of ngramTokens) {
                score += tempTfidf.tfidf(token, 0);
            }
            score /= ngramTokens.length;
            return { ngram, score };
        });
        // Sort by score and take top 10
        const topNgrams = scoredNgrams
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(item => item.ngram);
        return topNgrams;
    }
    /**
     * Extracts prompt-specific keywords from a thought using advanced NLP
     * @param thought The thought to analyze
     * @param promptMetadata The prompt metadata for context
     * @returns Array of keywords with relevance to the prompt
     */
    extractPromptSpecificKeywords(thought, promptMetadata) {
        const tokens = this.tokenizeAndNormalize(thought.thought);
        const promptKeywords = promptMetadata.keywords;
        const result = [];
        // Get all n-grams (1-3 word phrases)
        const ngrams = [];
        // Add unigrams
        tokens.forEach(token => ngrams.push(token));
        // Add bigrams
        for (let i = 0; i < tokens.length - 1; i++) {
            ngrams.push(`${tokens[i]} ${tokens[i + 1]}`);
        }
        // Add trigrams
        for (let i = 0; i < tokens.length - 2; i++) {
            ngrams.push(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
        }
        // Calculate relevance for each n-gram
        for (const ngram of ngrams) {
            if (this.isSignificantConcept(ngram)) {
                // Calculate semantic relevance to prompt keywords
                let maxRelevance = 0;
                // Check exact matches first
                if (promptKeywords.includes(ngram)) {
                    maxRelevance = 1.0;
                }
                else {
                    // Calculate semantic similarity to each prompt keyword
                    for (const promptKeyword of promptKeywords) {
                        const relevance = this.calculatePhraseRelevance(ngram, promptKeyword);
                        maxRelevance = Math.max(maxRelevance, relevance);
                    }
                }
                // Add if relevance is above threshold
                if (maxRelevance > 0.25) {
                    result.push({ keyword: ngram, relevance: maxRelevance });
                }
            }
        }
        // Remove duplicates (keeping highest relevance)
        const uniqueResults = new Map();
        for (const { keyword, relevance } of result) {
            if (!uniqueResults.has(keyword) || uniqueResults.get(keyword) < relevance) {
                uniqueResults.set(keyword, relevance);
            }
        }
        // Convert back to array and sort by relevance
        return Array.from(uniqueResults.entries())
            .map(([keyword, relevance]) => ({ keyword, relevance }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 15); // Return top 15 relevant keywords
    }
    /**
     * Calculate relevance between two phrases using multiple techniques
     */
    calculatePhraseRelevance(phrase1, phrase2) {
        // 1. Check for word overlap
        const words1 = phrase1.split(' ');
        const words2 = phrase2.split(' ');
        const words1Set = new Set(words1);
        const words2Set = new Set(words2);
        // Jaccard similarity for word overlap
        const overlapSim = this.jaccardSimilarity(words1Set, words2Set);
        // 2. String similarity for spelling variations
        const stringSim = this.calculateStringSimilarity(phrase1, phrase2);
        // 3. Semantic similarity (simplified version)
        let semanticSim = 0;
        // For each word pair, calculate similarity
        for (const word1 of words1) {
            for (const word2 of words2) {
                // Get stemmed forms
                const stem1 = this.stemmer.stem(word1);
                const stem2 = this.stemmer.stem(word2);
                // If stems match, high similarity
                if (stem1 === stem2) {
                    semanticSim = Math.max(semanticSim, 0.9);
                }
                else {
                    // Otherwise, use string similarity between stems
                    const stemSim = this.calculateStringSimilarity(stem1, stem2);
                    semanticSim = Math.max(semanticSim, stemSim * 0.7);
                }
            }
        }
        // Weighted combination
        return (overlapSim * 0.4) + (stringSim * 0.3) + (semanticSim * 0.3);
    }
    /**
     * Detects topic drift with more sophisticated contextual analysis
     * @param thought The thought to analyze
     * @param promptMetadata The prompt metadata for context
     * @returns Object with drift information
     */
    detectTopicDrift(thought, promptMetadata) {
        const thoughtText = thought.thought;
        const promptGoals = promptMetadata.goals;
        const promptKeywords = promptMetadata.keywords;
        const promptDomains = promptMetadata.domains;
        // Calculate various relevance metrics
        const goalRelevance = this.calculateContextualAspectRelevance(thoughtText, promptGoals);
        const keywordRelevance = this.calculateContextualAspectRelevance(thoughtText, promptKeywords);
        const domainRelevance = this.calculateContextualAspectRelevance(thoughtText, promptDomains);
        // Extract thought keywords for comparison
        const thoughtKeywords = this.extractKeywords(thoughtText);
        // Calculate keyword overlap with prompt keywords
        const promptKeywordsSet = new Set(promptKeywords);
        const overlapCount = thoughtKeywords.filter(kw => promptKeywordsSet.has(kw)).length;
        const keywordOverlapRatio = promptKeywords.length > 0
            ? overlapCount / Math.min(thoughtKeywords.length, promptKeywords.length)
            : 1.0;
        // Calculate comprehensive drift score with weighted components
        const driftScore = 1 - ((goalRelevance * 0.4) +
            (keywordRelevance * 0.3) +
            (domainRelevance * 0.1) +
            (keywordOverlapRatio * 0.2));
        // Analyze drift direction
        let driftDirection = undefined;
        if (driftScore > 0.4) {
            // Identify which domains the thought might be drifting toward
            const alternativeDomains = this.identifyAlternativeDomains(thoughtText, promptMetadata);
            if (alternativeDomains.length > 0) {
                driftDirection = `Drifting toward: ${alternativeDomains.join(', ')}`;
            }
        }
        // Determine if drift is significant with adaptive threshold
        const driftThreshold = 0.55; // Slightly more permissive
        const hasDrift = driftScore > driftThreshold;
        // Generate detailed reason for drift if detected
        let driftReason;
        if (hasDrift) {
            if (goalRelevance < 0.4) {
                driftReason = "Thought has low relevance to the prompt's main goals";
            }
            else if (keywordRelevance < 0.4) {
                driftReason = "Thought uses terminology unrelated to the prompt's key concepts";
            }
            else if (keywordOverlapRatio < 0.3) {
                driftReason = "Few overlapping keywords with the prompt";
            }
            else if (domainRelevance < 0.3) {
                driftReason = "Thought appears to address a different knowledge domain";
            }
            else {
                driftReason = "Thought is diverging from the prompt's intended direction";
            }
        }
        return {
            hasDrift,
            driftScore,
            driftReason,
            driftDirection
        };
    }
    /**
     * Identify potential alternative domains the thought might be drifting toward
     */
    identifyAlternativeDomains(text, promptMetadata) {
        // Simplified domain identification
        // In a real implementation, this would use a more sophisticated domain classifier
        const domainKeywords = {
            "programming": ["code", "programming", "software", "development", "algorithm", "function"],
            "math": ["math", "calculation", "formula", "equation", "numerical"],
            "science": ["science", "scientific", "experiment", "hypothesis", "theory"],
            "business": ["business", "market", "strategy", "company", "product", "service"],
            "writing": ["write", "essay", "article", "blog", "content", "story"],
            "design": ["design", "layout", "visual", "UI", "UX", "interface"],
            "data": ["data", "analysis", "statistics", "dataset", "visualization"]
        };
        const textLower = text.toLowerCase();
        const alternativeDomains = [];
        // Don't include domains that are already in prompt domains
        const promptDomains = new Set(promptMetadata.domains);
        for (const [domain, keywords] of Object.entries(domainKeywords)) {
            if (!promptDomains.has(domain)) {
                for (const keyword of keywords) {
                    if (textLower.includes(keyword)) {
                        alternativeDomains.push(domain);
                        break;
                    }
                }
            }
        }
        return alternativeDomains;
    }
    /**
     * Compares a thought against prompt requirements with advanced semantic understanding
     * @param thought The thought to analyze
     * @param promptMetadata The prompt metadata for context
     * @returns Alignment metrics
     */
    compareThoughtToPromptRequirements(thought, promptMetadata) {
        const thoughtText = thought.thought;
        // Calculate alignments with more sophisticated techniques
        const goalAlignment = this.calculateContextualAspectRelevance(thoughtText, promptMetadata.goals);
        const constraintAlignment = this.calculateContextualAspectRelevance(thoughtText, promptMetadata.constraints);
        const domainAlignment = this.calculateContextualAspectRelevance(thoughtText, promptMetadata.domains);
        // Calculate overall alignment with adaptive weighting
        const taskType = promptMetadata.taskType;
        let goalWeight = 0.5;
        let constraintWeight = 0.3;
        let domainWeight = 0.2;
        // Adjust weights based on task type
        if (taskType === 'technical') {
            constraintWeight = 0.4;
            goalWeight = 0.4;
            domainWeight = 0.2;
        }
        else if (taskType === 'creative') {
            goalWeight = 0.6;
            constraintWeight = 0.2;
            domainWeight = 0.2;
        }
        const overallAlignment = (goalAlignment * goalWeight +
            constraintAlignment * constraintWeight +
            domainAlignment * domainWeight);
        // Identify missing aspects with improved detection
        const missingAspects = [];
        // Check for important goals with more nuanced detection
        const missingGoals = promptMetadata.goals.filter(goal => !this.containsAspectContextually(thoughtText, goal) &&
            this.isImportantAspect(goal, promptMetadata));
        if (missingGoals.length > 0) {
            missingAspects.push(`Missing goals: ${missingGoals.join(', ')}`);
        }
        // Check for important constraints with semantic understanding
        const missingConstraints = promptMetadata.constraints.filter(constraint => !this.containsAspectContextually(thoughtText, constraint) &&
            this.isImportantAspect(constraint, promptMetadata));
        if (missingConstraints.length > 0) {
            missingAspects.push(`Missing constraints: ${missingConstraints.join(', ')}`);
        }
        // Generate suggested additions to improve alignment
        const suggestedAdditions = [];
        if (missingGoals.length > 0) {
            suggestedAdditions.push(`Consider addressing these goals: ${missingGoals.join(', ')}`);
        }
        if (missingConstraints.length > 0) {
            suggestedAdditions.push(`Make sure to observe these constraints: ${missingConstraints.join(', ')}`);
        }
        // If alignment is low, suggest incorporating more domain-specific terminology
        if (domainAlignment < 0.4 && promptMetadata.domains.length > 0) {
            suggestedAdditions.push(`Consider using more terminology from: ${promptMetadata.domains.join(', ')}`);
        }
        return {
            overallAlignment,
            goalAlignment,
            constraintAlignment,
            domainAlignment,
            missingAspects,
            suggestedAdditions: suggestedAdditions.length > 0 ? suggestedAdditions : undefined
        };
    }
    /**
     * Advanced contextual aspect relevance calculation
     */
    calculateContextualAspectRelevance(text, aspects) {
        if (aspects.length === 0)
            return 1.0; // No aspects to check against
        let totalRelevance = 0;
        for (const aspect of aspects) {
            // Direct inclusion check
            if (text.toLowerCase().includes(aspect.toLowerCase())) {
                totalRelevance += 1.0;
                continue;
            }
            // Tokenize aspect and text for more detailed comparison
            const aspectTokens = this.tokenizeAndNormalize(aspect);
            const textTokens = this.tokenizeAndNormalize(text);
            // Check for aspect token presence
            let tokenMatches = 0;
            for (const token of aspectTokens) {
                if (textTokens.includes(token)) {
                    tokenMatches++;
                }
            }
            const tokenMatchRatio = aspectTokens.length > 0
                ? tokenMatches / aspectTokens.length
                : 0;
            // Check for semantic similarity between aspect and sentences in text
            const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
            let maxSentenceSimilarity = 0;
            for (const sentence of sentences) {
                const similarity = this.calculatePhraseRelevance(aspect, sentence);
                maxSentenceSimilarity = Math.max(maxSentenceSimilarity, similarity);
            }
            // Combine token matching and semantic similarity
            const combinedRelevance = (tokenMatchRatio * 0.6) + (maxSentenceSimilarity * 0.4);
            totalRelevance += combinedRelevance;
        }
        return Math.min(1.0, totalRelevance / Math.max(1, aspects.length));
    }
    /**
     * Check if text contains an aspect using contextual understanding
     */
    containsAspectContextually(text, aspect) {
        // Direct inclusion check
        if (text.toLowerCase().includes(aspect.toLowerCase())) {
            return true;
        }
        // Check for semantic presence through relevance score
        const relevance = this.calculateContextualAspectRelevance(text, [aspect]);
        return relevance > 0.65; // Threshold for considering the aspect present
    }
    /**
     * Enhanced tokenization and normalization
     */
    tokenizeAndNormalize(text) {
        // Tokenize
        const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
        // Remove stopwords
        const filteredTokens = stopword.removeStopwords(tokens);
        // Stem words (optional - sometimes stemming loses meaning)
        // const stemmedTokens = filteredTokens.map(token => this.stemmer.stem(token));
        return filteredTokens;
    }
    /**
     * Extract keywords from text using TF-IDF
     */
    extractKeywords(text) {
        const tokens = this.tokenizeAndNormalize(text);
        if (tokens.length === 0)
            return [];
        // Create a temporary TF-IDF just for this text
        const tempTfidf = new natural.TfIdf();
        tempTfidf.addDocument(tokens);
        // Get high TF-IDF terms
        const terms = [];
        tempTfidf.listTerms(0).forEach((item) => {
            terms.push({ term: item.term, tfidf: item.tfidf });
        });
        // Sort by TF-IDF score and take top N
        return terms
            .sort((a, b) => b.tfidf - a.tfidf)
            .slice(0, 10)
            .map(item => item.term);
    }
    // Private helpers
    preprocessText(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Replace punctuation with space
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }
    cosineSimilarity(vec1, vec2) {
        if (vec1.length !== vec2.length)
            return 0;
        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
        if (magnitude1 === 0 || magnitude2 === 0)
            return 0;
        return dotProduct / (magnitude1 * magnitude2);
    }
    jaccardSimilarity(set1, set2) {
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return union.size === 0 ? 0 : intersection.size / union.size;
    }
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    extractTopicKeywords(thoughts) {
        // Use TF-IDF for more accurate topic keyword extraction
        const tfidf = new natural.TfIdf();
        // Add all thoughts as documents
        thoughts.forEach(thought => {
            const tokens = this.tokenizeAndNormalize(thought.thought);
            tfidf.addDocument(tokens);
        });
        // Extract top terms from the collection
        const terms = [];
        // Get terms with highest average TF-IDF across documents
        const uniqueTerms = new Set();
        thoughts.forEach((_, docIndex) => {
            tfidf.listTerms(docIndex).forEach((item) => {
                uniqueTerms.add(item.term);
            });
        });
        // Calculate average TF-IDF for each term
        Array.from(uniqueTerms).forEach(term => {
            let totalScore = 0;
            thoughts.forEach((_, docIndex) => {
                totalScore += tfidf.tfidf(term, docIndex);
            });
            const avgScore = totalScore / thoughts.length;
            terms.push({ term, score: avgScore });
        });
        // Return top 5 terms by score
        return terms
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(item => item.term);
    }
    isSignificantConcept(concept) {
        // Enhanced concept significance check
        const words = concept.split(' ');
        // Extended stopwords list
        const stopWords = new Set([
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'is', 'are', 'was',
            'were', 'this', 'that', 'these', 'those', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
            'does', 'did', 'can', 'could', 'will', 'would', 'should', 'may', 'might', 'must', 'shall'
        ]);
        // For multi-word concepts, allow some stopwords
        if (words.length > 1) {
            // Check if all words are stopwords
            const allStopwords = words.every(word => stopWords.has(word));
            if (allStopwords)
                return false;
            // For longer concepts, they're more likely to be significant
            if (words.length >= 3)
                return true;
            // For bigrams, at least one word should be non-stopword and longer than 3 chars
            return words.some(word => !stopWords.has(word) && word.length > 3);
        }
        // For single words, they should be longer and not stopwords
        return concept.length > 3 && !stopWords.has(concept);
    }
    calculateStringSimilarity(str1, str2) {
        // Use Levenshtein distance for better string similarity
        const distance = natural.LevenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        if (maxLength === 0)
            return 1.0; // Both strings empty
        return 1 - (distance / maxLength);
    }
    calculateAspectRelevance(text, aspects) {
        // Use the more advanced contextual relevance calculation
        return this.calculateContextualAspectRelevance(text, aspects);
    }
    containsAspect(text, aspect) {
        // Use the more advanced contextual aspect detection
        return this.containsAspectContextually(text, aspect);
    }
    isImportantAspect(aspect, promptMetadata) {
        // Enhanced importance detection considering semantics
        // Check if aspect is a keyword
        const isKeyword = promptMetadata.keywords.some(kw => kw.includes(aspect) || aspect.includes(kw) ||
            this.calculatePhraseRelevance(kw, aspect) > 0.8);
        // Check if aspect is a primary goal (first 3 goals are primary)
        const isPrimaryGoal = promptMetadata.goals.indexOf(aspect) < 3;
        // Check if aspect contains entities from the prompt
        const containsPromptEntity = promptMetadata.entities.some(entity => aspect.includes(entity) || this.calculatePhraseRelevance(entity, aspect) > 0.9);
        return isKeyword || isPrimaryGoal || containsPromptEntity;
    }
}
