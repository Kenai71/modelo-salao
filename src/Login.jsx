import React, { useState } from 'react';

export default function Login() {
  const [isCadastro, setIsCadastro] = useState(false);
  
  // Estados para controlar os dados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estados para feedback da interface
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Limpa os campos e erros ao trocar entre Login e Cadastro
  const toggleModo = () => {
    setIsCadastro(!isCadastro);
    setErro('');
    setSenha('');
    setConfirmarSenha('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validação simples
    if (isCadastro && senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      // Aqui entraria a chamada real para sua API
      // Simulando um delay de rede (1.5 segundos)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log('Dados enviados:', { email, senha });
      alert(isCadastro ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!');
      
    } catch (err) {
      setErro('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-rose-100">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6 font-serif">
          {isCadastro ? 'Criar Conta' : 'Bem-vinda de volta!'}
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Exibição de Erro */}
          {erro && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {erro}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input 
              id="senha"
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {isCadastro && (
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input 
                id="confirmarSenha"
                type="password" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required={isCadastro}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md mt-4 
              ${isLoading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'}`}
          >
            {isLoading 
              ? 'Aguarde...' 
              : (isCadastro ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isCadastro ? 'Já tem uma conta?' : 'Ainda não tem cadastro?'}
          <button 
            type="button"
            onClick={toggleModo} 
            className="ml-1 text-rose-600 font-semibold hover:underline"
          >
            {isCadastro ? 'Faça login' : 'Crie uma agora'}
          </button>
        </p>
      </div>
    </div>
  );
}