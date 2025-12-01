import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Award, Calendar, Edit, Building2, FolderKanban, CheckCircle2, X, Save, Users, FileText, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function PerfilPage() {
  const { user, isDesigner, isCliente } = useAuth();
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
  const [modalFotoAberto, setModalFotoAberto] = useState(false);
  const [modalCurriculoAberto, setModalCurriculoAberto] = useState(false);
  const [tipoEdicao, setTipoEdicao] = useState<'sobre' | 'experiencia' | 'habilidades' | 'empresa' | null>(null);

  const abrirModalEdicao = (tipo: 'sobre' | 'experiencia' | 'habilidades' | 'empresa') => {
    setTipoEdicao(tipo);
    setModalEdicaoAberto(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberto(false);
    setTipoEdicao(null);
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
    // Aqui você salvaria as alterações
    setModalSalvarAberto(false);
    setTipoEdicao(null);
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
              {isDesigner ? 'Designer Sênior & Criativo' : 'Cliente Premium'}
            </p>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">{user?.email || 'email@exemplo.com'}</span>
              </div>
              {isCliente && (
                <div className="flex items-center gap-3 text-slate-700">
                  <Building2 size={18} className="text-blue-600" />
                  <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">TechCorp Solutions</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-700">
                <Phone size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">+55 (11) 98765-4321</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">São Paulo, Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Calendar size={18} className="text-blue-600" />
                <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">Membro desde Jan 2024</span>
              </div>
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
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                  Designer com mais de 8 anos de experiência em branding, design de interfaces e 
                  experiência do usuário. Apaixonado por criar soluções visuais que conectam marcas 
                  com seus públicos de forma autêntica e memorável.
                </p>
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
                
                <div className="space-y-4">
                  <div className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                        Designer Sênior
                      </h5>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] mb-1">
                        DesignFlow Studio
                      </p>
                      <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                        Jan 2024 - Presente
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="text-purple-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                        Designer de Produto
                      </h5>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] mb-1">
                        TechVision Labs
                      </p>
                      <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                        Mar 2020 - Dez 2023
                      </p>
                    </div>
                  </div>
                </div>
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
                
                <div className="flex flex-wrap gap-2">
                  {['UI/UX Design', 'Branding', 'Figma', 'Adobe Creative Suite', 'Prototipagem', 'Design Systems', 'Ilustração', 'Motion Design'].map((skill) => (
                    <span
                      key={skill}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-blue-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">24</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Concluídos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">4</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Ativos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-green-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">18</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Clientes Satisfeitos
                  </p>
                </div>
              </div>

              {/* Minhas Empresas */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px] flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Clientes e Empresas
                  </h4>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
                    6 empresas
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0">
                        TC
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          TechCorp Solutions
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          3 projetos ativos
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0">
                        SI
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          StartupHub Incubadora
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          2 projetos ativos
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0">
                        EF
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          EcoFriendly Brasil
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          1 projeto ativo
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0">
                        FA
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          FashionArt Studio
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          5 projetos concluídos
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-400 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            Concluído
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0">
                        FD
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          FoodDelivery Express
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          4 projetos concluídos
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-400 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            Concluído
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[16px] font-bold flex-shrink-0">
                        ST
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          SmartTech Inovações
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          2 projetos concluídos
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-400 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            Concluído
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                        TechCorp Solutions
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
                        Tecnologia e Inovação
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
                        São Paulo, SP - Brasil
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meus Projetos */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Meus Projetos
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                        Redesign Website Corporativo
                      </h5>
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-md font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold leading-[12px]">
                        Em Andamento
                      </span>
                    </div>
                    <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px] mb-3">
                      Redesign completo do website institucional
                    </p>
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <FolderKanban size={14} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px]">
                          65% completo
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px]">
                          Previsão: 15/12/2024
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px]">
                        Logo e Identidade Visual
                      </h5>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-md font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold leading-[12px]">
                        Concluído
                      </span>
                    </div>
                    <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px] mb-3">
                      Criação da identidade visual da marca
                    </p>
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px]">
                          Finalizado
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px]">
                          Concluído em 20/10/2024
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats do Cliente */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderKanban className="text-blue-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">2</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Ativos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-purple-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">3</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Projetos Concluídos
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-green-600" size={24} />
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-1">8</p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    Meses de Parceria
                  </p>
                </div>
              </div>

              {/* Designers Colaboradores */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px] flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    Designers Colaboradores
                  </h4>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
                    4 designers
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[18px] font-bold flex-shrink-0">
                        LS
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          Lucas Silva
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          Designer Sênior • UI/UX Specialist
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            2 Projetos Ativos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[18px] font-bold flex-shrink-0">
                        MO
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          Marina Oliveira
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          Designer Pleno • Branding Expert
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            1 Projeto Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[18px] font-bold flex-shrink-0">
                        RC
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          Rafael Costa
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          Designer Júnior • Motion Designer
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-400 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            2 Projetos Concluídos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[18px] font-bold flex-shrink-0">
                        AS
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                          Ana Santos
                        </h5>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-2">
                          Designer Sênior • Ilustradora
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-400 text-white px-2 py-0.5 rounded font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            1 Projeto Concluído
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {modalEdicaoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                {tipoEdicao === 'sobre' && 'Editar Sobre Mim'}
                {tipoEdicao === 'experiencia' && 'Editar Experiência'}
                {tipoEdicao === 'habilidades' && 'Editar Habilidades'}
                {tipoEdicao === 'empresa' && 'Editar Informações da Empresa'}
              </h3>
              <button
                onClick={fecharModalEdicao}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-4">
                {tipoEdicao === 'sobre' && (
                  <div>
                    <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                      Descrição
                    </label>
                    <textarea
                      placeholder="Conte um pouco sobre você..."
                      rows={6}
                      defaultValue="Designer com mais de 8 anos de experiência em branding, design de interfaces e experiência do usuário. Apaixonado por criar soluções visuais que conectam marcas com seus públicos de forma autêntica e memorável."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px] resize-none"
                    />
                  </div>
                )}

                {tipoEdicao === 'experiencia' && (
                  <div className="space-y-4">
                    <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                      Funcionalidade de edição de experiência em desenvolvimento...
                    </p>
                  </div>
                )}

                {tipoEdicao === 'habilidades' && (
                  <div className="space-y-4">
                    <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                      Funcionalidade de edição de habilidades em desenvolvimento...
                    </p>
                  </div>
                )}

                {tipoEdicao === 'empresa' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        defaultValue="TechCorp Solutions"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                        Segmento
                      </label>
                      <input
                        type="text"
                        defaultValue="Tecnologia e Inovação"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModalEdicao}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={abrirModalSalvar}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Foto */}
      {modalFotoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Alterar Foto de Perfil
              </h3>
              <button
                onClick={fecharModalFoto}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[36px] font-bold leading-[42px]">
                  {user?.avatar || 'U'}
                </div>
                <div className="text-center">
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                    Escolha uma nova foto
                  </p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                    Formatos aceitos: JPG, PNG (máx. 5MB)
                  </p>
                </div>
                <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold">
                  Escolher Arquivo
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModalFoto}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAlterarFoto}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Salvar Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Salvamento */}
      {modalSalvarAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Confirmar Alterações
              </h3>
              <button
                onClick={fecharModalSalvar}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  💾
                </div>
                <div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                    Salvar alterações?
                  </p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                    As informações do seu perfil serão atualizadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModalSalvar}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarSalvar}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Currículo */}
      {modalCurriculoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px] mb-1">
                  📄 Currículo Rápido
                </h3>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                  Pré-visualização do seu currículo profissional
                </p>
              </div>
              <button
                onClick={fecharModalCurriculo}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Currículo Preview */}
            <div className="p-6 bg-slate-50 max-h-[60vh] overflow-y-auto">
              <div id="curriculo-preview" className="bg-white p-8 shadow-sm">
                {/* Header do Currículo */}
                <div className="text-center mb-6 pb-6 border-b-2 border-blue-500">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-['Maven_Pro',sans-serif] text-[36px] font-bold">
                    {user?.avatar || 'U'}
                  </div>
                  <h1 className="text-slate-900 font-['Maven_Pro',sans-serif] text-[32px] font-bold mb-2">
                    {user?.nome || 'Usuário'}
                  </h1>
                  <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[18px] font-medium mb-4">
                    Designer Sênior & Criativo
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[14px]">{user?.email || 'email@exemplo.com'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[14px]">+55 (11) 98765-4321</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[14px]">São Paulo, Brasil</span>
                    </div>
                  </div>
                </div>

                {/* Sobre */}
                <div className="mb-6">
                  <h2 className="text-slate-900 font-['Maven_Pro',sans-serif] text-[20px] font-bold mb-3 flex items-center gap-2">
                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                    Perfil Profissional
                  </h2>
                  <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] leading-[22px]">
                    Designer com mais de 8 anos de experiência em branding, design de interfaces e 
                    experiência do usuário. Apaixonado por criar soluções visuais que conectam marcas 
                    com seus públicos de forma autêntica e memorável.
                  </p>
                </div>

                {/* Experiência */}
                <div className="mb-6">
                  <h2 className="text-slate-900 font-['Maven_Pro',sans-serif] text-[20px] font-bold mb-3 flex items-center gap-2">
                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                    Experiência Profissional
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-bold">
                        Designer Sênior
                      </h3>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium">
                        DesignFlow Studio
                      </p>
                      <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] mb-2">
                        Jan 2024 - Presente
                      </p>
                      <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[13px] leading-[20px]">
                        Liderança em projetos de branding e design de interfaces, gerenciando equipes multidisciplinares 
                        e entregando soluções criativas para clientes nacionais e internacionais.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-bold">
                        Designer de Produto
                      </h3>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium">
                        TechVision Labs
                      </p>
                      <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] mb-2">
                        Mar 2020 - Dez 2023
                      </p>
                      <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[13px] leading-[20px]">
                        Desenvolvimento de interfaces e experiências digitais para produtos SaaS, 
                        com foco em usabilidade e design centrado no usuário.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Habilidades */}
                <div className="mb-6">
                  <h2 className="text-slate-900 font-['Maven_Pro',sans-serif] text-[20px] font-bold mb-3 flex items-center gap-2">
                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                    Habilidades Técnicas
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {['UI/UX Design', 'Branding', 'Figma', 'Adobe Creative Suite', 'Prototipagem', 'Design Systems', 'Ilustração', 'Motion Design'].map((skill) => (
                      <span
                        key={skill}
                        className="bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Empresas */}
                <div className="mb-6">
                  <h2 className="text-slate-900 font-['Maven_Pro',sans-serif] text-[20px] font-bold mb-3 flex items-center gap-2">
                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                    Empresas Colaboradoras
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-slate-200 rounded p-3">
                      <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold">TechCorp Solutions</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">3 projetos ativos</p>
                    </div>
                    <div className="border border-slate-200 rounded p-3">
                      <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold">StartupHub Incubadora</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">2 projetos ativos</p>
                    </div>
                    <div className="border border-slate-200 rounded p-3">
                      <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold">EcoFriendly Brasil</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">1 projeto ativo</p>
                    </div>
                    <div className="border border-slate-200 rounded p-3">
                      <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold">FashionArt Studio</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">5 projetos concluídos</p>
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="border-t-2 border-slate-200 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-900 font-['Maven_Pro',sans-serif] text-[28px] font-bold">24</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">Projetos Concluídos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-900 font-['Maven_Pro',sans-serif] text-[28px] font-bold">4</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">Projetos Ativos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-900 font-['Maven_Pro',sans-serif] text-[28px] font-bold">18</p>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px]">Clientes Satisfeitos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModalCurriculo}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Fechar
              </button>
              <button
                onClick={exportarCurriculoPDF}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
