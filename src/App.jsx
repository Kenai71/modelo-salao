import React, { useState } from 'react';
import Login from './Login';
import DashboardCabeleireira from './DashboardCabelereira';
import DashboardCliente from './DashboardCliente';

export default function App() {
  // Inicializa o estado lendo do localStorage. 
  // Assim, se recarregar a página, ele lembra quem estava logado.
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  // Função para fazer login e salvar no navegador
  const handleLogin = (role) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
  };

  // Função para sair e limpar o navegador
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Se não tem ninguém logado, mostra o Login */}
      {!userRole && <Login onLogin={handleLogin} />}
      
      {/* Se logou como cabeleireira, mostra o painel dela */}
      {userRole === 'cabeleireira' && <DashboardCabeleireira onLogout={handleLogout} />}
      
      {/* Se logou como cliente, mostra o painel do cliente */}
      {userRole === 'cliente' && <DashboardCliente onLogout={handleLogout} />}
    </div>
  );
}