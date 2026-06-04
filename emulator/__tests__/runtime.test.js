const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const indexPath = path.resolve(__dirname, "..", "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const runtimeStart = html.indexOf(
  "(function (global) {",
  html.indexOf("/* --- CEmu Runtime --- */"),
);
const runtimeEnd = html.indexOf("/* --- CEmu App Logic --- */");

assert.ok(runtimeStart >= 0 && runtimeEnd > runtimeStart, "CEmu Runtime source should exist");

global.window = global;
vm.runInThisContext(html.slice(runtimeStart, runtimeEnd), { filename: indexPath });

const check = (code) => global.CEmuRuntime.syntaxCheck(code, { mode: "run" });

const validFixedArray = check(`
#include <stdio.h>
int main(void) {
  int R[5] = {5, 10, 15, 20, 25};
  printf("%d\\n", R[0]);
  return 0;
}`);
assert.equal(validFixedArray.ok, true, validFixedArray.errors.join("\n"));

const validVla = check(`
#include <stdio.h>
int main(void) {
  int count = 5;
  int R[count];
  R[0] = 5;
  return 0;
}`);
assert.equal(validVla.ok, true, validVla.errors.join("\n"));

const validArrayParameter = check(`
#include <stdio.h>
int first(int values[3]) {
  return values[0];
}
int main(void) {
  int values[3] = {1, 2, 3};
  return first(values);
}`);
assert.equal(validArrayParameter.ok, true, validArrayParameter.errors.join("\n"));

const validPointerIndex = check(`
#include <stdio.h>
int first(int* values) {
  return values[0];
}
int main(void) {
  int values[3] = {1, 2, 3};
  return first(values);
}`);
assert.equal(validPointerIndex.ok, true, validPointerIndex.errors.join("\n"));

const doubleArraySize = check(`
#include <stdio.h>
int main(void) {
  const double V = 5.0;
  int R[V] = {5, 10, 15, 20, 25};
  return 0;
}`);
assert.equal(doubleArraySize.ok, false);
assert.ok(doubleArraySize.errors.some((message) => message.includes("V は double 型")));

const undeclaredArray = check(`
#include <stdio.h>
int main(void) {
  double I[5];
  if (i[0] > 0.0) {
    printf("WARN\\n");
  }
  return 0;
}`);
assert.equal(undeclaredArray.ok, false);
assert.ok(undeclaredArray.errors.some((message) => message.includes("i は配列またはポインタ")));

const validFunctionParameters = check(`
#include <stdio.h>
double current(double V, double R) {
  return V / R;
}
int main(void) {
  printf("%.2f\\n", current(5, 10));
  return 0;
}`);
assert.equal(validFunctionParameters.ok, true, validFunctionParameters.errors.join("\n"));

const wrongParameterCase = check(`
#include <stdio.h>
double current(double V, double R) {
  return v / R;
}
int main(void) {
  printf("%.2f\\n", current(5, 10));
  return 0;
}`);
assert.equal(wrongParameterCase.ok, false);
assert.ok(wrongParameterCase.errors.some((message) => message.includes("v は宣言されていません")));

console.log("CEmu Runtime semantic tests passed");
