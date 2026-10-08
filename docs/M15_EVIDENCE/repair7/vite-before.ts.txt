import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()], test: { include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'casino-tests/**/*.test.ts', 'casino-tests/**/*.test.tsx'], setupFiles: ['tests/harness/ra1InventorySetup.ts'], maxWorkers: 4 } });
