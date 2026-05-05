async function testCors() {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:5177",
        "Access-Control-Request-Method": "POST"
      }
    });
    
    console.log("Status:", res.status);
    console.log("Headers:");
    for (const [key, value] of res.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

testCors();
