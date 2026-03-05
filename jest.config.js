/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'],
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          module: 'commonjs',
          target: 'ES2022',
          strict: true,
          esModuleInterop: true,
          jsx: 'react-jsx',
        },
      },
    ],
  },
};
