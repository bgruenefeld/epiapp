class EpilepsyRiskCalculator {
    private riskScores: Map<string, number> = new Map();
    private pedigreeCount: number = 0;

    addPedigree(pedigree: string[][]): void {
        this.pedigreeCount += 1;
        pedigree.forEach((generation, genIdx) => {
            const weight = 1 / (2 ** genIdx);
            generation.forEach(dog => {
                this.riskScores.set(dog, (this.riskScores.get(dog) || 0) + weight);
            });
        });
    }

    normalizeRisk(): void {
        if (this.pedigreeCount === 0) return;
        const maxRisk = Math.max(...Array.from(this.riskScores.values()));
        this.riskScores.forEach((value, key) => {
            this.riskScores.set(key, value / maxRisk);
        });
    }

    evaluateNewPedigree(newPedigree: string[][]): Map<string, number> {
        const newRisk = new Map<string, number>();
        newPedigree.forEach((generation, genIdx) => {
            const weight = 1 / (2 ** genIdx);
            generation.forEach(dog => {
                if (this.riskScores.has(dog)) {
                    newRisk.set(dog, (this.riskScores.get(dog) || 0) * weight);
                }
            });
        });
        return newRisk;
    }
}

export default EpilepsyRiskCalculator;
