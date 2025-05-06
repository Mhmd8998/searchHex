'use client';

import { useState } from 'react';

export default function Home() {
    const [ip, setIp] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const ipArray = ip.trim().split(/\s+/); // تحويل إلى array على أساس المسافات

            const res = await fetch('http://localhost:4000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ips: ipArray }), // نرسل مصفوفة
            });

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || 'حدث خطأ ما');
            }

            const data = await res.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h2>البحث عن IP</h2>
            <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="أدخل IP أو أكثر مفصولين بمسافة"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
            <button
                onClick={handleSearch}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
                بحث
            </button>

            {loading && <p>جاري البحث...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {results && results.length === 0 && <p>لا توجد نتائج.</p>}
            {results && results.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>وضع المسار:</h3>
                    {results.map((res, index) => (
                        <div key={index}>
                            <strong>{res.table}:</strong>
                            <ul>
                                {res.names.map((name, idx) => (
                                    <li key={idx}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
