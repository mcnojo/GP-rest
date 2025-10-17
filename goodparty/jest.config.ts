import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

// had issues with the jest init start, below is gpt-ese
const config: Config = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

export default createJestConfig(config);