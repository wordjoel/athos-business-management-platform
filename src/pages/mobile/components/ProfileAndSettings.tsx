import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Bell, 
  Eye, 
  Globe, 
  DollarSign, 
  ShieldAlert, 
  Database, 
  Info, 
  Check,
  CheckCheck,
  Mail,
  Phone,
  Briefcase,
  Building,
  BellRing,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';

interface ProfileAndSettingsProps {
  initialSubScreen: 'profile' | 'settings' | 'notifications';
  profile: UserProfile;
  notifications: NotificationItem[];
  onNavigate: (screen: any) => void;
  onBack: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onMarkAllAsRead: () => void;
}

export default function ProfileAndSettings({
  initialSubScreen,
  profile,
  notifications,
  onNavigate,
  onBack,
  onUpdateProfile,
  onMarkAllAsRead
}: ProfileAndSettingsProps) {
  const [subScreen, setSubScreen] = useState<'profile' | 'settings' | 'notifications'>(initialSubScreen);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile edits
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [company, setCompany] = useState(profile.company);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      role,
      email,
      phone,
      company
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-black text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
          {subScreen === 'profile' && 'Perfil Executivo'}
          {subScreen === 'settings' && 'Configurações'}
          {subScreen === 'notifications' && 'Central de Notificações'}
        </h2>
        <div className="w-8"></div>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-2 px-5 py-3 border-b border-slate-900/60 bg-slate-950/30">
        <button
          onClick={() => setSubScreen('profile')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
            subScreen === 'profile' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5 inline mr-1.5" /> Perfil
        </button>
        <button
          onClick={() => setSubScreen('settings')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
            subScreen === 'settings' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5 inline mr-1.5" /> Configs
        </button>
        <button
          onClick={() => setSubScreen('notifications')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
            subScreen === 'notifications' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5 inline mr-1.5 text-yellow-400" /> Alertas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ======================================= */}
        {/* 1. PERFIL EXECUTIVO                      */}
        {/* ======================================= */}
        {subScreen === 'profile' && (
          <div className="p-5 space-y-5">
            {/* Avatar Header */}
            <div className="flex flex-col items-center text-center space-y-3.5 py-4 bg-slate-950/20 border border-slate-900 rounded-2xl">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-glow-blue">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                  <Check className="w-3 h-3 text-slate-950 font-bold" />
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{profile.role} • {profile.company}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={saveProfile} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Cargo</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Empresa</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Telefone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-800 text-xs font-bold rounded-xl text-slate-400 uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl text-white uppercase tracking-wider shadow-lg"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5">
                {[
                  { label: 'E-mail Corporativo', value: email, icon: <Mail className="w-4 h-4 text-blue-400" /> },
                  { label: 'Telefone Celular', value: phone, icon: <Phone className="w-4 h-4 text-emerald-400" /> },
                  { label: 'Cargo Ocupado', value: role, icon: <Briefcase className="w-4 h-4 text-purple-400" /> },
                  { label: 'Nome da Empresa', value: company, icon: <Building className="w-4 h-4 text-amber-400" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3.5 p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-left">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none block">{item.label}</span>
                      <p className="text-xs font-semibold text-slate-200 mt-1">{item.value}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 uppercase tracking-widest transition"
                >
                  Editar Perfil
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* 2. CONFIGURAÇÕES                         */}
        {/* ======================================= */}
        {subScreen === 'settings' && (
          <div className="p-5 space-y-4 text-left">
            {/* Preference groups */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">PREFERÊNCIAS VISUAIS</h3>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Moon className="w-4.5 h-4.5 text-blue-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Nível de Dark Mode</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Atualmente: Midnight Navy</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">ATIVADO</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4.5 h-4.5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Idioma do App</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Mudar idioma da interface</p>
                    </div>
                  </div>
                  <select 
                    value={profile.language} 
                    onChange={(e) => onUpdateProfile({ ...profile, language: e.target.value as any })}
                    className="bg-slate-950 text-xs border border-slate-850 px-2 py-1 rounded"
                  >
                    <option value="pt">Português (PT)</option>
                    <option value="en">English (EN)</option>
                    <option value="es">Español (ES)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4.5 h-4.5 text-amber-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Moeda Padrão</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Selecione o indexador principal</p>
                    </div>
                  </div>
                  <select 
                    value={profile.currency} 
                    onChange={(e) => onUpdateProfile({ ...profile, currency: e.target.value as any })}
                    className="bg-slate-950 text-xs border border-slate-850 px-2 py-1 rounded"
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Módulo Adicionar / Atalhos Rápidos */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Módulo Adicionar (Atalhos Rápidos)</h3>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3.5">
                <div 
                  onClick={() => onNavigate('new_revenue')}
                  className="flex justify-between items-center hover:bg-slate-850 p-2 -mx-2 rounded-xl transition cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Nova Receita</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Registrar entrada de capital corporativo</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>

                <div 
                  onClick={() => onNavigate('new_expense')}
                  className="flex justify-between items-center hover:bg-slate-850 p-2 -mx-2 rounded-xl transition border-t border-slate-800/60 pt-3.5 cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Nova Despesa</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Lançar saída ou custo operacional</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>

                <div 
                  onClick={() => {
                    alert('Transferência Bancária PJ simulada com sucesso!');
                  }}
                  className="flex justify-between items-center hover:bg-slate-850 p-2 -mx-2 rounded-xl transition border-t border-slate-800/60 pt-3.5 cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Transferência</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Movimentar saldos entre contas PJ</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>

                <div 
                  onClick={() => {
                    alert('Lançamento recorrente corporativo simulado!');
                  }}
                  className="flex justify-between items-center hover:bg-slate-850 p-2 -mx-2 rounded-xl transition border-t border-slate-800/60 pt-3.5 cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Lançamento Recorrente</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Configurar cobrança mensal fixa</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">SEGURANÇA & SISTEMA</h3>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <BellRing className="w-4.5 h-4.5 text-purple-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Notificações Push</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Receber avisos de vencimento</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onUpdateProfile({ ...profile, notificationsEnabled: !profile.notificationsEnabled })}
                    className={`w-10 h-5 rounded-full relative transition ${profile.notificationsEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${profile.notificationsEnabled ? 'right-0.5' : 'left-0.5'}`}></span>
                  </button>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Proteção Biométrica</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Requerer FaceID/Digital</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ATIVO</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-3">
                    <Database className="w-4.5 h-4.5 text-cyan-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Backup em Nuvem</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Sincronização diária</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Backup manual efetuado com sucesso!')}
                    className="px-2 py-1 rounded bg-slate-950 text-[10px] font-bold text-blue-400 hover:bg-slate-900 active:scale-95 transition"
                  >
                    Fazer Backup
                  </button>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-4.5 h-4.5 text-slate-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Sobre o App</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">ATHOS Mobile v2.4.0-build-8842</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">OK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 3. CENTRAL DE NOTIFICAÇÕES               */}
        {/* ======================================= */}
        {subScreen === 'notifications' && (
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-slate-400">Mensagens e alertas urgentes do sistema.</span>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-4.5 h-4.5" /> Marcar tudo lido
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-1">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold">Sem novas notificações</p>
                </div>
              ) : (
                notifications.map((not) => (
                  <div 
                    key={not.id}
                    className={`p-4 rounded-xl border transition relative text-left ${
                      not.read 
                        ? 'bg-slate-900/40 border-slate-800/50 opacity-75' 
                        : 'bg-[#1E2430]/60 border-[#C9A961]/30 shadow-sm'
                    }`}
                  >
                    {/* Unread circle badge */}
                    {!not.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full"></span>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg border ${
                        not.type === 'receipt' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : not.type === 'billing' 
                          ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        <Bell className="w-4 h-4" />
                      </div>

                      <div className="flex-1 pr-4">
                        <h4 className="text-xs font-bold text-white leading-snug">{not.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{not.message}</p>
                        <span className="text-[9px] text-slate-500 font-medium block mt-2">{not.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
