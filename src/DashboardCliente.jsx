import React, { useState, useEffect } from 'react';

export default function DashboardCliente({ onLogout }) {
  // Estados do Agendamento
  const [selectedProfissional, setSelectedProfissional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  
  // Controle de Serviços (Formato: { id_do_servico: quantidade })
  const [servicosSelecionados, setServicosSelecionados] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- DADOS MOCKADOS (Simulando banco de dados) ---
  const profissionais = [
    { id: 1, nome: 'Juliana', especialidade: 'Cachos', sigla: 'JU' },
    { id: 2, nome: 'Camila', especialidade: 'Colorimetria', sigla: 'CA' },
    { id: 3, nome: 'Amanda', especialidade: 'Corte e Escova', sigla: 'AM' },
  ];

  const listaServicos = [
    { id: 1, nome: 'Corte Feminino', preco: 80 },
    { id: 2, nome: 'Coloração Completa', preco: 250 },
    { id: 3, nome: 'Escova Modeladora', preco: 60 },
    { id: 4, nome: 'Hidratação Profunda', preco: 90 },
  ];

  const diasSemExpediente = [10, 15, 22, 23]; // Dias vermelhos (Fechado)
  const horariosOcupados = ['10:00', '14:00', '16:00']; // Horários vermelhos (Reservados)
  const todosHorarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  // Pegar dia e hora atuais reais para a regra de 3 horas
  const dataAtual = new Date();
  const diaAtual = dataAtual.getDate();
  const horaAtual = dataAtual.getHours();

  // --- LÓGICAS DE NEGÓCIO ---

  // Lida com o +/- dos serviços
  const alterarQuantidade = (idServico, delta) => {
    setServicosSelecionados(prev => {
      const quantidadeAtual = prev[idServico] || 0;
      let novaQuantidade = quantidadeAtual + delta;
      
      // Regra: Máximo de 1 e Mínimo de 0
      if (novaQuantidade > 1) novaQuantidade = 1;
      if (novaQuantidade < 0) novaQuantidade = 0;

      return { ...prev, [idServico]: novaQuantidade };
    });
  };

  // Calcula Faturamento (Total a Pagar)
  const totalAPagar = listaServicos.reduce((total, servico) => {
    const qtd = servicosSelecionados[servico.id] || 0;
    return total + (servico.preco * qtd);
  }, 0);

  // Verifica se o horário está bloqueado (Regra das 3h ou já ocupado)
  const isHorarioBloqueado = (horaStr) => {
    if (horariosOcupados.includes(horaStr)) return true;
    
    // Se selecionou o dia de hoje, aplica regra de 3h de antecedência
    if (selectedDate === diaAtual) {
      const horaAgendamento = parseInt(horaStr.split(':')[0], 10);
      if (horaAgendamento <= (horaAtual + 3)) return true;
    }
    
    // Se for um dia no passado, bloqueia tudo
    if (selectedDate < diaAtual) return true;

    return false;
  };

  // Ações dos Botões Finais
  const handleCancelar = () => {
    setSelectedProfissional(null);
    setSelectedDate(null);
    setSelectedHorario(null);
    setServicosSelecionados({});
  };

  const handleConfirmar = () => {
    if (!selectedProfissional || !selectedDate || !selectedHorario || totalAPagar === 0) {
      alert("Por favor, preencha todos os campos e selecione ao menos um serviço.");
      return;
    }
    setIsSuccessModalOpen(true);
  };

  const fecharSucesso = () => {
    setIsSuccessModalOpen(false);
    handleCancelar(); // Reseta o form após agendar
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans w-full relative">
      
      {/* Sidebar Lateral FIXA (Estética idêntica à da Profissional) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[70px] md:w-20 bg-white border-r border-gray-200 flex flex-col items-center pt-6 pb-6 gap-4 md:gap-6 shadow-sm z-20">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg md:text-xl mb-2 md:mb-4 shrink-0">
          CL
        </div>
        
        <nav className="flex flex-col gap-3 md:gap-4 flex-1 w-full px-2 overflow-y-auto custom-scrollbar">
          {/* Agendar (Home) */}
          <button className="w-full flex justify-center p-2.5 md:p-3 text-rose-600 bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Novo Agendamento</span>
          </button>

          {/* Meus Agendamentos */}
          <button className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Meus Agendamentos</span>
          </button>

          <div className="flex-1"></div>

          {/* Sair */}
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

      {/* Área Principal */}
      <main className="flex-1 ml-[70px] md:ml-20 p-4 md:p-10 w-full min-h-screen">
        <div className="max-w-3xl mx-auto pb-10">
          
          {/* Cabeçalho */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Agendar Horário</h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">Siga os passos para reservar seu atendimento.</p>
            </div>
            
            {/* Card de Faturamento (Total a pagar) */}
            <div className="bg-white px-5 py-3 md:py-4 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-4 w-full md:w-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">Total do Serviço</p>
                <p className="text-xl md:text-2xl font-black text-rose-600">R$ {totalAPagar.toFixed(2)}</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            
            {/* Passo 1: Profissionais */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Escolha a Profissional
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {profissionais.map(prof => (
                  <div 
                    key={prof.id}
                    onClick={() => { setSelectedProfissional(prof.id); setSelectedDate(null); setSelectedHorario(null); }}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-center gap-3
                      ${selectedProfissional === prof.id ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-rose-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                      ${selectedProfissional === prof.id ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {prof.sigla}
                    </div>
                    <div>
                      <p className={`font-bold ${selectedProfissional === prof.id ? 'text-rose-800' : 'text-gray-700'}`}>{prof.nome}</p>
                      <p className="text-xs text-gray-500">{prof.especialidade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Passo 2: Calendário (Fica cinza se não escolher profissional) */}
            <div className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 transition-opacity duration-300 ${!selectedProfissional ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Escolha a Data
              </h2>
              <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                {['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="font-bold text-gray-400 text-xs md:text-sm py-2">{d}</div>)}
                {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                  const isFolga = diasSemExpediente.includes(day);
                  const isSelected = selectedDate === day;
                  const isPassado = day < diaAtual; // Não deixa agendar dias que já passaram no mês
                  
                  return (
                    <button 
                      key={day} 
                      disabled={isFolga || isPassado}
                      onClick={() => { setSelectedDate(day); setSelectedHorario(null); }}
                      className={`
                        relative h-10 rounded-lg flex justify-center items-center text-sm font-medium transition
                        ${isFolga || isPassado ? 'bg-red-50 text-red-400 cursor-not-allowed line-through border border-red-100' : ''}
                        ${!isFolga && !isPassado && !isSelected ? 'hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-200 cursor-pointer text-gray-700' : ''}
                        ${isSelected ? 'bg-rose-500 text-white shadow-md' : ''}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passo 3 e 4: Serviços e Horários (Só aparecem após escolher a data) */}
            {selectedDate && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                
                {/* Serviços */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                    Serviços
                  </h2>
                  <div className="space-y-3">
                    {listaServicos.map(servico => {
                      const qtd = servicosSelecionados[servico.id] || 0;
                      return (
                        <div key={servico.id} className={`flex items-center justify-between p-3 rounded-xl border transition ${qtd > 0 ? 'border-rose-300 bg-rose-50/50' : 'border-gray-100'}`}>
                          <div>
                            <p className="font-bold text-gray-700 text-sm">{servico.nome}</p>
                            <p className="text-xs font-bold text-green-600">R$ {servico.preco}</p>
                          </div>
                          
                          {/* Controles + e - */}
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button 
                              onClick={() => alterarQuantidade(servico.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-gray-800">{qtd}</span>
                            <button 
                              onClick={() => alterarQuantidade(servico.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Horários */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                    Horário
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {todosHorarios.map(hora => {
                      const bloqueado = isHorarioBloqueado(hora);
                      const isSelected = selectedHorario === hora;
                      
                      return (
                        <button
                          key={hora}
                          disabled={bloqueado}
                          onClick={() => setSelectedHorario(hora)}
                          className={`
                            py-2.5 rounded-lg text-sm font-bold transition border
                            ${bloqueado ? 'bg-red-50 text-red-400 border-red-100 line-through cursor-not-allowed' : ''}
                            ${!bloqueado && !isSelected ? 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600' : ''}
                            ${isSelected ? 'bg-rose-500 text-white border-rose-500 shadow-md' : ''}
                          `}
                        >
                          {hora}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-4 text-center">* Antecedência mínima de 3 horas para agendamentos no mesmo dia.</p>
                </div>
              </div>
            )}

            {/* Botões Finais */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={handleCancelar}
                className="w-full sm:w-auto px-6 py-3 text-gray-600 font-bold bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmar}
                className="w-full sm:w-auto px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Confirmar Agendamento
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Modal de Sucesso */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl transform scale-100 transition-transform">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Agendado!</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Sua profissional já recebeu a notificação do seu agendamento.</p>
            <button 
              onClick={fecharSucesso} 
              className="w-full bg-gray-100 text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
}