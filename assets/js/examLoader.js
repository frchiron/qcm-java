// examLoader.js - Dynamic exam discovery and loading system

class ExamLoader {
    constructor() {
        this.examFiles = [];
        this.examsData = {};
        this.categoryOrder = {
            'dev': { order: 1, icon: '🛠️', title: 'Développement & Test' },
            'heritage': { order: 2, icon: '🏗️', title: 'Héritage/Polymorphisme/Encapsulation/Overriding' },
            'collections': { order: 3, icon: '📊', title: 'Collections & Streams' }
        };
    }

    // Automatic discovery of JSON files in assets/data/
    async discoverExams() {
        // List of exam files to try loading (since we can't list directory in browser)
        const possibleExams = [
            'exam1.json',
            'exam5.json',
            'exam6.json',
            'exam7.json',
            'exam8.json',
            'exam9.json',
            'exam10.json',
            'exam11.json',
            'exam-12-heritage_and_co.json',
            'exam-13-heritage_and_co.json',
            'exam-14_streams_special_parallel.json'
        ];

        this.examFiles = [];
        this.examsData = {};

        const loadPromises = possibleExams.map(async (filename) => {
            try {
                const response = await fetch(`assets/data/${filename}`);
                if (response.ok) {
                    const examData = await response.json();
                    if (examData.metadata) {
                        this.examFiles.push(filename);
                        this.examsData[filename] = examData;
                        console.log(`✅ Loaded: ${filename}`, examData.metadata);
                    } else {
                        console.warn(`⚠️  ${filename} missing metadata, skipping`);
                    }
                } else {
                    console.log(`❌ Failed to load: ${filename} (${response.status})`);
                }
            } catch (error) {
                console.log(`❌ Error loading ${filename}:`, error.message);
            }
        });

        await Promise.all(loadPromises);

        console.log(`🎯 Successfully loaded ${this.examFiles.length} exams`);
        return this.examFiles;
    }

    // Group exams by category and sort them
    getExamsByCategory() {
        const categories = {};

        // Initialize categories
        Object.entries(this.categoryOrder).forEach(([key, config]) => {
            categories[key] = {
                ...config,
                exams: []
            };
        });

        // Group exams by category
        this.examFiles.forEach(filename => {
            const examData = this.examsData[filename];
            if (examData && examData.metadata) {
                const category = examData.metadata.category;
                if (categories[category]) {
                    categories[category].exams.push(examData.metadata);
                }
            }
        });

        // Sort exams within each category by examNumber
        Object.keys(categories).forEach(category => {
            categories[category].exams.sort((a, b) => {
                // Custom sorting: DEV first, then H1-H5, then C1-C5
                const getOrder = (examNumber) => {
                    if (examNumber === 'DEV') return 0;
                    if (examNumber.startsWith('H')) return 100 + parseInt(examNumber.substring(1));
                    if (examNumber.startsWith('C')) return 200 + parseInt(examNumber.substring(1));
                    return 1000;
                };
                return getOrder(a.examNumber) - getOrder(b.examNumber);
            });
        });

        return categories;
    }

    // Generate HTML for exam cards
    generateExamCardHTML(examMetadata) {
        return `
            <div class="exam-card compact">
                <div class="exam-header">
                    <div class="exam-title-group">
                        <span class="exam-number">${examMetadata.examNumber}</span>
                        <h4>${examMetadata.examName}</h4>
                    </div>
                </div>
                ${examMetadata.description ? `<p class="exam-desc">${examMetadata.description}</p>` : ''}
                <div class="exam-actions">
                    <a class="btn-mini" href="exam.html?exam=${examMetadata.id}&mode=exam">Examen</a>
                    <a class="btn-mini outline" href="exam.html?exam=${examMetadata.id}&mode=train">Entraînement</a>
                </div>
            </div>
        `;
    }

    // Generate HTML for a category section
    generateCategoryHTML(categoryKey, categoryData) {
        if (categoryData.exams.length === 0) {
            return ''; // Don't show empty categories
        }

        const examCardsHTML = categoryData.exams
            .map(exam => this.generateExamCardHTML(exam))
            .join('');

        return `
            <div class="category-section">
                <h2 class="category-title">${categoryData.icon} ${categoryData.title}</h2>
                <div class="exam-grid">
                    ${examCardsHTML}
                </div>
            </div>
        `;
    }

    // Generate complete exam categories HTML
    generateAllCategoriesHTML() {
        const categories = this.getExamsByCategory();

        const sortedCategories = Object.entries(categories)
            .sort(([, a], [, b]) => a.order - b.order);

        return sortedCategories
            .map(([key, data]) => this.generateCategoryHTML(key, data))
            .join('');
    }

    // Generate new exam mappings for progressManager compatibility
    generateExamMappings() {
        const mappings = {};
        this.examFiles.forEach(filename => {
            const examData = this.examsData[filename];
            if (examData && examData.metadata) {
                mappings[filename] = examData.metadata.examNumber;
            }
        });
        return mappings;
    }

    // Initialize the dynamic loading
    async init() {
        try {
            await this.discoverExams();
            return true;
        } catch (error) {
            console.error('Failed to initialize ExamLoader:', error);
            return false;
        }
    }
}

// Global instance
window.examLoader = new ExamLoader();