import React, { useState } from 'react';

export default function Login() {
  const [isCadastro, setIsCadastro] = useState(false);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-rose-100">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6 font-serif">
          {isCadastro ? 'Criar Conta' : 'Bem-vinda de volta!'}
        </h2>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {isCadastro && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
              <input 
                type="password" 
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          )}

          <button className="w-full bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition shadow-md mt-4">
            {isCadastro ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isCadastro ? 'Já tem uma conta?' : 'Ainda não tem cadastro?'}
          <button 
            onClick={() => setIsCadastro(!isCadastro)} 
            className="ml-1 text-rose-600 font-semibold hover:underline"
          >
            {isCadastro ? 'Faça login' : 'Crie uma agora'}
          </button>
        </p>
      </div>
    </div>
  );
}