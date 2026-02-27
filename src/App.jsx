import React, { useState } from 'react';
import Login from './Login';
import DashboardCabeleireira from './DashboardCabeleireira';
import DashboardCliente from './DashboardCliente';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login'); // 'login', 'cabeleireira', 'cliente'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navegação temporária para testes */}
      <nav className="bg-rose-600 p-4 flex justify-center gap-4 text-white shadow-md">
        <button onClick={() => setTelaAtual('login')} className="hover:underline">Tela de Login</button>
        <button onClick={() => setTelaAtual('cabeleireira')} className="hover:underline">Visão Cabeleireira</button>
        <button onClick={() => setTelaAtual('cliente')} className="hover:underline">Visão Cliente</button>
      </nav>

      <main className="p-4 md:p-8">
        {telaAtual === 'login' && <Login />}
        {telaAtual === 'cabeleireira' && <DashboardCabeleireira />}
        {telaAtual === 'cliente' && <DashboardCliente />}
      </main>
    </div>
  );
}