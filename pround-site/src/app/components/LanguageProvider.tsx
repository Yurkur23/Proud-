'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Icon } from './Icon'

export type Language = 'pt-BR' | 'en' | 'es'

const labels: Record<Language, { short: string; label: Record<Language, string> }> = {
  'pt-BR': {
    short: 'PT',
    label: {
      'pt-BR': 'Português (brasileiro)',
      en: 'Portuguese (Brazilian)',
      es: 'Portugués (brasileño)',
    },
  },
  en: { short: 'EN', label: { 'pt-BR': 'Inglês', en: 'English', es: 'Inglés' } },
  es: { short: 'ES', label: { 'pt-BR': 'Espanhol', en: 'Spanish', es: 'Español' } },
}

const dictionary: Record<string, { en: string; es: string }> = {
  Serviços: { en: 'Services', es: 'Servicios' },
  'Como fazemos': { en: 'How we work', es: 'Cómo trabajamos' },
  Planos: { en: 'Plans', es: 'Planes' },
  'Área do cliente': { en: 'Client area', es: 'Área del cliente' },
  Entrar: { en: 'Sign in', es: 'Ingresar' },
  'Começar projeto': { en: 'Start a project', es: 'Iniciar proyecto' },
  'Websites com propósito': { en: 'Purposeful websites', es: 'Sitios web con propósito' },
  'Sua presença digital': { en: 'Your digital presence', es: 'Tu presencia digital' },
  'começa aqui.': { en: 'starts here.', es: 'empieza aquí.' },
  'Sites profissionais, feitos para impulsionar seu negócio.': {
    en: 'Professional websites designed to move your business forward.',
    es: 'Sitios web profesionales creados para impulsar tu negocio.',
  },
  'Quero um site melhor': { en: 'I want a better website', es: 'Quiero un sitio mejor' },
  'Ver soluções': { en: 'View solutions', es: 'Ver soluciones' },
  'Projeto sob medida': { en: 'Tailored project', es: 'Proyecto a medida' },
  'Suporte contínuo': { en: 'Ongoing support', es: 'Soporte continuo' },
  '100% responsivo': { en: '100% responsive', es: '100% responsivo' },
  'O que fazemos': { en: 'What we do', es: 'Lo que hacemos' },
  'Nosso processo': { en: 'Our process', es: 'Nuestro proceso' },
  'Simples para você.': { en: 'Simple for you.', es: 'Simple para ti.' },
  'Intencional em cada detalhe.': {
    en: 'Intentional in every detail.',
    es: 'Intencional en cada detalle.',
  },
  Imersão: { en: 'Discovery', es: 'Inmersión' },
  Estratégia: { en: 'Strategy', es: 'Estrategia' },
  Criação: { en: 'Creation', es: 'Creación' },
  Evolução: { en: 'Evolution', es: 'Evolución' },
  'Soluções digitais': { en: 'Digital solutions', es: 'Soluciones digitales' },
  'O que podemos construir para você.': {
    en: 'What we can build for you.',
    es: 'Lo que podemos construir para ti.',
  },
  'Landing pages': { en: 'Landing pages', es: 'Landing pages' },
  'Sites com hospedagem': { en: 'Hosted websites', es: 'Sitios con alojamiento' },
  'Reformulação e recuperação': { en: 'Redesign and recovery', es: 'Rediseño y recuperación' },
  'Aplicações web (PWA)': { en: 'Web applications (PWA)', es: 'Aplicaciones web (PWA)' },
  'Problema que resolvemos': { en: 'Problem we solve', es: 'Problema que resolvemos' },
  'Principais recursos': { en: 'Key features', es: 'Recursos principales' },
  'Tecnologias possíveis': { en: 'Possible technologies', es: 'Tecnologías posibles' },
  'Quero uma solução assim': {
    en: 'I want a solution like this',
    es: 'Quiero una solución así',
  },
  'Depois do lançamento': { en: 'After launch', es: 'Después del lanzamiento' },
  'Seu site cuidado como parte do seu time.': {
    en: 'Your website cared for as part of your team.',
    es: 'Tu sitio cuidado como parte de tu equipo.',
  },
  'Explorar área do cliente': { en: 'Explore client area', es: 'Explorar área del cliente' },
  'Planos de desenvolvimento': { en: 'Development plans', es: 'Planes de desarrollo' },
  'Vamos criar algo relevante?': {
    en: 'Shall we create something relevant?',
    es: '¿Creamos algo relevante?',
  },
  'Seu próximo grande passo pode começar com um bom site.': {
    en: 'Your next big step can start with a great website.',
    es: 'Tu próximo gran paso puede comenzar con un buen sitio.',
  },
  'Conte sua ideia': { en: 'Tell us your idea', es: 'Cuéntanos tu idea' },
  Navegue: { en: 'Explore', es: 'Explora' },
  Soluções: { en: 'Solutions', es: 'Soluciones' },
  'Acessar área privada': { en: 'Open client area', es: 'Acceder al área privada' },
  'Solicitar projeto': { en: 'Request a project', es: 'Solicitar proyecto' },
  'Selecionar idioma': { en: 'Select language', es: 'Seleccionar idioma' },
  'Voltar ao site': { en: 'Back to website', es: 'Volver al sitio' },
  'Nome completo': { en: 'Full name', es: 'Nombre completo' },
  Telefone: { en: 'Phone', es: 'Teléfono' },
  Senha: { en: 'Password', es: 'Contraseña' },
  'Digite sua senha': { en: 'Enter your password', es: 'Escribe tu contraseña' },
  'Criar conta e continuar': { en: 'Create account and continue', es: 'Crear cuenta y continuar' },
  'Criando sua área...': { en: 'Creating your area...', es: 'Creando tu área...' },
  'Cadastro gratuito': { en: 'Free registration', es: 'Registro gratuito' },
  'Crie sua conta.': { en: 'Create your account.', es: 'Crea tu cuenta.' },
  'Precisamos apenas dos dados essenciais.': {
    en: 'We only need essential data.',
    es: 'Solo necesitamos los datos esenciales.',
  },
  'Sua área Pround': { en: 'Your Pround area', es: 'Tu área Pround' },
  'Acompanhe tudo com mais tranquilidade.': {
    en: 'Keep track of everything with peace of mind.',
    es: 'Acompaña todo con más tranquilidad.',
  },
  'Sites, suporte, manutenções e novas ideias organizados em uma experiência simples.': {
    en: 'Websites, support, maintenance and new ideas organized in one simple experience.',
    es: 'Sitios, soporte, mantenimientos y nuevas ideas organizados en una experiencia sencilla.',
  },
  'Que bom ter você de volta.': {
    en: 'Good to have you back.',
    es: 'Qué bueno tenerte de vuelta.',
  },
  'Entre para acompanhar seus sites, chamados e manutenções.': {
    en: 'Sign in to follow your websites, tickets and maintenance.',
    es: 'Ingresa para seguir tus sitios, tickets y mantenimientos.',
  },
  'Entrar na área do cliente': { en: 'Enter client area', es: 'Entrar al área del cliente' },
  'Abrindo sua área...': { en: 'Opening your area...', es: 'Abriendo tu área...' },
  'Projeto entregue': { en: 'Project delivered', es: 'Proyecto entregado' },
  'de conversões no primeiro mês': {
    en: 'more conversions in the first month',
    es: 'más conversiones en el primer mes',
  },
  'projetos entregues': { en: 'projects delivered', es: 'proyectos entregados' },
  'satisfação média': { en: 'average satisfaction', es: 'satisfacción media' },
  'tempo de resposta': { en: 'response time', es: 'tiempo de respuesta' },
  disponibilidade: { en: 'availability', es: 'disponibilidad' },
  'Da primeira ideia à manutenção contínua, construímos e cuidamos da sua presença digital em cada etapa.':
    {
      en: 'From the first idea to ongoing maintenance, we build and care for your digital presence at every stage.',
      es: 'Desde la primera idea hasta el mantenimiento continuo, construimos y cuidamos tu presencia digital en cada etapa.',
    },
  'Sites que vendem': { en: 'Websites that sell', es: 'Sitios que venden' },
  'Estratégia, design e tecnologia combinados para transformar visitas em novas oportunidades.': {
    en: 'Strategy, design and technology combined to turn visits into new opportunities.',
    es: 'Estrategia, diseño y tecnología combinados para convertir visitas en nuevas oportunidades.',
  },
  'Muito mais que uma vitrine digital, seu site é uma ferramenta para apresentar sua empresa e conquistar novos clientes.':
    {
      en: 'More than a digital showcase, your website is a tool to present your company and win new clients.',
      es: 'Mucho más que una vitrina digital, tu sitio es una herramienta para presentar tu empresa y conquistar nuevos clientes.',
    },
  'Desenvolvemos páginas personalizadas, com design exclusivo, navegação intuitiva e estrutura responsiva, garantindo uma experiência profissional em qualquer dispositivo.':
    {
      en: 'We develop custom pages with exclusive design, intuitive navigation and a responsive structure for a professional experience on every device.',
      es: 'Desarrollamos páginas personalizadas con diseño exclusivo, navegación intuitiva y estructura responsiva para una experiencia profesional en cualquier dispositivo.',
    },
  'Cada detalhe é pensado para transmitir confiança, destacar seus diferenciais e facilitar o contato entre sua empresa e seus clientes.':
    {
      en: 'Every detail conveys trust, highlights your strengths and makes contact between your company and clients easier.',
      es: 'Cada detalle transmite confianza, destaca tus diferenciales y facilita el contacto entre tu empresa y tus clientes.',
    },
  'Hospedagem cuidada': { en: 'Managed hosting', es: 'Alojamiento gestionado' },
  'Performance, segurança, backups e disponibilidade 24/7 sem você precisar pensar na operação.': {
    en: 'Performance, security, backups and 24/7 availability without operational worries.',
    es: 'Rendimiento, seguridad, copias y disponibilidad 24/7 sin preocuparte por la operación.',
  },
  'Seu site merece estar sempre disponível, seguro e funcionando como deveria.': {
    en: 'Your website deserves to stay available, secure and working as it should.',
    es: 'Tu sitio merece estar siempre disponible, seguro y funcionando como debe.',
  },
  'Cuidamos da hospedagem e da infraestrutura necessária para manter sua presença digital no ar, com atenção à performance, segurança, backups e estabilidade.':
    {
      en: 'We manage the hosting and infrastructure needed to keep your digital presence online, with attention to performance, security, backups and stability.',
      es: 'Cuidamos el alojamiento y la infraestructura para mantener tu presencia digital en línea, con atención al rendimiento, seguridad, copias y estabilidad.',
    },
  'Você não precisa se preocupar com questões técnicas: nós cuidamos dos bastidores para que você possa se concentrar no seu negócio.':
    {
      en: 'You do not need to worry about technical matters: we handle the background so you can focus on your business.',
      es: 'No necesitas preocuparte por cuestiones técnicas: cuidamos los bastidores para que te concentres en tu negocio.',
    },
  'Suporte que resolve': { en: 'Support that solves', es: 'Soporte que resuelve' },
  'Uma área exclusiva para pedir ajustes, acompanhar chamados e manter tudo sob controle.': {
    en: 'An exclusive area to request changes, follow tickets and keep everything under control.',
    es: 'Un área exclusiva para pedir ajustes, seguir tickets y mantener todo bajo control.',
  },
  'Nosso trabalho não termina quando seu site vai ao ar. Continuamos ao seu lado para garantir que ele acompanhe as necessidades da sua empresa.':
    {
      en: 'Our work does not end when your website goes live. We stay by your side as your company evolves.',
      es: 'Nuestro trabajo no termina cuando tu sitio se publica. Seguimos a tu lado mientras tu empresa evoluciona.',
    },
  'Oferecemos suporte contínuo para atualizações, correções, ajustes de conteúdo e melhorias, além de um canal organizado para acompanhar suas solicitações.':
    {
      en: 'We provide ongoing support for updates, fixes, content changes and improvements, with an organized channel for every request.',
      es: 'Ofrecemos soporte continuo para actualizaciones, correcciones, cambios de contenido y mejoras, con un canal organizado para cada solicitud.',
    },
  'Você conta com uma equipe disponível para cuidar do seu site mesmo depois da entrega do projeto.':
    {
      en: 'You have a team available to care for your website even after project delivery.',
      es: 'Tienes un equipo disponible para cuidar tu sitio incluso después de entregar el proyecto.',
    },
  'Você acompanha cada etapa, sabe o que está acontecendo e fala com pessoas de verdade.': {
    en: 'You follow every stage, know what is happening and talk to real people.',
    es: 'Acompañas cada etapa, sabes qué ocurre y hablas con personas reales.',
  },
  'Entendemos seu negócio, público e objetivos.': {
    en: 'We understand your business, audience and goals.',
    es: 'Entendemos tu negocio, público y objetivos.',
  },
  'Organizamos conteúdo, jornada e prioridades.': {
    en: 'We organize content, journey and priorities.',
    es: 'Organizamos contenido, recorrido y prioridades.',
  },
  'Design e desenvolvimento em ciclos transparentes.': {
    en: 'Design and development in transparent cycles.',
    es: 'Diseño y desarrollo en ciclos transparentes.',
  },
  'Publicamos, medimos e seguimos cuidando.': {
    en: 'We publish, measure and continue improving.',
    es: 'Publicamos, medimos y seguimos cuidando.',
  },
  'Não entregamos apenas páginas bonitas. Criamos soluções que resolvem problemas reais, organizam operações e ajudam empresas a crescer com mais clareza.':
    {
      en: 'We do not deliver only beautiful pages. We create solutions that solve real problems, organize operations and help companies grow with clarity.',
      es: 'No entregamos solo páginas bonitas. Creamos soluciones que resuelven problemas reales, organizan operaciones y ayudan a las empresas a crecer con claridad.',
    },
  'Para campanhas, lançamentos e captação': {
    en: 'For campaigns, launches and acquisition',
    es: 'Para campañas, lanzamientos y captación',
  },
  'Páginas objetivas e persuasivas para apresentar uma oferta e transformar campanhas em contatos ou vendas.':
    {
      en: 'Clear, persuasive pages that present an offer and turn campaigns into leads or sales.',
      es: 'Páginas claras y persuasivas para presentar una oferta y convertir campañas en contactos o ventas.',
    },
  'Campanhas que levam o público para perfis ou páginas genéricas, sem uma jornada clara para a conversão.':
    {
      en: 'Campaigns that send audiences to generic profiles or pages without a clear conversion journey.',
      es: 'Campañas que llevan al público a perfiles o páginas genéricas sin un recorrido claro de conversión.',
    },
  'Copy e estrutura estratégica': {
    en: 'Strategic copy and structure',
    es: 'Copy y estructura estratégica',
  },
  'Formulários e WhatsApp': { en: 'Forms and WhatsApp', es: 'Formularios y WhatsApp' },
  'Métricas e responsividade': { en: 'Metrics and responsiveness', es: 'Métricas y responsividad' },
  'Infraestrutura cuidada de ponta a ponta': {
    en: 'End-to-end managed infrastructure',
    es: 'Infraestructura gestionada de punta a punta',
  },
  'Criação, publicação e cuidado técnico contínuo para manter sua presença digital rápida, segura e disponível.':
    {
      en: 'Creation, publishing and ongoing technical care to keep your digital presence fast, secure and available.',
      es: 'Creación, publicación y cuidado técnico continuo para mantener tu presencia digital rápida, segura y disponible.',
    },
  'Empresas que não querem lidar com domínio, certificado, servidor, segurança, atualizações e cópias de segurança.':
    {
      en: 'Companies that do not want to manage domains, certificates, servers, security, updates and backups.',
      es: 'Empresas que no quieren gestionar dominios, certificados, servidores, seguridad, actualizaciones y copias.',
    },
  'Hospedagem gerenciada': { en: 'Managed hosting', es: 'Alojamiento gestionado' },
  'SSL, backups e domínio': { en: 'SSL, backups and domain', es: 'SSL, copias y dominio' },
  'Monitoramento e suporte': { en: 'Monitoring and support', es: 'Monitoreo y soporte' },
  'Melhoramos o que você já construiu': {
    en: 'We improve what you have already built',
    es: 'Mejoramos lo que ya construiste',
  },
  'Analisamos sites existentes, corrigimos problemas e reconstruímos a experiência quando ela já não acompanha o negócio.':
    {
      en: 'We analyze existing websites, fix problems and rebuild the experience when it no longer supports the business.',
      es: 'Analizamos sitios existentes, corregimos problemas y reconstruimos la experiencia cuando ya no acompaña al negocio.',
    },
  'Sites lentos, desatualizados, com erros, visual antigo ou estrutura difícil de manter e evoluir.':
    {
      en: 'Slow, outdated websites with errors, dated visuals or structures that are hard to maintain.',
      es: 'Sitios lentos, desactualizados, con errores, visual antiguo o estructuras difíciles de mantener.',
    },
  'Auditoria técnica e visual': {
    en: 'Technical and visual audit',
    es: 'Auditoría técnica y visual',
  },
  'Redesign e correções': { en: 'Redesign and fixes', es: 'Rediseño y correcciones' },
  'Migração e otimização': { en: 'Migration and optimization', es: 'Migración y optimización' },
  'Experiência aplicada na Kings Produtos': {
    en: 'Experience applied at Kings Produtos',
    es: 'Experiencia aplicada en Kings Produtos',
  },
  'Soluções rápidas e instaláveis, com experiência semelhante à de um aplicativo e acesso pelo navegador.':
    {
      en: 'Fast, installable solutions with an app-like experience accessed through the browser.',
      es: 'Soluciones rápidas e instalables, con experiencia similar a una aplicación y acceso desde el navegador.',
    },
  'Equipes e clientes que precisam acessar funções importantes pelo celular sem depender de uma loja de aplicativos.':
    {
      en: 'Teams and clients who need important mobile features without relying on an app store.',
      es: 'Equipos y clientes que necesitan funciones móviles importantes sin depender de una tienda de aplicaciones.',
    },
  'Instalação no celular': { en: 'Mobile installation', es: 'Instalación en el móvil' },
  'Uso responsivo': { en: 'Responsive use', es: 'Uso responsivo' },
  'Notificações e acesso rápido': {
    en: 'Notifications and quick access',
    es: 'Notificaciones y acceso rápido',
  },
  'Sua ideia não se encaixa exatamente nessas categorias? Ótimo. Projetos sob medida começam com uma boa conversa.':
    {
      en: 'Does your idea not fit these categories exactly? Great. Tailored projects start with a good conversation.',
      es: '¿Tu idea no encaja exactamente en estas categorías? Perfecto. Los proyectos a medida comienzan con una buena conversación.',
    },
  'Conte o que você precisa': { en: 'Tell us what you need', es: 'Cuéntanos qué necesitas' },
  'Na área do cliente Pround, você centraliza sites, chamados e manutenções. Sem e-mails perdidos, sem ficar no escuro.':
    {
      en: 'In the Pround client area, websites, tickets and maintenance stay together. No lost emails and no uncertainty.',
      es: 'En el área del cliente Pround, sitios, tickets y mantenimientos están juntos. Sin correos perdidos ni incertidumbre.',
    },
  'Chamado aberto': { en: 'Open ticket', es: 'Ticket abierto' },
  'Resposta média': { en: 'Average response', es: 'Respuesta media' },
  'Atualização do formulário': { en: 'Form update', es: 'Actualización del formulario' },
  'EM ANDAMENTO': { en: 'IN PROGRESS', es: 'EN CURSO' },
  'Um começo à altura do seu próximo passo.': {
    en: 'A start worthy of your next step.',
    es: 'Un comienzo a la altura de tu próximo paso.',
  },
  Essencial: { en: 'Essential', es: 'Esencial' },
  'Presença profissional para começar certo.': {
    en: 'A professional presence to start right.',
    es: 'Una presencia profesional para comenzar bien.',
  },
  'Site institucional': { en: 'Corporate website', es: 'Sitio institucional' },
  'Até 5 páginas': { en: 'Up to 5 pages', es: 'Hasta 5 páginas' },
  'Design responsivo': { en: 'Responsive design', es: 'Diseño responsivo' },
  'SEO essencial': { en: 'Essential SEO', es: 'SEO esencial' },
  'Conversar sobre o projeto': { en: 'Discuss the project', es: 'Hablar sobre el proyecto' },
  'Mais escolhido': { en: 'Most popular', es: 'Más elegido' },
  Crescimento: { en: 'Growth', es: 'Crecimiento' },
  'Estrutura para atrair e converter mais.': {
    en: 'Structure to attract and convert more.',
    es: 'Estructura para atraer y convertir más.',
  },
  'Estratégia de conteúdo': { en: 'Content strategy', es: 'Estrategia de contenido' },
  'Até 10 páginas': { en: 'Up to 10 pages', es: 'Hasta 10 páginas' },
  'Integrações e automações': {
    en: 'Integrations and automations',
    es: 'Integraciones y automatizaciones',
  },
  'Suporte prioritário': { en: 'Priority support', es: 'Soporte prioritario' },
  'Experiências digitais sem limitações.': {
    en: 'Digital experiences without limits.',
    es: 'Experiencias digitales sin límites.',
  },
  'Projeto personalizado': { en: 'Custom project', es: 'Proyecto personalizado' },
  'Funcionalidades exclusivas': { en: 'Exclusive features', es: 'Funcionalidades exclusivas' },
  'Área logada ou e-commerce': {
    en: 'Member area or e-commerce',
    es: 'Área privada o comercio electrónico',
  },
  'Evolução contínua': { en: 'Continuous evolution', es: 'Evolución continua' },
  'Conte o que você está imaginando. Nós ajudamos a transformar sua ideia em uma experiência digital.':
    {
      en: 'Tell us what you imagine. We help turn your idea into a digital experience.',
      es: 'Cuéntanos qué imaginas. Te ayudamos a convertir tu idea en una experiencia digital.',
    },
  'Sites dos quais você vai se orgulhar. Estratégia, design, tecnologia e cuidado em um só parceiro.':
    {
      en: 'Websites you will be proud of. Strategy, design, technology and care in one partner.',
      es: 'Sitios de los que estarás orgulloso. Estrategia, diseño, tecnología y cuidado en un solo socio.',
    },
  'Cliente Pround': { en: 'Pround Client', es: 'Cliente Pround' },
  'Legal e privacidade': { en: 'Legal and privacy', es: 'Legal y privacidad' },
  'Política de Privacidade': { en: 'Privacy Policy', es: 'Política de Privacidad' },
  'Termos de Uso': { en: 'Terms of Use', es: 'Términos de Uso' },
  'Política de Consentimento de Cookies': {
    en: 'Cookie Consent Policy',
    es: 'Política de Consentimiento de Cookies',
  },
  'Política de Reembolso': { en: 'Refund Policy', es: 'Política de Reembolso' },
  'Preferências de cookies': { en: 'Cookie preferences', es: 'Preferencias de cookies' },
  '© 2026 Pround. Todos os direitos reservados.': {
    en: '© 2026 Pround. All rights reserved.',
    es: '© 2026 Pround. Todos los derechos reservados.',
  },
  'Privacidade · Termos · Cookies · LGPD': {
    en: 'Privacy · Terms · Cookies · LGPD',
    es: 'Privacidad · Términos · Cookies · LGPD',
  },
  'Sua privacidade importa': { en: 'Your privacy matters', es: 'Tu privacidad importa' },
  'Usamos cookies essenciais para o funcionamento do site e da área do cliente. Cookies de análise só serão ativados com sua autorização. Consulte nossa': {
    en: 'We use essential cookies for the site and the client area to work. Analytics cookies are only enabled with your permission. Read our',
    es: 'Usamos cookies esenciales para el funcionamiento del sitio y del área de clientes. Las cookies de análisis solo se activan con tu autorización. Consulta nuestra',
  },
  'Política de Cookies': { en: 'Cookie Policy', es: 'Política de Cookies' },
  'Somente essenciais': { en: 'Essential only', es: 'Solo esenciales' },
  Personalizar: { en: 'Customize', es: 'Personalizar' },
  'Aceitar todos': { en: 'Accept all', es: 'Aceptar todos' },
  'Ainda não possui acesso?': { en: 'Do not have access yet?', es: '¿Todavía no tienes acceso?' },
  'Crie sua conta': { en: 'Create your account', es: 'Crea tu cuenta' },
  'Li e concordo com os': { en: 'I have read and agree to the', es: 'He leído y acepto los' },
  'e a': { en: 'and the', es: 'y la' },
  ', incluindo o tratamento necessário dos dados para minha conta.': {
    en: ', including the data processing required for my account.',
    es: ', incluido el tratamiento de datos necesario para mi cuenta.',
  },
  'Sair do briefing': { en: 'Exit brief', es: 'Salir del briefing' },
  'Seu projeto começa aqui': { en: 'Your project starts here', es: 'Tu proyecto comienza aquí' },
  'Vamos entender sua ideia.': { en: 'Let us understand your idea.', es: 'Entendamos tu idea.' },
  'Leva cerca de 2 minutos. Você poderá voltar e alterar suas respostas.': {
    en: 'It takes about 2 minutes. You can go back and change your answers.',
    es: 'Toma unos 2 minutos. Podrás volver y cambiar tus respuestas.',
  },
  Serviço: { en: 'Service', es: 'Servicio' },
  Objetivo: { en: 'Goal', es: 'Objetivo' },
  Funcionalidades: { en: 'Features', es: 'Funcionalidades' },
  'Sua ideia': { en: 'Your idea', es: 'Tu idea' },
  'Não precisa ter tudo definido. Nós ajudamos a encontrar o melhor caminho.': {
    en: 'You do not need to have everything defined. We help find the best path.',
    es: 'No necesitas tener todo definido. Te ayudamos a encontrar el mejor camino.',
  },
  Etapa: { en: 'Step', es: 'Etapa' },
  'de 4': { en: 'of 4', es: 'de 4' },
  'Primeiro passo': { en: 'First step', es: 'Primer paso' },
  'Qual serviço você procura?': {
    en: 'Which service are you looking for?',
    es: '¿Qué servicio buscas?',
  },
  'Escolha a opção mais próxima do que você precisa agora.': {
    en: 'Choose the option closest to what you need now.',
    es: 'Elige la opción más cercana a lo que necesitas ahora.',
  },
  'Criar um site do zero': { en: 'Create a website from scratch', es: 'Crear un sitio desde cero' },
  'Uma presença digital nova, pensada desde a estratégia.': {
    en: 'A new digital presence designed from the strategy onward.',
    es: 'Una nueva presencia digital pensada desde la estrategia.',
  },
  'Reformular um site existente': {
    en: 'Redesign an existing website',
    es: 'Rediseñar un sitio existente',
  },
  'Modernizar design, conteúdo, velocidade e conversão.': {
    en: 'Modernize design, content, speed and conversion.',
    es: 'Modernizar diseño, contenido, velocidad y conversión.',
  },
  'Manutenção e suporte': { en: 'Maintenance and support', es: 'Mantenimiento y soporte' },
  'Corrigir, atualizar e evoluir um site que já está no ar.': {
    en: 'Fix, update and evolve a website that is already live.',
    es: 'Corregir, actualizar y evolucionar un sitio que ya está publicado.',
  },
  'Ainda estou avaliando': { en: 'I am still evaluating', es: 'Todavía estoy evaluando' },
  'Tudo bem — ajudamos você a encontrar o melhor caminho.': {
    en: 'That is fine — we help you find the best path.',
    es: 'Está bien — te ayudamos a encontrar el mejor camino.',
  },
  Voltar: { en: 'Back', es: 'Volver' },
  Continuar: { en: 'Continue', es: 'Continuar' },
  'seuemail@empresa.com.br': { en: 'you@company.com', es: 'tu@empresa.com' },
  'E-mail': { en: 'Email', es: 'Correo electrónico' },
  Essenciais: { en: 'Essential', es: 'Esenciales' },
  'Necessários para preferências básicas.': {
    en: 'Required for basic preferences.',
    es: 'Necesarias para preferencias básicas.',
  },
  Análise: { en: 'Analytics', es: 'Análisis' },
  'Medição anônima de uso. Nenhuma ferramenta está ativa no momento.': {
    en: 'Anonymous usage measurement. No analytics tool is active at the moment.',
    es: 'Medición anónima de uso. Ninguna herramienta está activa por el momento.',
  },
  'Salvar preferências': { en: 'Save preferences', es: 'Guardar preferencias' },
  'Apresentar minha empresa': { en: 'Present my company', es: 'Presentar mi empresa' },
  'Atrair novos clientes': { en: 'Attract new clients', es: 'Atraer nuevos clientes' },
  'Vender produtos ou serviços': {
    en: 'Sell products or services',
    es: 'Vender productos o servicios',
  },
  'Exibir meu portfólio': { en: 'Show my portfolio', es: 'Mostrar mi portafolio' },
  'Outro objetivo': { en: 'Another goal', es: 'Otro objetivo' },
  'Integração com WhatsApp': { en: 'WhatsApp integration', es: 'Integración con WhatsApp' },
  'Formulário de contato': { en: 'Contact form', es: 'Formulario de contacto' },
  'Catálogo de produtos': { en: 'Product catalog', es: 'Catálogo de productos' },
  'Agendamento online': { en: 'Online scheduling', es: 'Agendamiento en línea' },
  'Área administrativa': { en: 'Administration area', es: 'Área administrativa' },
  'Galeria de fotos e portfólio': {
    en: 'Photo gallery and portfolio',
    es: 'Galería de fotos y portafolio',
  },
  'Ainda não sei': { en: 'I am not sure yet', es: 'Todavía no lo sé' },
  'Direção do projeto': { en: 'Project direction', es: 'Dirección del proyecto' },
  'Qual é o principal objetivo do seu site?': {
    en: 'What is the main goal of your website?',
    es: '¿Cuál es el objetivo principal de tu sitio?',
  },
  'Isso nos ajuda a priorizar a estratégia e a experiência.': {
    en: 'This helps us prioritize strategy and experience.',
    es: 'Esto nos ayuda a priorizar la estrategia y la experiencia.',
  },
  'Recursos importantes': { en: 'Important features', es: 'Recursos importantes' },
  'Quais funcionalidades você gostaria de ter?': {
    en: 'Which features would you like?',
    es: '¿Qué funcionalidades te gustaría tener?',
  },
  'Pode selecionar mais de uma opção. Isso não fecha o escopo do projeto.': {
    en: 'You can select more than one option. This does not define the final project scope.',
    es: 'Puedes seleccionar más de una opción. Esto no define el alcance final del proyecto.',
  },
  'A parte mais importante': { en: 'The most important part', es: 'La parte más importante' },
  'Conte sua ideia.': { en: 'Tell us your idea.', es: 'Cuéntanos tu idea.' },
  'Tem algo mais que gostaria de nos contar? Não precisa usar termos técnicos.': {
    en: 'Is there anything else you would like to tell us? You do not need technical terms.',
    es: '¿Hay algo más que quieras contarnos? No necesitas usar términos técnicos.',
  },
  'O que você está imaginando?': { en: 'What are you imagining?', es: '¿Qué estás imaginando?' },
  'Descreva suas ideias, referências ou qualquer detalhe que considere importante. Não precisa ter tudo definido, podemos ajudar você a desenvolver o projeto.':
    {
      en: 'Describe your ideas, references or any important detail. You do not need everything defined; we can help develop the project.',
      es: 'Describe tus ideas, referencias o cualquier detalle importante. No necesitas tener todo definido; podemos ayudarte a desarrollar el proyecto.',
    },
  'Escreva do seu jeito.': { en: 'Write in your own way.', es: 'Escribe a tu manera.' },
  caracteres: { en: 'characters', es: 'caracteres' },
  'Não precisa ter todas as ideias definidas. Conte o que você precisa e nós ajudaremos a encontrar o melhor caminho.':
    {
      en: 'You do not need every idea defined. Tell us what you need and we will help find the best path.',
      es: 'No necesitas tener todas las ideas definidas. Cuéntanos qué necesitas y te ayudaremos a encontrar el mejor camino.',
    },
  'Autorizo o uso destas respostas exclusivamente para analisar minha solicitação, conforme a': {
    en: 'I authorize the use of these answers exclusively to analyze my request, according to the',
    es: 'Autorizo el uso de estas respuestas exclusivamente para analizar mi solicitud, de acuerdo con la',
  },
  'Enviando...': { en: 'Sending...', es: 'Enviando...' },
  'Enviar minha ideia': { en: 'Send my idea', es: 'Enviar mi idea' },
  'Briefing concluído': { en: 'Brief completed', es: 'Briefing completado' },
  'Obrigado por compartilhar sua ideia.': {
    en: 'Thank you for sharing your idea.',
    es: 'Gracias por compartir tu idea.',
  },
  'Você envia': { en: 'You send', es: 'Tú envías' },
  'Seu briefing chega organizado para a Pround.': {
    en: 'Your brief arrives organized for Pround.',
    es: 'Tu briefing llega organizado a Pround.',
  },
  'Nós analisamos': { en: 'We analyze', es: 'Analizamos' },
  'Avaliamos objetivos, recursos e complexidade.': {
    en: 'We assess goals, features and complexity.',
    es: 'Evaluamos objetivos, recursos y complejidad.',
  },
  'Entramos em contato': { en: 'We get in touch', es: 'Nos ponemos en contacto' },
  'Apresentamos o melhor caminho para o projeto.': {
    en: 'We present the best path for the project.',
    es: 'Presentamos el mejor camino para el proyecto.',
  },
  'Ir para minha área': { en: 'Go to my area', es: 'Ir a mi área' },
  'Sites ativos': { en: 'Active sites', es: 'Sitios activos' },
  'Sob medida': { en: 'Tailored', es: 'A medida' },
  'Página não encontrada': { en: 'Page not found', es: 'Página no encontrada' },
  'O endereço que você tentou abrir não existe ou foi movido.': {
    en: 'The address you tried to open does not exist or has been moved.',
    es: 'La dirección que intentaste abrir no existe o fue movida.',
  },
  'Voltar para o início': { en: 'Back to home', es: 'Volver al inicio' },
  'Confirmar senha': { en: 'Confirm password', es: 'Confirmar contraseña' },
  'Mostrar senha': { en: 'Show password', es: 'Mostrar contraseña' },
  'Ocultar senha': { en: 'Hide password', es: 'Ocultar contraseña' },
  'Nova senha': { en: 'New password', es: 'Nueva contraseña' },
  'As senhas não conferem.': { en: 'The passwords do not match.', es: 'Las contraseñas no coinciden.' },
  'Esqueci minha senha': { en: 'Forgot my password', es: 'Olvidé mi contraseña' },
  'Muitas tentativas. Aguarde alguns minutos e tente de novo.': { en: 'Too many attempts. Wait a few minutes and try again.', es: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' },
  'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).': { en: 'Confirm your email before signing in (check your inbox).', es: 'Confirma tu correo antes de entrar (revisa tu bandeja de entrada).' },
  'Mínimo de 10 caracteres, com letras maiúsculas, minúsculas e números.': { en: 'At least 10 characters, with uppercase and lowercase letters and numbers.', es: 'Mínimo de 10 caracteres, con letras mayúsculas, minúsculas y números.' },
  'Senha fraca. Use 10+ caracteres com letras maiúsculas, minúsculas e números.': { en: 'Weak password. Use 10+ characters with uppercase and lowercase letters and numbers.', es: 'Contraseña débil. Usa 10+ caracteres con letras mayúsculas, minúsculas y números.' },
  'Não foi possível concluir. Tente novamente em instantes.': { en: 'We could not complete this. Please try again shortly.', es: 'No fue posible completar. Inténtalo de nuevo en unos instantes.' },
  'E-mail ou senha incorretos.': { en: 'Incorrect email or password.', es: 'Correo o contraseña incorrectos.' },
  'Este e-mail já possui uma conta. Tente entrar.': { en: 'This email already has an account. Try signing in.', es: 'Este correo ya tiene una cuenta. Intenta entrar.' },
  'Link inválido ou expirado. Peça um novo.': { en: 'Invalid or expired link. Request a new one.', es: 'Enlace inválido o expirado. Solicita uno nuevo.' },
  'Informe seu nome completo.': { en: 'Enter your full name.', es: 'Ingresa tu nombre completo.' },
  'Informe um telefone válido.': { en: 'Enter a valid phone number.', es: 'Ingresa un teléfono válido.' },
  'Quase lá!': { en: 'Almost there!', es: '¡Casi listo!' },
  'Enviamos um link de confirmação para o seu e-mail. Depois de confirmar,': { en: 'We sent a confirmation link to your email. After confirming,', es: 'Enviamos un enlace de confirmación a tu correo. Después de confirmar,' },
  'entre na sua conta': { en: 'sign in to your account', es: 'entra en tu cuenta' },
  'Esqueceu sua senha?': { en: 'Forgot your password?', es: '¿Olvidaste tu contraseña?' },
  'Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.': { en: 'Enter your account email and we will send you a link to create a new password.', es: 'Ingresa el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.' },
  'Enviar link': { en: 'Send link', es: 'Enviar enlace' },
  'Se existir uma conta com este e-mail, enviamos um link para redefinir a senha. Confira também a caixa de spam.': { en: 'If an account exists with this email, we sent a link to reset the password. Check your spam folder too.', es: 'Si existe una cuenta con este correo, enviamos un enlace para restablecer la contraseña. Revisa también la carpeta de spam.' },
  'Voltar para o login': { en: 'Back to sign in', es: 'Volver al inicio de sesión' },
  'Criar nova senha': { en: 'Create a new password', es: 'Crear nueva contraseña' },
  'Escolha uma senha forte para a sua conta.': { en: 'Choose a strong password for your account.', es: 'Elige una contraseña segura para tu cuenta.' },
  'Salvar nova senha': { en: 'Save new password', es: 'Guardar nueva contraseña' },
  'Salvando...': { en: 'Saving...', es: 'Guardando...' },
  'Senha alterada! Agora você já pode entrar.': { en: 'Password changed! You can now sign in.', es: '¡Contraseña cambiada! Ya puedes entrar.' },
  'Ir para o login': { en: 'Go to sign in', es: 'Ir al inicio de sesión' },
  'Este link é inválido ou expirou. Peça um novo link.': { en: 'This link is invalid or has expired. Request a new link.', es: 'Este enlace no es válido o expiró. Solicita uno nuevo.' },
  'Pedir novo link': { en: 'Request a new link', es: 'Solicitar nuevo enlace' },
}

const originalTextByNode = new WeakMap<Text, string>()

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function Flag({ language }: { language: Language }) {
  if (language === 'pt-BR') {
    return (
      <span
        aria-hidden="true"
        className="relative block h-4 w-6 overflow-hidden rounded-sm bg-[#229E45]"
      >
        <span className="absolute left-2 top-1 size-2 rotate-45 bg-[#FFDF00]" />
        <span className="absolute left-[10px] top-[6px] size-1 rounded-full bg-[#002776]" />
      </span>
    )
  }
  if (language === 'en') {
    return (
      <span
        aria-hidden="true"
        className="relative block h-4 w-6 overflow-hidden rounded-sm bg-[#24468E]"
      >
        <span className="absolute left-0 top-[6px] h-1 w-full bg-white" />
        <span className="absolute left-[10px] top-0 h-full w-1 bg-white" />
        <span className="absolute left-0 top-[7px] h-0.5 w-full bg-[#C8102E]" />
        <span className="absolute left-[11px] top-0 h-full w-0.5 bg-[#C8102E]" />
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className="relative block h-4 w-6 overflow-hidden rounded-sm bg-[#AA151B]"
    >
      <span className="absolute inset-x-0 top-1 h-2 bg-[#F1BF00]" />
    </span>
  )
}

function translatePage(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script, style, textarea, input')) continue
    const textNode = node as Text
    const raw = textNode.textContent ?? ''
    const trimmed = raw.trim()
    if (!trimmed) continue
    const original = originalTextByNode.get(textNode) ?? trimmed

    if (language === 'pt-BR' && originalTextByNode.has(textNode)) {
      textNode.textContent = raw.replace(trimmed, original)
      originalTextByNode.delete(textNode)
    } else if (language !== 'pt-BR') {
      const translation = dictionary[original]?.[language]
      if (!translation) continue
      originalTextByNode.set(textNode, original)
      if (translation !== trimmed) textNode.textContent = raw.replace(trimmed, translation)
    }
  }

  document
    .querySelectorAll<HTMLElement>('[placeholder], [aria-label], [title]')
    .forEach((element) => {
      ;(['placeholder', 'aria-label', 'title'] as const).forEach((attribute) => {
        const value = element.getAttribute(attribute)
        if (!value) return
        const dataKey = `original${attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/^./, (letter) => letter.toUpperCase())}`
        const original = element.dataset[dataKey] ?? value
        if (language === 'pt-BR') {
          if (element.dataset[dataKey]) {
            element.setAttribute(attribute, original)
            delete element.dataset[dataKey]
          }
          return
        }
        const translated = dictionary[original]?.[language]
        if (translated) {
          element.dataset[dataKey] = original
          element.setAttribute(attribute, translated)
        }
      })
    })
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt-BR')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('pround-language') as Language | null
    if (saved && labels[saved]) setLanguageState(saved)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = language
    window.localStorage.setItem('pround-language', language)
    translatePage(language)
    const observer = new MutationObserver(() => translatePage(language))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language, ready])

  const value = useMemo(() => ({ language, setLanguage: setLanguageState }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export function LanguageSwitcher() {
  const context = useContext(LanguageContext)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  if (!context) return null

  return (
    <div ref={wrapperRef} className="relative z-[65]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] py-1 pl-1.5 pr-3 text-xs font-semibold text-white/90 transition hover:border-[#C5AD87]/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5AD87]"
      >
        <span className="grid size-6 place-items-center rounded-full bg-[#163B43] ring-1 ring-white/20">
          <Flag language={context.language} />
        </span>
        <span className="text-[10px] text-[#C5AD87]">{labels[context.language].short}</span>
        <span className="hidden sm:inline">{labels[context.language].label[context.language]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className={`h-2 w-3 fill-none stroke-current transition ${open ? 'rotate-180' : ''}`}
        >
          <path d="m1 1 5 5 5-5" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={
            context.language === 'pt-BR'
              ? 'Selecionar idioma'
              : context.language === 'en'
                ? 'Select language'
                : 'Seleccionar idioma'
          }
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#102F36] p-2 text-white shadow-2xl"
        >
          {(Object.keys(labels) as Language[]).map((language) => (
            <button
              key={language}
              type="button"
              role="menuitemradio"
              aria-checked={context.language === language}
              onClick={() => {
                context.setLanguage(language)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C5AD87] ${
                context.language === language ? 'bg-white/10' : ''
              }`}
            >
              <span className="grid size-8 place-items-center rounded-full border border-white/20">
                <Flag language={language} />
              </span>
              <span>
                <span className="mr-2 text-[9px] text-[#C5AD87]">{labels[language].short}</span>
                {labels[language].label[context.language]}
              </span>
              {context.language === language && (
                <Icon name="check" className="ml-auto size-4 text-[#C5AD87]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
