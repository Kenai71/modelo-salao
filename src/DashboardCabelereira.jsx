import React, { useState } from 'react';

// RECEBENDO A FUNÇÃO onLogout AQUI
export default function DashboardCabeleireira({ onLogout }) {
  const [faturamento, setFaturamento] = useState(0);
  const [activeModal, setActiveModal] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(null);

  const [agendamentos, setAgendamentos] = useState([
    { id: 1, cliente: 'Ana Silva', data: '20/10/2026', hora: '14:00', servico: 'Corte e Escova', valor: 120, status: 'pendente' },
    { id: 2, cliente: 'Mariana Costa', data: '20/10/2026', hora: '15:30', servico: 'Coloração', valor: 250, status: 'pendente' },
    { id: 3, cliente: 'Cláudia Raia', data: '20/10/2026', hora: '16:45', servico: 'Hidratação', valor: 90, status: 'pendente' }
  ]);
  
  const historico = [
    { id: 1, cliente: 'Juliana Paes', data: '18/10/2026', valor: 150 },
    { id: 2, cliente: 'Bruna Marquezine', data: '19/10/2026', valor: 300 },
    { id: 3, cliente: 'Paolla Oliveira', data: '19/10/2026', valor: 80 },
    { id: 4, cliente: 'Larissa Manoela', data: '17/10/2026', valor: 450 },
  ];

  const faturamentoTotal = historico.reduce((acc, item) => acc + item.valor, 0);
  const diasComAgendamento = [15, 18, 20, 22, 25];

  const finalizarAtendimento = (id, valor, compareceu) => {
    setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: compareceu ? 'concluido' : 'faltou' } : ag));
    if (compareceu) setFaturamento(prev => prev + valor);
  };

  const openDayConfig = (day) => {
    setSelectedDate(day);
    setActiveModal('configDay');
  };

  const renderModalContent = () => {
    switch(activeModal) {
      case 'wallet':
        return (
          <div className="p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Histórico de Faturamento</h3>
            <div className="bg-rose-50 p-4 rounded-xl mb-4 border border-rose-100 flex justify-between items-center shadow-sm">
              <span className="text-xs md:text-sm font-bold text-rose-800 uppercase tracking-wider">Total Acumulado</span>
              <span className="text-xl md:text-2xl font-black text-rose-600">R$ {faturamentoTotal.toFixed(2)}</span>
            </div>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {historico.map(h => (
                <div key={h.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-bold text-gray-700 text-sm md:text-base">{h.cliente}</p>
                    <p className="text-xs text-gray-500">{h.data}</p>
                  </div>
                  <span className="font-bold text-green-600 text-sm md:text-base">R$ {h.valor.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'clock':
        return (
          <div className="p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Dias com Agendamentos</h3>
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
              {['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="font-bold text-gray-400 text-xs md:text-sm">{d}</div>)}
              {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                <div key={day} className="relative p-1 md:p-2 border border-transparent rounded-lg flex justify-center items-center h-8 w-8 md:h-10 md:w-10 mx-auto">
                  <span className="text-sm font-medium text-gray-700">{day}</span>
                  {diasComAgendamento.includes(day) && (
                    <span className="absolute bottom-0.5 md:bottom-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 border-b pb-2">Configurar Expediente</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-4">Selecione um dia para configurar horários ou folga.</p>
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
              {['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="font-bold text-gray-400 text-xs md:text-sm">{d}</div>)}
              {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                <div 
                  key={day} 
                  onClick={() => openDayConfig(day)}
                  className="p-1 md:p-2 border border-gray-100 rounded-lg hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 cursor-pointer flex justify-center items-center h-8 w-8 md:h-10 md:w-10 mx-auto transition-colors shadow-sm"
                >
                  <span className="text-sm font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'configDay':
        return (
          <div className="p-5 md:p-6 animate-fade-in">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Expediente - Dia {selectedDate}</h3>
            <div className="flex items-center gap-3 mb-6 p-3 md:p-4 bg-rose-50 rounded-xl border border-rose-100">
              <input type="checkbox" id="folga" className="w-5 h-5 accent-rose-500 cursor-pointer" />
              <label htmlFor="folga" className="font-semibold text-rose-800 text-sm md:text-base cursor-pointer select-none">Sem expediente (Folga)</label>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-600 mb-2">Abertura</label>
                <input type="time" className="w-full p-2.5 md:p-3 border border-gray-300 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-lg transition text-sm md:text-base" defaultValue="09:00" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-600 mb-2">Fechamento</label>
                <input type="time" className="w-full p-2.5 md:p-3 border border-gray-300 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-lg transition text-sm md:text-base" defaultValue="18:00" />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3">
              <button onClick={() => setActiveModal('calendar')} className="w-full sm:w-auto px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition text-sm md:text-base">Voltar</button>
              <button onClick={() => setActiveModal(null)} className="w-full sm:w-auto px-5 py-2.5 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition shadow-md text-sm md:text-base">Salvar</button>
            </div>
          </div>
        );
      case 'addUser':
        return (
          <div className="p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Novo Perfil</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                <input type="text" className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition text-sm md:text-base" placeholder="Ex: Ana Souza" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Email (Login)</label>
                <input type="email" className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition text-sm md:text-base" placeholder="ana@salao.com" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Senha Provisória</label>
                <input type="password" className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition text-sm md:text-base" placeholder="••••••••" />
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3">
              <button onClick={() => setActiveModal(null)} className="w-full sm:w-auto px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-bold transition text-sm md:text-base">Cancelar</button>
              <button onClick={() => setActiveModal(null)} className="w-full sm:w-auto px-5 py-2.5 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition shadow-md text-sm md:text-base">Criar Conta</button>
            </div>
          </div>
        );
      case 'changePassword':
        return (
          <div className="p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Segurança (Trocar Senha)</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Senha Atual</label>
                <input type="password" className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg outline-none focus:border-rose-500 transition text-sm md:text-base" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Nova Senha</label>
                <input type="password" className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg outline-none focus:border-rose-500 transition text-sm md:text-base" placeholder="Nova senha segura" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Confirmar Nova Senha</label>
                <input type="password" className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg outline-none focus:border-rose-500 transition text-sm md:text-base" placeholder="Repita a nova senha" />
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3">
              <button onClick={() => setActiveModal(null)} className="w-full sm:w-auto px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-bold transition text-sm md:text-base">Cancelar</button>
              <button onClick={() => setActiveModal(null)} className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition shadow-md text-sm md:text-base">Atualizar Senha</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans w-full relative">
      
      {/* Sidebar Lateral FIXA */}
      <aside className="fixed left-0 top-0 bottom-0 w-[70px] md:w-20 bg-white border-r border-gray-200 flex flex-col items-center pt-6 pb-6 gap-4 md:gap-6 shadow-sm z-20">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg md:text-xl mb-2 md:mb-4 shrink-0">
          SC
        </div>
        
        <nav className="flex flex-col gap-3 md:gap-4 flex-1 w-full px-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => setActiveModal(null)} className="w-full flex justify-center p-2.5 md:p-3 text-rose-600 bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Início</span>
          </button>

          <button onClick={() => setActiveModal('wallet')} className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Faturamento</span>
          </button>

          <button onClick={() => setActiveModal('clock')} className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Dias Agendados</span>
          </button>

          <button onClick={() => setActiveModal('calendar')} className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Configurar Expediente</span>
          </button>
          
          <div className="flex-1"></div>

          <button onClick={() => setActiveModal('addUser')} className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Adicionar Perfil</span>
          </button>

          <button onClick={() => setActiveModal('changePassword')} className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Trocar Senha</span>
          </button>

          {/* AQUI ESTÁ A MÁGICA DO BOTÃO DE SAIR - Chama a função onLogout */}
          <button 
            onClick={onLogout} 
            className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition group relative mb-4 md:mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Sair da Conta</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-[70px] md:ml-20 p-4 md:p-10 w-full min-h-screen">
        <div className="max-w-4xl mx-auto pb-6">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Painel da Profissional</h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">Acompanhe seus agendamentos e faturamento.</p>
            </div>
            
            <div 
              onClick={() => setActiveModal('wallet')}
              className="bg-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4 w-full md:w-auto cursor-pointer hover:shadow-md hover:border-rose-200 transition"
              title="Clique para ver o histórico"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">Faturamento Hoje</p>
                <p className="text-xl md:text-2xl font-black text-gray-800">R$ {faturamento.toFixed(2)}</p>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendamentos do Dia
              </h2>
              <span className="bg-rose-100 text-rose-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                {agendamentos.length} clientes
              </span>
            </div>
            
            <div className="divide-y divide-gray-50">
              {agendamentos.map((ag) => (
                <div key={ag.id} className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/80 transition duration-200">
                  <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-50 text-rose-600 rounded-xl flex flex-col items-center justify-center font-bold border border-rose-100 shrink-0">
                      <span className="text-xs md:text-sm">{ag.hora.split(':')[0]}</span>
                      <span className="text-[10px] md:text-xs -mt-1 opacity-70">{ag.hora.split(':')[1]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-base md:text-lg leading-tight">{ag.cliente}</p>
                      <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">{ag.servico} <span className="text-gray-300 mx-1">•</span> <span className="text-green-600 font-bold">R$ {ag.valor}</span></p>
                    </div>
                  </div>
                  
                  {ag.status === 'pendente' ? (
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                      <button 
                        onClick={() => finalizarAtendimento(ag.id, ag.valor, true)}
                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm shrink-0"
                        title="Compareceu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <button 
                        onClick={() => finalizarAtendimento(ag.id, ag.valor, false)}
                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white text-red-500 rounded-lg hover:bg-red-50 transition border border-red-200 shrink-0"
                        title="Faltou"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className={`w-full sm:w-auto justify-center px-3 md:px-4 py-2.5 md:py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 ${ag.status === 'concluido' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {ag.status === 'concluido' ? '✓ Finalizado' : '✕ Faltou'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {activeModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-md relative scale-100 transition-transform max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-400 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition bg-white z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}