"use client"
import { useState } from "react";

const AddIp = () => {
  const [ip, setIp] = useState("");
  const [name, setName] = useState("");
  const [table, setTable] = useState("tabqa");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ip || !name) {
      setErrorMessage("الـ IP والاسم مطلوبان.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/${table}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip, name }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      alert("تمت إضافة البيانات بنجاح");
      setIp("");
      setName("");
      setTable("tabqa");
    } catch (err) {
      setErrorMessage(err.message || "حدث خطأ أثناء إضافة البيانات.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
      <h1>إضافة IP إلى قاعدة البيانات</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="ip">أدخل الـ IP:</label>
          <input
            type="text"
            id="ip"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="أدخل IP"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">أدخل الاسم:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل الاسم"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="table">اختر الجدول:</label>
          <select
            id="table"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="tabqa">tabqa</option>
            <option value="rqaa">rqaa</option>
            <option value="kobani">kobani</option>
          </select>
        </div>

        <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          إضافة البيانات
        </button>
      </form>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AddIp;
