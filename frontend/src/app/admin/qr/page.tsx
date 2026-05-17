'use client';

import { useState } from 'react';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function QRScannerPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<string>('');

  const scan = async () => {
    const auth = getToken();
    if (!auth || !token) return;
    try {
      const res = await api.scanQR(auth, token);
      setResult(res.valid ? res.message || 'Success' : res.message || 'Invalid');
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Scan failed');
    }
  };

  return (
    <AdminLayoutShell title="QR Scanner">
      <div className="max-w-lg mx-auto surface-elevated rounded-lg p-8 text-center space-y-6">
        <p className="text-cream-muted text-sm">Scan reservation, check-in, loyalty, or event tickets</p>
        <input
          className="input-field font-mono text-center"
          placeholder="Paste QR token..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button onClick={scan} className="w-full">Verify & Scan</Button>
        {result && <p className="text-cyan font-medium">{result}</p>}
      </div>
    </AdminLayoutShell>
  );
}
