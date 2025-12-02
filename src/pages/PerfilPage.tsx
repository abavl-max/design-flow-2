import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, Award, Calendar, Edit, Building2, FolderKanban, CheckCircle2, X, Save, Users, FileText, Download, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
      projetosArquivados: number;
      total: number;
    }>();
    
    projetosArray.forEach(projeto => {
      const cliente = projeto.cliente;
      if (!clientesMap.has(cliente)) {
        clientesMap.set(cliente, {
          nome: cliente,
          projetosAtivos: 0,
          projetosConcluidos: 0,
          projetosArquivados: 0,
          total: 0
        });
      }
      
      const clienteData = clientesMap.get(cliente)!;
      clienteData.total++;
      
      if (projeto.arquivado) {
        clienteData.projetosArquivados++;
      } else if (projeto.status === 'Concluído') {
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
  const [editEmail, setEditEmail] = useState('');
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
      setEditEmail(user?.email || '');
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
      updateProfile({ cargo: editCargo, email: editEmail, telefone: editTelefone, localizacao: editLocalizacao });
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

  const exportarCurriculoPDF = async () => {
    const curriculoElement = document.getElementById('curriculo-preview');
    if (!curriculoElement) {
      console.error('Elemento curriculo-preview não encontrado');
      return;
    }

    // Clonar o elemento para aplicar estilos compatíveis com html2canvas
    const clone = curriculoElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '800px';
    clone.style.backgroundColor = '#ffffff';
    clone.style.padding = '48px';
    document.body.appendChild(clone);

    // Mapeamento completo de cores Tailwind para RGB
    const colorMap: { [key: string]: string } = {
      // Text colors
      'text-slate-100': '#f1f5f9',
      'text-slate-200': '#e2e8f0',
      'text-slate-300': '#cbd5e1',
      'text-slate-400': '#94a3b8',
      'text-slate-500': '#64748b',
      'text-slate-600': '#475569',
      'text-slate-700': '#334155',
      'text-slate-800': '#1e293b',
      'text-slate-900': '#0f172a',
      // Background colors
      'bg-white': '#ffffff',
      'bg-slate-50': '#f8fafc',
      'bg-slate-100': '#f1f5f9',
      'bg-slate-200': '#e2e8f0',
      'bg-slate-600': '#475569',
      'bg-slate-700': '#334155',
      // Border colors
      'border-slate-100': '#f1f5f9',
      'border-slate-200': '#e2e8f0',
      'border-slate-600': '#475569',
    };

    // Função para remover classes dark: e converter cores
    const processElement = (element: HTMLElement) => {
      // Remover todas as classes dark: se houver className
      if (element.className && typeof element.className === 'string') {
        const classes = element.className.split(' ').filter(cls => !cls.startsWith('dark:'));
        element.className = classes.join(' ');
        
        // Aplicar cores mapeadas como estilos inline
        classes.forEach(cls => {
          const color = colorMap[cls];
          if (color) {
            if (cls.startsWith('text-')) {
              element.style.color = color;
            } else if (cls.startsWith('bg-')) {
              element.style.backgroundColor = color;
            } else if (cls.startsWith('border-')) {
              element.style.borderColor = color;
            }
          }
        });
      }

      // FORÇA todos os estilos computados para RGB - SOLUÇÃO DEFINITIVA
      try {
        const computedStyle = window.getComputedStyle(element);
        
        // Forçar cor de texto
        const textColor = computedStyle.color;
        if (textColor && textColor.includes('oklch')) {
          element.style.color = '#1e293b';
        } else if (!element.style.color) {
          element.style.color = textColor || '#1e293b';
        }
        
        // Forçar background
        const bgColor = computedStyle.backgroundColor;
        if (bgColor && bgColor.includes('oklch')) {
          element.style.backgroundColor = 'transparent';
        } else if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && !element.style.backgroundColor) {
          element.style.backgroundColor = bgColor;
        }
        
        // Forçar border color
        const borderColor = computedStyle.borderColor;
        if (borderColor && borderColor.includes('oklch')) {
          element.style.borderColor = '#e2e8f0';
        } else if (borderColor && !element.style.borderColor) {
          element.style.borderColor = borderColor;
        }

        // Forçar border top/right/bottom/left colors individualmente
        ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(prop => {
          const value = computedStyle[prop as any];
          if (value && value.includes('oklch')) {
            (element.style as any)[prop] = '#e2e8f0';
          }
        });
      } catch (e) {
        // Em caso de erro, aplicar cores padrão
        if (!element.style.color) element.style.color = '#1e293b';
        if (!element.style.borderColor) element.style.borderColor = '#e2e8f0';
      }
      
      // Processar todos os filhos recursivamente
      Array.from(element.children).forEach(child => {
        processElement(child as HTMLElement);
      });
    };

    // Processar o clone ANTES
    processElement(clone);

    try {
      // Gerar canvas do elemento com callback onclone para processar NOVAMENTE
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        windowHeight: clone.scrollHeight,
        onclone: (clonedDoc) => {
          // Processar o documento clonado pelo html2canvas
          const clonedElement = clonedDoc.getElementById('curriculo-preview');
          if (clonedElement) {
            // Processar novamente para garantir que não há oklch
            processElement(clonedElement as HTMLElement);
            
            // FORÇA BRUTAL: percorrer TODOS os elementos e forçar cores RGB
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              
              // Forçar cor de texto para TODOS os elementos
              if (!htmlEl.style.color || htmlEl.style.color.includes('oklch')) {
                htmlEl.style.color = '#1e293b';
              }
              
              // Forçar background
              if (htmlEl.style.backgroundColor && htmlEl.style.backgroundColor.includes('oklch')) {
                htmlEl.style.backgroundColor = 'transparent';
              }
              
              // Forçar todas as bordas
              if (htmlEl.style.borderColor && htmlEl.style.borderColor.includes('oklch')) {
                htmlEl.style.borderColor = '#e2e8f0';
              }
              htmlEl.style.borderTopColor = htmlEl.style.borderTopColor?.includes('oklch') ? '#e2e8f0' : htmlEl.style.borderTopColor || '#e2e8f0';
              htmlEl.style.borderRightColor = htmlEl.style.borderRightColor?.includes('oklch') ? '#e2e8f0' : htmlEl.style.borderRightColor || '#e2e8f0';
              htmlEl.style.borderBottomColor = htmlEl.style.borderBottomColor?.includes('oklch') ? '#e2e8f0' : htmlEl.style.borderBottomColor || '#e2e8f0';
              htmlEl.style.borderLeftColor = htmlEl.style.borderLeftColor?.includes('oklch') ? '#e2e8f0' : htmlEl.style.borderLeftColor || '#e2e8f0';
            });
          }
        },
      });

      // Remover o clone após a captura
      document.body.removeChild(clone);

      // Criar o PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensões mantendo a proporção
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
      
      const finalWidth = (imgWidth * 0.264583) * ratio;
      const finalHeight = (imgHeight * 0.264583) * ratio;
      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, finalWidth, finalHeight);
      pdf.save(`curriculo-${user?.nome?.replace(/\s+/g, '-') || 'designer'}.pdf`);
      
      console.log('PDF gerado com sucesso!');
    } catch (error) {
      // Remover o clone em caso de erro
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
            Meu Perfil
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center">
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
            
            <h3 className="text-slate-800 dark:text-slate-100 mb-1 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
              {user?.nome || 'Usuário'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
              {user?.perfil?.cargo || (isDesigner ? 'Designer' : 'Cliente')}
            </p>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Mail size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">{user?.email || 'email@exemplo.com'}</span>
              </div>
              {isCliente && user?.perfil?.empresaNome && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Building2 size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">{user.perfil.empresaNome}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  {user?.perfil?.telefone || 'Não informado'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  {user?.perfil?.localizacao || 'Não informado'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  Membro desde {user?.perfil?.membroDesde || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => abrirModalEdicao('infopessoal')}
                className="w-full mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
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
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Sobre Mim
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('sobre')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                {user?.perfil?.sobre ? (
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                    {user.perfil.sobre}
                  </p>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 dark:text-slate-500 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Conte um pouco sobre você e sua experiência profissional
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('sobre')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Descrição
                    </button>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Experiência Profissional
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('experiencia')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                {user?.perfil?.experiencias && user.perfil.experiencias.length > 0 ? (
                  <div className="space-y-4">
                    {user.perfil.experiencias.map((exp, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                            {exp.cargo}
                          </h5>
                          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] mb-1">
                            {exp.empresa}
                          </p>
                          <p className="text-slate-500 dark:text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                            {exp.periodo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 dark:text-slate-500 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Adicione suas experiências profissionais
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('experiencia')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Experiência
                    </button>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Habilidades
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('habilidades')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                {user?.perfil?.habilidades && user.perfil.habilidades.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.perfil.habilidades.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 dark:text-slate-500 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Adicione suas habilidades e competências
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('habilidades')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.concluidos}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Concluídos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.emAndamento}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Ativos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.clientes}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Clientes Atendidos
                  </p>
                </div>
              </div>
              )}

              {/* Minhas Empresas */}
              {projetosArray.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px] flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
                    Clientes e Empresas
                  </h4>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
                    {clientesUnicos.length} {clientesUnicos.length === 1 ? 'empresa' : 'empresas'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clientesUnicos.map((cliente, index) => {
                    const corAvatar = coresAvatar[index % coresAvatar.length];
                    const corFundo = coresFundo[index % coresFundo.length];
                    const temAtivos = cliente.projetosAtivos > 0;
                    const somenteArquivados = cliente.projetosAtivos === 0 && cliente.projetosConcluidos === 0 && cliente.projetosArquivados > 0;
                    
                    return (
                      <div 
                        key={cliente.nome}
                        className={`bg-gradient-to-r ${corFundo.from} ${corFundo.to} dark:from-slate-700 dark:to-slate-700/80 border ${corFundo.border} dark:border-slate-600 rounded-xl p-4 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${corAvatar} rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0`}>
                            {gerarIniciais(cliente.nome)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                              {cliente.nome}
                            </h5>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                              {temAtivos 
                                ? `${cliente.projetosAtivos} projeto${cliente.projetosAtivos > 1 ? 's' : ''} ativo${cliente.projetosAtivos > 1 ? 's' : ''}`
                                : somenteArquivados
                                  ? `${cliente.projetosArquivados} projeto${cliente.projetosArquivados > 1 ? 's' : ''} arquivado${cliente.projetosArquivados > 1 ? 's' : ''}`
                                  : `${cliente.projetosConcluidos} projeto${cliente.projetosConcluidos > 1 ? 's' : ''} concluído${cliente.projetosConcluidos > 1 ? 's' : ''}`
                              }
                              {!somenteArquivados && cliente.projetosArquivados > 0 && (
                                <span className="text-slate-500 dark:text-slate-400"> • {cliente.projetosArquivados} arquivado{cliente.projetosArquivados > 1 ? 's' : ''}</span>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`${temAtivos ? 'bg-green-500' : somenteArquivados ? 'bg-slate-500 dark:bg-slate-600' : 'bg-slate-400 dark:bg-slate-500'} text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold`}>
                                {temAtivos ? 'Ativo' : somenteArquivados ? 'Arquivado' : 'Concluído'}
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
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Informações da Empresa
                  </h4>
                  <button 
                    onClick={() => abrirModalEdicao('empresa')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                {user?.perfil?.empresaNome || user?.perfil?.segmento ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mb-1">
                          Nome da Empresa
                        </p>
                        <h5 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                          {user?.perfil?.empresaNome || 'Não informado'}
                        </h5>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="text-purple-600 dark:text-purple-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mb-1">
                          Segmento
                        </p>
                        <h5 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                          {user?.perfil?.segmento || 'Não informado'}
                        </h5>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-green-600 dark:text-green-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mb-1">
                          Localização
                        </p>
                        <h5 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                          {user?.perfil?.localizacao || 'Não informado'}
                        </h5>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 dark:text-slate-500 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] mb-3">
                      Adicione as informações da sua empresa
                    </p>
                    <button
                      onClick={() => abrirModalEdicao('empresa')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                    >
                      <Plus size={16} />
                      Adicionar Informações
                    </button>
                  </div>
                )}
              </div>

              {/* Meus Projetos */}
              {projetosArray.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Meus Projetos
                  </h4>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
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
                      <div key={projeto.id} className={`bg-gradient-to-r ${corFundo} dark:from-slate-700 dark:to-slate-700/80 border dark:border-slate-600 rounded-xl p-4`}>
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                            {projeto.titulo}
                          </h5>
                          <span className={`${corBadge} text-white px-2 py-1 rounded-md font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold leading-[12px]`}>
                            {projeto.status}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px] mb-3">
                          Cliente: {projeto.cliente}
                        </p>
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderKanban className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.emAndamento}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Ativos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">{estatisticas.concluidos}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[32px]">
                {tipoEdicao === 'sobre' && 'Editar Sobre Mim'}
                {tipoEdicao === 'experiencia' && 'Editar Experiência'}
                {tipoEdicao === 'habilidades' && 'Editar Habilidades'}
                {tipoEdicao === 'empresa' && 'Editar Informações da Empresa'}
                {tipoEdicao === 'infopessoal' && 'Editar Informações Pessoais'}
              </h3>
              <button
                onClick={fecharModalEdicao}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {tipoEdicao === 'sobre' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Sobre Você
                  </label>
                  <textarea
                    value={editSobre}
                    onChange={(e) => setEditSobre(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px] min-h-[150px] bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Conte um pouco sobre você, sua experiência e paixão pelo design..."
                  />
                </div>
              </div>
            )}

            {tipoEdicao === 'habilidades' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                    Adicionar Habilidade
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={novaHabilidade}
                      onChange={(e) => setNovaHabilidade(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarHabilidade()}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px] bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                    <label className="block text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold mb-2">
                      Suas Habilidades
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editHabilidades.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removerHabilidade(skill)}
                            className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                    placeholder="Ex: email@exemplo.com"
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[32px]">
                Pré-visualização do Currículo
              </h3>
              <button
                onClick={fecharModalCurriculo}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div id="curriculo-preview" className="bg-white dark:bg-slate-700/50 p-12 mb-6 rounded-xl border border-slate-100 dark:border-slate-600">
              <div className="max-w-3xl mx-auto">
                {/* Header do Currículo */}
                <div className="text-center mb-8 pb-8 border-b-2 border-slate-200 dark:border-slate-600">
                  <h1 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[36px] font-bold leading-[42px] mb-2">
                    {user?.nome || 'Seu Nome'}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[18px] font-medium mb-4">
                    {user?.perfil?.cargo || 'Designer'}
                  </p>
                  <div className="flex justify-center gap-6 text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px]">
                    <span>{user?.email}</span>
                    <span>{user?.perfil?.telefone || 'Telefone não informado'}</span>
                    <span>{user?.perfil?.localizacao || 'Localização não informada'}</span>
                  </div>
                </div>

                {/* Sobre */}
                {user?.perfil?.sobre && (
                  <div className="mb-8">
                    <h2 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[24px] font-bold leading-[28px] mb-3">
                      Sobre
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] leading-[22px]">
                      {user.perfil.sobre}
                    </p>
                  </div>
                )}

                {/* Experiência */}
                {user?.perfil?.experiencias && user.perfil.experiencias.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[24px] font-bold leading-[28px] mb-4">
                      Experiência Profissional
                    </h2>
                    <div className="space-y-4">
                      {user.perfil.experiencias.map((exp, index) => (
                        <div key={index} className="pb-4 border-b border-slate-100 dark:border-slate-600 last:border-0">
                          <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-bold mb-1">
                            {exp.cargo}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium mb-1">
                            {exp.empresa}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px]">
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
                    <h2 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[24px] font-bold leading-[28px] mb-3">
                      Habilidades
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {user.perfil.habilidades.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1 rounded font-['Kumbh_Sans',sans-serif] text-[12px] font-medium"
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
                className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
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