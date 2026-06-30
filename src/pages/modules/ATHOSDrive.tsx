import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { File, Upload, Trash2, Eye, Plus, Search, Image, FileText, FileArchive, History, Lock, Unlock, Users, Copy, X, ChevronDown, ChevronRight } from 'lucide-react';

interface ArquivoVersao {
  numero: number;
  dataUpload: string;
  uploadedPor: string;
  tamanho: number;
  changelog: string;
}

interface ArquivoPermissao {
  usuario: string;
  papel: 'visualizar' | 'editar' | 'admin';
}

interface Arquivo {
  id: string;
  nome: string;
  tipo: 'projeto' | 'contrato' | 'documento' | 'imagem' | 'outro';
  tamanho: number;
  url?: string;
  uploadedPor: string;
  dataUpload: string;
  categoria: string;
  visivelPara: string[];
  versoes: ArquivoVersao[];
  versaoAtual: number;
  permissoes: ArquivoPermissao[];
  privado: boolean;
  tags: string[];
  descricao: string;
}

const ATHOSDrive: React.FC = () => {
  const { darkMode, usuarioLogado } = useApp();

  const [arquivos, setArquivos] = useState<Arquivo[]>(() => {
    const saved = localStorage.getItem('athos_arquivos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((a: any) => ({
        ...a,
        versoes: a.versoes || [{ numero: 1, dataUpload: a.dataUpload, uploadedPor: a.uploadedPor, tamanho: a.tamanho, changelog: 'Versão inicial' }],
        versaoAtual: a.versaoAtual || 1,
        permissoes: a.permissoes || [],
        privado: a.privado || false,
        tags: a.tags || [],
        descricao: a.descricao || '',
      }));
    }
    return [];
  });

  const [showUpload, setShowUpload] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState<string | null>(null);
  const [showPermissoes, setShowPermissoes] = useState<string | null>(null);
  const [showNovaVersao, setShowNovaVersao] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', categoria: 'Projetos', tipo: 'projeto', descricao: '', tags: '', privado: false });
  const [formDataPermissao, setFormDataPermissao] = useState({ usuario: '', papel: 'visualizar' as const });
  const [formDataVersao, setFormDataVersao] = useState({ changelog: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [abaDetalhes, setAbaDetalhes] = useState<'info' | 'versoes' | 'permissoes'>('info');

  useEffect(() => { localStorage.setItem('athos_arquivos', JSON.stringify(arquivos)); }, [arquivos]);

  const categorias = [...new Set(arquivos.map(a => a.categoria))];

  const arquivosFiltrados = arquivos.filter(a => {
    const q = searchTerm.toLowerCase();
    const matchSearch = a.nome.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)) || a.descricao.toLowerCase().includes(q);
    const matchCategoria = filterCategoria === 'todos' || a.categoria === filterCategoria;
    return matchSearch && matchCategoria;
  });

  const handleUpload = () => {
    if (!formData.nome) return;
    const now = new Date().toLocaleDateString('pt-BR');
    const nome = usuarioLogado?.nome || 'Usuário';
    const novo: Arquivo = {
      id: Date.now().toString(),
      nome: formData.nome,
      tipo: formData.tipo as any,
      tamanho: Math.floor(Math.random() * 5000000) + 100000,
      uploadedPor: nome,
      dataUpload: now,
      categoria: formData.categoria,
      visivelPara: ['todos'],
      versoes: [{ numero: 1, dataUpload: now, uploadedPor: nome, tamanho: Math.floor(Math.random() * 5000000) + 100000, changelog: 'Versão inicial' }],
      versaoAtual: 1,
      permissoes: [],
      privado: formData.privado,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      descricao: formData.descricao,
    };
    setArquivos([novo, ...arquivos]);
    setFormData({ nome: '', categoria: 'Projetos', tipo: 'projeto', descricao: '', tags: '', privado: false });
    setShowUpload(false);
  };

  const novaVersao = (arquivoId: string) => {
    const arquivo = arquivos.find(a => a.id === arquivoId);
    if (!arquivo) return;
    const now = new Date().toLocaleDateString('pt-BR');
    const nome = usuarioLogado?.nome || 'Usuário';
    const novaV: ArquivoVersao = {
      numero: arquivo.versaoAtual + 1,
      dataUpload: now,
      uploadedPor: nome,
      tamanho: arquivo.tamanho + Math.floor(Math.random() * 100000),
      changelog: formDataVersao.changelog || `Versão ${arquivo.versaoAtual + 1}`,
    };
    setArquivos(arquivos.map(a => a.id === arquivoId ? { ...a, versoes: [...a.versoes, novaV], versaoAtual: novaV.numero, tamanho: novaV.tamanho } : a));
    setFormDataVersao({ changelog: '' });
    setShowNovaVersao(null);
  };

  const adicionarPermissao = (arquivoId: string) => {
    if (!formDataPermissao.usuario) return;
    setArquivos(arquivos.map(a => a.id === arquivoId ? { ...a, permissoes: [...a.permissoes.filter(p => p.usuario !== formDataPermissao.usuario), { usuario: formDataPermissao.usuario, papel: formDataPermissao.papel }] } : a));
    setFormDataPermissao({ usuario: '', papel: 'visualizar' });
  };

  const removerPermissao = (arquivoId: string, usuario: string) => {
    setArquivos(arquivos.map(a => a.id === arquivoId ? { ...a, permissoes: a.permissoes.filter(p => p.usuario !== usuario) } : a));
  };

  const togglePrivado = (arquivoId: string) => {
    setArquivos(arquivos.map(a => a.id === arquivoId ? { ...a, privado: !a.privado } : a));
  };

  const excluirArquivo = (id: string) => {
    if (confirm('Excluir este arquivo e todas as suas versões?')) {
      setArquivos(arquivos.filter(a => a.id !== id));
      setShowDetalhes(null);
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'projeto': return <FileText size={18} className="text-cyan-400" />;
      case 'contrato': return <File size={18} className="text-violet-400" />;
      case 'imagem': return <Image size={18} className="text-emerald-400" />;
      case 'documento': return <FileArchive size={18} className="text-amber-400" />;
      default: return <File size={18} className="text-gray-400" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const arquivoDetalhes = showDetalhes ? arquivos.find(a => a.id === showDetalhes) : null;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ATHOS Drive</h1>
          <p className="text-sm text-gray-500">Gestão de Documentos com Versionamento</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Upload size={16} /> Upload
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-white/5">
          <Search size={14} className="text-gray-500" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por nome, tags ou descrição..." className="bg-transparent text-sm outline-none text-white placeholder-gray-600 w-full" />
        </div>
        <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)} className="px-3 py-2 bg-gray-800/50 rounded-lg border border-white/5 text-sm text-white">
          <option value="todos">Todas categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Total Arquivos</p>
          <p className="text-2xl font-bold text-cyan-400">{arquivos.length}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Total Versões</p>
          <p className="text-2xl font-bold text-violet-400">{arquivos.reduce((s, a) => s + a.versoes.length, 0)}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Privados</p>
          <p className="text-2xl font-bold text-amber-400">{arquivos.filter(a => a.privado).length}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Armazenamento</p>
          <p className="text-2xl font-bold text-emerald-400">{formatSize(arquivos.reduce((s, a) => s + a.tamanho, 0))}</p>
        </div>
      </div>

      <div className="space-y-2">
        {arquivosFiltrados.map(arquivo => (
          <div key={arquivo.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-white/5 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => { setShowDetalhes(arquivo.id); setAbaDetalhes('info'); }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                {getIcon(arquivo.tipo)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{arquivo.nome}</p>
                  {arquivo.privado && <Lock size={10} className="text-amber-400" />}
                  {arquivo.versoes.length > 1 && <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">v{arquivo.versaoAtual}</span>}
                </div>
                <p className="text-xs text-gray-500">{arquivo.categoria} • {formatSize(arquivo.tamanho)} • {arquivo.dataUpload}</p>
                {arquivo.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {arquivo.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-gray-700/50 text-gray-400 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1"><History size={12} /> <span>v{arquivo.versaoAtual}</span></div>
              <span>{arquivo.uploadedPor}</span>
              <div className="flex gap-1">
                <button onClick={e => { e.stopPropagation(); setShowPermissoes(arquivo.id); }} className="p-1.5 hover:text-cyan-400"><Users size={14} /></button>
                <button onClick={e => { e.stopPropagation(); excluirArquivo(arquivo.id); }} className="p-1.5 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {arquivosFiltrados.length === 0 && <p className="text-sm text-center text-gray-500 py-8">Nenhum arquivo encontrado.</p>}
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Novo Arquivo</h2>
              <button onClick={() => setShowUpload(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome do arquivo" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição (opcional)" rows={2} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm resize-none" />
              <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Tags (separadas por vírgula)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  <option>Projetos</option><option>Contratos</option><option>Documentos</option><option>Apresentações</option><option>Assets</option><option>Financeiro</option>
                </select>
                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  <option value="projeto">Projeto</option><option value="contrato">Contrato</option><option value="documento">Documento</option><option value="imagem">Imagem</option><option value="outro">Outro</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" checked={formData.privado} onChange={e => setFormData({ ...formData, privado: e.target.checked })} className="rounded" /> Arquivo privado
              </label>
              <div className="flex gap-2">
                <button onClick={() => setShowUpload(false)} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-sm">Cancelar</button>
                <button onClick={handleUpload} className="flex-1 py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {arquivoDetalhes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-lg border border-white/10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getIcon(arquivoDetalhes.tipo)}
                <div>
                  <h2 className="text-lg font-semibold text-white">{arquivoDetalhes.nome}</h2>
                  <p className="text-xs text-gray-500">v{arquivoDetalhes.versaoAtual} • {arquivoDetalhes.categoria}</p>
                </div>
              </div>
              <button onClick={() => setShowDetalhes(null)}><X size={18} className="text-gray-400" /></button>
            </div>

            <div className="flex gap-1 p-1 rounded-lg bg-gray-700/50 mb-4">
              {(['info', 'versoes', 'permissoes'] as const).map(a => (
                <button key={a} onClick={() => setAbaDetalhes(a)} className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${abaDetalhes === a ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {a === 'info' ? 'Info' : a === 'versoes' ? `Versões (${arquivoDetalhes.versoes.length})` : 'Permissões'}
                </button>
              ))}
            </div>

            {abaDetalhes === 'info' && (
              <div className="space-y-3">
                {arquivoDetalhes.descricao && <div><p className="text-xs text-gray-500">Descrição</p><p className="text-sm text-white">{arquivoDetalhes.descricao}</p></div>}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-700/30 rounded-lg"><p className="text-xs text-gray-500">Tamanho</p><p className="text-sm text-white">{formatSize(arquivoDetalhes.tamanho)}</p></div>
                  <div className="p-3 bg-gray-700/30 rounded-lg"><p className="text-xs text-gray-500">Upload por</p><p className="text-sm text-white">{arquivoDetalhes.uploadedPor}</p></div>
                  <div className="p-3 bg-gray-700/30 rounded-lg"><p className="text-xs text-gray-500">Data</p><p className="text-sm text-white">{arquivoDetalhes.dataUpload}</p></div>
                  <div className="p-3 bg-gray-700/30 rounded-lg"><p className="text-xs text-gray-500">Versão</p><p className="text-sm text-white">v{arquivoDetalhes.versaoAtual}</p></div>
                </div>
                {arquivoDetalhes.tags.length > 0 && (
                  <div><p className="text-xs text-gray-500 mb-1">Tags</p><div className="flex flex-wrap gap-1">{arquivoDetalhes.tags.map((t, i) => <span key={i} className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded">{t}</span>)}</div></div>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { togglePrivado(arquivoDetalhes.id); }} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-xs flex items-center justify-center gap-1">
                    {arquivoDetalhes.privado ? <><Lock size={12} /> Privado</> : <><Unlock size={12} /> Público</>}
                  </button>
                  <button onClick={() => { setShowNovaVersao(arquivoDetalhes.id); }} className="flex-1 py-2 bg-cyan-600 rounded-lg text-white text-xs flex items-center justify-center gap-1">
                    <Upload size={12} /> Nova Versão
                  </button>
                  <button onClick={() => excluirArquivo(arquivoDetalhes.id)} className="py-2 px-3 bg-gray-700 rounded-lg text-gray-400 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}

            {abaDetalhes === 'versoes' && (
              <div className="space-y-2">
                {arquivoDetalhes.versoes.sort((a, b) => b.numero - a.numero).map(v => (
                  <div key={v.numero} className={`p-3 rounded-lg ${v.numero === arquivoDetalhes.versaoAtual ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-gray-700/30'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white">Versão {v.numero} {v.numero === arquivoDetalhes.versaoAtual && <span className="text-[10px] text-cyan-400">(atual)</span>}</p>
                        <p className="text-xs text-gray-500">{v.dataUpload} • {v.uploadedPor} • {formatSize(v.tamanho)}</p>
                        <p className="text-xs text-gray-400 mt-1">{v.changelog}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {abaDetalhes === 'permissoes' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="text" value={formDataPermissao.usuario} onChange={e => setFormDataPermissao({ ...formDataPermissao, usuario: e.target.value })} placeholder="E-mail do usuário" className="flex-1 px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
                  <select value={formDataPermissao.papel} onChange={e => setFormDataPermissao({ ...formDataPermissao, papel: e.target.value as any })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                    <option value="visualizar">Visualizar</option><option value="editar">Editar</option><option value="admin">Admin</option>
                  </select>
                  <button onClick={() => adicionarPermissao(arquivoDetalhes.id)} className="px-3 py-2 bg-cyan-600 rounded-lg text-white text-sm">+</button>
                </div>
                <div className="space-y-2">
                  {arquivoDetalhes.permissoes.map(p => (
                    <div key={p.usuario} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{p.usuario}</p>
                        <p className="text-[10px] text-gray-500">{p.papel === 'visualizar' ? 'Visualizar' : p.papel === 'editar' ? 'Editar' : 'Admin'}</p>
                      </div>
                      <button onClick={() => removerPermissao(arquivoDetalhes.id, p.usuario)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  {arquivoDetalhes.permissoes.length === 0 && <p className="text-xs text-gray-500 text-center py-4">Nenhuma permissão individual definida.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showNovaVersao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Nova Versão</h2>
              <button onClick={() => setShowNovaVersao(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <textarea value={formDataVersao.changelog} onChange={e => setFormDataVersao({ ...formDataVersao, changelog: e.target.value })} placeholder="O que mudou nesta versão?" rows={3} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm resize-none" />
              <div className="flex gap-2">
                <button onClick={() => setShowNovaVersao(null)} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-sm">Cancelar</button>
                <button onClick={() => novaVersao(showNovaVersao)} className="flex-1 py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Upload Versão</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPermissoes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Permissões</h2>
              <button onClick={() => setShowPermissoes(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="flex gap-2 mb-3">
              <input type="text" value={formDataPermissao.usuario} onChange={e => setFormDataPermissao({ ...formDataPermissao, usuario: e.target.value })} placeholder="E-mail do usuário" className="flex-1 px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <select value={formDataPermissao.papel} onChange={e => setFormDataPermissao({ ...formDataPermissao, papel: e.target.value as any })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                <option value="visualizar">Visualizar</option><option value="editar">Editar</option><option value="admin">Admin</option>
              </select>
              <button onClick={() => { adicionarPermissao(showPermissoes); }} className="px-3 py-2 bg-cyan-600 rounded-lg text-white text-sm">+</button>
            </div>
            <div className="space-y-2">
              {arquivos.find(a => a.id === showPermissoes)?.permissoes.map(p => (
                <div key={p.usuario} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-sm text-white">{p.usuario}</p>
                    <p className="text-[10px] text-gray-500">{p.papel === 'visualizar' ? 'Visualizar' : p.papel === 'editar' ? 'Editar' : 'Admin'}</p>
                  </div>
                  <button onClick={() => removerPermissao(showPermissoes, p.usuario)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              ))}
              {(!arquivos.find(a => a.id === showPermissoes)?.permissoes || arquivos.find(a => a.id === showPermissoes)!.permissoes.length === 0) && <p className="text-xs text-gray-500 text-center py-4">Nenhuma permissão individual.</p>}
            </div>
            <button onClick={() => setShowPermissoes(null)} className="w-full mt-3 py-2 bg-gray-700 rounded-lg text-gray-300 text-sm">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSDrive;
