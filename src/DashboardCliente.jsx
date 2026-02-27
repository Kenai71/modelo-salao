import React, { useState } from 'react';

export default function DashboardCliente() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [profissional, setProfissional] = useState('');
  
  // Lógica mockada para simular horários e a regra de 3 horas
  const horarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const dataHoje = new Date().toISOString().split('T')[0];
  const horaAtual = new Date().getHours();

  // Bloqueia horários passados ou com menos de 3h de antecedência (simulação simples)
  const isHorarioBloqueado = (horaStr) => {
    const horaAgendamento = parseInt(horaStr.split(':')[0], 10);
    // Bloqueia se a diferença for menor que 3 horas considerando o dia de hoje
    return horaAgendamento <= (horaAtual + 3);
  };

  const handleAgendar = (e) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-rose-600 mb-8 font-serif">Novo Agendamento</h1>

      <form onSubmit={handleAgendar} className="space-y-6">
        {/* Seleção de Profissional */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione a Profissional</label>
          <select 
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none"
            value={profissional}
            onChange={(e) => setProfissional(e.target.value)}
          >
            <option value="">Escolha...</option>
            <option value="juliana">Juliana (Especialista em Cachos)</option>
            <option value="camila">Camila (Colorimetria)</option>
            <option value="amanda">Amanda (Corte e Escova)</option>
          </select>
        </div>

        {/* Seleção de Serviço */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Serviço</label>
          <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none">
            <option value="">Escolha o serviço...</option>
            <option value="corte">Corte Feminino - R$ 80</option>
            <option value="coloracao">Coloração Completa - R$ 250</option>
            <option value="escova">Escova Modeladora - R$ 60</option>
          </select>
        </div>

        {/* Seleção de Data */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Data</label>
          <input 
            type="date" 
            required 
            min={dataHoje} // Não permite dias anteriores
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none"
          />
        </div>

        {/* Grade de Horários */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Horários Disponíveis (Antecedência Mín. 3h)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {horarios.map((hora) => {
              const bloqueado = isHorarioBloqueado(hora);
              return (
                <label 
                  key={hora} 
                  className={`border rounded-lg p-2 text-center cursor-pointer transition ${
                    bloqueado 
                    ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed line-through' 
                    : 'hover:bg-rose-50 border-gray-200 text-gray-700 has-[:checked]:bg-rose-500 has-[:checked]:text-white has-[:checked]:border-rose-500'
                  }`}
                >
                  <input type="radio" name="horario" value={hora} disabled={bloqueado} className="hidden" required />
                  {hora}
                </label>
              );
            })}
          </div>
        </div>

        <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl hover:bg-rose-700 transition shadow-lg text-lg">
          Confirmar Agendamento
        </button>
      </form>

      {/* Modal de Sucesso */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center transform scale-100 transition-transform">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Agendamento feito!</h3>
            <p className="text-gray-600 mb-6">Sua profissional já recebeu a notificação.</p>
            <button 
              onClick={() => setIsSuccessModalOpen(false)} 
              className="w-full bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}