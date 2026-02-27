import React, { useState } from 'react';
import Login from './Login';
import DashboardCabelereira from './DashboardCabelereira';
import DashboardCliente from './DashboardCliente';

function App() {
  // Estado que controla qual tela está visível no momento
  const [telaAtual, setTelaAtual] = useState('login'); 

  // Função que será chamada quando o login for bem-sucedido
  const handleLogin = (tipoUsuario) => {
    setTelaAtual(tipoUsuario);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {telaAtual === 'login' && <Login onLogin={handleLogin} />}
      {telaAtual === 'cabelereira' && <DashboardCabelereira />}
      {telaAtual === 'cliente' && <DashboardCliente />}
    </div>
  );
}

export default App;