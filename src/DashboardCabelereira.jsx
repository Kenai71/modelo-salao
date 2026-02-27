import React, { useState } from 'react';

export default function DashboardCabeleireira() {
  const [faturamento, setFaturamento] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentos, setAgendamentos] = useState([
    { id: 1, cliente: 'Ana Silva', data: '20/10/2026 - 14:00', servico: 'Corte e Escova', valor: 120, status: 'pendente' },
    { id: 2, cliente: 'Mariana Costa', data: '20/10/2026 - 15:30', servico: 'Coloração', valor: 250, status: 'pendente' }
  ]);

  const finalizarAtendimento = (id, valor, compareceu) => {
    setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: compareceu ? 'concluido' : 'faltou' } : ag));
    if (compareceu) setFaturamento(prev => prev + valor);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel da Profissional</h1>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold shadow-sm">
          Faturamento: R$ {faturamento.toFixed(2)}
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition flex items-center gap-2"
      >
        📅 Configurar Horários/Folgas
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-rose-50 border-b border-rose-100">
          <h2 className="text-xl font-semibold text-rose-800">Agendamentos do Dia</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {agendamentos.map((ag) => (
            <div key={ag.id} className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-bold text-gray-800 text-lg">{ag.cliente}</p>
                <p className="text-sm text-gray-500">{ag.data} • {ag.servico} • R$ {ag.valor}</p>
              </div>
              
              {ag.status === 'pendente' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => finalizarAtendimento(ag.id, ag.valor, true)}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition text-sm font-medium"
                  >
                    Compareceu
                  </button>
                  <button 
                    onClick={() => finalizarAtendimento(ag.id, ag.valor, false)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition text-sm font-medium"
                  >
                    Não veio
                  </button>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ag.status === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {ag.status === 'concluido' ? 'Finalizado' : 'Faltou'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Calendário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Configurar Expediente</h3>
            <input type="date" className="w-full p-2 border rounded-lg mb-4" />
            
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" id="folga" className="w-4 h-4 text-rose-500" />
              <label htmlFor="folga">Sem expediente (Folga)</label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Abertura</label>
                <input type="time" className="w-full p-2 border rounded-lg" defaultValue="09:00" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fechamento</label>
                <input type="time" className="w-full p-2 border rounded-lg" defaultValue="18:00" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}