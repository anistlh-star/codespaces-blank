// practice-loops.js

console.log("=== LOOP PRACTICE LAB ===\n");

// 1. Simple Array (most common)
console.log("1. Array with for...of");
const products = ["Headphones", "Laptop", "Smartwatch", "Earbuds"];

for (const item of products) {
  console.log("→", item);
}

// 2. Object (keys, values, entries)
console.log("\n2. Object with for...of");
const product = { name: "Sony WH-1000XM6", price: 398, category: "Audio" };

console.log("Keys:");
for (const key of Object.keys(product)) {
  console.log("→", key);
}

console.log("Values:");
for (const value of Object.values(product)) {
  console.log("→", value);
}

console.log("Entries (key + value):");
for (const [key, value] of Object.entries(product)) {
  console.log(`→ ${key} = ${value}`);
}

// 3. Array of Objects (very common in MERN)
console.log("\n3. Array of Objects");
const productsList = [
  { id: 1, name: "Headphones", price: 398 },
  { id: 2, name: "Laptop", price: 1200 },
  { id: 3, name: "Watch", price: 299 }
];

for (const p of productsList) {
  console.log(`→ ${p.name} - $${p.price}`);
}

// 4. Simple Async (Promises) - for await...of
console.log("\n4. Async Promises with for await...of");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const asyncNumbers = [
  delay(300).then(() => "Chunk 1"),
  delay(600).then(() => "Chunk 2"),
  delay(400).then(() => "Chunk 3")
];

for await (const chunk of asyncNumbers) {
  console.log("Received async:", chunk);
}

// 5. Custom Async Iterable (closest to AI streaming)
console.log("\n5. Custom Async Iterable (simulates AI chunks)");
async function* fakeAIStream() {
  yield "Escape into ";
  await delay(200);
  yield "Pure Sound. ";
  await delay(300);
  yield "Immerse yourself ";
  await delay(250);
  yield "in uninterrupted listening.";
}

for await (const word of fakeAIStream()) {
  process.stdout.write(word);   // prints live (typing effect)
}
console.log("\n← End of fake stream\n");

// 6. Real Groq Streaming (the exact code we use)
console.log("6. Real Groq Streaming (copy this into aiService.js later)");

// Uncomment this only after your Groq setup is working
/*
const stream = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: "Say hello in 4 short sentences" }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  if (content) {
    process.stdout.write(content);        // see live typing
    // res.write(`data: ${JSON.stringify({ content })}\n\n`);  // for frontend
  }
}
console.log("\n← Real streaming done");
*/

console.log("\n=== PRACTICE COMPLETE ===");