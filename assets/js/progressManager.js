class ProgressManager {
    constructor() {
        this.storageKey = 'qcm-java-progress';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                userProgress: {},
                globalStats: {
                    totalExamsCompleted: 0,
                    totalExamsAttempted: 0,
                    averageScore: 0,
                    totalStudyTime: 0,
                    bestScore: 0,
                    lastActivity: null
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    saveExamResult(examId, score, totalQuestions, timeSpent, mode = 'exam') {
        const data = this.getData();
        const percentage = Math.round((score / totalQuestions) * 100);
        const now = new Date().toISOString();

        // Initialiser les données de l'examen si nécessaire
        if (!data.userProgress[examId]) {
            data.userProgress[examId] = {
                attempts: 0,
                bestScore: 0,
                bestPercentage: 0,
                lastScore: 0,
                lastPercentage: 0,
                lastAttempt: null,
                totalTimeSpent: 0,
                status: 'new',
                mode: mode,
                completed: false,
                allScores: [], // Nouveau: stocker tous les scores
                averagePercentage: 0 // Nouveau: moyenne des pourcentages
            };
        }

        const examProgress = data.userProgress[examId];

        // Mettre à jour les données de l'examen
        examProgress.attempts += 1;
        examProgress.lastScore = score;
        examProgress.lastPercentage = percentage;
        examProgress.lastAttempt = now;
        examProgress.totalTimeSpent += timeSpent;
        examProgress.mode = mode;

        // Ajouter le nouveau score à la liste
        examProgress.allScores.push({
            score: score,
            percentage: percentage,
            date: now,
            timeSpent: timeSpent
        });

        // Calculer la moyenne des pourcentages
        const totalPercentage = examProgress.allScores.reduce((sum, attempt) => sum + attempt.percentage, 0);
        examProgress.averagePercentage = Math.round(totalPercentage / examProgress.allScores.length);

        // Mettre à jour le meilleur score
        if (percentage > examProgress.bestPercentage) {
            examProgress.bestScore = score;
            examProgress.bestPercentage = percentage;
        }

        // Déterminer le statut
        if (percentage >= 80) {
            examProgress.status = 'passed';
            examProgress.completed = true;
        } else if (examProgress.attempts >= 2) {
            examProgress.status = 'needs-review';
        } else {
            examProgress.status = 'in-progress';
        }

        // Mettre à jour les statistiques globales
        this.updateGlobalStats(data);

        this.saveData(data);
        return examProgress;
    }

    updateGlobalStats(data) {
        const progress = data.userProgress;
        const examIds = Object.keys(progress);

        if (examIds.length === 0) return;

        let totalCompleted = 0;
        let totalScore = 0;
        let totalTime = 0;
        let bestScore = 0;
        let totalAttempted = 0;

        examIds.forEach(examId => {
            const exam = progress[examId];
            totalAttempted++;
            totalTime += exam.totalTimeSpent;

            if (exam.completed) {
                totalCompleted++;
            }

            if (exam.bestPercentage > 0) {
                totalScore += exam.bestPercentage;
            }

            if (exam.bestPercentage > bestScore) {
                bestScore = exam.bestPercentage;
            }
        });

        data.globalStats = {
            totalExamsCompleted: totalCompleted,
            totalExamsAttempted: totalAttempted,
            averageScore: totalAttempted > 0 ? Math.round(totalScore / totalAttempted) : 0,
            totalStudyTime: totalTime,
            bestScore: bestScore,
            lastActivity: new Date().toISOString()
        };
    }

    getExamProgress(examId) {
        const data = this.getData();
        const progress = data.userProgress[examId];

        // Migration des anciennes données
        if (progress && !progress.allScores) {
            progress.allScores = [];
            progress.averagePercentage = progress.bestPercentage || 0;
            this.saveData(data);
        }

        return progress || null;
    }

    getAllExamProgress() {
        const data = this.getData();
        return data.userProgress;
    }

    getGlobalStats() {
        const data = this.getData();
        return data.globalStats;
    }

    getExamStatus(examId) {
        const progress = this.getExamProgress(examId);
        if (!progress) return 'new';
        return progress.status;
    }

    getExamBadgeInfo(examId) {
        const progress = this.getExamProgress(examId);

        if (!progress) {
            return {
                status: 'new',
                badge: '⚪',
                text: 'Nouveau',
                color: '#94a3b8',
                score: null
            };
        }

        const statusMap = {
            'passed': {
                badge: '✅',
                text: 'Réussi',
                color: '#10b981'
            },
            'needs-review': {
                badge: '🔄',
                text: 'À revoir',
                color: '#f59e0b'
            },
            'in-progress': {
                badge: '🟡',
                text: 'En cours',
                color: '#eab308'
            },
            'new': {
                badge: '⚪',
                text: 'Nouveau',
                color: '#94a3b8'
            }
        };

        const statusInfo = statusMap[progress.status] || statusMap['new'];

        return {
            status: progress.status,
            badge: statusInfo.badge,
            text: statusInfo.text,
            color: statusInfo.color,
            bestScore: progress.bestPercentage,
            averageScore: progress.averagePercentage || 0,
            attempts: progress.attempts,
            lastAttempt: progress.lastAttempt
        };
    }

    // Utilitaire pour formater le temps
    formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
        return `${Math.round(seconds / 3600)}h`;
    }

    // Reset complet de toutes les données
    resetAllProgress() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
        return true;
    }

    // Reset d'un examen spécifique
    resetExamProgress(examId) {
        const data = this.getData();

        if (data.userProgress[examId]) {
            delete data.userProgress[examId];

            // Recalculer les statistiques globales
            this.updateGlobalStats(data);
            this.saveData(data);
            return true;
        }
        return false;
    }

    // Obtenir le nombre total d'examens avec progression
    getTotalExamsWithProgress() {
        const data = this.getData();
        return Object.keys(data.userProgress).length;
    }

    // Reset des données (pour debug - gardé pour compatibilité)
    resetProgress() {
        return this.resetAllProgress();
    }
}

// Instance globale
const progressManager = new ProgressManager();