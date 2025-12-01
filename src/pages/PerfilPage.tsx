import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, Award, Calendar, Edit, Building2, FolderKanban, CheckCircle2, X, Save, Users, FileText, Download, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';

export function PerfilPage() {
  const { user, isDesigner, isCliente, updateProfile } = useAuth();
  const { projetos } = useProjects();
  
  // Garante que projetos é sempre um array
  const projetosArray = projetos || [];
  
  // Extrai clientes únicos dos projetos
  const clientesUnicos = React.useMemo(() => {
    const clientesMap = new Map<string, {
      nome: string;
      projetosAtivos: number;
      projetosConcluidos: number;
      total: number;
    }>();
    
    projetosArray.forEach(projeto => {
      const cliente = projeto.cliente;
      if (!clientesMap.has(cliente)) {
        clientesMap.set(cliente, {
          nome: cliente,
          projetosAtivos: 0,
          projetosConcluidos: 0,
          total: 0
        });
      }
      
      const clienteData = clientesMap.get(cliente)!;
      clienteData.total++;
      
      if (projeto.status === 'Concluído') {
        clienteData.projetosConcluidos++;
      } else {
        clienteData.projetosAtivos++;
      }
    });
    
    return Array.from(clientesMap.values());
  }, [projetosArray]);
  
  // Calcula estatísticas reais dos projetos
  const estatisticas = React.useMemo(() => {
    const total = projetosArray.length;
    const concluidos = projetosArray.filter(p => p.status === 'Concluído').length;
    const emAndamento = projetosArray.filter(p => p.status === 'Em Andamento').length;
    const clientes = clientesUnicos.length;
    
    return {
      total,
      concluidos,
      emAndamento,
      clientes
    };
  }, [projetosArray, clientesUnicos]);
  
  // Função para gerar iniciais do cliente
  const gerarIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  // Cores para os avatares dos clientes
  const coresAvatar = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500'];
  const coresFundo = [
    { from: 'from-blue-50', to: 'to-indigo-50', border: 'border-blue-200' },
    { from: 'from-purple-50', to: 'to-pink-50', border: 'border-purple-200' },
    { from: 'from-orange-50', to: 'to-amber-50', border: 'border-orange-200' },
    { from: 'from-teal-50', to: 'to-cyan-50', border: 'border-teal-200' },
    { from: 'from-pink-50', to: 'to-rose-50', border: 'border-pink-200' },
    { from: 'from-emerald-50', to: 'to-green-50', border: 'border-emerald-200' },
    { from: 'from-indigo-50', to: 'to-blue-50', border: 'border-indigo-200' },
    { from: 'from-rose-50', to: 'to-pink-50', border: 'border-rose-200' }
  ];
  
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
  const [modalFotoAberto, setModalFotoAberto] = useState(false);
  const [modalCurriculoAberto, setModalCurriculoAberto] = useState(false);
  const [modalInfoPessoalAberto, setModalInfoPessoalAberto] = useState(false);
  const [tipoEdicao, setTipoEdicao] = useState<'sobre' | 'experiencia' | 'habilidades' | 'empresa' | 'infopessoal' | null>(null);
  
  // Estados para edição
  const [editSobre, setEditSobre] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editLocalizacao, setEditLocalizacao] = useState('');
  const [editEmpresaNome, setEditEmpresaNome] = useState('');
  const [editSegmento, setEditSegmento] = useState('');
  const [editHabilidades, setEditHabilidades] = useState<string[]>([]);
  const [novaHabilidade, setNovaHabilidade] = useState('');
  
  // Estados para experiências
  const [editExperiencias, setEditExperiencias] = useState<{cargo: string; empresa: string; periodo: string}[]>([]);
  const [novaExpCargo, setNovaExpCargo] = useState('');
  const [novaExpEmpresa, setNovaExpEmpresa] = useState('');
  const [novaExpPeriodo, setNovaExpPeriodo] = useState('');

  const abrirModalEdicao = (tipo: 'sobre' | 'experiencia' | 'habilidades' | 'empresa' | 'infopessoal') => {
    setTipoEdicao(tipo);
    
    if (tipo === 'sobre') {
      setEditSobre(user?.perfil?.sobre || '');
    } else if (tipo === 'habilidades') {
      setEditHabilidades(user?.perfil?.habilidades || []);
    } else if (tipo === 'empresa') {
      setEditEmpresaNome(user?.perfil?.empresaNome || '');
      setEditSegmento(user?.perfil?.segmento || '');
    } else if (tipo === 'infopessoal') {
      setEditCargo(user?.perfil?.cargo || '');
      setEditTelefone(user?.perfil?.telefone || '');
      setEditLocalizacao(user?.perfil?.localizacao || '');
    } else if (tipo === 'experiencia') {
      setEditExperiencias(user?.perfil?.experiencias || []);
    }
    
    setModalEdicaoAberto(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberto(false);
    setTipoEdicao(null);
    setNovaHabilidade('');
    setNovaExpCargo('');
    setNovaExpEmpresa('');
    setNovaExpPeriodo('');
  };

  const abrirModalSalvar = () => {
    setModalEdicaoAberto(false);
    setModalSalvarAberto(true);
  };

  const fecharModalSalvar = () => {
    setModalSalvarAberto(false);
    setTipoEdicao(null);
  };

  const confirmarSalvar = () => {
    if (tipoEdicao === 'sobre') {
      updateProfile({ sobre: editSobre });
    } else if (tipoEdicao === 'habilidades') {
      updateProfile({ habilidades: editHabilidades });
    } else if (tipoEdicao === 'empresa') {
      updateProfile({ empresaNome: editEmpresaNome, segmento: editSegmento });
    } else if (tipoEdicao === 'infopessoal') {
      updateProfile({ cargo: editCargo, telefone: editTelefone, localizacao: editLocalizacao });
    } else if (tipoEdicao === 'experiencia') {
      updateProfile({ experiencias: editExperiencias });
    }
    
    // Limpar estados temporários
    setModalSalvarAberto(false);
    setTipoEdicao(null);
    setNovaExpCargo('');
    setNovaExpEmpresa('');
    setNovaExpPeriodo('');
    setNovaHabilidade('');
  };

  const abrirModalFoto = () => {
    setModalFotoAberto(true);
  };

  const fecharModalFoto = () => {
    setModalFotoAberto(false);
  };

  const confirmarAlterarFoto = () => {
    // Aqui você alteraria a foto
    setModalFotoAberto(false);
  };

  const abrirModalCurriculo = () => {
    setModalCurriculoAberto(true);
  };

  const fecharModalCurriculo = () => {
    setModalCurriculoAberto(false);
  };

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() && !editHabilidades.includes(novaHabilidade.trim())) {
      setEditHabilidades([...editHabilidades, novaHabilidade.trim()]);
      setNovaHabilidade('');
    }
  };

  const removerHabilidade = (habilidade: string) => {
    setEditHabilidades(editHabilidades.filter(h => h !== habilidade));
  };

  const adicionarExperiencia = () => {
    if (novaExpCargo.trim() && novaExpEmpresa.trim() && novaExpPeriodo.trim()) {
      setEditExperiencias([...editExperiencias, {
        cargo: novaExpCargo.trim(), 
        empresa: novaExpEmpresa.trim(), 
        periodo: novaExpPeriodo.trim()
      }]);
      setNovaExpCargo('');
      setNovaExpEmpresa('');
      setNovaExpPeriodo('');
    }
  };

  const removerExperiencia = (index: number) => {
    setEditExperiencias(editExperiencias.filter((_, i) => i !== index));
  };

  const exportarCurriculoPDF = () => {
    // Criar o conteúdo do PDF
    const curriculoElement = document.getElementById('curriculo-preview');
    if (!curriculoElement) return;

    // Usar html2canvas e jsPDF para gerar o PDF
    import('html2canvas').then(html2canvas => {
      import('jspdf').then(({ default: jsPDF }) => {
        html2canvas.default(curriculoElement, {
          scale: 2,
          useCORS: true,
          logging: false,
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 0;
          
          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          pdf.save(`curriculo-${user?.nome || 'designer'}.pdf`);
        });
      });
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-slate-800 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
            Meu Perfil
          </h2>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
            {isDesigner ? 'Gerencie suas informações pessoais e profissionais' : 'Gerencie suas informações e acompanhe seus projetos'}
          </p>
        </div>
        {isDesigner && (
          <button
            onClick={abrirModalCurriculo}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
          >
            <FileText size={20} />
            Gerar Currículo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[48px] font-bold leading-[58px]">
                {user?.avatar || 'U'}
              </div>
              <button 
                onClick={abrirModalFoto}
                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Edit size={18} />
              </button>
            </div>
            
            <h3 className="text-slate-800 mb-1 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
              {user?.nome || 'Usuário'}
            </h3>
            <p className="text-slate-600 mb-6 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
              {user?.perfil?.cargo || (isDesigner ? 'Designer' : 'Cliente')}
            </p>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">{user?.email || 'email@exemplo.com'}</span>
              </div>
              {isCliente && user?.perfil?.empresaNome && (
                <div className="flex items-center gap-3 text-slate-700">
                  <Building2 size={18} className="text-blue-600" />
                  <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">{user.perfil.empresaNome}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-700">
                <Phone size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  {user?.perfil?.telefone || 'Não informado'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  {user?.perfil?.localizacao || 'Não informado'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Calendar size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  Membro desde {user?.perfil?.membroDesde || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => abrirModalEdicao('infopessoal')}
                className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Editar Informações
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {isDesigner ? (
            <>
              {/* Designer Content */}
              {/* About */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Sobre Mim
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('sobre')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                {user?.perfil?.sobre ? (
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                    {user.perfil.sobre}
                  </p>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Conte um pouco sobre você e sua experiência profissional
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('sobre')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Descrição
                    </button>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Experiência Profissional
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('experiencia')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                {user?.perfil?.experiencias && user.perfil.experiencias.length > 0 ? (
                  <div className="space-y-4">
                    {user.perfil.experiencias.map((exp, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                            {exp.cargo}
                          </h5>
                          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] mb-1">
                            {exp.empresa}
                          </p>
                          <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                            {exp.periodo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Adicione suas experiências profissionais
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('experiencia')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Experiência
                    </button>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Habilidades
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('habilidades')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                {user?.perfil?.habilidades && user.perfil.habilidades.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.perfil.habilidades.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Adicione suas habilidades e competências
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('habilidades')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Habilidades
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              {projetosArray.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-blue-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.concluidos}</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Concluídos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.emAndamento}</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Ativos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-green-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.clientes}</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Clientes Atendidos
                  </p>
                </div>
              </div>
              )}

              {/* Minhas Empresas */}
              {projetosArray.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px] flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Clientes e Empresas
                  </h4>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
                    {clientesUnicos.length} {clientesUnicos.length === 1 ? 'empresa' : 'empresas'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clientesUnicos.map((cliente, index) => {
                    const corAvatar = coresAvatar[index % coresAvatar.length];
                    const corFundo = coresFundo[index % coresFundo.length];
                    const temAtivos = cliente.projetosAtivos > 0;
                    
                    return (
                      <div 
                        key={cliente.nome}
                        className={`bg-gradient-to-r ${corFundo.from} ${corFundo.to} border ${corFundo.border} rounded-xl p-4 hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${corAvatar} rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0`}>
                            {gerarIniciais(cliente.nome)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                              {cliente.nome}
                            </h5>
                            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                              {temAtivos 
                                ? `${cliente.projetosAtivos} projeto${cliente.projetosAtivos > 1 ? 's' : ''} ativo${cliente.projetosAtivos > 1 ? 's' : ''}`
                                : `${cliente.projetosConcluidos} projeto${cliente.projetosConcluidos > 1 ? 's' : ''} concluído${cliente.projetosConcluidos > 1 ? 's' : ''}`
                              }
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`${temAtivos ? 'bg-green-500' : 'bg-slate-400'} text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold`}>
                                {temAtivos ? 'Ativo' : 'Concluído'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}
            </>
          ) : (
            <>
              {/* Cliente Content */}
              {/* Informações da Empresa */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Informações da Empresa
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('empresa')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                {user?.perfil?.empresaNome || user?.perfil?.segmento ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mb-1">
                          Nome da Empresa
                        </p>
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                          {user?.perfil?.empresaNome || 'Não informado'}
                        </h5>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="text-purple-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mb-1">
                          Segmento
                        </p>
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                          {user?.perfil?.segmento || 'Não informado'}
                        </h5>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-green-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mb-1">
                          Localização
                        </p>
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                          {user?.perfil?.localizacao || 'Não informado'}
                        </h5>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Adicione as informações da sua empresa
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('empresa')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Informações
                    </button>
                  </div>
                )}
              </div>

              {/* Meus Projetos */}
              {projetosArray.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Meus Projetos
                  </h4>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
                    {projetosArray.length} {projetosArray.length === 1 ? 'projeto' : 'projetos'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {projetosArray.slice(0, 5).map((projeto) => {
                    const isConcluido = projeto.status === 'Concluído';
                    const corFundo = isConcluido 
                      ? 'from-green-50 to-emerald-50 border-green-200'
                      : 'from-blue-50 to-indigo-50 border-blue-200';
                    const corBadge = isConcluido 
                      ? 'bg-green-500'
                      : 'bg-blue-500';
                    
                    return (
                      <div key={projeto.id} className={`bg-gradient-to-r ${corFundo} border rounded-xl p-4`}>
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                            {projeto.titulo}
                          </h5>
                          <span className={`${corBadge} text-white px-2 py-1 rounded-md font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold leading-[12px]`}>
                            {projeto.status}
                          </span>
                        </div>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px] mb-3">
                          Cliente: {projeto.cliente}
                        </p>
                        <div className="flex items-center gap-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            {isConcluido ? <CheckCircle2 size={14} /> : <FolderKanban size={14} />}
                            <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px]">
                              {isConcluido ? '100% completo' : `${projeto.progresso || 0}% completo`}
                            </span>
                          </div>
                          {projeto.dataEntrega && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px]">
                                {isConcluido ? 'Entregue' : 'Previsão'}: {projeto.dataEntrega}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Stats do Cliente */}
              {projetosArray.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderKanban className="text-blue-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.emAndamento}</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Ativos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.concluidos}</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Concluídos
                  </p>
                </div>
              </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {modalEdicaoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[32px]">
                {tipoEdicao === 'sobre' && 'Editar Sobre Mim'}
                {tipoEdicao === 'experiencia' && 'Editar Experiência'}
                {tipoEdicao === 'habilidades' && 'Editar Habilidades'}
                {tipoEdicao === 'empresa' && 'Editar Informações da Empresa'}
                {tipoEdicao === 'infopessoal' && 'Editar Informações Pessoais'}
              </h3>
              <button
                onClick={fecharModalEdicao}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {tipoEdicao === 'sobre' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Sobre Você
                  </label>
                  <textarea
                    value={editSobre}
                    onChange={(e) => setEditSobre(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px] min-h-[150px]"
                    placeholder="Conte um pouco sobre você, sua experiência e paixão pelo design..."
                  />
                </div>
              </div>
            )}

            {tipoEdicao === 'habilidades' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Adicionar Habilidade
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={novaHabilidade}
                      onChange={(e) => setNovaHabilidade(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarHabilidade()}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                      placeholder="Ex: UI/UX Design"
                    />
                    <button
                      onClick={adicionarHabilidade}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                
                {editHabilidades.length > 0 && (
                  <div>
                    <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                      Suas Habilidades
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editHabilidades.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removerHabilidade(skill)}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tipoEdicao === 'experiencia' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Adicionar Experiência
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={novaExpCargo}
                      onChange={(e) => setNovaExpCargo(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarExperiencia()}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                      placeholder="Ex: Designer Sênior"
                    />
                    <input
                      type="text"
                      value={novaExpEmpresa}
                      onChange={(e) => setNovaExpEmpresa(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarExperiencia()}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                      placeholder="Ex: TechCorp Solutions"
                    />
                    <input
                      type="text"
                      value={novaExpPeriodo}
                      onChange={(e) => setNovaExpPeriodo(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarExperiencia()}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                      placeholder="Ex: 2018 - 2020"
                    />
                    <button
                      onClick={adicionarExperiencia}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                
                {editExperiencias.length > 0 && (
                  <div>
                    <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                      Suas Experiências
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editExperiencias.map((exp, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium flex items-center gap-2"
                        >
                          {exp.cargo} - {exp.empresa} ({exp.periodo})
                          <button
                            onClick={() => removerExperiencia(index)}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tipoEdicao === 'empresa' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={editEmpresaNome}
                    onChange={(e) => setEditEmpresaNome(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                    placeholder="Ex: TechCorp Solutions"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Segmento
                  </label>
                  <input
                    type="text"
                    value={editSegmento}
                    onChange={(e) => setEditSegmento(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                    placeholder="Ex: Tecnologia e Inovação"
                  />
                </div>
              </div>
            )}

            {tipoEdicao === 'infopessoal' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={editCargo}
                    onChange={(e) => setEditCargo(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                    placeholder="Ex: Designer Sênior & Criativo"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                    placeholder="Ex: +55 (11) 98765-4321"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={editLocalizacao}
                    onChange={(e) => setEditLocalizacao(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                    placeholder="Ex: São Paulo, Brasil"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModalEdicao}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={abrirModalSalvar}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Salvamento */}
      {modalSalvarAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Save className="text-green-600" size={32} />
              </div>
              <h3 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[24px] font-semibold leading-[28px] mb-2">
                Salvar Alterações?
              </h3>
              <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
                Deseja salvar as alterações realizadas no seu perfil?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fecharModalSalvar}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarSalvar}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Foto */}
      {modalFotoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[24px] font-semibold leading-[28px]">
                Alterar Foto de Perfil
              </h3>
              <button
                onClick={fecharModalFoto}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[48px] font-bold leading-[58px] mx-auto mb-4">
                {user?.avatar || 'U'}
              </div>
              <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
                Funcionalidade de upload de foto será implementada em breve.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fecharModalFoto}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Currículo - Mantém a implementação existente */}
      {modalCurriculoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[32px]">
                Pré-visualização do Currículo
              </h3>
              <button
                onClick={fecharModalCurriculo}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div id="curriculo-preview" className="bg-white p-12 mb-6">
              <div className="max-w-3xl mx-auto">
                {/* Header do Currículo */}
                <div className="text-center mb-8 pb-8 border-b-2 border-slate-200">
                  <h1 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[36px] font-bold leading-[42px] mb-2">
                    {user?.nome || 'Seu Nome'}
                  </h1>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[18px] font-medium mb-4">
                    {user?.perfil?.cargo || 'Designer'}
                  </p>
                  <div className="flex justify-center gap-6 text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px]">
                    <span>{user?.email}</span>
                    <span>{user?.perfil?.telefone || 'Telefone não informado'}</span>
                    <span>{user?.perfil?.localizacao || 'Localização não informada'}</span>
                  </div>
                </div>

                {/* Sobre */}
                {user?.perfil?.sobre && (
                  <div className="mb-8">
                    <h2 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[24px] font-bold leading-[28px] mb-3">
                      Sobre
                    </h2>
                    <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] leading-[22px]">
                      {user.perfil.sobre}
                    </p>
                  </div>
                )}

                {/* Experiência */}
                {user?.perfil?.experiencias && user.perfil.experiencias.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[24px] font-bold leading-[28px] mb-4">
                      Experiência Profissional
                    </h2>
                    <div className="space-y-4">
                      {user.perfil.experiencias.map((exp, index) => (
                        <div key={index} className="pb-4 border-b border-slate-100 last:border-0">
                          <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-bold mb-1">
                            {exp.cargo}
                          </h3>
                          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium mb-1">
                            {exp.empresa}
                          </p>
                          <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px]">
                            {exp.periodo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Habilidades */}
                {user?.perfil?.habilidades && user.perfil.habilidades.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[24px] font-bold leading-[28px] mb-3">
                      Habilidades
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {user.perfil.habilidades.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 text-slate-700 px-3 py-1 rounded font-['Kumbh_Sans',sans-serif] text-[12px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fecharModalCurriculo}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Fechar
              </button>
              <button
                onClick={exportarCurriculoPDF}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}