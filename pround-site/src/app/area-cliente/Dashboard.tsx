'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brand } from '../components/Brand'
import { Icon } from '../components/Icon'
import { useLanguage, type Language } from '../components/LanguageProvider'
import { contactHref } from '@/lib/contact'
import { SiteEditor } from './SiteEditor'
import { TicketConversation } from './TicketConversation'
import {
  createTicket,
  deleteMyAccount,
  loadBriefs,
  loadDashboard,
  markNotificationsRead,
  signOutUser,
  updateBriefStatus,
  updateTicketStatus,
  type Account,
  type BriefRecord,
  type BriefStatus,
  type NotificationRecord,
  type SiteRecord,
  type TicketRecord,
} from '@/lib/db'

type View = 'overview' | 'projects' | 'myProjects' | 'sites' | 'tickets' | 'history' | 'assistant' | 'support' | 'settings'

const copy = {
  'pt-BR': {
    overview: 'Visão geral',
    sites: 'Meus sites',
    tickets: 'Chamados',
    history: 'Histórico',
    assistant: 'Assistente Proud',
    support: 'Central de ajuda',
    settings: 'Privacidade e conta',
    newProject: 'Novo projeto',
    notifications: 'Notificações',
    noNotifications: 'Nenhuma notificação por enquanto.',
    markRead: 'Marcar como lidas',
    logout: 'Sair',
    back: 'Voltar para o site',
    hello: 'Olá',
    adminSummary: 'Acompanhe clientes, sites e chamados em um só lugar.',
    clientSummary: 'Acompanhe seus sites, chamados e manutenções.',
    activeSites: 'Sites ativos',
    openTickets: 'Chamados abertos',
    resolvedTickets: 'Chamados resolvidos',
    clients: 'Clientes',
    allSites: 'Todos os sites',
    yourSites: 'Seus sites',
    editSite: 'Editar site',
    siteEmpty: 'Nenhum site está registrado para esta conta.',
    setup: 'Em configuração',
    online: 'Online',
    plan: 'Plano',
    owner: 'Cliente',
    requestSupport: 'Solicitar suporte',
    supportTickets: 'Chamados de suporte',
    clientTickets: 'Todos os chamados dos clientes e seus status.',
    ownTickets: 'Acompanhe suas solicitações e atualizações.',
    newTicket: 'Novo chamado',
    noTickets: 'Nenhum chamado aberto.',
    status: 'Status',
    open: 'Aberto',
    inProgress: 'Em andamento',
    resolved: 'Resolvido',
    startWork: 'Marcar em andamento',
    resolve: 'Marcar como resolvido',
    ticketActionError: 'Não foi possível atualizar o chamado. Tente novamente.',
    openConversation: 'Abrir conversa',
    maintenanceHistory: 'Histórico de manutenções',
    adminHistory: 'Chamados resolvidos em todos os sites.',
    ownHistory: 'Intervenções concluídas somente nos seus sites.',
    noHistory: 'Nenhuma manutenção concluída.',
    resolvedOn: 'Resolvido em',
    immediateHelp: 'Ajuda imediata para dúvidas básicas',
    assistantWelcome:
      'Olá! Sou o assistente virtual da Proud. Respondo dúvidas comuns sobre site fora do ar, atualizações e acesso; para qualquer outra coisa, abra um chamado.',
    assistantFallback:
      'Não tenho uma resposta pronta para isso. Abra um chamado e conte o que está acontecendo: nossa equipe responde pelo painel.',
    describeQuestion: 'Descreva sua dúvida...',
    sendMessage: 'Enviar mensagem',
    quickQuestions: 'Perguntas rápidas',
    quick1: 'Por que meu site não está carregando?',
    quick2: 'A atualização ainda não apareceu',
    quick3: 'Não consigo fazer login',
    helpTitle: 'Como podemos cuidar do seu site hoje?',
    helpText:
      'Abra um chamado para erros, alterações ou dúvidas. Você acompanhará cada mudança de status.',
    askAI: 'Perguntar ao assistente primeiro',
    faq: 'Dúvidas frequentes',
    faq1: 'O que devo informar no chamado?',
    faq1a: 'Conte o que aconteceu, em qual página e quando o problema começou.',
    faq2: 'Como acompanho uma correção?',
    faq2a: 'Cada chamado mostra o status atual e vai para o histórico quando for resolvido.',
    privacyTitle: 'Seus dados e sua privacidade',
    privacyText:
      'Guardamos nome, e-mail, telefone, função e os dados operacionais dos seus sites e chamados, com acesso restrito à sua conta e à equipe Proud.',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Uso',
    cookies: 'Política de Cookies',
    refund: 'Política de Reembolso',
    accountControl: 'Controle da conta',
    deleteAccount: 'Excluir conta e dados',
    deleteText: 'Remove esta conta de cliente, seus sites, chamados e notificações locais.',
    deleteRequest: 'Solicitar exclusão dos dados',
    deleteTitle: 'Excluir sua conta e os dados locais?',
    deleteConfirm:
      'Sua conta e todos os seus dados (sites, chamados e notificações) serão apagados. Esta ação não pode ser desfeita.',
    adminProtected: 'A conta administrativa fixa não pode ser excluída.',
    cancel: 'Cancelar',
    delete: 'Excluir meus dados',
    openTicket: 'Abrir novo chamado',
    site: 'Site',
    requestType: 'Tipo de solicitação',
    technical: 'Problema técnico',
    content: 'Alteração de conteúdo',
    feature: 'Nova funcionalidade',
    question: 'Dúvida',
    impact: 'Impacto',
    low: 'Baixo — dúvida ou melhoria',
    medium: 'Médio — afeta parte do site',
    high: 'Alto — site ou venda indisponível',
    subject: 'Assunto',
    subjectPlaceholder: 'Ex.: Ajuste no formulário',
    description: 'Descrição do problema',
    descriptionPlaceholder: 'Conte o que está acontecendo e o resultado esperado...',
    ticketPrivacy:
      'Os dados serão usados somente para o atendimento deste chamado.',
    sendTicket: 'Enviar chamado',
    ticketCreated: 'Chamado registrado!',
    protocol: 'Protocolo',
    createdMessage: 'foi criado e já aparece na aba Chamados.',
    understood: 'Entendi',
    close: 'Fechar',
    admin: 'Administrador',
    client: 'Cliente',
    answerSiteDown:
      'Confira se o endereço foi digitado certo e recarregue a página (Ctrl+F5). Teste em outra aba, em outro navegador e em outra rede (ex.: dados do celular). Se continuar fora do ar, abra um chamado com impacto Alto.',
    answerUpdate:
      'Mudanças podem levar alguns minutos para aparecer. Force a atualização (Ctrl+F5) ou abra o site em uma aba anônima. Se depois de 30 minutos ainda não mudou, abra um chamado do tipo Alteração de conteúdo.',
    answerLogin:
      'Na tela de login, use Esqueci minha senha: enviaremos um link por e-mail (veja também o spam). A senha precisa ter 10+ caracteres com maiúsculas, minúsculas e números. Muitas tentativas seguidas bloqueiam o login por alguns minutos.',
    answerTicket:
      'Abra um chamado na aba Chamados informando o que aconteceu, em qual página e quando começou. Você acompanha o status ali e, quando for resolvido, ele vai para o Histórico.',
    answerProject:
      'Para um novo site ou reformulação, use o botão Novo projeto, no topo da página: conte sua ideia e a equipe entra em contato.',
    projects: 'Projetos',
    projectsTitle: 'Projetos enviados',
    projectsSubtitle:
      'Todos os briefings recebidos pelo botão Novo projeto, com os dados completos e o contato do cliente.',
    myProjects: 'Meus projetos',
    myProjectsSubtitle: 'Acompanhe o que você enviou e o andamento de cada projeto.',
    noClientProjects: 'Nenhum projeto enviado está vinculado a esta conta.',
    noProjects: 'Nenhum projeto recebido ainda.',
    noProjectsFilter: 'Nenhum projeto neste filtro.',
    searchProjects: 'Buscar por cliente, serviço, contato ou mensagem',
    exportCsv: 'Exportar CSV',
    noSearchMatch: 'Nenhum projeto corresponde à busca.',
    filterAll: 'Todos',
    statusNew: 'Novo',
    statusContacted: 'Contatado',
    statusClosed: 'Encerrado',
    viewDetails: 'Ver detalhes',
    projectDetails: 'Detalhes do projeto',
    receivedOn: 'Recebido em',
    sentOn: 'Enviado em',
    updatedOn: 'Atualizado em',
    serviceLabel: 'Serviço',
    objectiveLabel: 'Objetivo',
    featuresLabel: 'Funcionalidades',
    ideaLabel: 'Mensagem do cliente',
    contactLabel: 'Contato preferido',
    accountLabel: 'Conta no site',
    visitor: 'Visitante (sem login)',
    noFeatures: 'Nenhuma selecionada',
    viaEmail: 'E-mail',
    viaWhatsapp: 'WhatsApp',
    viaOther: 'Contato',
    replyEmail: 'Responder por e-mail',
    openWhatsapp: 'Abrir WhatsApp',
    copyContact: 'Copiar contato',
    copied: 'Copiado!',
    markContacted: 'Marcar como contatado',
    closeProject: 'Encerrar projeto',
    reopenProject: 'Reabrir como novo',
    statusError: 'Não foi possível atualizar o status agora. Tente novamente.',
    projectsError: 'Não foi possível carregar os projetos agora.',
    retry: 'Tentar de novo',
    loading: 'Carregando...',
    projectsTruncated: 'Mostrando os 500 mais recentes de',
    ofTotal: 'projetos.',
  },
  en: {
    overview: 'Overview',
    sites: 'My Sites',
    tickets: 'Tickets',
    history: 'History',
    assistant: 'Proud Assistant',
    support: 'Help Center',
    settings: 'Privacy and Account',
    newProject: 'New Project',
    notifications: 'Notifications',
    noNotifications: 'No notifications yet.',
    markRead: 'Mark all as read',
    logout: 'Sign out',
    back: 'Back to website',
    hello: 'Hello',
    adminSummary: 'Track clients, sites and tickets in one place.',
    clientSummary: 'Track your sites, tickets and maintenance.',
    activeSites: 'Active sites',
    openTickets: 'Open tickets',
    resolvedTickets: 'Resolved tickets',
    clients: 'Clients',
    allSites: 'All sites',
    yourSites: 'Your sites',
    editSite: 'Edit site',
    siteEmpty: 'No site is registered to this account.',
    setup: 'In setup',
    online: 'Online',
    plan: 'Plan',
    owner: 'Client',
    requestSupport: 'Request support',
    supportTickets: 'Support tickets',
    clientTickets: 'All client tickets and their current status.',
    ownTickets: 'Follow your requests and updates.',
    newTicket: 'New ticket',
    noTickets: 'No open tickets.',
    status: 'Status',
    open: 'Open',
    inProgress: 'In progress',
    resolved: 'Resolved',
    startWork: 'Mark as in progress',
    resolve: 'Mark as resolved',
    ticketActionError: 'Could not update the ticket. Please try again.',
    openConversation: 'Open conversation',
    maintenanceHistory: 'Maintenance history',
    adminHistory: 'Resolved tickets from every site.',
    ownHistory: 'Completed work only for your registered sites.',
    noHistory: 'No completed maintenance.',
    resolvedOn: 'Resolved on',
    immediateHelp: 'Immediate help for basic questions',
    assistantWelcome:
      'Hello! I am Proud’s virtual assistant. I answer common questions about a site being down, updates and access; for anything else, open a ticket.',
    assistantFallback:
      'I don’t have a ready answer for that. Open a ticket and tell us what is happening: our team replies through the dashboard.',
    describeQuestion: 'Describe your question...',
    sendMessage: 'Send message',
    quickQuestions: 'Quick questions',
    quick1: 'Why is my website not loading?',
    quick2: 'The update is not visible yet',
    quick3: 'I cannot sign in',
    helpTitle: 'How can we take care of your website today?',
    helpText: 'Open a ticket for errors, changes or questions. You can follow every status update.',
    askAI: 'Ask the assistant first',
    faq: 'Frequently asked questions',
    faq1: 'What should I include in a ticket?',
    faq1a: 'Tell us what happened, on which page and when the problem started.',
    faq2: 'How do I follow a fix?',
    faq2a: 'Each ticket shows its current status and moves to history when resolved.',
    privacyTitle: 'Your data and privacy',
    privacyText:
      'We store your name, email, phone, role and the operational data of your sites and tickets, with access restricted to your account and the Proud team.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    cookies: 'Cookie Policy',
    refund: 'Refund Policy',
    accountControl: 'Account control',
    deleteAccount: 'Delete account and data',
    deleteText: 'Removes this client account, its sites, tickets and local notifications.',
    deleteRequest: 'Request data deletion',
    deleteTitle: 'Delete your account and local data?',
    deleteConfirm: 'Your account and all your data (sites, tickets and notifications) will be deleted. This cannot be undone.',
    adminProtected: 'The fixed administrator account cannot be deleted.',
    cancel: 'Cancel',
    delete: 'Delete my data',
    openTicket: 'Open new ticket',
    site: 'Site',
    requestType: 'Request type',
    technical: 'Technical problem',
    content: 'Content change',
    feature: 'New feature',
    question: 'Question',
    impact: 'Impact',
    low: 'Low — question or improvement',
    medium: 'Medium — affects part of the site',
    high: 'High — site or sales unavailable',
    subject: 'Subject',
    subjectPlaceholder: 'Example: Form adjustment',
    description: 'Problem description',
    descriptionPlaceholder: 'Describe what is happening and the expected result...',
    ticketPrivacy: 'The data will only be used to handle this ticket.',
    sendTicket: 'Send ticket',
    ticketCreated: 'Ticket created!',
    protocol: 'Protocol',
    createdMessage: 'was created and now appears in the Tickets tab.',
    understood: 'Got it',
    close: 'Close',
    admin: 'Administrator',
    client: 'Client',
    answerSiteDown:
      'Check the address was typed correctly and reload the page (Ctrl+F5). Try another tab, another browser and another network (e.g. mobile data). If it is still down, open a ticket with High impact.',
    answerUpdate:
      'Changes can take a few minutes to show up. Force a refresh (Ctrl+F5) or open the site in a private window. If nothing changed after 30 minutes, open a Content change ticket.',
    answerLogin:
      'On the sign-in page use Forgot my password: we will email you a link (check spam too). Passwords need 10+ characters with upper case, lower case and numbers. Too many attempts in a row lock sign-in for a few minutes.',
    answerTicket:
      'Open a ticket in the Tickets tab telling us what happened, on which page and when it started. You can follow its status there, and once resolved it moves to History.',
    answerProject:
      'For a new site or a redesign, use the New Project button at the top of the page: tell us your idea and the team will get in touch.',
    projects: 'Projects',
    projectsTitle: 'Submitted projects',
    projectsSubtitle:
      'Every brief received through the New Project button, with full details and the client’s contact.',
    myProjects: 'My projects',
    myProjectsSubtitle: 'Follow what you submitted and each project’s status.',
    noClientProjects: 'No submitted projects are linked to this account.',
    noProjects: 'No projects received yet.',
    noProjectsFilter: 'No projects in this filter.',
    searchProjects: 'Search client, service, contact or message',
    exportCsv: 'Export CSV',
    noSearchMatch: 'No projects match your search.',
    filterAll: 'All',
    statusNew: 'New',
    statusContacted: 'Contacted',
    statusClosed: 'Closed',
    viewDetails: 'View details',
    projectDetails: 'Project details',
    receivedOn: 'Received on',
    sentOn: 'Submitted on',
    updatedOn: 'Updated on',
    serviceLabel: 'Service',
    objectiveLabel: 'Goal',
    featuresLabel: 'Features',
    ideaLabel: 'Client message',
    contactLabel: 'Preferred contact',
    accountLabel: 'Site account',
    visitor: 'Visitor (not signed in)',
    noFeatures: 'None selected',
    viaEmail: 'Email',
    viaWhatsapp: 'WhatsApp',
    viaOther: 'Contact',
    replyEmail: 'Reply by email',
    openWhatsapp: 'Open WhatsApp',
    copyContact: 'Copy contact',
    copied: 'Copied!',
    markContacted: 'Mark as contacted',
    closeProject: 'Close project',
    reopenProject: 'Reopen as new',
    statusError: 'Could not update the status right now. Please try again.',
    projectsError: 'Could not load the projects right now.',
    retry: 'Try again',
    loading: 'Loading...',
    projectsTruncated: 'Showing the 500 most recent of',
    ofTotal: 'projects.',
  },
  es: {
    overview: 'Vista general',
    sites: 'Mis sitios',
    tickets: 'Tickets',
    history: 'Historial',
    assistant: 'Asistente de Proud',
    support: 'Centro de ayuda',
    settings: 'Privacidad y cuenta',
    newProject: 'Nuevo proyecto',
    notifications: 'Notificaciones',
    noNotifications: 'Aún no hay notificaciones.',
    markRead: 'Marcar todas como leídas',
    logout: 'Salir',
    back: 'Volver al sitio',
    hello: 'Hola',
    adminSummary: 'Acompaña clientes, sitios y tickets en un solo lugar.',
    clientSummary: 'Acompaña tus sitios, tickets y mantenimientos.',
    activeSites: 'Sitios activos',
    openTickets: 'Tickets abiertos',
    resolvedTickets: 'Tickets resueltos',
    clients: 'Clientes',
    allSites: 'Todos los sitios',
    yourSites: 'Tus sitios',
    editSite: 'Editar sitio',
    siteEmpty: 'Ningún sitio está registrado para esta cuenta.',
    setup: 'En configuración',
    online: 'En línea',
    plan: 'Plan',
    owner: 'Cliente',
    requestSupport: 'Solicitar soporte',
    supportTickets: 'Tickets de soporte',
    clientTickets: 'Todos los tickets de clientes y su estado actual.',
    ownTickets: 'Acompaña tus solicitudes y actualizaciones.',
    newTicket: 'Nuevo ticket',
    noTickets: 'No hay tickets abiertos.',
    status: 'Estado',
    open: 'Abierto',
    inProgress: 'En curso',
    resolved: 'Resuelto',
    startWork: 'Marcar en curso',
    resolve: 'Marcar como resuelto',
    ticketActionError: 'No se pudo actualizar el ticket. Inténtalo de nuevo.',
    openConversation: 'Abrir conversación',
    maintenanceHistory: 'Historial de mantenimientos',
    adminHistory: 'Tickets resueltos de todos los sitios.',
    ownHistory: 'Trabajos concluidos solo para tus sitios registrados.',
    noHistory: 'No hay mantenimientos concluidos.',
    resolvedOn: 'Resuelto el',
    immediateHelp: 'Ayuda inmediata para dudas básicas',
    assistantWelcome:
      '¡Hola! Soy el asistente virtual de Proud. Respondo dudas comunes sobre sitio caído, actualizaciones y acceso; para cualquier otra cosa, abre un ticket.',
    assistantFallback:
      'No tengo una respuesta lista para eso. Abre un ticket y cuenta qué está ocurriendo: nuestro equipo responde desde el panel.',
    describeQuestion: 'Describe tu duda...',
    sendMessage: 'Enviar mensaje',
    quickQuestions: 'Preguntas rápidas',
    quick1: '¿Por qué mi sitio no está cargando?',
    quick2: 'La actualización todavía no aparece',
    quick3: 'No puedo iniciar sesión',
    helpTitle: '¿Cómo podemos cuidar tu sitio hoy?',
    helpText: 'Abre un ticket para errores, cambios o dudas. Podrás seguir cada cambio de estado.',
    askAI: 'Preguntar primero al asistente',
    faq: 'Preguntas frecuentes',
    faq1: '¿Qué debo informar en el ticket?',
    faq1a: 'Cuéntanos qué ocurrió, en qué página y cuándo comenzó el problema.',
    faq2: '¿Cómo acompaño una corrección?',
    faq2a: 'Cada ticket muestra su estado actual y pasa al historial cuando se resuelve.',
    privacyTitle: 'Tus datos y tu privacidad',
    privacyText:
      'Guardamos nombre, correo, teléfono, función y los datos operativos de tus sitios y tickets, con acceso restringido a tu cuenta y al equipo de Proud.',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Uso',
    cookies: 'Política de Cookies',
    refund: 'Política de Reembolso',
    accountControl: 'Control de la cuenta',
    deleteAccount: 'Eliminar cuenta y datos',
    deleteText: 'Elimina esta cuenta de cliente, sus sitios, tickets y notificaciones locales.',
    deleteRequest: 'Solicitar eliminación de datos',
    deleteTitle: '¿Eliminar tu cuenta y los datos locales?',
    deleteConfirm:
      'Tu cuenta y todos tus datos (sitios, tickets y notificaciones) serán eliminados. Esta acción es irreversible.',
    adminProtected: 'La cuenta fija de administrador no puede ser eliminada.',
    cancel: 'Cancelar',
    delete: 'Eliminar mis datos',
    openTicket: 'Abrir nuevo ticket',
    site: 'Sitio',
    requestType: 'Tipo de solicitud',
    technical: 'Problema técnico',
    content: 'Cambio de contenido',
    feature: 'Nueva funcionalidad',
    question: 'Duda',
    impact: 'Impacto',
    low: 'Bajo — duda o mejora',
    medium: 'Medio — afecta parte del sitio',
    high: 'Alto — sitio o venta no disponible',
    subject: 'Asunto',
    subjectPlaceholder: 'Ej.: Ajuste en el formulario',
    description: 'Descripción del problema',
    descriptionPlaceholder: 'Cuenta qué está ocurriendo y el resultado esperado...',
    ticketPrivacy: 'Los datos se usarán solo para atender este ticket.',
    sendTicket: 'Enviar ticket',
    ticketCreated: '¡Ticket registrado!',
    protocol: 'Protocolo',
    createdMessage: 'fue creado y ya aparece en la pestaña Tickets.',
    understood: 'Entendido',
    close: 'Cerrar',
    admin: 'Administrador',
    client: 'Cliente',
    answerSiteDown:
      'Verifica que la dirección esté bien escrita y recarga la página (Ctrl+F5). Prueba en otra pestaña, otro navegador y otra red (p. ej. datos del móvil). Si sigue caído, abre un ticket con impacto Alto.',
    answerUpdate:
      'Los cambios pueden tardar unos minutos en aparecer. Fuerza la actualización (Ctrl+F5) o abre el sitio en una ventana privada. Si pasados 30 minutos no cambió, abre un ticket de Cambio de contenido.',
    answerLogin:
      'En la pantalla de acceso usa Olvidé mi contraseña: te enviaremos un enlace por correo (revisa también el spam). La contraseña necesita 10+ caracteres con mayúsculas, minúsculas y números. Demasiados intentos seguidos bloquean el acceso unos minutos.',
    answerTicket:
      'Abre un ticket en la pestaña Tickets contando qué pasó, en qué página y cuándo empezó. Allí sigues el estado y, al resolverse, pasa al Historial.',
    answerProject:
      'Para un sitio nuevo o un rediseño, usa el botón Nuevo proyecto, arriba en la página: cuéntanos tu idea y el equipo te contactará.',
    projects: 'Proyectos',
    projectsTitle: 'Proyectos enviados',
    projectsSubtitle:
      'Todos los briefings recibidos con el botón Nuevo proyecto, con los datos completos y el contacto del cliente.',
    myProjects: 'Mis proyectos',
    myProjectsSubtitle: 'Acompaña lo que enviaste y el estado de cada proyecto.',
    noClientProjects: 'No hay proyectos enviados vinculados a esta cuenta.',
    noProjects: 'Aún no se recibieron proyectos.',
    noProjectsFilter: 'Ningún proyecto en este filtro.',
    searchProjects: 'Buscar cliente, servicio, contacto o mensaje',
    exportCsv: 'Exportar CSV',
    noSearchMatch: 'Ningún proyecto coincide con la búsqueda.',
    filterAll: 'Todos',
    statusNew: 'Nuevo',
    statusContacted: 'Contactado',
    statusClosed: 'Cerrado',
    viewDetails: 'Ver detalles',
    projectDetails: 'Detalles del proyecto',
    receivedOn: 'Recibido el',
    sentOn: 'Enviado el',
    updatedOn: 'Actualizado el',
    serviceLabel: 'Servicio',
    objectiveLabel: 'Objetivo',
    featuresLabel: 'Funcionalidades',
    ideaLabel: 'Mensaje del cliente',
    contactLabel: 'Contacto preferido',
    accountLabel: 'Cuenta en el sitio',
    visitor: 'Visitante (sin sesión)',
    noFeatures: 'Ninguna seleccionada',
    viaEmail: 'Correo',
    viaWhatsapp: 'WhatsApp',
    viaOther: 'Contacto',
    replyEmail: 'Responder por correo',
    openWhatsapp: 'Abrir WhatsApp',
    copyContact: 'Copiar contacto',
    copied: '¡Copiado!',
    markContacted: 'Marcar como contactado',
    closeProject: 'Cerrar proyecto',
    reopenProject: 'Reabrir como nuevo',
    statusError: 'No se pudo actualizar el estado ahora. Inténtalo de nuevo.',
    projectsError: 'No se pudieron cargar los proyectos ahora.',
    retry: 'Reintentar',
    loading: 'Cargando...',
    projectsTruncated: 'Mostrando los 500 más recientes de',
    ofTotal: 'proyectos.',
  },
} as const

const recordTranslations: Record<string, { en: string; es: string }> = {
  'Ajuste no formulário de contato': {
    en: 'Contact form adjustment',
    es: 'Ajuste en el formulario de contacto',
  },
  'Atualização de textos da página Sobre': {
    en: 'About page copy update',
    es: 'Actualización de textos de la página Nosotros',
  },
  Crescimento: { en: 'Growth', es: 'Crecimiento' },
  'Sob medida': { en: 'Tailored', es: 'A medida' },
  'Em definição': { en: 'To be defined', es: 'Por definir' },
}

function localizeRecord(value: string, language: Language) {
  return language === 'pt-BR' ? value : (recordTranslations[value]?.[language] ?? value)
}

function localizeNotification(notification: NotificationRecord, language: Language) {
  const brandedNotification = {
    ...notification,
    message: notification.message.replaceAll('Pround', 'Proud'),
  }
  if (language === 'pt-BR') return brandedNotification
  const titleMap: Record<string, { en: string; es: string }> = {
    'Novo chamado': { en: 'New ticket', es: 'Nuevo ticket' },
    'Chamado criado': { en: 'Ticket created', es: 'Ticket creado' },
    'Chamado resolvido': { en: 'Ticket resolved', es: 'Ticket resuelto' },
    'Novo briefing': { en: 'New project brief', es: 'Nuevo briefing' },
  }
  const message =
    language === 'en'
      ? brandedNotification.message
          .replace('foi recebido pela Proud.', 'was received by Proud.')
          .replace(
            'foi movido para o histórico de manutenções.',
            'was moved to maintenance history.',
          )
      : brandedNotification.message
          .replace('foi recebido pela Proud.', 'fue recibido por Proud.')
          .replace(
            'foi movido para o histórico de manutenções.',
            'fue movido al historial de mantenimientos.',
          )
  return {
    ...brandedNotification,
    title: titleMap[notification.title]?.[language] ?? notification.title,
    message,
  }
}

function statusTone(status: TicketRecord['status']) {
  if (status === 'resolved') return 'bg-[#E5F1EC] text-[#31634F]'
  if (status === 'in-progress') return 'bg-[#FFF0C8] text-[#8C6714]'
  return 'bg-[#E9E9E4] text-[#60757A]'
}

function briefStatusTone(status: BriefStatus) {
  if (status === 'closed') return 'bg-[#E9E9E4] text-[#60757A]'
  if (status === 'contacted') return 'bg-[#E5F1EC] text-[#31634F]'
  return 'bg-[#FFF0C8] text-[#8C6714]'
}

// Assistente de dúvidas comuns: respostas prontas escolhidas por palavras-chave (não é um modelo de IA).
function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const answerRules: Array<{ key: 'answerSiteDown' | 'answerUpdate' | 'answerLogin' | 'answerTicket' | 'answerProject'; words: string[] }> = [
  { key: 'answerSiteDown', words: ['carreg', 'fora do ar', 'nao abre', 'nao funciona', 'offline', 'loading', 'not loading', 'down', 'cargando', 'no abre', 'no carga', 'caido'] },
  { key: 'answerUpdate', words: ['atualiza', 'alteracao', 'mudanca', 'cache', 'nao apareceu', 'update', 'change', 'not visible', 'actualiza', 'cambio', 'no aparece'] },
  { key: 'answerLogin', words: ['login', 'entrar', 'senha', 'acesso', 'password', 'sign in', 'log in', 'contrasena', 'ingresar', 'acceso'] },
  { key: 'answerTicket', words: ['chamado', 'ticket', 'protocolo', 'protocol', 'suporte', 'support', 'soporte'] },
  { key: 'answerProject', words: ['novo site', 'novo projeto', 'orcamento', 'preco', 'valor', 'plano', 'new site', 'new project', 'price', 'plan', 'quote', 'nuevo sitio', 'nuevo proyecto', 'precio', 'presupuesto'] },
]

export function Dashboard() {
  const router = useRouter()
  const { language } = useLanguage()
  const text = copy[language]
  const [loaded, setLoaded] = useState(false)
  const [account, setAccount] = useState<Account | null>(null)
  const [sites, setSites] = useState<SiteRecord[]>([])
  const [tickets, setTickets] = useState<TicketRecord[]>([])
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [view, setView] = useState<View>('sites')
  const [newBriefs, setNewBriefs] = useState(0)
  const [briefs, setBriefs] = useState<BriefRecord[]>([])
  const [briefsTotal, setBriefsTotal] = useState(0)
  const [briefsState, setBriefsState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [briefFilter, setBriefFilter] = useState<'all' | BriefStatus>('all')
  const [briefSearch, setBriefSearch] = useState('')
  const [openBriefId, setOpenBriefId] = useState<string | null>(null)
  const [briefError, setBriefError] = useState('')
  const [ticketActionError, setTicketActionError] = useState('')
  const [editingSite, setEditingSite] = useState<SiteRecord | null>(null)
  const [activeTicket, setActiveTicket] = useState<TicketRecord | null>(null)
  const [copied, setCopied] = useState(false)
  const initialViewSet = useRef(false)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [createdTicket, setCreatedTicket] = useState<TicketRecord | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([])

  async function refresh() {
    try {
      const data = await loadDashboard()
      setAccount(data.account)
      setSites(data.sites)
      setTickets(data.tickets)
      setNotifications(data.notifications)
      setNewBriefs(data.newBriefs ?? 0)
      // O administrador começa na Visão geral (antes ficava preso em "Meus sites"); só na primeira carga.
      if (data.account?.role === 'admin' && !initialViewSet.current) {
        initialViewSet.current = true
        setView('overview')
      }
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => {
    void refresh()
    const handleChange = () => void refresh()
    window.addEventListener('pround-data-change', handleChange)
    return () => window.removeEventListener('pround-data-change', handleChange)
  }, [])

  useEffect(() => {
    setMessages([{ role: 'assistant', text: text.assistantWelcome }])
  }, [text.assistantWelcome])

  const isAdmin = account?.role === 'admin'

  const refreshBriefs = useCallback(async () => {
    setBriefsState((current) => (current === 'ready' ? current : 'loading'))
    const data = await loadBriefs()
    if (!data) {
      setBriefsState('error')
      return
    }
    setBriefs(data.briefs)
    setBriefsTotal(data.total)
    setBriefsState('ready')
  }, [])

  // Os projetos são carregados apenas ao abrir a aba correspondente e atualizados após mudanças.
  useEffect(() => {
    if ((isAdmin && view !== 'projects') || (!isAdmin && view !== 'myProjects')) return
    void refreshBriefs()
    const handleChange = () => void refreshBriefs()
    window.addEventListener('pround-data-change', handleChange)
    return () => window.removeEventListener('pround-data-change', handleChange)
  }, [isAdmin, view, refreshBriefs])

  // Esc fecha os detalhes do projeto
  useEffect(() => {
    if (!openBriefId) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenBriefId(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openBriefId])

  const openBrief = briefs.find((brief) => brief.id === openBriefId) ?? null
  const visibleBriefs = briefs.filter((brief) => {
    const matchesStatus = briefFilter === 'all' || brief.status === briefFilter
    const query = normalizeText(briefSearch.trim())
    const matchesSearch =
      !query ||
      normalizeText(
        [
          brief.service,
          brief.objective,
          brief.features.join(' '),
          brief.idea,
          brief.contact,
          brief.account?.name ?? '',
          brief.account?.email ?? '',
          brief.account?.phone ?? '',
        ].join(' '),
      ).includes(query)
    return matchesStatus && matchesSearch
  })
  const briefCount = (status: BriefStatus) => briefs.filter((brief) => brief.status === status).length
  const briefStatusLabel = (status: BriefStatus) =>
    status === 'new' ? text.statusNew : status === 'contacted' ? text.statusContacted : text.statusClosed

  async function changeBriefStatus(id: string, status: BriefStatus) {
    setBriefError('')
    const ok = await updateBriefStatus(id, status)
    if (!ok) setBriefError(text.statusError)
  }

  function exportBriefs() {
    const headers =
      language === 'pt-BR'
        ? ['Serviço', 'Objetivo', 'Recursos', 'Descrição', 'Contato', 'Nome', 'E-mail', 'Telefone', 'Status', 'Data']
        : language === 'es'
          ? ['Servicio', 'Objetivo', 'Funciones', 'Descripción', 'Contacto', 'Nombre', 'Correo', 'Teléfono', 'Estado', 'Fecha']
          : ['Service', 'Objective', 'Features', 'Description', 'Contact', 'Name', 'Email', 'Phone', 'Status', 'Date']
    const rows = visibleBriefs.map((brief) => [
      brief.service,
      brief.objective,
      brief.features.join('; '),
      brief.idea,
      brief.contact,
      brief.account?.name ?? '',
      brief.account?.email ?? '',
      brief.account?.phone ?? '',
      briefStatusLabel(brief.status),
      new Date(brief.createdAt).toLocaleString(language),
    ])
    const csvCell = (value: string) => {
      const safeValue = value.replace(/^\s*[=+\-@]/, (prefix) => `'${prefix}`)
      return `"${safeValue.replace(/"/g, '""')}"`
    }
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => csvCell(String(value))).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `projetos-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  async function changeTicketStatus(id: string, status: 'in-progress' | 'resolved') {
    setTicketActionError('')
    const ok = await updateTicketStatus(id, status)
    if (!ok) setTicketActionError(text.ticketActionError)
  }

  async function copyContact(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt(text.copyContact, value)
    }
  }

  const ownerEmail = account?.email ?? ''
  const visibleSites = useMemo(
    () => (isAdmin ? sites : sites.filter((site) => site.ownerEmail === ownerEmail)),
    [isAdmin, ownerEmail, sites],
  )
  const visibleTickets = useMemo(
    () => (isAdmin ? tickets : tickets.filter((ticket) => ticket.ownerEmail === ownerEmail)),
    [isAdmin, ownerEmail, tickets],
  )
  const openTickets = visibleTickets.filter((ticket) => ticket.status !== 'resolved')
  const ticketList = isAdmin ? visibleTickets : openTickets
  const history = visibleTickets.filter((ticket) => ticket.status === 'resolved')
  const visibleNotifications = notifications.filter(
    (notification) => notification.ownerEmail === (isAdmin ? 'admin' : ownerEmail),
  )
  const unreadCount = visibleNotifications.filter((notification) => !notification.read).length

  const nav = [
    ...(isAdmin
      ? [
          { id: 'overview' as const, label: text.overview, icon: 'globe' as const },
          { id: 'projects' as const, label: text.projects, icon: 'folder' as const, badge: newBriefs },
        ]
      : [{ id: 'myProjects' as const, label: text.myProjects, icon: 'folder' as const }]),
    { id: 'sites' as const, label: text.sites, icon: 'site' as const },
    {
      id: 'tickets' as const,
      label: text.tickets,
      icon: 'ticket' as const,
      badge: openTickets.length,
    },
    { id: 'history' as const, label: text.history, icon: 'history' as const },
    { id: 'assistant' as const, label: text.assistant, icon: 'spark' as const },
    { id: 'support' as const, label: text.support, icon: 'headset' as const },
    { id: 'settings' as const, label: text.settings, icon: 'shield' as const },
  ]

  async function signOut() {
    await signOutUser()
    router.push('/entrar')
  }

  async function removeAccount() {
    if (!account || isAdmin) return
    const deleted = await deleteMyAccount()
    if (!deleted) {
      window.alert('Não foi possível excluir a conta agora. Tente novamente em instantes.')
      return
    }
    router.push('/')
  }

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!account) return
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const siteId = String(form.get('siteId') ?? '')
    const site = visibleSites.find((item) => item.id === siteId)
    if (!site) return
    try {
      const created = await createTicket({
        siteId: site.id,
        subject: String(form.get('subject') ?? ''),
        description: String(form.get('description') ?? ''),
        type: String(form.get('type') ?? 'technical'),
        impact: String(form.get('impact') ?? 'low'),
      })
      setCreatedTicket({
        id: created.id,
        subject: String(form.get('subject') ?? ''),
        description: String(form.get('description') ?? ''),
        siteId: site.id,
        siteName: created.siteName,
        ownerEmail: site.ownerEmail,
        type: String(form.get('type') ?? 'technical'),
        impact: String(form.get('impact') ?? 'low'),
        status: 'open',
        createdAt: new Date().toISOString(),
      })
      setView('tickets')
    } catch {
      window.alert('Não foi possível criar o chamado agora. Tente novamente em instantes.')
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = question.trim()
    if (!clean) return
    const normalized = normalizeText(clean)
    const rule = answerRules.find((item) => item.words.some((word) => normalized.includes(word)))
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: rule ? text[rule.key] : text.assistantFallback },
    ])
    setQuestion('')
  }

  if (!loaded) {
    return (
      <main className="grid min-h-[calc(100vh-2.5rem)] place-items-center bg-[#E9E9E4] p-6">
        <p className="text-sm text-[#60757A]">Carregando...</p>
      </main>
    )
  }

  if (!account) {
    return (
      <main className="grid min-h-[calc(100vh-2.5rem)] place-items-center bg-[#E9E9E4] p-6">
        <div className="max-w-md rounded-[2rem] bg-white p-8 text-center">
          <Brand />
          <h1 className="mt-6 text-2xl font-semibold">{text.sites}</h1>
          <p className="mt-3 text-sm text-[#60757A]">{text.clientSummary}</p>
          <Link
            href="/entrar"
            className="btn btn-ink mt-7 px-6 py-3 text-sm"
          >
            {language === 'pt-BR' ? 'Entrar' : language === 'en' ? 'Sign in' : 'Ingresar'}
          </Link>
        </div>
      </main>
    )
  }

  const initials = account.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <main className="min-h-[calc(100vh-2.5rem)] bg-[#E9E9E4] text-[#163B43]">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden min-h-[calc(100vh-2.5rem)] border-r border-[#163B43]/8 bg-[#F7F7F3] p-5 lg:flex lg:flex-col">
          <div className="px-2 py-4">
            <Brand />
          </div>
          <nav className="mt-6 space-y-1">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition duration-300 ${
                  view === item.id ? 'bg-gradient-to-r from-[#163B43] to-[#1D4A54] text-white shadow-lg shadow-[#163B43]/25' : 'text-[#60757A] hover:bg-[#E9E9E4] hover:text-[#163B43]'
                }`}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
                {'badge' in item && (item.badge ?? 0) > 0 && (
                  <span className="ml-auto grid size-5 place-items-center rounded-full bg-[#C5AD87] text-[10px] font-bold text-[#163B43]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <Link href="/" className="mt-auto px-3 text-xs text-[#87979A]">
            ← {text.back}
          </Link>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-10 z-30 flex min-h-20 items-center justify-between gap-3 border-b border-[#163B43]/8 bg-[#E9E9E4]/85 px-4 py-3 backdrop-blur-xl sm:px-8">
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/projeto"
                className="hidden rounded-full bg-[#163B43] px-4 py-2.5 text-xs font-semibold text-white sm:block"
              >
                {text.newProject}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  aria-label={text.notifications}
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((current) => !current)
                    markNotificationsRead()
                  }}
                  className="relative grid size-10 place-items-center rounded-full bg-white"
                >
                  <Icon name="bell" className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#A14D3F] text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-[#163B43]/10 bg-white p-3 shadow-2xl">
                    <div className="flex items-center justify-between px-2 py-2">
                      <h2 className="text-sm font-semibold">{text.notifications}</h2>
                      <button
                        type="button"
                        onClick={() => markNotificationsRead()}
                        className="text-[10px] font-semibold text-[#9B7F57]"
                      >
                        {text.markRead}
                      </button>
                    </div>
                    <div className="max-h-72 space-y-2 overflow-auto">
                      {visibleNotifications.length ? (
                        visibleNotifications.map((notification) => {
                          const localized = localizeNotification(notification, language)
                          const toProjects = isAdmin && notification.title === 'Novo briefing'
                          const content = (
                            <>
                              <p className="text-xs font-semibold">{localized.title}</p>
                              <p className="mt-1 text-[11px] leading-5 text-[#667A7F]">
                                {localized.message}
                              </p>
                            </>
                          )
                          return toProjects ? (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => {
                                setNotificationsOpen(false)
                                setView('projects')
                              }}
                              className="block w-full rounded-xl bg-[#F7F7F3] p-3 text-left transition hover:bg-[#F0ECE4]"
                            >
                              {content}
                            </button>
                          ) : (
                            <div key={notification.id} className="rounded-xl bg-[#F7F7F3] p-3">
                              {content}
                            </div>
                          )
                        })
                      ) : (
                        <p className="px-2 py-6 text-center text-xs text-[#87979A]">
                          {text.noNotifications}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <span className="grid size-10 place-items-center rounded-full bg-[#C5AD87] text-xs font-bold">
                {initials}
              </span>
              <div className="hidden md:block">
                <p className="text-xs font-semibold">{account.name}</p>
                <p className="text-[10px] text-[#87979A]">{isAdmin ? text.admin : text.client}</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-[#163B43]/10 bg-white px-3 py-2 text-[10px] font-semibold"
              >
                {text.logout}
              </button>
            </div>
          </header>

          <div className="border-b border-[#163B43]/8 bg-[#F7F7F3] px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${view === item.id ? 'bg-[#163B43] text-white' : 'bg-[#E9E9E4]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
            <div className="grain relative isolate mb-8 flex flex-wrap items-end justify-between gap-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1D4A54] to-[#0F2B31] p-6 text-white shadow-lift sm:p-8">
              <div className="aurora-soft absolute inset-0" />
              <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10" />
              <div className="relative z-10">
                <h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                  {text.hello}, {account.name.split(' ')[0]}.
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  {isAdmin ? text.adminSummary : text.clientSummary}
                </p>
              </div>
              {(view === 'tickets' || view === 'sites') && visibleSites.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCreatedTicket(null)
                    setTicketOpen(true)
                  }}
                  className="btn btn-sand relative z-10 px-5 py-3 text-xs"
                >
                  <Icon name="plus" className="size-4" /> {text.newTicket}
                </button>
              )}
            </div>

            {view === 'overview' && isAdmin && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [text.activeSites, sites.length],
                  [
                    text.openTickets,
                    tickets.filter((ticket) => ticket.status !== 'resolved').length,
                  ],
                  [
                    text.resolvedTickets,
                    tickets.filter((ticket) => ticket.status === 'resolved').length,
                  ],
                  [text.clients, new Set(sites.map((site) => site.ownerEmail)).size],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="card-lift group rounded-2xl border border-[#163B43]/8 bg-white p-6"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-[#F0ECE4] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#E3D3B3] group-hover:to-[#C5AD87]">
                      <Icon
                        name={(['site', 'ticket', 'history', 'globe'] as const)[index]}
                        className="size-5 text-[#9B7F57] transition group-hover:text-[#163B43]"
                      />
                    </span>
                    <strong className="mt-5 block text-4xl tabular-nums tracking-[-.04em]">
                      {value}
                    </strong>
                    <p className="mt-2 text-sm text-[#60757A]">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {view === 'projects' && isAdmin && (
              <section className="overflow-hidden rounded-2xl border border-[#163B43]/8 bg-white">
                <div className="border-b border-[#163B43]/8 p-5">
                  <h2 className="font-semibold">{text.projectsTitle}</h2>
                  <p className="mt-1 text-xs text-[#87979A]">{text.projectsSubtitle}</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="search"
                      value={briefSearch}
                      onChange={(event) => setBriefSearch(event.target.value)}
                      placeholder={text.searchProjects}
                      aria-label={text.searchProjects}
                      className="form-input min-w-0 flex-1"
                    />
                    <button
                      type="button"
                      onClick={exportBriefs}
                      disabled={!visibleBriefs.length}
                      className="btn btn-outline shrink-0 px-4 py-3 text-xs disabled:opacity-50"
                    >
                      {text.exportCsv}
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(
                      [
                        ['all', text.filterAll, briefs.length],
                        ['new', text.statusNew, briefCount('new')],
                        ['contacted', text.statusContacted, briefCount('contacted')],
                        ['closed', text.statusClosed, briefCount('closed')],
                      ] as const
                    ).map(([id, label, count]) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={briefFilter === id}
                        onClick={() => setBriefFilter(id)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          briefFilter === id ? 'bg-[#163B43] text-white' : 'bg-[#E9E9E4] hover:bg-[#DDDDD6]'
                        }`}
                      >
                        {label} <span className="opacity-60">{count}</span>
                      </button>
                    ))}
                  </div>
                  {briefsState === 'ready' && briefsTotal > briefs.length && (
                    <p className="mt-3 text-[11px] text-[#87979A]">
                      {text.projectsTruncated} {briefsTotal} {text.ofTotal}
                    </p>
                  )}
                </div>
                {briefsState === 'error' ? (
                  <div className="p-8">
                    <p role="alert" className="text-sm text-red-800">{text.projectsError}</p>
                    <button type="button" onClick={() => void refreshBriefs()} className="btn btn-ink mt-4 px-4 py-2.5 text-xs">
                      {text.retry}
                    </button>
                  </div>
                ) : briefsState !== 'ready' ? (
                  <p className="p-8 text-sm text-[#667A7F]">{text.loading}</p>
                ) : visibleBriefs.length ? (
                  <div className="divide-y divide-[#163B43]/8">
                    {visibleBriefs.map((brief) => (
                      <article
                        key={brief.id}
                        className="grid gap-4 p-5 transition-colors hover:bg-[#F7F7F3] md:grid-cols-[1fr_auto] md:items-center"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold">{brief.service}</h3>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${briefStatusTone(brief.status)}`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              {briefStatusLabel(brief.status)}
                            </span>
                          </div>
                          <p className="mt-1 break-words text-xs text-[#87979A]">
                            {brief.contact} · {new Date(brief.createdAt).toLocaleString(language)}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#667A7F]">{brief.idea}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setBriefError('')
                            setOpenBriefId(brief.id)
                          }}
                          className="btn btn-outline px-4 py-2.5 text-xs"
                        >
                          {text.viewDetails}
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="p-8 text-sm text-[#667A7F]">
                    {briefSearch.trim()
                      ? text.noSearchMatch
                      : briefs.length
                        ? text.noProjectsFilter
                        : text.noProjects}
                  </p>
                )}
              </section>
            )}

            {view === 'myProjects' && !isAdmin && (
              <section className="overflow-hidden rounded-2xl border border-[#163B43]/8 bg-white">
                <div className="border-b border-[#163B43]/8 p-5">
                  <h2 className="font-semibold">{text.myProjects}</h2>
                  <p className="mt-1 text-xs text-[#87979A]">{text.myProjectsSubtitle}</p>
                </div>
                {briefsState === 'error' ? (
                  <div className="p-8">
                    <p role="alert" className="text-sm text-red-800">{text.projectsError}</p>
                    <button
                      type="button"
                      onClick={() => void refreshBriefs()}
                      className="btn btn-ink mt-4 px-4 py-2.5 text-xs"
                    >
                      {text.retry}
                    </button>
                  </div>
                ) : briefsState !== 'ready' ? (
                  <p className="p-8 text-sm text-[#667A7F]">{text.loading}</p>
                ) : briefs.length ? (
                  <div className="divide-y divide-[#163B43]/8">
                    {briefs.map((brief) => (
                      <article key={brief.id} className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold">{brief.service}</h3>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${briefStatusTone(brief.status)}`}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            {briefStatusLabel(brief.status)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#87979A]">
                          {text.sentOn} {new Date(brief.createdAt).toLocaleDateString(language)}
                          {brief.updatedAt !== brief.createdAt && (
                            <>
                              {' · '}{text.updatedOn}{' '}
                              {new Date(brief.updatedAt).toLocaleDateString(language)}
                            </>
                          )}
                        </p>
                        <p className="mt-4 text-xs font-semibold text-[#9B7F57]">{brief.objective}</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#667A7F]">
                          {brief.idea}
                        </p>
                        {brief.features.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {brief.features.map((feature) => (
                              <span
                                key={feature}
                                className="rounded-full bg-[#F0ECE4] px-3 py-1.5 text-[10px] font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="p-8 text-sm text-[#667A7F]">{text.noClientProjects}</p>
                )}
              </section>
            )}

            {view === 'sites' && (
              <section>
                <h2 className="text-xl font-semibold">
                  {isAdmin ? text.allSites : text.yourSites}
                </h2>
                {visibleSites.length ? (
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    {visibleSites.map((site) => (
                      <article
                        key={site.id}
                        className="card-lift relative overflow-hidden rounded-2xl border border-[#163B43]/8 bg-white p-6"
                      >
                        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C5AD87] via-[#E3D3B3] to-[#9B7F57]" />
                        <div className="flex items-start justify-between">
                          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#1D4A54] to-[#0F2B31] font-bold text-[#C5AD87] shadow-md">
                            {site.name.slice(0, 2).toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                              site.status === 'online'
                                ? 'bg-[#E5F1EC] text-[#31634F]'
                                : 'bg-[#FFF0C8] text-[#8C6714]'
                            }`}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            {site.status === 'online' ? text.online : text.setup}
                          </span>
                        </div>
                        <h3 className="mt-5 text-xl font-semibold">{site.name}</h3>
                        <p className="mt-1 text-sm text-[#667A7F]">{site.url}</p>
                        <div className="mt-5 grid gap-3 border-t border-[#163B43]/8 pt-5 text-xs sm:grid-cols-2">
                          <p>
                            <span className="text-[#97A4A6]">{text.plan}</span>
                            <br />
                            <strong>{localizeRecord(site.plan, language)}</strong>
                          </p>
                          {isAdmin && (
                            <p>
                              <span className="text-[#97A4A6]">{text.owner}</span>
                              <br />
                              <strong>{site.ownerEmail}</strong>
                            </p>
                          )}
                        </div>
                        <div className={`mt-5 grid gap-2 ${isAdmin ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => setEditingSite(site)}
                              className="btn btn-outline py-3 text-sm"
                            >
                              {text.editSite}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCreatedTicket(null)
                              setTicketOpen(true)
                            }}
                            className="btn btn-outline w-full py-3 text-sm"
                          >
                            {text.requestSupport}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-2xl bg-white p-8 text-sm text-[#667A7F]">
                    {text.siteEmpty}
                  </p>
                )}
              </section>
            )}

            {view === 'tickets' && (
              <section className="overflow-hidden rounded-2xl border border-[#163B43]/8 bg-white">
                <div className="border-b border-[#163B43]/8 p-5">
                  <h2 className="font-semibold">{text.supportTickets}</h2>
                  <p className="mt-1 text-xs text-[#87979A]">
                    {isAdmin ? text.clientTickets : text.ownTickets}
                  </p>
                </div>
                {ticketActionError && (
                  <p role="alert" className="m-5 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
                    {ticketActionError}
                  </p>
                )}
                {ticketList.length ? (
                  <div className="divide-y divide-[#163B43]/8">
                    {ticketList.map((ticket) => (
                      <article
                        key={ticket.id}
                        className="grid gap-4 p-5 transition-colors hover:bg-[#F7F7F3] md:grid-cols-[90px_1fr_auto] md:items-center"
                      >
                        <span className="text-xs font-semibold text-[#87979A]">#{ticket.id}</span>
                        <div>
                          <h3 className="text-sm font-semibold">
                            {localizeRecord(ticket.subject, language)}
                          </h3>
                          <p className="mt-1 text-xs text-[#87979A]">
                            {ticket.siteName} · {ticket.ownerEmail}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusTone(ticket.status)}`}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            {ticket.status === 'open'
                              ? text.open
                              : ticket.status === 'in-progress'
                                ? text.inProgress
                                : text.resolved}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTicket(ticket)}
                            className="btn btn-outline px-3 py-2 text-[10px]"
                          >
                            {text.openConversation}
                          </button>
                          {isAdmin && ticket.status === 'open' && (
                            <button
                              type="button"
                              onClick={() => void changeTicketStatus(ticket.id, 'in-progress')}
                              className="btn btn-outline px-3 py-2 text-[10px]"
                            >
                              {text.startWork}
                            </button>
                          )}
                          {isAdmin && ticket.status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() => void changeTicketStatus(ticket.id, 'resolved')}
                              className="btn btn-ink px-3 py-2 text-[10px]"
                            >
                              {text.resolve}
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="p-8 text-sm text-[#667A7F]">{text.noTickets}</p>
                )}
              </section>
            )}

            {view === 'history' && (
              <section className="rounded-2xl border border-[#163B43]/8 bg-white p-6">
                <h2 className="font-semibold">{text.maintenanceHistory}</h2>
                <p className="mt-1 text-xs text-[#87979A]">
                  {isAdmin ? text.adminHistory : text.ownHistory}
                </p>
                {history.length ? (
                  <div className="mt-6 divide-y divide-[#163B43]/8">
                    {history.map((ticket) => (
                      <article key={ticket.id} className="py-5 first:pt-0">
                        <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#87979A]">
                          {text.resolvedOn}{' '}
                          {new Date(ticket.resolvedAt ?? ticket.createdAt).toLocaleDateString(
                            language,
                          )}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold">
                          {localizeRecord(ticket.subject, language)}
                        </h3>
                        <p className="mt-1 text-xs text-[#667A7F]">
                          {ticket.siteName} · {ticket.ownerEmail}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTicket(ticket)}
                          className="btn btn-outline mt-3 px-3 py-2 text-[10px]"
                        >
                          {text.openConversation}
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-[#667A7F]">{text.noHistory}</p>
                )}
              </section>
            )}

            {view === 'assistant' && (
              <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
                <section className="overflow-hidden rounded-2xl border border-[#163B43]/8 bg-white">
                  <div className="bg-gradient-to-r from-[#1D4A54] to-[#0F2B31] p-5 text-white">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] text-[#163B43]">
                        <Icon name="spark" className="size-4" />
                      </span>
                      {text.assistant}
                    </h2>
                    <p className="mt-1 text-xs text-white/55">{text.immediateHelp}</p>
                  </div>
                  <div className="min-h-80 space-y-3 bg-[#F7F7F3] p-5">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : ''}`}
                      >
                        <p
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-gradient-to-br from-[#1D4A54] to-[#163B43] text-white shadow-md' : 'bg-white text-[#526A70] shadow-sm'}`}
                        >
                          {message.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={submitQuestion}
                    className="flex gap-2 border-t border-[#163B43]/8 p-4"
                  >
                    <input
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder={text.describeQuestion}
                      aria-label={text.describeQuestion}
                      className="form-input min-w-0 flex-1"
                    />
                    <button
                      type="submit"
                      aria-label={text.sendMessage}
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-[#163B43] text-white"
                    >
                      <Icon name="arrow" />
                    </button>
                  </form>
                </section>
                <aside className="rounded-2xl bg-[#F0ECE4] p-5">
                  <h2 className="text-xs font-bold uppercase tracking-[.12em] text-[#9B7F57]">
                    {text.quickQuestions}
                  </h2>
                  <div className="mt-4 space-y-2">
                    {[text.quick1, text.quick2, text.quick3].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuestion(item)}
                        className="w-full rounded-xl bg-white px-3 py-3 text-left text-xs leading-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {visibleSites.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCreatedTicket(null)
                        setTicketOpen(true)
                      }}
                      className="btn btn-ink mt-5 w-full px-4 py-3 text-xs"
                    >
                      <Icon name="plus" className="size-4" /> {text.openTicket}
                    </button>
                  )}
                </aside>
              </div>
            )}

            {view === 'support' && (
              <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
                <section className="grain relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D4A54] to-[#0F2B31] p-7 text-white shadow-lift">
                  <Icon name="headset" className="size-8 text-[#C5AD87]" />
                  <h2 className="mt-6 text-2xl font-semibold">{text.helpTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">{text.helpText}</p>
                  <button
                    type="button"
                    onClick={() => setView('assistant')}
                    className="btn btn-sand mt-7 px-5 py-3 text-sm"
                  >
                    {text.askAI}
                  </button>
                </section>
                <section className="rounded-2xl bg-white p-6">
                  <h2 className="font-semibold">{text.faq}</h2>
                  {[
                    [text.faq1, text.faq1a],
                    [text.faq2, text.faq2a],
                  ].map(([questionText, answer]) => (
                    <details key={questionText} className="border-b border-[#163B43]/8 py-4">
                      <summary className="cursor-pointer text-sm font-semibold">
                        {questionText}
                      </summary>
                      <p className="pt-3 text-xs leading-5 text-[#667A7F]">{answer}</p>
                    </details>
                  ))}
                </section>
              </div>
            )}

            {view === 'settings' && (
              <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
                <section className="rounded-2xl bg-white p-7">
                  <Icon name="shield" className="size-8 text-[#9B7F57]" />
                  <h2 className="mt-6 text-2xl font-semibold">{text.privacyTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#60757A]">{text.privacyText}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ['/privacidade', text.privacy],
                      ['/termos', text.terms],
                      ['/cookies', text.cookies],
                      ['/reembolso', text.refund],
                    ].map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        className="rounded-xl border border-[#163B43]/8 bg-[#F7F7F3] px-4 py-3 text-xs font-semibold"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </section>
                <aside className="rounded-2xl bg-[#F7F7F3] p-6">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-red-800">
                    {text.accountControl}
                  </p>
                  <h2 className="mt-4 text-xl font-semibold">{text.deleteAccount}</h2>
                  <p className="mt-3 text-xs leading-5 text-[#60757A]">
                    {isAdmin ? text.adminProtected : text.deleteText}
                  </p>
                  <button
                    type="button"
                    disabled={isAdmin}
                    onClick={() => setDeleteOpen(true)}
                    className="mt-6 w-full rounded-full border border-red-900/20 px-5 py-3 text-xs font-semibold text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {text.deleteRequest}
                  </button>
                </aside>
              </div>
            )}
          </div>
        </section>
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-[#102F36]/50 p-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="animate-pop-in w-full max-w-md rounded-[2rem] bg-[#F7F7F3] p-7 shadow-float"
          >
            <h2 id="delete-title" className="text-2xl font-semibold">
              {text.deleteTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#60757A]">{text.deleteConfirm}</p>
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setDeleteOpen(false)}
                className="flex-1 rounded-full border border-[#163B43]/12 px-5 py-3 text-sm font-semibold"
              >
                {text.cancel}
              </button>
              <button
                type="button"
                onClick={removeAccount}
                className="flex-1 rounded-full bg-red-800 px-5 py-3 text-sm font-semibold text-white"
              >
                {text.delete}
              </button>
            </div>
          </div>
        </div>
      )}


      {openBrief && (
        <div
          className="fixed inset-0 z-[90] grid place-items-end bg-[#102F36]/50 backdrop-blur-sm sm:place-items-center sm:p-6"
          onMouseDown={(event) => event.target === event.currentTarget && setOpenBriefId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="brief-title"
            className="animate-pop-in max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-[#F7F7F3] p-6 shadow-float sm:rounded-[2rem] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#9B7F57]">{text.projectDetails}</p>
                <h2 id="brief-title" className="mt-2 text-2xl font-semibold">{openBrief.service}</h2>
                <p className="mt-1 text-xs text-[#87979A]">
                  {text.receivedOn} {new Date(openBrief.createdAt).toLocaleString(language)}
                  {openBrief.updatedAt !== openBrief.createdAt &&
                    ` · ${text.updatedOn} ${new Date(openBrief.updatedAt).toLocaleString(language)}`}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                aria-label={text.close}
                onClick={() => setOpenBriefId(null)}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E9E9E4]"
              >
                ×
              </button>
            </div>

            <span
              className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${briefStatusTone(openBrief.status)}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {briefStatusLabel(openBrief.status)}
            </span>

            <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[.12em] text-[#87979A]">{text.objectiveLabel}</dt>
                <dd className="mt-1.5 font-semibold">{openBrief.objective}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[.12em] text-[#87979A]">{text.featuresLabel}</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {openBrief.features.length ? (
                    openBrief.features.map((feature) => (
                      <span key={feature} className="rounded-full bg-white px-3 py-1 text-xs font-semibold">
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#87979A]">{text.noFeatures}</span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#87979A]">{text.ideaLabel}</p>
              <p className="mt-2 whitespace-pre-wrap break-words rounded-2xl bg-white p-4 text-sm leading-7">
                {openBrief.idea}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F0ECE4] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#9B7F57]">
                {text.contactLabel} ·{' '}
                {openBrief.contactKind === 'email'
                  ? text.viaEmail
                  : openBrief.contactKind === 'whatsapp'
                    ? text.viaWhatsapp
                    : text.viaOther}
              </p>
              <p className="mt-2 break-all text-base font-semibold">{openBrief.contact}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {contactHref(openBrief.contact) && (
                  <a
                    href={contactHref(openBrief.contact) ?? undefined}
                    target={openBrief.contactKind === 'whatsapp' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="btn btn-ink px-4 py-2.5 text-xs"
                  >
                    {openBrief.contactKind === 'email' ? text.replyEmail : text.openWhatsapp}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => void copyContact(openBrief.contact)}
                  className="btn btn-outline px-4 py-2.5 text-xs"
                >
                  {copied ? text.copied : text.copyContact}
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-[#667A7F]">
              <span className="font-bold uppercase tracking-[.12em] text-[#87979A]">{text.accountLabel}: </span>
              {openBrief.account
                ? [openBrief.account.name, openBrief.account.email, openBrief.account.phone].filter(Boolean).join(' · ')
                : text.visitor}
            </div>

            {briefError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
                {briefError}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-2 border-t border-[#163B43]/8 pt-5">
              {openBrief.status !== 'contacted' && (
                <button
                  type="button"
                  onClick={() => void changeBriefStatus(openBrief.id, 'contacted')}
                  className="btn btn-ink px-4 py-2.5 text-xs"
                >
                  {text.markContacted}
                </button>
              )}
              {openBrief.status !== 'closed' && (
                <button
                  type="button"
                  onClick={() => void changeBriefStatus(openBrief.id, 'closed')}
                  className="btn btn-outline px-4 py-2.5 text-xs"
                >
                  {text.closeProject}
                </button>
              )}
              {openBrief.status !== 'new' && (
                <button
                  type="button"
                  onClick={() => void changeBriefStatus(openBrief.id, 'new')}
                  className="btn btn-outline px-4 py-2.5 text-xs"
                >
                  {text.reopenProject}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {ticketOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-end bg-[#102F36]/45 backdrop-blur-sm sm:place-items-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-title"
            className="animate-pop-in w-full max-w-lg rounded-t-[2rem] bg-[#F7F7F3] p-6 shadow-float sm:rounded-[2rem] sm:p-8"
          >
            {createdTicket ? (
              <div className="py-6 text-center">
                <Icon name="check" className="mx-auto size-12 text-[#9B7F57]" />
                <h2 className="mt-5 text-2xl font-semibold">{text.ticketCreated}</h2>
                <p className="mt-2 text-sm text-[#667A7F]">
                  {text.protocol} {createdTicket.id} {text.createdMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedTicket(null)
                    setTicketOpen(false)
                  }}
                  className="mt-6 rounded-full bg-[#163B43] px-6 py-3 text-sm font-semibold text-white"
                >
                  {text.understood}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 id="ticket-title" className="text-2xl font-semibold">
                    {text.openTicket}
                  </h2>
                  <button
                    type="button"
                    aria-label={text.close}
                    onClick={() => setTicketOpen(false)}
                    className="grid size-9 place-items-center rounded-full bg-[#E9E9E4]"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={submitTicket} className="mt-7 space-y-4">
                  <label className="block text-sm font-semibold">
                    {text.site}
                    <select name="siteId" required className="form-input mt-2">
                      {visibleSites.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold">
                      {text.requestType}
                      <select name="type" className="form-input mt-2">
                        <option value="technical">{text.technical}</option>
                        <option value="content">{text.content}</option>
                        <option value="feature">{text.feature}</option>
                        <option value="question">{text.question}</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold">
                      {text.impact}
                      <select name="impact" className="form-input mt-2">
                        <option value="low">{text.low}</option>
                        <option value="medium">{text.medium}</option>
                        <option value="high">{text.high}</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-sm font-semibold">
                    {text.subject}
                    <input
                      name="subject"
                      required
                      placeholder={text.subjectPlaceholder}
                      className="form-input mt-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    {text.description}
                    <textarea
                      name="description"
                      required
                      rows={4}
                      placeholder={text.descriptionPlaceholder}
                      className="form-input mt-2 resize-none"
                    />
                  </label>
                  <p className="text-xs leading-5 text-[#667A7F]">{text.ticketPrivacy}</p>
                  <button className="btn btn-ink w-full py-3.5 text-sm">
                    {text.sendTicket}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {editingSite && (
        <SiteEditor
          site={editingSite}
          onClose={() => setEditingSite(null)}
          onSaved={() => setEditingSite(null)}
        />
      )}
      {activeTicket && account && (
        <TicketConversation
          ticket={activeTicket}
          account={account}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </main>
  )
}
