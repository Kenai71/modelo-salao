import React, { useState } from 'react';
// Importando as ferramentas do nosso Firebase
import { auth, db } from './firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login({ onLogin }) {
  const [isCadastro, setIsCadastro] = useState(false);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleModo = () => {
    setIsCadastro(!isCadastro);
    setErro('');
    setSenha('');
    setConfirmarSenha('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (isCadastro && senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      if (isCadastro) {
        // 1. CRIA A CONTA NO FIREBASE AUTH
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Regra para definir quem é cabeleireira e quem é cliente
        const role = (email.includes('admin') || email.includes('salao')) ? 'cabeleireira' : 'cliente';

        // 2. SALVA O PERFIL (ROLE) NO BANCO DE DADOS FIRESTORE
        await setDoc(doc(db, "usuarios", user.uid), {
          email: email,
          role: role,
          criadoEm: new Date()
        });

        alert('Conta criada com sucesso! Agora você já pode entrar.');
        toggleModo(); // Muda para a tela de login
        
      } else {
        // 1. FAZ O LOGIN REAL NO FIREBASE AUTH
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // 2. BUSCA NO BANCO DE DADOS SE É CLIENTE OU CABELEIREIRA
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dadosUsuario = docSnap.data();
          onLogin(dadosUsuario.role); // Manda a pessoa pra tela certa
        } else {
          setErro("Perfil não encontrado no banco de dados.");
        }
      }
      
    } catch (err) {
      console.error(err);
      // Tratando os erros mais comuns do Firebase para ficar amigável
      if (err.code === 'auth/email-already-in-use') {
        setErro('Esse e-mail já está cadastrado.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErro('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/weak-password') {
        setErro('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErro('Ocorreu um erro. Verifique seus dados e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-rose-100">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6 font-serif">
          {isCadastro ? 'Criar Conta' : 'Bem-vinda de volta!'}
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {erro && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {erro}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="seu@email.com"
            />
            {isCadastro && (
              <p className="text-[10px] text-gray-400 mt-1">Dica: Use "admin" no email se você for a profissional.</p>
            )}
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha (mínimo 6 caracteres)</label>
            <input 
              id="senha"
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength="6"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {isCadastro && (
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
              <input 
                id="confirmarSenha"
                type="password" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required={isCadastro}
                minLength="6"
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
            {isLoading ? 'Aguarde...' : (isCadastro ? 'Cadastrar' : 'Entrar')}
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