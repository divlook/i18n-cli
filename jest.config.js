// @ts-check

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/'],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}

export default config
