import chalk from 'chalk';
export class GraphRenderer {
    /**
     * Generates a dependency graph visualization
     */
    generateDependencyGraph(thoughts) {
        const lines = [];
        lines.push(chalk.cyan('\n=== Thought Dependency Graph ===\n'));
        // Create a map for quick lookup
        const thoughtMap = new Map(thoughts.map(t => [t.thoughtNumber, t]));
        // Build adjacency list
        const adjacencyList = {};
        thoughts.forEach(thought => {
            if (thought.dependencies && thought.dependencies.length > 0) {
                thought.dependencies.forEach(dep => {
                    if (!adjacencyList[dep]) {
                        adjacencyList[dep] = [];
                    }
                    adjacencyList[dep].push(thought.thoughtNumber);
                });
            }
        });
        // Generate graph visualization
        thoughts.forEach(thought => {
            if (thought.isRevision)
                return;
            const phase = thought.phase || 'Execution';
            const colorFn = this.getPhaseColor(phase);
            const connections = adjacencyList[thought.thoughtNumber] || [];
            // Format node
            const nodeLabel = `T${thought.thoughtNumber}`;
            const nodeWithPhase = `${nodeLabel}(${phase[0]})`;
            const qualityIndicator = thought.quality ?
                ` [Q:${thought.quality.qualityScore}]` : '';
            const classificationTag = thought.classification ?
                ` [${thought.classification}]` : '';
            // Add prompt alignment indicator
            const alignmentIndicator = thought.promptAlignment !== undefined ?
                ` [A:${thought.promptAlignment}${thought.promptAlignment >= 7 ? '✓' : thought.promptAlignment >= 4 ? '⚠️' : '❌'}]` : '';
            lines.push(colorFn(`${nodeWithPhase.padEnd(10)}${qualityIndicator}${classificationTag}${alignmentIndicator} ${connections.length ? '→' : ''} ${connections.map(c => `T${c}`).join(', ')}`));
        });
        // Add branch information
        const branches = this.groupThoughtsByBranch(thoughts);
        if (Object.keys(branches).length > 0) {
            lines.push(chalk.yellow('\nBranches:'));
            Object.entries(branches).forEach(([branchId, branchThoughts]) => {
                const branchInfo = branchThoughts
                    .map(t => {
                    const phase = t.phase || 'Execution';
                    const colorFn = this.getPhaseColor(phase);
                    return colorFn(`T${t.thoughtNumber}(${phase[0]})`);
                })
                    .join(' → ');
                lines.push(`  ${branchId}: ${branchInfo}`);
            });
        }
        // Add legend
        lines.push('\nLegend:');
        ['Planning', 'Analysis', 'Execution', 'Verification'].forEach(phase => {
            const colorFn = this.getPhaseColor(phase);
            lines.push(`  ${colorFn(`${phase[0]}`)} - ${phase}`);
        });
        lines.push(`  A:# - Prompt Alignment Score (A:8✓ = good, A:5⚠️ = moderate, A:2❌ = poor)`);
        return lines.join('\n') + '\n';
    }
    /**
     * Generates a concept map visualization
     */
    generateConceptMap(thoughts) {
        const lines = [];
        lines.push(chalk.cyan('\n=== Concept Map ===\n'));
        // Extract all concepts and their relationships
        const conceptRelations = this.extractConceptRelations(thoughts);
        const concepts = new Set();
        conceptRelations.forEach(rel => {
            concepts.add(rel.source);
            concepts.add(rel.target);
        });
        // Generate concept nodes
        concepts.forEach(concept => {
            const relatedConcepts = conceptRelations
                .filter(rel => rel.source === concept)
                .map(rel => `${rel.relationship} → ${rel.target}`);
            lines.push(chalk.yellow(`[${concept}]`));
            relatedConcepts.forEach(rel => {
                lines.push(`  ${rel}`);
            });
            lines.push('');
        });
        return lines.join('\n');
    }
    /**
     * Generates a timeline view of thoughts
     */
    generateTimelineView(thoughts) {
        const lines = [];
        lines.push(chalk.cyan('\n=== Thought Timeline ===\n'));
        let currentPhase;
        thoughts.forEach(thought => {
            // Add phase transition marker
            if (thought.phase && thought.phase !== currentPhase) {
                lines.push(chalk.yellow(`\n[Phase: ${thought.phase}]`));
                currentPhase = thought.phase;
            }
            // Format thought entry
            const thoughtNumber = `T${thought.thoughtNumber}`.padEnd(4);
            const classification = thought.classification ?
                chalk.blue(`[${thought.classification}] `) : '';
            const summary = this.truncateText(thought.thought, 60);
            const quality = thought.quality ?
                chalk.gray(` (Q:${thought.quality.qualityScore})`) : '';
            // Add prompt alignment indicator
            const alignment = thought.promptAlignment !== undefined ?
                chalk.cyan(` [A:${thought.promptAlignment}${thought.promptAlignment >= 7 ? '✓' : thought.promptAlignment >= 4 ? '⚠️' : '❌'}]`) : '';
            lines.push(`${thoughtNumber} ${classification}${summary}${quality}${alignment}`);
            // Add revision marker if applicable
            if (thought.isRevision) {
                lines.push(`      ${chalk.yellow('↳')} Revises T${thought.revisesThought}`);
            }
            // Add dependency information
            if (thought.dependencies && thought.dependencies.length > 0) {
                lines.push(`      ${chalk.gray('↑')} Depends on: T${thought.dependencies.join(', T')}`);
            }
            // Add drift warning if applicable
            if (thought.driftWarning) {
                lines.push(`      ${chalk.red('⚠️')} ${thought.driftWarning}`);
            }
        });
        return lines.join('\n') + '\n';
    }
    /**
     * Generates a prompt-centered visualization showing how thoughts relate to prompt goals
     */
    generatePromptAlignmentView(thoughts, promptMetadata) {
        if (!promptMetadata) {
            return chalk.yellow('\n=== Prompt Alignment View ===\n(No prompt metadata available)\n');
        }
        const lines = [];
        lines.push(chalk.cyan('\n=== Prompt Alignment View ===\n'));
        // Display prompt goals
        lines.push(chalk.magenta('Prompt Goals:'));
        promptMetadata.goals.forEach((goal, index) => {
            lines.push(`  ${index + 1}. ${goal}`);
        });
        lines.push('');
        // Display alignment of thoughts to goals
        lines.push(chalk.magenta('Thought Alignment to Goals:'));
        // Group thoughts by alignment score
        const highAlignment = thoughts.filter(t => t.promptAlignment !== undefined && t.promptAlignment >= 7);
        const mediumAlignment = thoughts.filter(t => t.promptAlignment !== undefined && t.promptAlignment >= 4 && t.promptAlignment < 7);
        const lowAlignment = thoughts.filter(t => t.promptAlignment !== undefined && t.promptAlignment < 4);
        if (highAlignment.length > 0) {
            lines.push(chalk.green('  High Alignment:'));
            highAlignment.forEach(t => {
                lines.push(`    T${t.thoughtNumber} - ${this.truncateText(t.thought, 50)} [${t.promptAlignment}/10]`);
            });
        }
        if (mediumAlignment.length > 0) {
            lines.push(chalk.yellow('  Medium Alignment:'));
            mediumAlignment.forEach(t => {
                lines.push(`    T${t.thoughtNumber} - ${this.truncateText(t.thought, 50)} [${t.promptAlignment}/10]`);
            });
        }
        if (lowAlignment.length > 0) {
            lines.push(chalk.red('  Low Alignment:'));
            lowAlignment.forEach(t => {
                lines.push(`    T${t.thoughtNumber} - ${this.truncateText(t.thought, 50)} [${t.promptAlignment}/10]`);
                if (t.driftWarning) {
                    lines.push(`      ⚠️ ${t.driftWarning}`);
                }
            });
        }
        // Calculate overall alignment metrics
        const alignmentScores = thoughts
            .filter(t => t.promptAlignment !== undefined)
            .map(t => t.promptAlignment);
        if (alignmentScores.length > 0) {
            const avgAlignment = alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length;
            const alignmentTrend = this.calculateAlignmentTrend(thoughts);
            lines.push('');
            lines.push(chalk.magenta('Alignment Metrics:'));
            lines.push(`  Average Alignment: ${avgAlignment.toFixed(1)}/10`);
            lines.push(`  Alignment Trend: ${alignmentTrend}`);
            lines.push(`  High Alignment Thoughts: ${highAlignment.length}/${thoughts.length}`);
            lines.push(`  Low Alignment Thoughts: ${lowAlignment.length}/${thoughts.length}`);
        }
        return lines.join('\n') + '\n';
    }
    /**
     * Generates a progress tracking visualization against prompt objectives
     */
    generatePromptProgressView(thoughts, promptMetadata) {
        if (!promptMetadata) {
            return chalk.yellow('\n=== Prompt Progress View ===\n(No prompt metadata available)\n');
        }
        const lines = [];
        lines.push(chalk.cyan('\n=== Prompt Progress View ===\n'));
        // Display progress against each goal
        lines.push(chalk.magenta('Progress Against Goals:'));
        promptMetadata.goals.forEach((goal, index) => {
            // Calculate progress for this goal based on thought relevance
            const relevantThoughts = thoughts.filter(t => t.promptRelevance && t.promptRelevance[`goal_${index}`] !== undefined &&
                t.promptRelevance[`goal_${index}`] > 0.5);
            const progressPercentage = Math.min(100, Math.round((relevantThoughts.length / Math.max(2, promptMetadata.complexity === 'simple' ? 3 : promptMetadata.complexity === 'medium' ? 5 : 8)) * 100));
            // Create progress bar
            const barWidth = 20;
            const filledWidth = Math.floor(barWidth * (progressPercentage / 100));
            const progressBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);
            lines.push(`  Goal ${index + 1}: ${goal}`);
            lines.push(`    [${progressBar}] ${progressPercentage}%`);
            // List relevant thoughts
            if (relevantThoughts.length > 0) {
                lines.push(`    Relevant thoughts: ${relevantThoughts.map(t => `T${t.thoughtNumber}`).join(', ')}`);
            }
            else {
                lines.push(`    No thoughts directly addressing this goal yet`);
            }
            lines.push('');
        });
        // Calculate overall progress
        const overallProgress = this.calculateOverallProgress(thoughts, promptMetadata);
        const barWidth = 30;
        const filledWidth = Math.floor(barWidth * (overallProgress / 100));
        const progressBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);
        lines.push(chalk.magenta('Overall Progress:'));
        lines.push(`  [${progressBar}] ${overallProgress}%`);
        // Add completion estimate
        const completionEstimate = this.estimateCompletion(thoughts, promptMetadata);
        lines.push(`  Estimated thoughts to completion: ${completionEstimate}`);
        return lines.join('\n') + '\n';
    }
    getPhaseColor(phase) {
        const phaseColors = {
            'Planning': chalk.blue,
            'Analysis': chalk.yellow,
            'Execution': chalk.green,
            'Verification': chalk.magenta
        };
        return phaseColors[phase] || chalk.white;
    }
    groupThoughtsByBranch(thoughts) {
        const branches = {};
        thoughts.forEach(thought => {
            if (thought.branchId) {
                if (!branches[thought.branchId]) {
                    branches[thought.branchId] = [];
                }
                branches[thought.branchId].push(thought);
            }
        });
        return branches;
    }
    extractConceptRelations(thoughts) {
        const relations = [];
        thoughts.forEach(thought => {
            if (!thought.conceptsExtracted)
                return;
            // Connect consecutive concepts within the same thought
            for (let i = 0; i < thought.conceptsExtracted.length - 1; i++) {
                relations.push({
                    source: thought.conceptsExtracted[i],
                    target: thought.conceptsExtracted[i + 1],
                    relationship: 'relates to'
                });
            }
            // Connect concepts to thought classification if available
            if (thought.classification && thought.conceptsExtracted.length > 0) {
                relations.push({
                    source: thought.conceptsExtracted[0],
                    target: thought.classification,
                    relationship: 'classified as'
                });
            }
        });
        return relations;
    }
    truncateText(text, maxLength) {
        if (text.length <= maxLength)
            return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    calculateAlignmentTrend(thoughts) {
        // Get thoughts with alignment scores
        const alignedThoughts = thoughts
            .filter(t => t.promptAlignment !== undefined)
            .sort((a, b) => a.thoughtNumber - b.thoughtNumber);
        if (alignedThoughts.length < 3) {
            return 'Insufficient data';
        }
        // Get the last 5 thoughts (or fewer if not available)
        const recentThoughts = alignedThoughts.slice(-5);
        // Calculate trend
        const firstScore = recentThoughts[0].promptAlignment;
        const lastScore = recentThoughts[recentThoughts.length - 1].promptAlignment;
        const difference = lastScore - firstScore;
        if (difference > 1) {
            return chalk.green('↗️ Improving');
        }
        else if (difference < -1) {
            return chalk.red('↘️ Declining');
        }
        else {
            return chalk.blue('→ Stable');
        }
    }
    calculateOverallProgress(thoughts, promptMetadata) {
        // Calculate progress based on:
        // 1. Percentage of thoughts completed vs. estimated total
        // 2. Average alignment score
        // 3. Coverage of prompt goals
        // Get the latest thought to determine current progress
        const latestThought = thoughts.reduce((latest, current) => current.thoughtNumber > latest.thoughtNumber ? current : latest, thoughts[0]);
        // Calculate progress percentage based on thought numbers
        const thoughtProgress = Math.min(100, (latestThought.thoughtNumber / latestThought.totalThoughts) * 100);
        // Calculate average alignment score (0-10)
        const alignmentScores = thoughts
            .filter(t => t.promptAlignment !== undefined)
            .map(t => t.promptAlignment);
        const avgAlignment = alignmentScores.length > 0
            ? alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length
            : 5; // Default to middle if no alignment data
        // Calculate goal coverage (percentage of goals with at least one relevant thought)
        const goalCoverage = promptMetadata.goals.map((_, index) => {
            const hasRelevantThought = thoughts.some(t => t.promptRelevance &&
                t.promptRelevance[`goal_${index}`] !== undefined &&
                t.promptRelevance[`goal_${index}`] > 0.5);
            return hasRelevantThought ? 1 : 0;
        }).reduce((sum, covered) => sum + covered, 0) / promptMetadata.goals.length * 100;
        // Calculate phase progress (weight later phases more heavily)
        const phaseWeights = {
            'Planning': 0.1,
            'Analysis': 0.3,
            'Execution': 0.5,
            'Verification': 0.9
        };
        const latestPhase = latestThought.phase || 'Execution';
        const phaseProgress = (phaseWeights[latestPhase] || 0.5) * 100;
        // Combine all factors with weights
        const weightedProgress = (thoughtProgress * 0.3) +
            (avgAlignment * 10 * 0.3) +
            (goalCoverage * 0.3) +
            (phaseProgress * 0.1);
        return Math.round(weightedProgress);
    }
    estimateCompletion(thoughts, promptMetadata) {
        // Get the latest thought
        const latestThought = thoughts.reduce((latest, current) => current.thoughtNumber > latest.thoughtNumber ? current : latest, thoughts[0]);
        // Calculate overall progress
        const progress = this.calculateOverallProgress(thoughts, promptMetadata);
        // If progress is very low, estimate based on complexity
        if (progress < 10) {
            return promptMetadata.complexity === 'simple' ? 5 :
                promptMetadata.complexity === 'medium' ? 8 : 12;
        }
        // Estimate remaining thoughts based on current progress and total thoughts
        const estimatedTotal = Math.ceil((latestThought.thoughtNumber * 100) / progress);
        const remainingThoughts = estimatedTotal - latestThought.thoughtNumber;
        return remainingThoughts;
    }
}
