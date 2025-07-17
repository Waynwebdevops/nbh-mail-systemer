"use client";

import { useState } from "react";

export default function EmailTest() {
  const [msg, setMsg] = useState("");

  const handleSend = async () => {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "hountonmarcowen@gmail.com",
        subject: "Test depuis le site",
        text: "Message de test",
        html: "<h3>Hello !</h3><p>Test Next.js Nodemailer</p>"
      }),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div className="bg-red-100 p-4 rounded-lg shadow-md">
      <button onClick={handleSend}>Envoyer un email de test</button>
      <p>{msg}</p>
    </div>
  );
}
