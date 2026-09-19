/**
 * BHASHA Phase 12 Writing Session Master Test Runner
 * Executes all Phase 12 Real-World Writing Scenarios (50 Scenarios)
 * and End-to-End Session Workflows (6 Workflows).
 */

import { spawnSync } from 'child_process';
import path from 'path';

const suites = [
  'writing-scenarios.test.ts',
  'session-workflows.test.ts',
];

console.log('================================================================');
console.log('🚀 BHASHA PHASE 12: MASTER WRITING SESSION & WORKFLOW TEST RUNNER');
console.log('================================================================\n');

const projectRoot = path.resolve(__dirname, '..', '..', '..');
let totalSuites = suites.length;
let passedSuites = 0;
let failedSuites: string[] = [];

for (const suite of suites) {
  const relPath = path.join('src', 'tests', 'writing-session', suite);
  console.log(`▶ Running Suite: ${suite}...\n`);
  const res = spawnSync('npx', ['tsx', relPath], {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: true,
  });

  if (res.status === 0) {
    passedSuites++;
  } else {
    failedSuites.push(suite);
    console.error(`\n❌ Suite Failed: ${suite}\n`);
  }
}

console.log('\n================================================================');
console.log(`📊 PHASE 12 SUMMARY: ${passedSuites}/${totalSuites} TEST SUITES PASSED`);
if (failedSuites.length > 0) {
  console.error(`❌ FAILED SUITES: ${failedSuites.join(', ')}`);
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 12 WRITING SESSION & WORKFLOW SUITES PASSED FLAWLESSLY!');
  console.log('================================================================\n');
}
