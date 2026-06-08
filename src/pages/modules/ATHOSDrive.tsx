import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderOpen, File, Upload, Trash2, Download, Eye, Plus, Search, Calendar, User, MoreVertical, Image, FileText, FileArchive } from 'lucide-react';

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
}

const ATHOSDrive: React.FC = () => {
  const { darkMode, usuarioLogado } = useApp();

  const [arquivos, setArquivos] = useState<Arquivo[]>(() => {
    const saved = localStorage.getItem('athos_arquivos');
    return saved ? JSON.parse(saved) : [];
  });

  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({ nome: '', categoria: 'Projetos', tipo: 'projeto' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');

  useEffect(() => { localStorage.setItem('athos_arquivos', JSON.stringify(arquivos)); }, [arquivos]);

  const categorias = [...new Set(arquivos.map(a => a.categoria))];

  const arquivosFiltrados = arquivos.filter(a => {
    const matchesSearch = a.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'todos' || a.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  const handleUpload = () => {
    if (!formData.nome) return;
    const novo: Arquivo = {
      id: Date.now().toString(),
      nome: formData.nome,
      tipo: formData.tipo as any,
      tamanho: Math.floor(Math.random() * 5000000) + 100000,
      uploadedPor: usuarioLogado?.nome || 'Usuário',
      dataUpload: new Date().toLocaleDateString('pt-BR'),
      categoria: formData.categoria,
      visivelPara: ['todos'],
    };
    setArquivos([novo, ...arquivos]);
    setFormData({ nome: '', categoria: 'Projetos', tipo: 'projeto' });
    setShowUpload(false);
  };

  const excluirArquivo = (id: string) => {
    if (confirm('Excluir este arquivo?')) setArquivos(arquivos.filter(a => a.id !== id));
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

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ATHOS Drive</h1>
          <p className="text-sm text-gray-500">Gestão de Projetos e Contratos</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Upload size={16} /> Upload
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-white/5">
          <Search size={14} className="text-gray-500" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar arquivos..." className="bg-transparent text-sm outline-none text-white placeholder-gray-600 w-full" />
        </div>
        <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)} className="px-3 py-2 bg-gray-800/50 rounded-lg border border-white/5 text-sm text-white">
          <option value="todos">Todas as categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Novo Arquivo</h2>
            <div className="space-y-3">
              <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome do arquivo" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                <option>Projetos</option>
                <option>Contratos</option>
                <option>Documentos</option>
                <option>Apresentações</option>
                <option>Assets</option>
                <option>Financeiro</option>
              </select>
              <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                <option value="projeto">Projeto</option>
                <option value="contrato">Contrato</option>
                <option value="documento">Documento</option>
                <option value="imagem">Imagem</option>
                <option value="outro">Outro</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => setShowUpload(false)} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-sm">Cancelar</button>
                <button onClick={handleUpload} className="flex-1 py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Total Arquivos</p>
          <p className="text-2xl font-bold text-cyan-400">{arquivos.length}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Projetos</p>
          <p className="text-2xl font-bold text-violet-400">{arquivos.filter(a => a.tipo === 'projeto').length}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Contratos</p>
          <p className="text-2xl font-bold text-emerald-400">{arquivos.filter(a => a.tipo === 'contrato').length}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
          <p className="text-gray-500 text-xs">Armazenamento</p>
          <p className="text-2xl font-bold text-amber-400">{formatSize(arquivos.reduce((s, a) => s + a.tamanho, 0))}</p>
        </div>
      </div>

      <div className="space-y-2">
        {arquivosFiltrados.map(arquivo => (
          <div key={arquivo.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-white/5 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                {getIcon(arquivo.tipo)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{arquivo.nome}</p>
                <p className="text-xs text-gray-500">{arquivo.categoria} • {formatSize(arquivo.tamanho)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{arquivo.uploadedPor}</span>
              <span>{arquivo.dataUpload}</span>
              <button onClick={() => excluirArquivo(arquivo.id)} className="p-1.5 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATHOSDrive;