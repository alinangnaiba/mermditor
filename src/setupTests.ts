// src/setupTests.ts
import { config } from '@vue/test-utils';

// Example: Global mocks or configurations
// config.global.mocks = {
//   $t: (key: string) => key, // Mock vue-i18n
// };

// Example: Mocking a global object (like a router)
// jest.mock('vue-router', () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//   }),
//   useRoute: () => ({
//     params: {},
//   }),
// }));

// Add any other global setup needed for your tests here.
// For example, if you use a state management library like Pinia,
// you might want to create a fresh store for each test.

console.log('Global test setup file loaded.');
