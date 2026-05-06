
async function getHash(pw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pw);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const pws = ["aB7xR9m2", "kP4tW5nQ", "vE2sY8zG", "hJ9cM6dL"];
pws.forEach(async (pw, i) => {
    console.log(`Kadai ${i+1}: ${await getHash(pw)}`);
});
