module.exports = {
    preset: 'ts-jest',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: [
        '<rootDir>/packages/',
        '<rootDir>/utils/',
        '<rootDir>/.storybook/',
    ],
    coverageReporters: ['lcov', 'text'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    coveragePathIgnorePatterns: [
        '<rootDir>/packages/',
        '<rootDir>/utils/',
        '<rootDir>/.storybook/',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.ts',
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
};
