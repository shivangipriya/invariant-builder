'use strict';
// Tests the invariant pipeline: signal detection, generation shape and IDs,
// contradiction spotting on an antonym pair, and coverage notes.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
// The logic lives in a strict IIFE; the DOM block inside is guarded by a
// typeof document check, so evaluating it in Node is safe. Make the IIFE
// return IB and evaluate it as an expression.
const inner = script.trim().replace(/\}\)\(\);\s*$/, ' return IB;\n})()');
const IB = new Function('return (' + inner + ');')();

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('ok   ' + name); }
  else { fail++; console.log('FAIL ' + name); }
}

const parsed = IB.parse('Users upload invoices and pay them. Admins can refund payments and export reports.');
check('money terms are detected as signals', Array.isArray(parsed.signals.money) && parsed.signals.money.indexOf('invoices') !== -1);
check('upload terms are detected as signals', Array.isArray(parsed.signals.upload) && parsed.signals.upload.indexOf('upload') !== -1);
check('permission terms are detected as signals', Array.isArray(parsed.signals.permission) && parsed.signals.permission.indexOf('admins') !== -1);
check('money verbs are detected as signals', Array.isArray(parsed.signals.moneyVerbs) && parsed.signals.moneyVerbs.indexOf('refund') !== -1);
check('sentences are split', parsed.sentences.length === 2);

const quiet = IB.parse('The page shows a greeting.');
check('signal-free text yields no lexicon hits', Object.keys(quiet.signals).length === 0);

const inv = IB.generate(parsed);
check('generate returns invariants', Array.isArray(inv) && inv.length > 0);
check('invariant IDs are sequential from INV-1', inv[0].id === 'INV-1' && inv.every((v, i) => v.id === 'INV-' + (i + 1)));
check('every invariant carries statement, assumption, why and how', inv.every((v) => v.statement && v.assumption && v.why && v.how));
check('every invariant starts as unsure', inv.every((v) => v.keep === 'unsure'));
check('sourceType is triggered or general', inv.every((v) => v.sourceType === 'triggered' || v.sourceType === 'general'));
check('signal-rich text triggers at least one sourced invariant', inv.some((v) => v.sourceType === 'triggered'));

const contra = IB.contradictions(IB.parse('Users can delete their posts. Posts cannot be deleted.'));
check('antonym contradiction is spotted', contra.length >= 1 && contra[0].object && contra[0].a && contra[0].b);

const notes = IB.coverage(IB.parse('The system sends email alerts to users.'), []);
check('uncovered notification text earns a coverage note', Array.isArray(notes) && notes.some(function (n) { return /messages going out/.test(n); }));

const md = IB.toMarkdown('Checkout feature', inv.slice(0, 2));
check('markdown export names the feature and invariants', typeof md === 'string' && md.indexOf('INV-1') !== -1 && md.indexOf('Checkout feature') !== -1);

console.log('\n' + (pass + fail) + ' cases, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
