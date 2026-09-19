/**
 * BHASHA Phase 11 Reliability Master Test Runner
 * Executes all Phase 11 Data Integrity, Migration, Import Safety,
 * Stress Scaling, and Real-World Scenario test suites.
 */

import { spawnSync } from 'child_process';
import path from 'path';

const testSuites = [
  'integrity.test.ts',
  'migration.test.ts',
  'import-safety.test.ts',
  'export-roundtrip.test.ts',
  'duplication.test.ts',
  'version-integrity.test.ts',
  'deletion-safety.test.ts',
  'search-consistency.test.ts',
  'corruption-recovery.test.ts',
  'timestamp.test.ts',
  'stress.test.ts',
  'long-session.test.ts',
  'scenarios.test.ts',
];

console.log('================================================================');
console.log('🚀 BHASHA PHASE 11: MASTER RELIABILITY & STRESS TEST RUNNER');
console.log('================================================================\n');

const projectRoot = path.resolve(__dirname, '..', '..', '..');
let totalSuites = testSuites.length;
let passedSuites = 0;
let failedSuites: string[] = [];

for (const suite of testSuites) {
  const relPath = path.join('src', 'tests', 'reliability', suite);
  console.log(`▶ Running Suite: ${suite}...`);
  const res = spawnSync('npx', ['tsx', relPath], {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: true,
  });

  if (res.status === 0) {
    passedSuites++;
  } else {
    failedSuites.push(suite);
    console.error(`❌ Suite Failed: ${suite}`);
  }
}

console.log('\n================================================================');
console.log(`📊 RELIABILITY SUITES SUMMARY: ${passedSuites}/${totalSuites} PASSED`);
if (failedSuites.length > 0) {
  console.error(`❌ FAILED SUITES: ${failedSuites.join(', ')}`);
  process.exit(1);
} else {
  console.log('🎉 ALL 13 RELIABILITY & STRESS TEST SUITES PASSED FLAWLESSLY!');
  console.log('================================================================\n');
}
