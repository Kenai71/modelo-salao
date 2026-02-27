import React, { useState } from 'react';

export default function DashboardCliente({ onLogout }) {
  const [selectedProfissional, setSelectedProfissional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [servicosSelecionados, setServicosSelecionados] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);

  // --- DADOS MOCKADOS ---
  const profissionais = [
    { id: 1, nome: 'Juliana', especialidade: 'Cachos', sigla: 'JU' },
    { id: 2, nome: 'Camila', especialidade: 'Colorimetria', sigla: 'CA' },
    { id: 3, nome: 'Amanda', especialidade: 'Corte e Escova', sigla: 'AM' },
  ];

  const listaServicos = [
    { id: 1, nome: 'Corte Feminino', preco: 80, tempo: 60 },
    { id: 2, nome: 'Coloração Completa', preco: 250, tempo: 120 },
    { id: 3, nome: 'Escova Modeladora', preco: 60, tempo: 40 },
    { id: 4, nome: 'Hidratação Profunda', preco: 90, tempo: 30 },
  ];

  const diasSemExpediente = [10, 15, 22, 23];
  const horariosOcupadosMock = ['10:00', '14:00', '16:00']; // Ocupados simulados pelo sistema
  const todosHorarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  const dataAtual = new Date();
  const diaAtual = dataAtual.getDate();
  const horaAtual = dataAtual.getHours();

  // --- LÓGICAS DE NEGÓCIO: GERENCIAMENTO DE TEMPO E BLOQUEIOS ---

  // Retorna todos os horários que já estão ocupados em um determinado dia
  const getHorariosOcupadosNoDia = (dia) => {
    let ocupados = [...horariosOcupadosMock];
    meusAgendamentos.forEach(ag => {
      if (ag.dia === dia) {
        ocupados.push(...ag.horariosReservados);
      }
    });
    return ocupados;
  };

  const isHorarioBloqueado = (horaStr) => {
    const ocupadosNoDia = getHorariosOcupadosNoDia(selectedDate);
    if (ocupadosNoDia.includes(horaStr)) return true;

    // Regra de antecedência de 3 horas no dia de hoje
    if (selectedDate === diaAtual) {
      const horaAgendamento = parseInt(horaStr.split(':')[0], 10);
      if (horaAgendamento <= (horaAtual + 3)) return true;
    }
    if (selectedDate < diaAtual) return true;

    return false;
  };

  const calcularTotalE_Tempo = () => {
    let totalValor = 0;
    let totalTempo = 0;
    listaServicos.forEach(servico => {
      const qtd = servicosSelecionados[servico.id] || 0;
      if (qtd > 0) {
        totalValor += servico.preco;
        totalTempo += servico.tempo;
      }
    });
    return { totalValor, totalTempo };
  };

  const { totalValor, totalTempo } = calcularTotalE_Tempo();

  const formatarTempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    if (horas > 0 && min > 0) return `${horas}h ${min}m`;
    if (horas > 0) return `${horas}h`;
    return `${min} min`;
  };

  // Função centralizada para adicionar/remover serviços com checagem de limite de horários
  const alterarQuantidade = (idServico, delta, tempoDoServico) => {
    // Se a cliente está tentando adicionar um serviço (+), verifica se tem horário consecutivo livre
    if (delta > 0) {
      const ocupados = getHorariosOcupadosNoDia(selectedDate);
      const startIndex = todosHorarios.indexOf(selectedHorario);
      let maxSlotsDisponiveis = 0;
      let ultimaHoraAnalisada = null;

      // Conta quantos "slots" (horas) consecutivas estão livres a partir do horário clicado
      for (let i = startIndex; i < todosHorarios.length; i++) {
        const horaAtualLoop = todosHorarios[i];
        
        // Se bater num horário ocupado, para de contar
        if (ocupados.includes(horaAtualLoop)) break;
        
        // Verifica se há quebra na grade (Ex: De 11:00 pula pra 13:00 - Almoço)
        if (ultimaHoraAnalisada) {
          const numHoraAtual = parseInt(horaAtualLoop, 10);
          const numHoraAnterior = parseInt(ultimaHoraAnalisada, 10);
          if (numHoraAtual !== numHoraAnterior + 1) break; // Tem intervalo, para de contar
        }

        maxSlotsDisponiveis++;
        ultimaHoraAnalisada = horaAtualLoop;
      }

      // 1 slot = 60 minutos
      const tempoMaximoPermitido = maxSlotsDisponiveis * 60;
      const tempoFuturo = totalTempo + tempoDoServico;

      if (tempoFuturo > tempoMaximoPermitido) {
        alert(`O horário das ${selectedHorario} permite no máximo ${maxSlotsDisponiveis} hora(s) de serviços consecutivos. Por favor, escolha um serviço mais rápido ou agende em outro horário livre.`);
        return; // Impede a adição do serviço
      }
    }

    setServicosSelecionados(prev => {
      const quantidadeAtual = prev[idServico] || 0;
      let novaQuantidade = quantidadeAtual + delta;
      if (novaQuantidade > 1) novaQuantidade = 1;
      if (novaQuantidade < 0) novaQuantidade = 0;
      return { ...prev, [idServico]: novaQuantidade };
    });
  };

  const resetarSelecao = () => {
    setSelectedProfissional(null);
    setSelectedDate(null);
    setSelectedHorario(null);
    setServicosSelecionados({});
    setActiveModal(null);
  };

  const handleConfirmarAgendamento = () => {
    if (totalValor === 0) {
      alert("Selecione pelo menos um serviço para agendar.");
      return;
    }

    // Calcula quantos slots de fato ela vai consumir
    const slotsNecessarios = Math.ceil(totalTempo / 60) || 1;
    const startIndex = todosHorarios.indexOf(selectedHorario);
    
    // Pega a fatia do array equivalente aos horários consumidos
    const blocosReservados = todosHorarios.slice(startIndex, startIndex + slotsNecessarios);

    const profissionalInfo = profissionais.find(p => p.id === selectedProfissional);
    const servicosNomes = listaServicos
      .filter(s => (servicosSelecionados[s.id] || 0) > 0)
      .map(s => s.nome)
      .join(', ');

    const novoAgendamento = {
      id: Date.now(),
      profissional: profissionalInfo.nome,
      dia: selectedDate,
      horaInicial: selectedHorario,
      horariosReservados: blocosReservados, // Array com ['09:00', '10:00']
      servicos: servicosNomes,
      valor: totalValor,
      tempo: totalTempo
    };

    setMeusAgendamentos(prev => [...prev, novoAgendamento]);
    resetarSelecao();
  };

  const podeCancelar = (agendamento) => {
    if (agendamento.dia > diaAtual) return true;
    if (agendamento.dia === diaAtual) {
      const horaAgendamento = parseInt(agendamento.horaInicial.split(':')[0], 10);
      return (horaAgendamento - horaAtual) >= 3;
    }
    return false;
  };

  const cancelarAgendamento = (id) => {
    if(window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      setMeusAgendamentos(prev => prev.filter(ag => ag.id !== id));
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans w-full relative">
      
      {/* Sidebar Lateral */}
      <aside className="fixed left-0 top-0 bottom-0 w-[70px] md:w-20 bg-white border-r border-gray-200 flex flex-col items-center pt-6 pb-6 gap-4 md:gap-6 shadow-sm z-20 overflow-x-hidden">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg md:text-xl mb-2 md:mb-4 shrink-0">
          CL
        </div>
        
        <nav className="flex flex-col gap-3 md:gap-4 flex-1 w-full px-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button onClick={resetarSelecao} className="w-full flex justify-center p-2.5 md:p-3 text-rose-600 bg-rose-50 rounded-xl transition group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Novo Agendamento</span>
          </button>

          <div className="flex-1"></div>

          <button onClick={onLogout} className="w-full flex justify-center p-2.5 md:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition group relative mb-4 md:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Sair da Conta</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-[70px] md:ml-20 p-4 md:p-10 w-full min-h-screen">
        <div className="max-w-3xl mx-auto pb-10">
          
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Agendar Horário</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Siga os passos para reservar seu atendimento.</p>
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
                    onClick={() => { setSelectedProfissional(prof.id); setSelectedDate(null); }}
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

            {/* Passo 2: Calendário */}
            <div className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 transition-opacity duration-300 ${!selectedProfissional ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Escolha a Data
              </h2>
              <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                {['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="font-bold text-gray-400 text-xs md:text-sm py-2">{d}</div>)}
                {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                  const isFolga = diasSemExpediente.includes(day);
                  const isPassado = day < diaAtual;
                  
                  return (
                    <button 
                      key={day} 
                      disabled={isFolga || isPassado}
                      onClick={() => { setSelectedDate(day); setActiveModal('horarios'); }}
                      className={`
                        relative h-10 rounded-lg flex justify-center items-center text-sm font-medium transition
                        ${isFolga || isPassado ? 'bg-red-50 text-red-400 cursor-not-allowed line-through border border-red-100' : 'hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-200 cursor-pointer text-gray-700'}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Listagem dos Agendamentos Confirmados */}
            {meusAgendamentos.length > 0 && (
              <div className="mt-10 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Meus Agendamentos
                </h2>
                
                <div className="space-y-4">
                  {meusAgendamentos.map(ag => {
                    const permissaoCancelar = podeCancelar(ag);
                    
                    return (
                      <div key={ag.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-rose-50 rounded-xl flex flex-col items-center justify-center border border-rose-100 shrink-0">
                            <span className="text-rose-600 font-bold text-lg">{ag.dia}</span>
                            <span className="text-rose-400 text-[10px] uppercase font-bold">Out</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{ag.servicos}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mt-1">
                              <span className="text-gray-500 font-medium">Profissional: <span className="text-gray-700">{ag.profissional}</span></span>
                              <span className="text-gray-300">•</span>
                              {/* Mostra todos os horários que o agendamento consome no dia */}
                              <span className="text-gray-500 font-medium">Horários Reservados: <span className="text-gray-700">{ag.horariosReservados.join(', ')}</span></span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500 font-medium">Duração: <span className="text-gray-700">{formatarTempo(ag.tempo)}</span></span>
                              <span className="text-gray-300">•</span>
                              <span className="text-green-600 font-bold">R$ {ag.valor.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => cancelarAgendamento(ag.id)}
                          disabled={!permissaoCancelar}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition shrink-0 w-full md:w-auto
                            ${permissaoCancelar 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                          `}
                          title={!permissaoCancelar ? "Apenas cancelamentos com 3h de antecedência" : "Cancelar atendimento"}
                        >
                          {permissaoCancelar ? 'Cancelar' : 'Bloqueado (Prazo < 3h)'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      {/* MODAL 1: Seleção de Horários */}
      {activeModal === 'horarios' && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-sm relative p-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">Horários</h3>
            <p className="text-sm text-gray-500 mb-6">Dia {selectedDate} - Selecione um horário de início.</p>
            
            <div className="grid grid-cols-3 gap-3">
              {todosHorarios.map(hora => {
                const bloqueado = isHorarioBloqueado(hora);
                return (
                  <button
                    key={hora}
                    disabled={bloqueado}
                    onClick={() => { setSelectedHorario(hora); setActiveModal('servicos'); }}
                    className={`
                      py-3 rounded-xl text-sm font-bold transition border
                      ${bloqueado ? 'bg-red-50 text-red-400 border-red-100 line-through cursor-not-allowed' : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 shadow-sm'}
                    `}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-4 text-center">* Horários bloqueados não possuem antecedência de 3 horas ou estão ocupados.</p>
          </div>
        </div>
      )}

      {/* MODAL 2: Serviços e Confirmação */}
      {activeModal === 'servicos' && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-md relative p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Serviços e Confirmação</h3>
            <p className="text-sm text-gray-500 mb-6">Agendamento para o dia <span className="font-bold text-gray-700">{selectedDate}</span> às <span className="font-bold text-gray-700">{selectedHorario}</span>.</p>
            
            <div className="space-y-3 mb-6">
              {listaServicos.map(servico => {
                const qtd = servicosSelecionados[servico.id] || 0;
                return (
                  <div key={servico.id} className={`flex items-center justify-between p-3 rounded-xl border transition ${qtd > 0 ? 'border-rose-300 bg-rose-50/50' : 'border-gray-100'}`}>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">{servico.nome}</p>
                      <p className="text-xs font-bold text-green-600">R$ {servico.preco} <span className="text-gray-400 font-normal ml-1">• {formatarTempo(servico.tempo)}</span></p>
                    </div>
                    
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm shrink-0">
                      <button onClick={() => alterarQuantidade(servico.id, -1, servico.tempo)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition">-</button>
                      <span className="w-6 text-center text-sm font-bold text-gray-800">{qtd}</span>
                      <button onClick={() => alterarQuantidade(servico.id, 1, servico.tempo)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition">+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumo do Pedido no Modal */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Tempo estimado:</span>
                <span className="font-bold text-gray-700">{formatarTempo(totalTempo)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Total a pagar:</span>
                <span className="text-xl font-black text-rose-600">R$ {totalValor.toFixed(2)}</span>
              </div>
            </div>

            {/* Botões do Modal */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button 
                onClick={resetarSelecao}
                className="w-full sm:w-auto px-6 py-3 text-gray-600 font-bold bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-sm"
              >
                Cancelar Tudo
              </button>
              <button 
                onClick={handleConfirmarAgendamento}
                className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}