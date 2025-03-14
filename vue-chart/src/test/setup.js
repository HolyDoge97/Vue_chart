import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/vue';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// 각 테스트 완료 후 자동 정리
afterEach(() => {
  cleanup();
});