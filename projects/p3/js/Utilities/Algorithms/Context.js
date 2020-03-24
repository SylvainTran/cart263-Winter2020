class Context {
    constructor(strategy) {
        this.strategy = strategy;
    }

    operation() {
        return this.strategy.algorithm();
    }
}