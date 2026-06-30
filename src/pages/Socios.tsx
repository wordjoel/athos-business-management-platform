import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Shield, Target, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';

const SociosPage: React.FC = () => {
  const { darkMode } = useApp();

  const socios = [
    {
      nome: 'Kleber Duarte',
      cargo: 'Sócio',
      funcao: 'Tecnologia, Inovação e Desenvolvimento',
      descricao: 'Responsável pela liderança estratégica da ATHOS, arquitetura tecnológica, inovação, desenvolvimento de soluções digitais e direcionamento técnico da empresa.',
      avatar: 'KD',
      cor: 'athos',
    },
    {
      nome: 'Joel Oliveira',
      cargo: 'Sócio',
      funcao: 'Gestão Administrativa e Financeira',
      descricao: 'Responsável pela gestão administrativa, organização operacional, planejamento financeiro, estrutura corporativa e suporte estratégico ao crescimento da ATHOS.',
      avatar: 'JO',
      cor: 'emerald',
    },
    {
      nome: 'Oscar Carvalho',
      cargo: 'Sócio',
      funcao: 'Qualidade e Melhoria Contínua',
      descricao: 'Responsável pelo controle de qualidade, validação operacional, melhoria contínua, testes técnicos e excelência das entregas desenvolvidas pela empresa.',
      avatar: 'OC',
      cor: 'violet',
    },
  ];

  const pilares = [
    { nome: 'Inovação', icon: Zap, desc: 'Soluções inovadoras para desafios modernos' },
    { nome: 'Tecnologia', icon: Target, desc: 'Tecnologia de ponta e excelência técnica' },
    { nome: 'Ética', icon: Shield, desc: 'Conduta ética em todas as relações' },
    { nome: 'Qualidade', icon: Award, desc: 'Padrões elevados de qualidade' },
    { nome: 'Segurança', icon: CheckCircle, desc: 'Segurança em primeiro lugar' },
    { nome: 'Colaboração', icon: Users, desc: 'Trabalho em equipe integrado' },
    { nome: 'Crescimento', icon: TrendingUp, desc: 'Crescimento sustentável e escalável' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">ATHOS Solution Tecnologia LTDA</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fundadores e Diretores</p>
      </div>

      <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-athos-500/20 to-violet-500/20' : 'bg-gradient-to-r from-athos-50 to-violet-50'} border border-athos-500/20`}>
        <p className="text-center text-lg font-medium">
          "Seguimos juntos desenvolvendo soluções inteligentes, escaláveis e alinhadas às necessidades do mercado."
        </p>
        <p className="text-center mt-2 text-2xl">🚀</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Nossa Liderança</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socios.map((socio, i) => (
            <div key={i} className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border border-${socio.cor}-500/20`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full gradient-athos flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {socio.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{socio.nome}</h3>
                  <p className={`text-sm font-medium text-${socio.cor}-400`}>{socio.cargo}</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{socio.funcao}</p>
                </div>
              </div>
              <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{socio.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Pilares da ATHOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pilares.map((pil, i) => (
            <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
              <pil.icon size={24} className="text-athos-400 mb-2" />
              <h3 className="font-semibold">{pil.nome}</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pil.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SociosPage;