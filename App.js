import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, 
  Modal, Alert, SafeAreaView, Platform, KeyboardAvoidingView, StatusBar as RNStatusBar,
  ActivityIndicator, Switch, Pressable
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './lib/supabase';
import { 
  Hammer, Home, MessageSquare, FileText, User, Camera, Send, 
  CheckCircle, Plus, Globe, DollarSign, Briefcase, Droplet, 
  Zap, Wind, Waves, Truck, Star, X, MapPin, AlertTriangle, 
  ChevronRight, HardHat, Building, Users, ClipboardList, Bell,
  Search, Phone, ShieldCheck, Shovel, Flower, Sparkles, Fence,
  Image as ImageIcon, Leaf, Brush, Rocket, TrendingUp, Menu,
  Clock, Calendar, Calculator, BookOpen, Receipt, Save, Ruler,
  Wrench, Settings, LogOut, Upload, CreditCard, Lock, MoreVertical,
  Languages, ScanFace, Eye, EyeOff, Mail, Key, Mic, FilePen, QrCode,
  Paintbrush, Grid, Trash2, Flag, Ban, RefreshCw
} from 'lucide-react-native';

// --- CONFIGURACIÓN Y TRADUCCIONES / CONFIG & TRANSLATIONS ---
const TRANSLATIONS = {
  es: {
    welcome: "Bienvenido a ContractorConnect",
    tagline: "La red #1 para la construcción",
    findPro: "¿Qué necesitas reparar hoy?",
    emergency: "EMERGENCIA 24/7",
    emergencyDesc: "Respuesta en < 1 hora",
    nearYou: "Profesionales",
    categories_title: "Categorías Populares",
    roles: {
      client: { title: "Dueño de Casa", desc: "Necesito reparaciones o proyectos" },
      sub: { title: "Subcontratista", desc: "Oficios: Plomería, Electricidad, HVAC, etc." },
      labor: { title: "Labor / Servicios", desc: "Jardinería, Limpieza, Mantenimiento" }, 
      gc: { title: "Contratista General", desc: "Gestiono proyectos y contrato personal" },
      helper: { title: "Ayudante", desc: "Busco trabajo de ayudante diario" }
    },
    auth: {
      login_title: "Bienvenido de nuevo",
      signup_title: "Crear Cuenta",
      name_label: "Nombre Completo",
      email_label: "Correo Electrónico",
      pass_label: "Contraseña",
      login_btn: "Iniciar Sesión",
      signup_btn: "Crear Cuenta",
      toggle_login: "¿Ya tienes cuenta? Inicia sesión",
      toggle_signup: "¿Nuevo aquí? Regístrate",
      face_id: "Acceder con Face ID",
      remember: "Guardar contraseña",
      terms_hint: "Al continuar, aceptas nuestros",
      terms_link: "Términos de Uso",
      privacy_link: "Política de Privacidad"
    },
    subs: {
      title: "Elige tu Plan",
      sub_tier: "Plan Profesional", 
      labor_tier: "Plan de Servicios", 
      gc_tier: "Plan General Contractor",
      helper_tier: "Perfil de Ayudante",
      features_sub: [
        "Leads Ilimitados (Dueños de Casa)", 
        "Acceso Prioritario a Licitaciones GC", 
        "Herramientas: Facturas y Estimados", 
        "Insignia 'Verificado' (Más Confianza)",
        "0% Comisiones - Gana el 100%",
        "Portafolio de Proyectos Premium"
      ],
      features_labor: [
        "Alertas Instantáneas (Radio 5mi)", 
        "Posicionamiento 'Top' en Búsquedas", 
        "Chat Directo sin Intermediarios", 
        "Sin Comisiones por Trabajo",
        "Perfil Destacado con Fotos",
        "Acceso a Trabajos de Emergencia"
      ], 
      features_gc: [
        "Leads Exclusivos de Alto Valor (+$10k)", 
        "CRM de Gestión de Obras y Clientes", 
        "Acceso a Red de Subs Calificados", 
        "Estimaciones y Contratos Digitales",
        "Facturación Ilimitada y Pagos",
        "Soporte VIP Prioritario 24/7"
      ],
      features_helper: [
        "Pago Único - Acceso de Por Vida", 
        "Notificaciones de 'Pago Diario' (Cash)", 
        "Construye tu Reputación (Reviews)", 
        "Visible para Empresas y Subs",
        "Sin Mensualidades Recurrentes"
      ],
      weekly: "Semanal",
      monthly: "Mensual",
      yearly: "Anual",
      best_value: "AHORRO",
      trial_badge: "3 DÍAS GRATIS",
      gc_trial_badge: "15 DÍAS GRATIS",
      boost_title: "🚀 Boost de Visibilidad",
      boost_desc: "Aparece primero por 24h",
      boost_price: "$4.99",
      helper_boost_title: "⚡ Boost Rápido",
      helper_boost_desc: "Destaca por 10h",
      helper_boost_price: "$2.99",
      restore: "Restaurar Compras"
    },
    tabs: { home: "Inicio", projects: "Obras", network: "Red", chat: "Chat", profile: "Perfil" },
    gc_actions: {
      post_sub: "Buscar Subcontratista",
      manage_proj: "Gestionar Obra",
      view_leads: "Ver Leads de Remodelación"
    },
    sub_actions: {
      find_helper: "Contratar Ayudante",
      view_jobs: "Ver Trabajos"
    },
    tools: {
      title: "Herramientas de Obra",
      log: "Bitácora",
      calc: "Calculadora",
      invoices: "Invoices",
      change_order: "Change Order",
      log_desc: "Fotos y notas diarias",
      calc_desc: "Materiales",
      invoices_desc: "Enviados y Pendientes",
      change_order_desc: "Cambios al contrato",
      log_modal_title: "Bitácora de Obra (Daily Log)",
      calc_modal_title: "Calculadora de Materiales",
      invoices_modal_title: "Facturas Enviadas",
      change_order_modal_title: "Órdenes de Cambio (Change Orders)"
    },
    feed_labels: {
      homeowner: "CLIENTE DIRECTO",
      gc_offer: "OFERTA DE GC",
      sub_offer: "OFERTA DE SUB",
      labor_offer: "OFERTA DE LABOR",
      urgent: "URGENTE"
    },
    chat: {
      placeholder: "Escribe un mensaje...",
      camera_error: "No se pudo acceder a la cámara. Verifique los permisos.",
      take_photo: "Tomar Foto",
      retake: "Retomar",
      send_photo: "Enviar Foto",
      translating: "Traduciendo chat...",
      translated_on: "Traducción activada (EN <-> ES)",
      translated_off: "Traducción desactivada",
      report_user: "Reportar Usuario",
      block_user: "Bloquear Usuario",
      report_success: "Usuario reportado. Revisaremos el caso en 24h.",
      block_success: "Usuario bloqueado.",
      original: "Original"
    },
    profile: {
      title: "Mi Perfil",
      upload_photo: "Cambiar Foto",
      subscription: "Suscripción",
      cancel_sub: "Cancelar Suscripción",
      cancel_confirm: "¿Estás seguro? Perderás acceso a los leads premium.",
      legal: "Legal y Privacidad",
      terms: "Términos y Condiciones (EULA)",
      privacy: "Política de Privacidad",
      logout: "Cerrar Sesión",
      member_since: "Miembro desde 2023",
      active_plan: "Plan Activo",
      next_billing: "Próximo cobro",
      canceled_status: "Cancelado (Acceso hasta fin de mes)",
      insurance_title: "Seguro y Licencias",
      insurance_desc: "Sube tu COI (Certificate of Insurance) para obtener la insignia de verificación.",
      upload_btn: "Subir Documento / Foto",
      verified_license: "Licencia Verificada",
      badge_insured: "ASEGURADO / INSURED",
      qr_title: "Mi Tarjeta Digital",
      qr_desc: "Escanéame para ver mi perfil y reseñas",
      delete_account: "Eliminar Cuenta",
      delete_desc: "Esta acción es irreversible. Se borrarán todos tus datos.",
      delete_confirm: "¿Estás seguro que deseas eliminar tu cuenta permanentemente? Escribe 'ELIMINAR' para confirmar."
    },
    skills: {
      title: "Selecciona tus Habilidades",
      subtitle: "Elige los oficios que dominas para recibir los trabajos correctos.",
      continue_btn: "Continuar a Planes",
      select_at_least: "Selecciona al menos 1 habilidad"
    }
  },
  en: {
    welcome: "Welcome to ContractorConnect",
    tagline: "Your home in expert hands",
    findPro: "What needs fixing today?",
    emergency: "24/7 EMERGENCY",
    emergencyDesc: "Response in < 1 hour",
    nearYou: "Pros",
    categories_title: "Popular Categories",
    roles: {
      client: { title: "Homeowner", desc: "I need repairs or projects" },
      sub: { title: "Subcontractor", desc: "Trades: Plumbing, Electric, HVAC, etc." },
      labor: { title: "Labor / Services", desc: "Landscaping, Cleaning, Maintenance" }, 
      gc: { title: "General Contractor", desc: "I manage projects & hire crews" },
      helper: { title: "Helper", desc: "I look for daily helper work" }
    },
    auth: {
      login_title: "Welcome Back",
      signup_title: "Create Account",
      name_label: "Full Name",
      email_label: "Email Address",
      pass_label: "Password",
      login_btn: "Log In",
      signup_btn: "Create Account",
      toggle_login: "Already have an account? Log In",
      toggle_signup: "New here? Sign Up",
      face_id: "Login with Face ID",
      remember: "Remember me",
      terms_hint: "By continuing, you agree to our",
      terms_link: "Terms of Use (EULA)",
      privacy_link: "Privacy Policy"
    },
    subs: {
      title: "Choose your Plan",
      sub_tier: "Professional Plan",
      labor_tier: "Services Plan",
      gc_tier: "General Contractor Plan",
      helper_tier: "Helper Profile",
      features_sub: [
        "Unlimited Leads (Homeowners)", 
        "Priority Access to GC Tenders", 
        "Tools: Invoices & Estimates", 
        "'Verified' Badge (More Trust)",
        "0% Commissions - Keep it all",
        "Premium Project Portfolio"
      ],
      features_labor: [
        "Instant Alerts (5mi radius)", 
        "Top Search Ranking", 
        "Direct Chat No Middleman", 
        "No Commission Fees",
        "Featured Profile with Photos",
        "Emergency Job Access"
      ], 
      features_gc: [
        "Exclusive High-Value Leads (+$10k)", 
        "Project & Client CRM", 
        "Access to Verified Sub Network", 
        "Digital Estimates & Contracts",
        "Unlimited Invoicing & Payments",
        "24/7 VIP Priority Support"
      ],
      features_helper: [
        "One-Time Fee - Lifetime Access", 
        "Daily 'Cash Pay' Alerts", 
        "Build Reputation (Reviews)", 
        "Visible to Top Pros & Companies",
        "No Recurring Monthly Fees"
      ],
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
      best_value: "SAVE",
      trial_badge: "3 DAY TRIAL",
      gc_trial_badge: "15 DAY TRIAL",
      boost_title: "🚀 Visibility Boost",
      boost_desc: "Rank first for 24h",
      boost_price: "$4.99",
      helper_boost_title: "⚡ Quick Boost",
      helper_boost_desc: "Stand out for 10h",
      helper_boost_price: "$2.99",
      restore: "Restore Purchases"
    },
    tabs: { home: "Home", projects: "Sites", network: "Network", chat: "Chat", profile: "Profile" },
    gc_actions: {
      post_sub: "Hire Subcontractor",
      manage_proj: "Manage Site",
      view_leads: "View Remodel Leads"
    },
    sub_actions: {
      find_helper: "Hire Helper",
      view_jobs: "View Jobs"
    },
    tools: {
      title: "Jobsite Tools",
      log: "Daily Log",
      calc: "Calculator",
      invoices: "Invoices",
      change_order: "Change Order",
      log_desc: "Photos & daily notes",
      calc_desc: "Materials",
      invoices_desc: "Sent & Pending",
      change_order_desc: "Contract changes",
      log_modal_title: "Project Daily Log",
      calc_modal_title: "Material Calculator",
      invoices_modal_title: "Sent Invoices",
      change_order_modal_title: "Change Orders"
    },
    feed_labels: {
      homeowner: "DIRECT CLIENT",
      gc_offer: "GC TENDER",
      sub_offer: "SUB OFFER",
      labor_offer: "LABOR OFFER",
      urgent: "URGENT"
    },
    chat: {
      placeholder: "Type a message...",
      camera_error: "Could not access camera. Check permissions.",
      take_photo: "Take Photo",
      retake: "Retake",
      send_photo: "Send Photo",
      translating: "Translating chat...",
      translated_on: "Translation ON (EN <-> ES)",
      translated_off: "Translation OFF",
      report_user: "Report User",
      block_user: "Block User",
      report_success: "User reported. We will review within 24h.",
      block_success: "User blocked.",
      original: "Original"
    },
    profile: {
      title: "My Profile",
      upload_photo: "Change Photo",
      subscription: "Subscription",
      cancel_sub: "Cancel Subscription",
      cancel_confirm: "Are you sure? You will lose access to premium leads.",
      legal: "Legal & Privacy",
      terms: "Terms & Conditions (EULA)",
      privacy: "Privacy Policy",
      logout: "Log Out",
      member_since: "Member since 2023",
      active_plan: "Active Plan",
      next_billing: "Next billing",
      canceled_status: "Canceled (Access until month end)",
      insurance_title: "Insurance & Licenses",
      insurance_desc: "Upload your COI (Certificate of Insurance) to get the verification badge.",
      upload_btn: "Upload Document / Photo",
      verified_license: "License Verified",
      badge_insured: "INSURED / VERIFIED",
      qr_title: "My Digital Card",
      qr_desc: "Scan me to view my profile and reviews",
      delete_account: "Delete Account",
      delete_desc: "This action is irreversible. All data will be wiped.",
      delete_confirm: "Are you sure you want to permanently delete your account? Type 'DELETE' to confirm."
    },
    skills: {
      title: "Select your Skills",
      subtitle: "Choose the trades you master to get the right jobs.",
      continue_btn: "Continue to Plans",
      select_at_least: "Select at least 1 skill"
    }
  }
};

const CATEGORIES = [
  { id: 'plumbing', icon: Droplet, color: 'bg-blue-500', label: { es: 'Plomería', en: 'Plumbing' } },
  { id: 'electric', icon: Zap, color: 'bg-yellow-500', label: { es: 'Electricidad', en: 'Electric' } },
  { id: 'hvac', icon: Wind, color: 'bg-cyan-500', label: { es: 'A/C', en: 'HVAC' } },
  { id: 'landscaping', icon: Flower, color: 'bg-green-500', label: { es: 'Jardinería', en: 'Landscaping' } },
  { id: 'cleaning', icon: Sparkles, color: 'bg-purple-500', label: { es: 'Limpieza', en: 'Cleaning' } },
  { id: 'fencing', icon: Fence, color: 'bg-amber-600', label: { es: 'Cercas', en: 'Fencing' } },
  { id: 'pool', icon: Waves, color: 'bg-teal-500', label: { es: 'Piscinas', en: 'Pools' } },
  { id: 'heavy', icon: Truck, color: 'bg-orange-500', label: { es: 'Maquinaria', en: 'Heavy' } },
];

const SKILLS_LIST = [
  { id: 'drywall', label: { es: 'Drywall / Yeso', en: 'Drywall' }, icon: Grid },
  { id: 'painting', label: { es: 'Pintura', en: 'Painting' }, icon: Paintbrush },
  { id: 'demolition', label: { es: 'Demolición', en: 'Demolition' }, icon: Hammer },
  { id: 'framing', label: { es: 'Framing / Estructura', en: 'Framing' }, icon: Ruler },
  { id: 'flooring', label: { es: 'Pisos / Flooring', en: 'Flooring' }, icon: Grid },
  { id: 'concrete', label: { es: 'Concreto', en: 'Concrete' }, icon: Truck },
  { id: 'plumbing', label: { es: 'Plomería', en: 'Plumbing' }, icon: Droplet },
  { id: 'electrical', label: { es: 'Electricidad', en: 'Electrical' }, icon: Zap },
  { id: 'hvac', label: { es: 'A/C (HVAC)', en: 'HVAC' }, icon: Wind },
  { id: 'roofing', label: { es: 'Techos / Roofing', en: 'Roofing' }, icon: Home },
  { id: 'cleaning', label: { es: 'Limpieza Final', en: 'Cleanup' }, icon: Sparkles },
  { id: 'landscaping', label: { es: 'Jardinería', en: 'Landscaping' }, icon: Flower },
];

const PROS_NEARBY = [
  { id: 101, name: "Carlos M.", role: "Electrician", rating: 4.9, reviews: 124, verified: true, img: "bg-gray-800" },
  { id: 102, name: "AquaFix LLC", role: "Plumbing", rating: 4.7, reviews: 89, verified: true, img: "bg-blue-800" },
  { id: 103, name: "CoolAir Pro", role: "HVAC", rating: 4.8, reviews: 56, verified: false, img: "bg-cyan-800" },
];

const HELPERS_AVAILABLE = [
  { id: 201, name: "Jose L.", exp: "2y exp", skills: ["Pintura", "Carga"], rate: "$18/hr", verified: true },
  { id: 202, name: "Miguel R.", exp: "New", skills: ["Limpieza", "Carga"], rate: "$15/hr", verified: false },
  { id: 203, name: "Team Bros", exp: "5y exp", skills: ["Drywall", "Framing"], rate: "$22/hr", verified: true },
];

const CHATS_DATA = [
  { id: 101, name: "Carlos M.", role: "Electrician", lastMsg: "¿Podrías enviarme una foto?", time: "10:01 AM", unread: 2, online: true },
  { id: 102, name: "AquaFix LLC", role: "Plumbing", lastMsg: "Presupuesto enviado.", time: "Ayer", unread: 0, online: false },
  { id: 201, name: "Jose L.", role: "Helper", lastMsg: "Llego en 5 minutos boss.", time: "Ayer", unread: 0, online: true },
  { id: 999, name: "Maria G.", role: "Homeowner", lastMsg: "Gracias por venir hoy.", time: "Lun", unread: 0, online: false },
];

const INITIAL_HELPER_JOBS = [
  { 
    id: 1, 
    type: 'sub_offer', 
    title: "Ayuda para instalar A/C", 
    pay: "$120/día", 
    desc: "Necesito ayuda cargando unidades y pasando herramientas. Hoy 2pm.", 
    poster: "Carlos (Sub)", 
    avatar: "C",
    color: "bg-orange-500",
    tags: [{text: "SUB OFFER", icon: User, color: "bg-orange-100 text-orange-700"}],
    status: 'open' 
  },
  { 
    id: 2, 
    type: 'labor_offer', 
    title: "Ayudante de Jardinería", 
    pay: "$15/hr", 
    desc: "Recoger hojas y limpieza general. 4 horas garantizadas.", 
    poster: "GreenLife (Labor)", 
    avatar: "G",
    color: "bg-green-500",
    tags: [{text: "LABOR OFFER", icon: Leaf, color: "bg-green-100 text-green-700"}],
    status: 'open'
  }
];

// LEGAL TEXTS - UPDATED FOR APPLE EULA COMPLIANCE
const LEGAL_TEXTS = {
  terms: {
    es: "Términos de Uso (EULA) y Condiciones\n\n1. Acuerdo de Usuario: Al descargar o utilizar esta aplicación, usted acepta el Acuerdo de Licencia de Usuario Final (EULA).\n2. Contenido Generado por el Usuario (UGC): No se tolera contenido objetable o usuarios abusivos. Nos reservamos el derecho de eliminar cualquier contenido y banear usuarios que violen estas normas inmediatamente.\n3. Reportes y Bloqueo: Los usuarios pueden reportar contenido ofensivo o bloquear a otros usuarios. Los reportes se revisan en 24 horas.\n4. Suscripciones: El pago se cargará a su cuenta de Apple ID en la confirmación de la compra. La suscripción se renueva automáticamente a menos que se cancele al menos 24 horas antes del final del período actual.\n5. Responsabilidad: ContractorConnect conecta usuarios pero no garantiza la calidad del trabajo físico.",
    en: "Terms of Use (EULA) & Conditions\n\n1. User Agreement: By downloading or using this app, you agree to the Standard End User License Agreement (EULA).\n2. User Generated Content (UGC): There is zero tolerance for objectionable content or abusive users. We reserve the right to remove any content and ban users violating these rules immediately.\n3. Reporting & Blocking: Users have the ability to report offensive content or block abusive users. Reports are reviewed within 24 hours.\n4. Subscriptions: Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless canceled at least 24 hours before the end of the current period.\n5. Liability: ContractorConnect connects users but guarantees no physical work quality."
  },
  privacy: {
    es: "Política de Privacidad\n\n1. Recopilación de Datos: Recopilamos nombre, correo, ubicación y fotos para el funcionamiento de la app.\n2. Uso de Datos: Sus datos se usan para conectar servicios. No vendemos datos personales a terceros.\n3. Derecho a Eliminar: Puede eliminar su cuenta y todos sus datos en cualquier momento desde la sección Perfil -> Zona de Peligro.\n4. Seguridad: Usamos encriptación estándar.\n5. Contacto: Para dudas de privacidad contacte a support@contractorconnect.app.",
    en: "Privacy Policy\n\n1. Data Collection: We collect name, email, location, and photos for app functionality.\n2. Data Usage: Your data is used to connect services. We do not sell personal data to third parties.\n3. Right to Delete: You may delete your account and all associated data at any time via Profile -> Danger Zone.\n4. Security: We use standard encryption.\n5. Contact: For privacy concerns contact support@contractorconnect.app."
  }
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('es');
  const [role, setRole] = useState(null); 
  const [view, setView] = useState('onboarding'); 
  const [tab, setTab] = useState('home');
  
  const [activeConversation, setActiveConversation] = useState(null);
  const [isChatTranslated, setIsChatTranslated] = useState(false);
  
  const [subBilling, setSubBilling] = useState('monthly'); 
  const [boostActive, setBoostActive] = useState(false); 
  const [helperBoostActive, setHelperBoostActive] = useState(false); 
  
  const [activeTool, setActiveTool] = useState(null);

  const [userProfilePic, setUserProfilePic] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [hasInsurance, setHasInsurance] = useState(false); 
  const [showLegal, setShowLegal] = useState(null); 
  const [showQrModal, setShowQrModal] = useState(false); 
  const [selectedSkills, setSelectedSkills] = useState([]); 
  
  const [helperJobs, setHelperJobs] = useState(INITIAL_HELPER_JOBS);
  const [isHelperAvailable, setIsHelperAvailable] = useState(true);

  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "¡Hola! Vi tu solicitud de trabajo.", 
      translation: "Hi! I saw your job request.", 
      sender: 'other', 
      type: 'text', 
      time: '10:00 AM' 
    },
    { 
      id: 2, 
      text: "¿Podrías enviarme una foto del área a reparar?", 
      translation: "Could you send me a photo of the repair area?", 
      sender: 'other', 
      type: 'text', 
      time: '10:01 AM' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const scrollViewRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tab === 'chat' && activeConversation) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, tab, activeConversation]);

  const handleApplyJob = (id) => {
    setHelperJobs(jobs => jobs.map(job => 
      job.id === id ? { ...job, status: 'applied' } : job
    ));
  };

  const toggleHelperAvailability = () => {
    setIsHelperAvailable(!isHelperAvailable);
  };

  const handleLogout = () => {
    setRole(null);
    setView('onboarding');
    setTab('home');
    setIsSubscribed(true); 
    setActiveConversation(null);
  };

  // APP STORE REQUIREMENT: Account Deletion
  const handleDeleteAccount = () => {
    Alert.prompt(
      t.profile.delete_account,
      t.profile.delete_confirm,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: (text) => {
            if (text && (text.toUpperCase() === 'DELETE' || text.toUpperCase() === 'ELIMINAR')) {
              Alert.alert("Account Deleted Successfully");
              handleLogout();
            }
          }
        }
      ],
      'plain-text'
    );
  };

  // APP STORE REQUIREMENT: Restore Purchase
  const handleRestorePurchase = () => {
    Alert.alert("StoreKit", "Restoring purchases via StoreKit...");
    setIsSubscribed(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserProfilePic(result.assets[0].uri);
    }
  };

  const pickChatImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newMsg = {
        id: messages.length + 1,
        text: '',
        image: result.assets[0].uri,
        sender: 'me',
        type: 'image',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      t.profile.cancel_sub,
      t.profile.cancel_confirm,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "destructive", onPress: () => setIsSubscribed(false) }
      ]
    );
  };

  const handleAuthSuccess = () => {
    if (role === 'sub' || role === 'helper') {
      setView('skills');
    } 
    else if (role === 'gc' || role === 'labor') {
      setView('pricing');
      if (role === 'labor' || role === 'gc') setSubBilling('monthly');
    } else {
      setView('app');
    }
  };

  const handleSkillsContinue = () => {
    if (selectedSkills.length === 0) {
      Alert.alert("Error", t.skills.select_at_least);
      return;
    }
    setView('pricing');
    if (role === 'sub') setSubBilling('monthly');
  };

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const newMsg = {
      id: messages.length + 1,
      text: inputText,
      translation: `[Translated] ${inputText}`, 
      sender: 'me',
      type: 'text',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const startCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert("Error", t.chat.camera_error);
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const sendPhoto = () => {
    if (capturedImage) {
      const newMsg = {
        id: messages.length + 1,
        text: '',
        image: capturedImage,
        sender: 'me',
        type: 'image',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      stopCamera();
    }
  };

  const Avatar = ({ name, size = "w-10 h-10", verified, color="bg-gray-700", imgUrl }) => (
    <View className={`relative ${size} rounded-full ${color} items-center justify-center`}>
      {imgUrl ? (
        <Image source={{ uri: imgUrl }} style={{ width: '100%', height: '100%', borderRadius: 999 }} resizeMode="cover" />
      ) : (
        <Text className="text-white font-bold">{name.charAt(0)}</Text>
      )}
      {verified && (
        <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
          <CheckCircle size={12} color="#3b82f6" fill="#3b82f6" />
        </View>
      )}
    </View>
  );

  const RoleCard = ({ icon: Icon, title, desc, onClick, color }) => (
    <TouchableOpacity 
      onPress={onClick}
      activeOpacity={0.8}
      className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-row items-center mb-4"
    >
      <View className={`p-4 rounded-xl mr-4 ${color}`}>
        <Icon size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-800 text-lg">{title}</Text>
        <Text className="text-sm text-gray-500 leading-tight">{desc}</Text>
      </View>
      <ChevronRight size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <TouchableOpacity onPress={() => setView('onboarding')} className="absolute top-6 left-6 flex-row items-center">
              <ChevronRight size={20} color="#9ca3af" style={{ transform: [{ rotate: '180deg' }] }} />
              <Text className="text-gray-400 ml-1">Back</Text>
            </TouchableOpacity>

            <View className="mb-8 mt-10">
              <Text className="text-3xl font-extrabold text-gray-900 mb-2">
                {isLogin ? t.auth.login_title : t.auth.signup_title}
              </Text>
              <Text className="text-gray-500">
                {isLogin ? "Accede a tu cuenta para continuar." : "Crea tu perfil en segundos."}
              </Text>
            </View>

            <View className="space-y-4">
              {!isLogin && (
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">{t.auth.name_label}</Text>
                  <View className="relative">
                    <User size={18} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }} />
                    <TextInput 
                      value={name}
                      onChangeText={setName}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>
              )}

              <View>
                <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">{t.auth.email_label}</Text>
                <View className="relative">
                  <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }} />
                  <TextInput 
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View>
                <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">{t.auth.pass_label}</Text>
                <View className="relative">
                  <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }} />
                  <TextInput 
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPass(!showPass)} 
                    style={{ position: 'absolute', right: 12, top: 12 }}
                  >
                    {showPass ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-2">
                <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center">
                  <View className={`w-5 h-5 rounded border items-center justify-center mr-2 ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                    {rememberMe && <CheckCircle size={14} color="white" fill="white" />}
                  </View>
                  <Text className="text-sm text-gray-600 font-medium">{t.auth.remember}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-sm text-blue-600 font-bold">Forgot?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-8 space-y-4">
              <TouchableOpacity 
                onPress={handleAuthSuccess}
                className="w-full bg-blue-600 py-4 rounded-xl shadow-lg flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">
                  {isLogin ? t.auth.login_btn : t.auth.signup_btn}
                </Text>
                <ChevronRight size={20} color="white" style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              <TouchableOpacity className="w-full bg-white border border-gray-200 py-3.5 rounded-xl flex-row items-center justify-center" activeOpacity={0.8}>
                <ScanFace size={22} color="#111827" style={{ marginRight: 8 }} />
                <Text className="text-gray-700 font-bold">{t.auth.face_id}</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8 items-center pb-8">
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text className="text-sm text-gray-500 font-medium">
                  {isLogin ? t.auth.toggle_signup : t.auth.toggle_login}
                </Text>
              </TouchableOpacity>
              {!isLogin && (
                <Text className="text-[10px] text-gray-400 mt-4 px-8 text-center leading-tight">
                  {t.auth.terms_hint}{' '}
                  <Text className="text-blue-600 underline" onPress={() => setShowLegal('terms')}>{t.auth.terms_link}</Text>
                  {' '}&{' '}
                  <Text className="text-blue-600 underline" onPress={() => setShowLegal('privacy')}>{t.auth.privacy_link}</Text>.
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  const SkillsSelection = () => {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
          <View className="mt-8 mb-6">
            <View className={`w-12 h-12 ${role === 'helper' ? 'bg-yellow-100' : 'bg-orange-100'} rounded-2xl items-center justify-center mb-4`}>
              <Wrench size={24} color={role === 'helper' ? '#ca8a04' : '#ea580c'} />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 mb-2">
              {t.skills.title}
            </Text>
            <Text className="text-gray-500">
              {t.skills.subtitle}
            </Text>
          </View>

          <View className="flex-1 pb-4">
            <View className="flex-row flex-wrap justify-between">
              {SKILLS_LIST.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                const SkillIcon = skill.icon;
                return (
                  <TouchableOpacity
                    key={skill.id}
                    onPress={() => toggleSkill(skill.id)}
                    className={`p-4 rounded-xl border-2 mb-3 w-[48%] ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
                    activeOpacity={0.8}
                  >
                    <View className={`p-2 rounded-full mb-2 ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}`}>
                      <SkillIcon size={20} color={isSelected ? 'white' : '#6b7280'} />
                    </View>
                    <Text className={`font-bold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {skill.label[lang]}
                    </Text>
                    {isSelected && (
                      <View className="absolute top-2 right-2">
                        <CheckCircle size={16} color="#2563eb" fill="#2563eb" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="pt-4 mt-auto">
            <View className="flex-row justify-between items-center mb-4 px-1">
              <Text className="text-sm text-gray-500">{selectedSkills.length} seleccionados</Text>
              <Text className="text-sm text-gray-500">Paso 2 de 3</Text>
            </View>
            <TouchableOpacity 
              onPress={handleSkillsContinue}
              disabled={selectedSkills.length === 0}
              className={`w-full font-bold py-4 rounded-xl flex-row items-center justify-center ${selectedSkills.length > 0 ? 'bg-blue-600' : 'bg-gray-200'}`}
              activeOpacity={0.8}
            >
              <Text className={selectedSkills.length > 0 ? 'text-white' : 'text-gray-400'}>
                {t.skills.continue_btn}
              </Text>
              <ChevronRight size={20} color={selectedSkills.length > 0 ? 'white' : '#9ca3af'} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const LegalModal = () => {
    if (!showLegal) return null;
    return (
      <Modal visible={showLegal !== null} transparent animationType="fade">
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh]">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
              <Text className="font-bold text-lg text-gray-800">
                {showLegal === 'terms' ? t.profile.terms : t.profile.privacy}
              </Text>
              <TouchableOpacity onPress={() => setShowLegal(null)} className="p-2 bg-gray-200 rounded-full">
                <X size={20} color="#4b5563" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-6">
              <Text className="text-sm text-gray-600 leading-relaxed">
                {showLegal === 'terms' ? LEGAL_TEXTS.terms[lang] : LEGAL_TEXTS.privacy[lang]}
              </Text>
            </ScrollView>
            <View className="p-4 border-t border-gray-100 bg-gray-50">
              <TouchableOpacity onPress={() => setShowLegal(null)} className="w-full bg-blue-600 py-3 rounded-xl">
                <Text className="text-white font-bold text-center">Aceptar / Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-br from-sky-400 to-blue-600">
        <View className="flex-1 items-center justify-center">
          <View className="relative p-10 rounded-[40px] shadow-xl mb-6 bg-white items-center justify-center">
            <View className="relative w-32 h-32 items-center justify-center">
              <Home size={100} color="#2563eb" strokeWidth={1.5} />
              <Hammer size={60} color="#ea580c" strokeWidth={2} fill="#ea580c" style={{ position: 'absolute', bottom: -4, right: -4, transform: [{ rotate: '-12deg' }] }} />
              <Leaf size={32} color="#22c55e" strokeWidth={2.5} style={{ position: 'absolute', top: 0, right: -8, transform: [{ rotate: '45deg' }] }} />
            </View>
          </View>
          <Text className="text-4xl font-extrabold tracking-tight mb-2 text-white">
            ContractorConnect
          </Text>
          <View className="bg-white/20 px-4 py-1 rounded-full">
            <Text className="text-blue-50 font-bold tracking-widest text-xs uppercase">
              Connecting Homes & Pros
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const Onboarding = () => (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 80 }}>
        <View className="flex-row justify-between items-center mb-6">
          <View className="bg-white w-14 h-14 rounded-2xl items-center justify-center shadow-md border border-gray-100 relative overflow-hidden">
            <View className="relative z-10 items-center justify-center w-full h-full" style={{ transform: [{ scale: 0.75 }] }}>
              <Home size={32} color="#2563eb" strokeWidth={1.5} />
              <Hammer size={20} color="#ea580c" strokeWidth={2} fill="#ea580c" style={{ position: 'absolute', bottom: 0, right: 0, transform: [{ rotate: '-12deg' }] }} />
            </View>
          </View>
          <TouchableOpacity onPress={() => setLang(l => l === 'es' ? 'en' : 'es')} className="bg-white px-3 py-1 rounded-full shadow-sm">
            <Text className="text-xs font-bold">{lang.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-extrabold text-gray-900 mb-2">{t.welcome}</Text>
        <Text className="text-gray-500 mb-8">{t.tagline}</Text>

        <RoleCard 
          icon={Home} color="bg-blue-500"
          title={t.roles.client.title} desc={t.roles.client.desc}
          onClick={() => { setRole('client'); setView('auth'); }}
        />

        <View className="my-4 flex-row items-center">
          <View className="h-px bg-gray-300 flex-1" />
          <Text className="px-4 text-xs text-gray-400 font-bold uppercase">Pro Zone</Text>
          <View className="h-px bg-gray-300 flex-1" />
        </View>

        <RoleCard 
          icon={User} color="bg-orange-500"
          title={t.roles.sub.title} desc={t.roles.sub.desc}
          onClick={() => { setRole('sub'); setView('auth'); }}
        />
        
        <RoleCard 
          icon={Leaf} color="bg-green-600"
          title={t.roles.labor.title} desc={t.roles.labor.desc}
          onClick={() => { setRole('labor'); setView('auth'); }}
        />

        <RoleCard 
          icon={HardHat} color="bg-gray-900"
          title={t.roles.gc.title} desc={t.roles.gc.desc}
          onClick={() => { setRole('gc'); setView('auth'); }}
        />

        <View className="my-4 flex-row items-center">
          <View className="h-px bg-gray-300 flex-1" />
          <Text className="px-4 text-xs text-gray-400 font-bold uppercase">Helpers</Text>
          <View className="h-px bg-gray-300 flex-1" />
        </View>

        <RoleCard 
          icon={Shovel} color="bg-yellow-600"
          title={t.roles.helper.title} desc={t.roles.helper.desc}
          onClick={() => { setRole('helper'); setView('auth'); }}
        />
      </ScrollView>
    </SafeAreaView>
  );

  // Placeholder components - estos se completarán después
  const Pricing = () => (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-6">
        <TouchableOpacity onPress={() => setView('onboarding')} className="mb-6 flex-row items-center">
          <ChevronRight size={16} color="#9ca3af" style={{ transform: [{ rotate: '180deg' }] }} />
          <Text className="text-gray-400 ml-1">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-6 text-white">{role === 'labor' ? t.subs.labor_tier : t.subs.title}</Text>
        <TouchableOpacity onPress={() => setView('app')} className="bg-blue-600 py-4 rounded-xl">
          <Text className="text-white font-bold text-center">Comenzar Prueba Gratis</Text>
        </TouchableOpacity>
        <View className="mt-6 flex-row justify-center space-x-4">
          <TouchableOpacity onPress={handleRestorePurchase}>
            <Text className="text-[10px] text-gray-500">Restore</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  
  const ProfileView = () => {
    return (
      <ScrollView className="bg-gray-50 flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="bg-white p-6 pt-12 rounded-b-3xl shadow-sm mb-6">
          <View className="items-center">
            <TouchableOpacity onPress={pickImage} className="relative w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden items-center justify-center">
              {userProfilePic ? (
                <Image source={{ uri: userProfilePic }} style={{ width: 112, height: 112, borderRadius: 56 }} resizeMode="cover" />
              ) : (
                <User size={48} color="#9ca3af" />
              )}
            </TouchableOpacity>
            
            <View className="flex-row items-center mt-4">
              <Text className="text-2xl font-bold text-gray-900 mr-2">Usuario Demo</Text>
              <TouchableOpacity onPress={() => setShowQrModal(true)} className="bg-gray-100 p-1.5 rounded-lg">
                <QrCode size={18} color="#4b5563" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-500 text-sm mt-1">{t.profile.member_since}</Text>
            <View className="flex-row mt-3 space-x-2">
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-bold uppercase">{role}</Text>
              </View>
              {isSubscribed && (
                <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
                  <Star size={10} color="#16a34a" fill="#16a34a" style={{ marginRight: 4 }} />
                  <Text className="text-green-700 text-xs font-bold uppercase">Premium</Text>
                </View>
              )}
              {hasInsurance && (
                <View className="bg-blue-600 px-3 py-1 rounded-full flex-row items-center">
                  <ShieldCheck size={10} color="white" fill="white" style={{ marginRight: 4 }} />
                  <Text className="text-white text-xs font-bold uppercase">Insured</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="px-6 space-y-6">
          {(role === 'sub' || role === 'gc') && (
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-4">
                <View className="bg-blue-100 p-2 rounded-lg mr-3">
                  <ShieldCheck size={20} color="#2563eb" />
                </View>
                <Text className="font-bold text-gray-800">{t.profile.insurance_title}</Text>
              </View>
              
              {hasInsurance ? (
                <View className="bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 p-2 rounded-full mr-3">
                      <CheckCircle size={24} color="#16a34a" />
                    </View>
                    <View>
                      <Text className="font-bold text-green-800 text-sm">{t.profile.badge_insured}</Text>
                      <Text className="text-[10px] text-green-600">{t.profile.verified_license}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setHasInsurance(false)}>
                    <X size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  onPress={() => setHasInsurance(true)}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 items-center justify-center"
                >
                  <Upload size={32} color="#d1d5db" />
                  <Text className="font-bold text-sm text-gray-600 mb-1 mt-2">{t.profile.upload_btn}</Text>
                  <Text className="text-xs text-gray-400 text-center">{t.profile.insurance_desc}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-100 p-2 rounded-lg mr-3">
                <CreditCard size={20} color="#9333ea" />
              </View>
              <Text className="font-bold text-gray-800">{t.profile.subscription}</Text>
            </View>
            
            <View className="bg-gray-50 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs font-bold text-gray-500 uppercase">{t.profile.active_plan}</Text>
                <View className={`px-2 py-0.5 rounded ${isSubscribed ? 'bg-green-200' : 'bg-red-200'}`}>
                  <Text className={`text-xs font-bold ${isSubscribed ? 'text-green-800' : 'text-red-800'}`}>
                    {isSubscribed ? 'ACTIVE' : 'CANCELED'}
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {role === 'sub' ? t.subs.sub_tier : role === 'labor' ? t.subs.labor_tier : role === 'gc' ? t.subs.gc_tier : 'Free Plan'}
              </Text>
              <Text className="text-xs text-gray-500">
                {isSubscribed ? `${t.profile.next_billing}: Nov 28, 2023` : t.profile.canceled_status}
              </Text>
            </View>

            {isSubscribed && (
              <TouchableOpacity 
                onPress={handleCancelSubscription}
                className="w-full border border-red-200 py-3 rounded-xl"
              >
                <Text className="text-red-500 font-bold text-sm text-center">{t.profile.cancel_sub}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-gray-100 p-2 rounded-lg mr-3">
                <Lock size={20} color="#4b5563" />
              </View>
              <Text className="font-bold text-gray-800">{t.profile.legal}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => setShowLegal('terms')} className="w-full flex-row justify-between items-center p-3 rounded-xl">
                <Text className="text-sm font-medium text-gray-600">{t.profile.terms}</Text>
                <ChevronRight size={16} color="#9ca3af" />
              </TouchableOpacity>
              <View className="h-px bg-gray-100 mx-3" />
              <TouchableOpacity onPress={() => setShowLegal('privacy')} className="w-full flex-row justify-between items-center p-3 rounded-xl">
                <Text className="text-sm font-medium text-gray-600">{t.profile.privacy}</Text>
                <ChevronRight size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout} className="w-full bg-gray-200 py-4 rounded-2xl flex-row items-center justify-center">
            <LogOut size={20} color="#4b5563" style={{ marginRight: 8 }} />
            <Text className="text-gray-600 font-bold">{t.profile.logout}</Text>
          </TouchableOpacity>
          
          <View className="mt-8 border border-red-100 bg-red-50 p-4 rounded-2xl">
            <Text className="text-red-600 font-bold text-sm mb-1">{t.profile.delete_account}</Text>
            <Text className="text-red-400 text-xs mb-4">{t.profile.delete_desc}</Text>
            <TouchableOpacity 
              onPress={handleDeleteAccount}
              className="w-full bg-white border border-red-200 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Trash2 size={16} color="#dc2626" style={{ marginRight: 8 }} />
              <Text className="text-red-600 font-bold text-sm">{t.profile.delete_account}</Text>
            </TouchableOpacity>
          </View>
          
          <View className="items-center pb-8 pt-4">
            <Text className="text-[10px] text-gray-400">Version 1.2.0 • Build 2405</Text>
          </View>
        </View>
        
        {showQrModal && (
          <Modal visible={showQrModal} transparent animationType="fade">
            <View className="flex-1 bg-black/80 items-center justify-center p-6">
              <View className="bg-white rounded-3xl w-full max-w-sm p-8 items-center relative">
                <TouchableOpacity 
                  onPress={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 bg-gray-100 rounded-full p-2"
                >
                  <X size={20} color="#9ca3af" />
                </TouchableOpacity>
                
                <Text className="text-xl font-bold text-gray-900 mb-2">{t.profile.qr_title}</Text>
                <Text className="text-sm text-gray-500 text-center mb-6">{t.profile.qr_desc}</Text>
                
                <View className="bg-white p-4 rounded-2xl border-2 border-gray-100 mb-6">
                  <Image 
                    source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://contractorconnect.demo/user/123" }}
                    style={{ width: 192, height: 192 }}
                    resizeMode="contain"
                  />
                </View>
                
                <View className="flex-row items-center">
                  <Home size={12} color="#9ca3af" />
                  <Text className="text-xs text-gray-400 ml-1">contractorconnect.app/u/demo</Text>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    );
  };
  const HomeClient = () => (
    <ScrollView className="flex-1 pb-24">
      <View className="bg-white p-6 pb-4 shadow-sm rounded-b-3xl mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-800">{lang === 'es' ? 'Hola, Alex' : 'Hi, Alex'} 👋</Text>
            <Text className="text-sm text-gray-500">{t.findPro}</Text>
          </View>
          <TouchableOpacity onPress={() => setTab('profile')} className="bg-gray-100 p-2 rounded-full">
            {userProfilePic ? (
              <Image source={{ uri: userProfilePic }} style={{ width: 24, height: 24, borderRadius: 12 }} />
            ) : (
              <User size={20} color="#4b5563" />
            )}
          </TouchableOpacity>
        </View>
        <View className="relative mb-6">
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }} />
          <TextInput 
            placeholder={lang === 'es' ? "Buscar plomero, electricista..." : "Search plumber, electrician..."}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-10 p-3"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity className="w-full bg-gradient-to-r from-red-500 to-rose-600 p-4 rounded-2xl flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="bg-white/20 p-2 rounded-lg mr-3">
              <AlertTriangle color="white" />
            </View>
            <View>
              <Text className="font-bold text-lg leading-tight text-white">{t.emergency}</Text>
              <Text className="text-xs text-white/90">{t.emergencyDesc}</Text>
            </View>
          </View>
          <ChevronRight color="white" />
        </TouchableOpacity>
      </View>
      <View className="px-6 mb-8">
        <Text className="font-bold text-gray-800 mb-4 text-lg">{t.categories_title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4">
          {CATEGORIES.map(cat => (
            <View key={cat.id} className="items-center mr-4 min-w-[72px]">
              <View className={`w-16 h-16 ${cat.color} rounded-2xl items-center justify-center mb-2`}>
                <cat.icon size={28} color="white" />
              </View>
              <Text className="text-xs font-medium text-gray-600 text-center">{cat.label[lang]}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View className="px-6">
        <Text className="font-bold text-gray-800 mb-4 text-lg">{t.nearYou}</Text>
        <View className="space-y-4">
          {PROS_NEARBY.map(pro => (
            <View key={pro.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row items-center">
              <Avatar name={pro.name} verified={pro.verified} color={pro.img} />
              <View className="ml-4 flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-gray-900">{pro.name}</Text>
                  <View className="flex-row items-center bg-yellow-50 px-1.5 py-0.5 rounded">
                    <Star size={10} color="#eab308" fill="#eab308" style={{ marginRight: 4 }} />
                    <Text className="font-bold text-yellow-700 text-xs">{pro.rating}</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500">{pro.role}</Text>
                <View className="mt-2 flex-row items-center">
                  <MapPin size={10} color="#9ca3af" />
                  <Text className="text-xs text-gray-400 ml-1">2.3 mi • {pro.reviews} reviews</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => { setActiveConversation({id: pro.id, name: pro.name, online: true}); setTab('chat'); }}
                className="ml-2 bg-black px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-xs font-bold">Chat</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
  
  const SubDashboard = () => (
    <ScrollView className="flex-1 pb-24">
      <View className="bg-orange-600 p-6 rounded-b-3xl mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-bold text-xl text-white">Hola, Profesional</Text>
            <Text className="text-white/80 text-xs">Nivel: Oro (4.9 ⭐)</Text>
          </View>
          <TouchableOpacity onPress={() => setTab('profile')} className="bg-white/20 p-2 rounded-full">
            {userProfilePic ? (
              <Image source={{ uri: userProfilePic }} style={{ width: 20, height: 20, borderRadius: 10 }} />
            ) : (
              <User size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row space-x-2 mt-4">
          <View className="bg-black/20 flex-1 p-2 rounded-lg">
            <Text className="text-xs text-white/80">Ganancias</Text>
            <Text className="font-bold text-white">$850.00</Text>
          </View>
          <View className="bg-black/20 flex-1 p-2 rounded-lg">
            <Text className="text-xs text-white/80">Trabajos</Text>
            <Text className="font-bold text-white">5 Activos</Text>
          </View>
        </View>
      </View>
      <View className="px-6">
        <Text className="font-bold text-gray-800 mb-4">{t.tools.title}</Text>
        <View className="flex-row flex-wrap justify-between">
          {['log', 'calc', 'invoices', 'change_order'].map(tool => (
            <TouchableOpacity 
              key={tool}
              onPress={() => setActiveTool(tool)}
              className="bg-white p-2 py-3 rounded-xl border border-gray-100 shadow-sm w-[23%] items-center mb-2"
            >
              <Text className="text-[10px] font-bold text-gray-800 text-center">{t.tools[tool]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
  
  const LaborDashboard = () => (
    <ScrollView className="flex-1 pb-24">
      <View className="bg-green-600 p-6 rounded-b-3xl mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-bold text-xl text-white">Panel de Servicios</Text>
            {boostActive && (
              <View className="bg-yellow-400 px-2 py-0.5 rounded-full mt-1 flex-row items-center">
                <Rocket size={10} color="black" />
                <Text className="text-black text-[10px] font-bold ml-1">BOOST ACTIVO</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => setTab('profile')} className="bg-white/20 p-2 rounded-full">
            {userProfilePic ? (
              <Image source={{ uri: userProfilePic }} style={{ width: 20, height: 20, borderRadius: 10 }} />
            ) : (
              <Leaf size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row space-x-2 mt-4">
          <View className="bg-black/20 flex-1 p-3 rounded-lg">
            <Text className="text-[10px] text-green-100 uppercase font-bold">Ganancias</Text>
            <Text className="font-bold text-lg text-white">$320.00</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setBoostActive(!boostActive)}
            className={`flex-1 p-3 rounded-lg ${boostActive ? 'bg-yellow-500' : 'bg-black/20'}`}
          >
            <Text className={`text-[10px] uppercase font-bold ${boostActive ? 'text-black/70' : 'text-green-100'}`}>Visibilidad</Text>
            <Text className={`font-bold text-sm ${boostActive ? 'text-black' : 'text-white'}`}>
              {boostActive ? 'Boost Activado' : 'Activar Boost'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  
  const HelperDashboard = () => (
    <ScrollView className="flex-1 pb-24">
      <View className={`p-6 rounded-b-3xl mb-6 ${isHelperAvailable ? 'bg-yellow-600' : 'bg-gray-600'}`}>
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-bold text-xl text-white">Hola, Ayudante</Text>
            <Text className="text-white/80 text-xs">Listo para trabajar</Text>
          </View>
          <TouchableOpacity onPress={() => setTab('profile')} className="bg-white/20 p-2 rounded-full">
            {userProfilePic ? (
              <Image source={{ uri: userProfilePic }} style={{ width: 20, height: 20, borderRadius: 10 }} />
            ) : (
              <Shovel size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <View className="bg-black/20 p-3 rounded-xl flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className={`w-3 h-3 ${isHelperAvailable ? 'bg-green-400' : 'bg-red-400'} rounded-full mr-2`} />
            <Text className="text-sm font-bold text-white">{isHelperAvailable ? "Estoy Disponible" : "No Disponible"}</Text>
          </View>
          <Switch 
            value={isHelperAvailable}
            onValueChange={toggleHelperAvailability}
            trackColor={{ false: '#9ca3af', true: '#22c55e' }}
            thumbColor={isHelperAvailable ? '#ffffff' : '#f3f4f6'}
          />
        </View>
        <TouchableOpacity 
          onPress={() => setHelperBoostActive(!helperBoostActive)}
          className={`w-full p-3 rounded-xl flex-row items-center justify-between ${helperBoostActive ? 'bg-white' : 'bg-black/20'}`}
        >
          <View>
            <Text className={`font-bold text-sm flex-row items-center ${helperBoostActive ? 'text-yellow-700' : 'text-white'}`}>
              <Rocket size={14} color={helperBoostActive ? '#ca8a04' : '#fbbf24'} style={{ marginRight: 4 }} />
              {t.subs.helper_boost_title}
            </Text>
            <Text className={`text-[10px] ${helperBoostActive ? 'text-yellow-800' : 'text-white/80'}`}>
              {helperBoostActive ? 'Activo (9:59h restantes)' : t.subs.helper_boost_desc}
            </Text>
          </View>
          <View className={`px-2 py-1 rounded ${helperBoostActive ? 'bg-yellow-100' : 'bg-white'}`}>
            <Text className={`text-xs font-bold ${helperBoostActive ? 'text-yellow-800' : 'text-yellow-700'}`}>
              {t.subs.helper_boost_price}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="px-6">
        <Text className="font-bold text-gray-800 mb-4">Chambas / Trabajos Rápidos</Text>
        <View className="space-y-4">
          {helperJobs.map(job => (
            <View key={job.id} className={`bg-white p-4 rounded-xl border-l-4 ${job.type === 'sub_offer' ? 'border-orange-500' : 'border-blue-500'} shadow-sm`}>
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row flex-wrap">
                  {job.tags.map((tag, idx) => (
                    <View key={idx} className={`${tag.color} px-2 py-1 rounded-md mr-1 mb-1 flex-row items-center`}>
                      {tag.icon && <tag.icon size={10} color={tag.color.includes('orange') ? '#ea580c' : '#16a34a'} style={{ marginRight: 4 }} />}
                      <Text className="text-[10px] font-bold">{tag.text}</Text>
                    </View>
                  ))}
                </View>
                <Text className="text-gray-900 font-bold text-sm">{job.pay}</Text>
              </View>
              <Text className="font-bold text-gray-800">{job.title}</Text>
              <Text className="text-gray-500 text-sm mb-3">{job.desc}</Text>
              <View className="flex-row items-center space-x-2 mb-3">
                <Avatar name={job.avatar} size="w-6 h-6" color={job.color}/>
                <Text className="text-xs text-gray-500">Publicado por {job.poster}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleApplyJob(job.id)}
                disabled={job.status === 'applied'}
                className={`w-full font-bold py-2 rounded-lg ${
                  job.status === 'applied' 
                  ? 'bg-green-100'
                  : job.type === 'sub_offer' ? 'bg-orange-500' : 'bg-gray-100'
                }`}
              >
                <Text className={`text-center text-sm ${
                  job.status === 'applied' 
                  ? 'text-green-700'
                  : job.type === 'sub_offer' ? 'text-white' : 'text-gray-600'
                }`}>
                  {job.status === 'applied' ? 'Postulado' : job.type === 'sub_offer' ? "Me Interesa" : "Ver Detalles"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
  
  const GCDashboard = () => (
    <ScrollView className="flex-1 pb-24 bg-gray-50">
      <View className="bg-white p-6 pt-12 pb-6 rounded-b-3xl shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xs text-gray-400 font-bold tracking-widest uppercase">General Contractor</Text>
            <Text className="text-2xl font-bold text-gray-900">BuildMaster Corp.</Text>
          </View>
          <TouchableOpacity onPress={() => setTab('profile')} className="w-10 h-10 bg-black rounded-full items-center justify-center">
            {userProfilePic ? (
              <Image source={{ uri: userProfilePic }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            ) : (
              <Text className="text-white font-bold">BM</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-black p-3 rounded-xl flex-1 items-center mr-2">
            <Users size={24} color="#eab308" />
            <Text className="text-xs font-bold text-white mt-2">{t.gc_actions.post_sub}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-200 p-3 rounded-xl flex-1 items-center">
            <ClipboardList size={24} color="#2563eb" />
            <Text className="text-xs font-bold text-gray-600 mt-2">{t.gc_actions.manage_proj}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  const ChatListView = () => (
    <ScrollView className="bg-white flex-1">
      <View className="p-6 pb-2 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Mensajes</Text>
        <View className="mt-4 relative">
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 10, zIndex: 1 }} />
          <TextInput 
            placeholder="Buscar chats..." 
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-10 p-2.5"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>
      
      <View className="mt-2">
        {CHATS_DATA.map(chat => (
          <TouchableOpacity 
            key={chat.id} 
            onPress={() => setActiveConversation(chat)}
            className="w-full flex-row items-center p-4 border-b border-gray-50"
          >
            <View className="relative">
              <Avatar name={chat.name} size="w-14 h-14" color={chat.role === 'Homeowner' ? 'bg-blue-600' : 'bg-gray-700'} verified={true} />
              {chat.online && <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />}
            </View>
            <View className="ml-4 flex-1">
              <View className="flex-row justify-between items-baseline mb-1">
                <Text className="font-bold text-gray-900 text-sm">{chat.name}</Text>
                <Text className="text-[10px] text-gray-400 font-medium">{chat.time}</Text>
              </View>
              <Text className="text-xs text-gray-500" numberOfLines={1}>{chat.lastMsg}</Text>
            </View>
            {chat.unread > 0 && (
              <View className="ml-3 bg-blue-600 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{chat.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const ChatScreen = () => {
    const [showOptions, setShowOptions] = useState(false);
    
    const handleReportUser = () => {
      Alert.alert("Success", t.chat.report_success);
      setShowOptions(false);
    };

    const handleBlockUser = () => {
      Alert.alert("Success", t.chat.block_success);
      setActiveConversation(null);
    };

    if (!activeConversation) return <ChatListView />;

    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-white p-3 shadow-sm border-b flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setActiveConversation(null)} className="mr-2 p-1 rounded-full">
              <ChevronRight size={24} color="#4b5563" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Avatar name={activeConversation.name} verified={true} />
            <View className="ml-3">
              <Text className="font-bold text-gray-900 leading-tight text-sm">{activeConversation.name}</Text>
              <Text className={`text-[10px] font-bold flex-row items-center ${activeConversation.online ? 'text-green-500' : 'text-gray-400'}`}>
                {activeConversation.online ? '● Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <View className="flex-row space-x-2 relative">
            <TouchableOpacity 
              onPress={() => setIsChatTranslated(!isChatTranslated)}
              className={`p-2 rounded-full ${isChatTranslated ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              <Globe size={18} color={isChatTranslated ? "#2563eb" : "#4b5563"} />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
              <Phone size={18} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptions(!showOptions)} className="p-2 bg-gray-100 rounded-full">
              <MoreVertical size={18} color="#4b5563" />
            </TouchableOpacity>
            {showOptions && (
              <View className="absolute right-0 top-10 bg-white shadow-xl rounded-xl border border-gray-100 w-40 z-50">
                <TouchableOpacity onPress={handleReportUser} className="w-full px-4 py-3 flex-row items-center">
                  <Flag size={14} color="#4b5563" style={{ marginRight: 8 }} />
                  <Text className="text-xs font-bold text-gray-700">{t.chat.report_user}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBlockUser} className="w-full px-4 py-3 flex-row items-center border-t border-gray-100">
                  <Ban size={14} color="#dc2626" style={{ marginRight: 8 }} />
                  <Text className="text-xs font-bold text-red-600">{t.chat.block_user}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {isChatTranslated && (
          <View className="bg-blue-50 px-4 py-2 border-b border-blue-100">
            <View className="flex-row items-center justify-center">
              <Languages size={14} color="#1e40af" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-blue-700">{t.chat.translated_on}</Text>
            </View>
          </View>
        )}
  
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View className="space-y-4">
            {messages.map((msg) => (
              <View key={msg.id} className={`flex-row ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <View className={`max-w-[75%] rounded-2xl p-3 ${
                  msg.sender === 'me' 
                    ? 'bg-blue-600 rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.type === 'image' ? (
                    <Image source={{ uri: msg.image }} style={{ width: '100%', borderRadius: 8, marginBottom: 4 }} resizeMode="cover" />
                  ) : (
                    <View>
                      <Text className={`text-sm ${msg.sender === 'me' ? 'text-white' : 'text-gray-800'}`}>
                        {isChatTranslated && msg.translation ? msg.translation : msg.text}
                      </Text>
                      {isChatTranslated && msg.translation && (
                        <Text className={`text-[10px] mt-1 border-t pt-1 ${msg.sender === 'me' ? 'border-white/20 text-blue-100' : 'border-gray-200 text-gray-400'}`}>
                          {t.chat.original}: {msg.text}
                        </Text>
                      )}
                    </View>
                  )}
                  <Text className={`text-[10px] text-right mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            ))}
            <View ref={messagesEndRef} />
          </View>
        </ScrollView>
  
        <View className="bg-white p-3 border-t border-gray-100 flex-row items-center">
          <TouchableOpacity 
            onPress={startCamera}
            className="p-2 mr-2 bg-gray-100 rounded-full"
          >
            <Camera size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 mr-2 bg-gray-100 rounded-full">
            <Mic size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={pickChatImage}
            className="p-2 mr-2 bg-gray-100 rounded-full"
          >
            <ImageIcon size={20} color="#4b5563" />
          </TouchableOpacity>
          <View className="flex-1">
            <TextInput 
              value={inputText}
              onChangeText={setInputText}
              placeholder={t.chat.placeholder}
              className="w-full bg-gray-100 text-sm rounded-full py-2 px-4"
              placeholderTextColor="#9ca3af"
              onSubmitEditing={handleSendMessage}
            />
          </View>
          <TouchableOpacity 
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            className={`ml-2 p-2 rounded-full ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <Send size={18} color={inputText.trim() ? 'white' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
  
        {isCameraOpen && (
          <Modal visible={isCameraOpen} animationType="slide">
            <SafeAreaView className="flex-1 bg-black">
              <CameraView ref={cameraRef} style={{ flex: 1 }}>
                <View className="flex-1 bg-transparent justify-end pb-10 px-6">
                  <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={stopCamera}>
                      <X size={30} color="white" />
                    </TouchableOpacity>
                    {capturedImage ? (
                      <TouchableOpacity onPress={sendPhoto} className="bg-blue-600 p-4 rounded-xl">
                        <Text className="text-white font-bold">{t.chat.send_photo}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={takePicture} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300" />
                    )}
                  </View>
                </View>
              </CameraView>
              {capturedImage && (
                <View className="absolute top-10 right-4 w-24 h-32 border-2 border-white bg-black">
                  <Image source={{ uri: capturedImage }} style={{ width: '100%', height: '100%' }} />
                </View>
              )}
            </SafeAreaView>
          </Modal>
        )}
      </SafeAreaView>
    );
  };
  const NavBar = () => (
    <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 h-20 flex-row justify-around items-center px-2 z-40 shadow-lg">
      <TouchableOpacity onPress={() => setTab('home')} className={`items-center w-16 ${tab==='home' ? 'text-blue-600' : 'text-gray-300'}`}>
        <Home size={24} color={tab==='home' ? '#2563eb' : '#d1d5db'} />
        <Text className={`text-[9px] font-bold mt-1 ${tab==='home' ? 'text-blue-600' : 'text-gray-300'}`}>{t.tabs.home}</Text>
      </TouchableOpacity>
      
      {role === 'gc' && (
        <TouchableOpacity onPress={() => setTab('projects')} className={`items-center w-16 ${tab==='projects' ? 'text-black' : 'text-gray-300'}`}>
          <Briefcase size={24} color={tab==='projects' ? '#000000' : '#d1d5db'} />
          <Text className={`text-[9px] font-bold mt-1 ${tab==='projects' ? 'text-black' : 'text-gray-300'}`}>{t.tabs.projects}</Text>
        </TouchableOpacity>
      )}

      <View className="-mt-8">
        <TouchableOpacity 
          onPress={() => {
            if(role === 'client') { setActiveConversation({id: 101, name: "Carlos M.", online: true}); setTab('chat'); }
          }}
          className={`w-14 h-14 rounded-full items-center justify-center shadow-lg ${
            role === 'gc' ? 'bg-black' : 
            role === 'sub' ? 'bg-orange-500' : 
            role === 'labor' ? 'bg-green-600' : 
            role === 'helper' ? 'bg-yellow-600' : 
            'bg-blue-600'
          }`}
          activeOpacity={0.8}
        >
          <Plus size={28} color="white" />
        </TouchableOpacity>
      </View>

      {role === 'gc' && (
        <TouchableOpacity onPress={() => setTab('network')} className={`items-center w-16 ${tab==='network' ? 'text-black' : 'text-gray-300'}`}>
          <Users size={24} color={tab==='network' ? '#000000' : '#d1d5db'} />
          <Text className={`text-[9px] font-bold mt-1 ${tab==='network' ? 'text-black' : 'text-gray-300'}`}>{t.tabs.network}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => { setTab('chat'); setActiveConversation(null); }} className={`items-center w-16 ${tab==='chat' ? 'text-blue-600' : 'text-gray-300'}`}>
        <MessageSquare size={24} color={tab==='chat' ? '#2563eb' : '#d1d5db'} />
        <Text className={`text-[9px] font-bold mt-1 ${tab==='chat' ? 'text-blue-600' : 'text-gray-300'}`}>{t.tabs.chat}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setTab('profile')} className={`items-center w-16 ${tab==='profile' ? 'text-blue-600' : 'text-gray-300'}`}>
        <User size={24} color={tab==='profile' ? '#2563eb' : '#d1d5db'} />
        <Text className={`text-[9px] font-bold mt-1 ${tab==='profile' ? 'text-blue-600' : 'text-gray-300'}`}>{t.tabs.profile}</Text>
      </TouchableOpacity>
    </View>
  );
  const CalculatorView = () => {
    const [type, setType] = useState('concrete');
    const [vals, setVals] = useState({ w: '', l: '', d: '' });
    const [result, setResult] = useState(null);

    const calc = () => {
      const w = parseFloat(vals.w) || 0;
      const l = parseFloat(vals.l) || 0;
      const d = parseFloat(vals.d) || 0;
      
      let res = 0;
      if (type === 'concrete') {
        res = (l * w * (d/12)) / 27; 
      } else if (type === 'paint') {
        res = ((l + w) * 2 * d) / 350; 
      } else if (type === 'drywall') {
        res = (l * w) / 32; 
      }
      setResult(res.toFixed(2));
    };

    return (
      <View>
        <View className="flex-row bg-gray-100 p-1 rounded-lg mb-4">
          {['concrete', 'paint', 'drywall'].map(t => (
            <TouchableOpacity 
              key={t}
              onPress={() => { setType(t); setResult(null); setVals({w:'',l:'',d:''}); }}
              className={`flex-1 py-1.5 rounded-md ${type === t ? 'bg-white shadow' : ''}`}
            >
              <Text className={`text-xs font-bold text-center capitalize ${type === t ? 'text-black' : 'text-gray-500'}`}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] mb-3">
            <Text className="text-xs text-gray-500 font-bold mb-1">Largo (ft)</Text>
            <TextInput 
              value={vals.l} 
              onChangeText={e=>setVals({...vals, l:e})} 
              keyboardType="numeric"
              className="w-full border p-2 rounded-lg bg-gray-50"
            />
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-xs text-gray-500 font-bold mb-1">Ancho (ft)</Text>
            <TextInput 
              value={vals.w} 
              onChangeText={e=>setVals({...vals, w:e})} 
              keyboardType="numeric"
              className="w-full border p-2 rounded-lg bg-gray-50"
            />
          </View>
          <View className="w-full">
            <Text className="text-xs text-gray-500 font-bold mb-1">
              {type === 'concrete' ? 'Profundidad (in)' : 'Altura (ft)'}
            </Text>
            <TextInput 
              value={vals.d} 
              onChangeText={e=>setVals({...vals, d:e})} 
              keyboardType="numeric"
              className="w-full border p-2 rounded-lg bg-gray-50"
            />
          </View>
        </View>
        <TouchableOpacity onPress={calc} className="w-full bg-blue-600 py-2 rounded-lg mb-4">
          <Text className="text-white font-bold text-center">Calcular</Text>
        </TouchableOpacity>
        {result !== null && (
          <View className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <Text className="text-sm text-blue-600 font-bold mb-1">Resultado Estimado</Text>
            <View className="flex-row items-baseline">
              <Text className="text-3xl font-extrabold text-gray-900">{result}</Text>
              <Text className="text-sm text-gray-500 ml-1">
                {type === 'concrete' ? 'Yardas Cúbicas' : type === 'paint' ? 'Galones' : 'Hojas (4x8)'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const ToolsModal = () => {
    if (!activeTool) return null;

    return (
      <Modal visible={activeTool !== null} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-white w-full max-w-sm rounded-2xl shadow-2xl max-h-[80vh]">
            <View className="bg-gray-900 p-4 flex-row justify-between items-center">
              <Text className="font-bold text-lg text-white">
                {activeTool === 'log' && t.tools.log_modal_title}
                {activeTool === 'calc' && t.tools.calc_modal_title}
                {activeTool === 'invoices' && t.tools.invoices_modal_title}
                {activeTool === 'change_order' && t.tools.change_order_modal_title}
              </Text>
              <TouchableOpacity onPress={() => setActiveTool(null)}>
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-4">
              {activeTool === 'log' && (
                <View className="space-y-4">
                  <View className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex-row items-start">
                    <ShieldCheck size={16} color="#ca8a04" style={{ marginRight: 8, marginTop: 2 }} />
                    <Text className="text-xs text-yellow-800 flex-1">
                      La bitácora te protege. Sube fotos diarias para evidenciar progreso y evitar disputas.
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-gray-700 mb-1">Proyecto</Text>
                    <View className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                      <Text className="text-sm">Remodelación Casa Smith</Text>
                    </View>
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-gray-700 mb-1">Notas de Hoy</Text>
                    <TextInput 
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm h-24" 
                      placeholder="Se terminó la instalación de tubería en baño principal..."
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center">
                      <Camera size={24} color="#9ca3af" />
                      <Text className="text-xs font-bold text-gray-400 mt-1">Tomar Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center">
                      <ImageIcon size={24} color="#9ca3af" />
                      <Text className="text-xs font-bold text-gray-400 mt-1">Galería</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity className="w-full bg-black py-3 rounded-xl flex-row items-center justify-center mt-2">
                    <Save size={18} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold">Guardar Bitácora</Text>
                  </TouchableOpacity>
                </View>
              )}
              {activeTool === 'calc' && <CalculatorView />}
              {activeTool === 'invoices' && (
                <View className="space-y-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm text-gray-500">Total Pendiente: <Text className="text-red-500 font-bold">$4,250.00</Text></Text>
                    <TouchableOpacity className="bg-blue-100 px-2 py-1 rounded">
                      <Text className="text-xs text-blue-700 font-bold">+ Crear</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="space-y-3">
                    {[
                      { id: 'INV-001', client: 'Casa Smith', amount: '$1,200', date: '02 Oct', status: 'paid' },
                      { id: 'INV-002', client: 'Oficinas Centro', amount: '$3,500', date: '05 Oct', status: 'pending' },
                      { id: 'INV-003', client: 'Residencia Perez', amount: '$750', date: '08 Oct', status: 'pending' }
                    ].map((inv) => (
                      <View key={inv.id} className="border border-gray-200 rounded-xl p-3 flex-row justify-between items-center">
                        <View>
                          <Text className="font-bold text-gray-800">{inv.client}</Text>
                          <Text className="text-xs text-gray-400">{inv.id} • {inv.date}</Text>
                        </View>
                        <View className="items-end">
                          <Text className="font-bold text-gray-900">{inv.amount}</Text>
                          <View className={`px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            <Text className={`text-[10px] font-bold ${inv.status === 'paid' ? 'text-green-700' : 'text-yellow-700'}`}>
                              {inv.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {activeTool === 'change_order' && (
                <View className="space-y-4">
                  <View className="bg-purple-50 border border-purple-200 p-3 rounded-lg flex-row items-start">
                    <FilePen size={16} color="#9333ea" style={{ marginRight: 8, marginTop: 2 }} />
                    <Text className="text-xs text-purple-800 flex-1">
                      Documenta cualquier trabajo extra para asegurar tu pago antes de empezar.
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-gray-700 mb-1">Proyecto</Text>
                    <View className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                      <Text className="text-sm">Remodelación Casa Smith</Text>
                    </View>
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-gray-700 mb-1">Descripción del Cambio</Text>
                    <TextInput 
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm h-16" 
                      placeholder="Ej: Instalar 4 luces empotradas adicionales en sala..."
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                  <View className="flex-row justify-between">
                    <View className="w-[48%]">
                      <Text className="text-xs font-bold text-gray-700 mb-1">Costo Extra ($)</Text>
                      <TextInput 
                        keyboardType="numeric"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm" 
                        placeholder="0.00"
                      />
                    </View>
                    <View className="w-[48%]">
                      <Text className="text-xs font-bold text-gray-700 mb-1">Tiempo Extra (Días)</Text>
                      <TextInput 
                        keyboardType="numeric"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm" 
                        placeholder="0"
                      />
                    </View>
                  </View>
                  <TouchableOpacity className="w-full bg-purple-600 py-3 rounded-xl flex-row items-center justify-center shadow-lg">
                    <Plus size={18} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold">Crear Change Order</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (view === 'onboarding') return <Onboarding />;
  if (view === 'auth') return <AuthScreen />;
  if (view === 'skills') return <SkillsSelection />;
  if (view === 'pricing') return <Pricing />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <RNStatusBar style="auto" />
      {view === 'app' && (
        <View className="flex-1">
          {tab === 'home' && role === 'sub' && <SubDashboard />}
          {tab === 'home' && role === 'labor' && <LaborDashboard />}
          {tab === 'home' && role === 'gc' && <GCDashboard />}
          {tab === 'home' && role === 'client' && <HomeClient />}
          {tab === 'home' && role === 'helper' && <HelperDashboard />}
          {tab === 'chat' && <ChatScreen />}
          {tab === 'profile' && <ProfileView />}
          <NavBar />
        </View>
      )}
      <ToolsModal />
      <LegalModal />
    </SafeAreaView>
  );
}
