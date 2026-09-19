/**
 * BHASHA Writing Session Test Setup & Reporting Harness
 */

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

export interface WritingScenarioLog {
  id: number;
  name: string;
  startState: string;
  action: string;
  expected: string;
  actual: string;
  friction: 'Zero' | 'Low' | 'Medium' | 'High';
  passed: boolean;
  notes?: string;
}

const scenarioLogs: WritingScenarioLog[] = [];

export function runWritingScenario(
  id: number,
  name: string,
  startState: string,
  action: string,
  expected: string,
  fn: () => { actual: string; friction: 'Zero' | 'Low' | 'Medium' | 'High'; notes?: string }
): void {
  const padId = String(id).padStart(2, '0');
  try {
    const { actual, friction, notes } = fn();
    scenarioLogs.push({
      id,
      name,
      startState,
      action,
      expected,
      actual,
      friction,
      passed: true,
      notes,
    });
    console.log(`[SCENARIO ${padId}] ${name}`);
    console.log(`  • START:    ${startState}`);
    console.log(`  • ACTION:   ${action}`);
    console.log(`  • EXPECTED: ${expected}`);
    console.log(`  • ACTUAL:   ${actual}`);
    console.log(`  • FRICTION: ${friction}`);
    console.log(`  • RESULT:   PASS\n`);
  } catch (err: any) {
    scenarioLogs.push({
      id,
      name,
      startState,
      action,
      expected,
      actual: err.message,
      friction: 'High',
      passed: false,
      notes: err.stack,
    });
    console.error(`❌ [SCENARIO ${padId}] ${name} FAILED:`, err.message);
    throw err;
  }
}

export function getScenarioLogs(): WritingScenarioLog[] {
  return scenarioLogs;
}
