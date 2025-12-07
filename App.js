Import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, 
  Modal, Alert, SafeAreaView, Platform, KeyboardAvoidingView, StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { styled } from 'nativewind';
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

// --- CONFIGURACIÓN Y TRADUCCIONES (IDÉNTICO AL ORIGINAL) ---
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
        "Insignia 'Verificado'",
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
        "Leads Exclusivos de Alto Valor", 
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
      change_order_modal_title: "Órdenes de Cambio"
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
      camera_error: "No se pudo acceder a la cámara.",
      take_photo: "Tomar Foto",
      retake: "Retomar",
      send_photo: "Enviar Foto",
      translating: "Traduciendo chat...",
      translated_on: "Traducción activada (EN <-> ES)",
      translated_off: "Traducción desactivada",
      report_user: "Reportar Usuario",
      block_user: "Bloquear Usuario",
      report_success: "Usuario reportado.",
      block_success: "Usuario bloqueado.",
      original: "Original"
    },
    profile: {
      title: "Mi Perfil",
      upload_photo: "Cambiar Foto",
      subscription: "Suscripción",
      cancel_sub: "Cancelar Suscripción",
      cancel_confirm: "¿Seguro? Perderás acceso premium.",
      legal: "Legal y Privacidad",
      terms: "Términos y Condiciones (EULA)",
      privacy: "Política de Privacidad",
      logout: "Cerrar Sesión",
      member_since: "Miembro desde 2023",
      active_plan: "Plan Activo",
      next_billing: "Próximo cobro",
      canceled_status: "Cancelado",
      insurance_title: "Seguro y Licencias",
      insurance_desc: "Sube tu COI para verificar.",
      upload_btn: "Subir Documento / Foto",
      verified_license: "Licencia Verificada",
      badge_insured: "ASEGURADO / INSURED",
      qr_title: "Mi Tarjeta Digital",
      qr_desc: "Escanéame para ver mi perfil",
      delete_account: "Eliminar Cuenta",
      delete_desc: "Acción irreversible.",
      delete_confirm: "¿Eliminar cuenta permanentemente?"
    },
    skills: {
      title: "Selecciona tus Habilidades",
      subtitle: "Elige los oficios que dominas.",
      continue_btn: "Continuar a Planes",
      select_at_least: "Selecciona al menos 1"
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
      sub: { title: "Subcontractor", desc: "Trades: Plumbing, Electric, HVAC" },
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
      camera_error: "Could not access camera.",
      take_photo: "Take Photo",
      retake: "Retake",
      send_photo: "Send Photo",
      translating: "Translating chat...",
      translated_on: "Translation ON (EN <-> ES)",
      translated_off: "Translation OFF",
      report_user: "Report User",
      block_user: "Block User",
      report_success: "User reported.",
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
      canceled_status: "Canceled",
      insurance_title: "Insurance & Licenses",
      insurance_desc: "Upload your COI to get the verification badge.",
      upload_btn: "Upload Document / Photo",
      verified_license: "License Verified",
      badge_insured: "INSURED / VERIFIED",
      qr_title: "My Digital Card",
      qr_desc: "Scan me to view my profile",
      delete_account: "Delete Account",
      delete_desc: "This action is irreversible.",
      delete_confirm: "Are you sure you want to permanently delete your account?"
    },
    skills: {
      title: "Select your Skills",
      subtitle: "Choose the trades you master.",
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

const LEGAL_TEXTS = {
  terms: {
    es: "Términos de Uso (EULA)...\n(Texto completo aquí)",
    en: "Terms of Use (EULA)...\n(Full text here)"
  },
  privacy: {
    es: "Política de Privacidad...\n(Texto completo aquí)",
    en: "Privacy Policy...\n(Full text here)"
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

  // Chat & Camera State
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! Vi tu solicitud de trabajo.", translation: "Hi! I saw your job request.", sender: 'other', type: 'text', time: '10:00 AM' },
    { id: 2, text: "¿Podrías enviarme una foto?", translation: "Could you send me a photo?", sender: 'other', type: 'text', time: '10:01 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
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

  const handleLogout = () => {
    setRole(null);
    setView('onboarding');
    setTab('home');
    setIsSubscribed(true); 
    setActiveConversation(null);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t.profile.delete_account,
      t.profile.delete_confirm,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => { Alert.alert("Account Deleted"); handleLogout(); } }
      ]
    );
  };

  const handleRestorePurchase = () => {
    Alert.alert("StoreKit", "Restoring purchases...");
    setIsSubscribed(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
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

  const handleAuthSuccess = () => {
    if (role === 'sub' || role === 'helper') setView('skills');
    else if (role === 'gc' || role === 'labor') {
      setView('pricing');
      setSubBilling('monthly');
    } else setView('app');
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
    if (selectedSkills.includes(skillId)) setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    else setSelectedSkills([...selectedSkills, skillId]);
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
    if (!cameraPermission || !cameraPermission.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) return;
    }
    setIsCameraOpen(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
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
      setCapturedImage(null);
      setIsCameraOpen(false);
    }
  };

  // --- COMPONENTS ---

  const Avatar = ({ name, size = "w-10 h-10", verified, color="bg-gray-700", imgUrl }) => (
    <View className={`relative ${size} rounded-full ${color} items-center justify-center shadow-sm overflow-hidden`}>
      {imgUrl ? (
        <Image source={{ uri: imgUrl }} className="w-full h-full" resizeMode="cover" />
      ) : (
        <Text className="text-white font-bold text-lg">{name.charAt(0)}</Text>
      )}
      {verified && (
        <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
          <CheckCircle size={12} color="#3b82f6" fill="currentColor" />
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
        <Text className="text-sm text-gray-500">{desc}</Text>
      </View>
      <ChevronRight size={24} color="#d1d5db" />
    </TouchableOpacity>
  );

  const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(false);
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-6 justify-center">
          <TouchableOpacity onPress={() => setView('onboarding')} className="mb-8 flex-row items-center">
             <ChevronRight size={20} color="#9ca3af" className="rotate-180 transform" />
             <Text className="text-gray-400 ml-1">Back</Text>
          </TouchableOpacity>

          <View className="mb-8 mt-4">
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
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
                  <User size={18} color="#9ca3af" className="mr-2" />
                  <TextInput className="flex-1 text-base text-gray-900" placeholder="John Doe" placeholderTextColor="#d1d5db"/>
                </View>
              </View>
            )}

            <View>
              <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">{t.auth.email_label}</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
                <Mail size={18} color="#9ca3af" className="mr-2" />
                <TextInput className="flex-1 text-base text-gray-900" placeholder="user@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#d1d5db"/>
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">{t.auth.pass_label}</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
                <Lock size={18} color="#9ca3af" className="mr-2" />
                <TextInput className="flex-1 text-base text-gray-900" secureTextEntry={true} placeholder="••••••" placeholderTextColor="#d1d5db"/>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleAuthSuccess}
            className="w-full bg-blue-600 py-4 rounded-xl mt-8 flex-row items-center justify-center shadow-md shadow-blue-200"
          >
            <Text className="text-white font-bold text-lg">{isLogin ? t.auth.login_btn : t.auth.signup_btn}</Text>
            <ChevronRight size={20} color="white" style={{marginLeft: 8}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="mt-8">
            <Text className="text-center text-sm text-gray-500 font-medium">
              {isLogin ? t.auth.toggle_signup : t.auth.toggle_login}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const SkillsSelection = () => (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 flex-1">
        <View className="mt-4 mb-6">
           <View className={`w-12 h-12 ${role === 'helper' ? 'bg-yellow-100' : 'bg-orange-100'} rounded-2xl items-center justify-center mb-4`}>
             <Wrench size={24} color={role === 'helper' ? '#ca8a04' : '#ea580c'} />
           </View>
           <Text className="text-3xl font-extrabold text-gray-900 mb-2">{t.skills.title}</Text>
           <Text className="text-gray-500">{t.skills.subtitle}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="flex-row flex-wrap justify-between">
            {SKILLS_LIST.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              const SkillIcon = skill.icon;
              return (
                <TouchableOpacity
                  key={skill.id}
                  onPress={() => toggleSkill(skill.id)}
                  className={`w-[48%] p-4 rounded-xl border-2 mb-3 flex-col items-start ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
                >
                  <View className={`p-2 rounded-full mb-2 ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    <SkillIcon size={20} color={isSelected ? 'white' : '#6b7280'} />
                  </View>
                  <Text className={`font-bold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                    {skill.label[lang]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity 
          onPress={handleSkillsContinue}
          disabled={selectedSkills.length === 0}
          className={`w-full py-4 rounded-xl mt-4 flex-row items-center justify-center ${selectedSkills.length > 0 ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <Text className={`font-bold text-lg ${selectedSkills.length > 0 ? 'text-white' : 'text-gray-400'}`}>{t.skills.continue_btn}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const Pricing = () => (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="p-6 flex-1">
        <TouchableOpacity onPress={() => setView('onboarding')} className="mb-6 flex-row items-center">
             <ChevronRight size={20} color="#9ca3af" className="rotate-180 transform" />
             <Text className="text-gray-400 ml-1">Back</Text>
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-white mb-6">{role === 'labor' ? t.subs.labor_tier : t.subs.title}</Text>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className={`${role === 'labor' ? 'bg-green-600' : 'bg-orange-600'} p-6 rounded-2xl shadow-lg relative overflow-hidden mb-8`}>
             <Text className="text-2xl font-bold text-white mb-1">{role === 'labor' ? t.subs.labor_tier : t.subs.sub_tier}</Text>
             <Text className="text-white/80 mb-4 text-sm">Professional access.</Text>

             <View className="flex-row bg-black/20 p-1 rounded-xl mb-6">
                {['weekly', 'monthly', 'yearly'].map((period) => (
                  <TouchableOpacity 
                    key={period}
                    onPress={() => setSubBilling(period)}
                    className={`flex-1 py-2 rounded-lg items-center ${subBilling === period ? 'bg-white' : ''}`}
                  >
                    <Text className={`text-xs font-bold ${subBilling === period ? (role==='labor'?'text-green-600':'text-orange-600') : 'text-white'}`}>
                      {t.subs[period]}
                    </Text>
                  </TouchableOpacity>
                ))}
             </View>

             <View className="flex-row items-end mb-6">
               <Text className="text-4xl font-extrabold text-white">
                 {role === 'labor' 
                    ? (subBilling === 'weekly' ? '$4.99' : subBilling === 'monthly' ? '$12.99' : '$99.99')
                    : (subBilling === 'weekly' ? '$7.99' : subBilling === 'monthly' ? '$19.99' : '$149.99')
                  }
               </Text>
               <Text className="text-white/80 ml-1 mb-1 font-bold">/ {subBilling}</Text>
             </View>

             <View className="space-y-2 mb-6">
               {(role === 'labor' ? t.subs.features_labor : t.subs.features_sub).map((f, i) => (
                 <View key={i} className="flex-row items-center mb-2">
                   <CheckCircle size={16} color="white" className="mr-2" />
                   <Text className="text-white text-sm flex-1">{f}</Text>
                 </View>
               ))}
             </View>

             <TouchableOpacity onPress={() => setView('app')} className="w-full bg-white py-3 rounded-xl items-center shadow-md">
                <Text className={`font-bold text-lg ${role === 'labor' ? 'text-green-600' : 'text-orange-600'}`}>Start Trial</Text>
             </TouchableOpacity>
          </View>
        </ScrollView>

        <View className="flex-row justify-center space-x-4 mt-2">
          <TouchableOpacity onPress={handleRestorePurchase}><Text className="text-gray-500 text-xs">Restore</Text></TouchableOpacity>
          <Text className="text-gray-500 text-xs">•</Text>
          <TouchableOpacity onPress={() => setShowLegal('terms')}><Text className="text-gray-500 text-xs">Terms</Text></TouchableOpacity>
          <Text className="text-gray-500 text-xs">•</Text>
          <TouchableOpacity onPress={() => setShowLegal('privacy')}><Text className="text-gray-500 text-xs">Privacy</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const HomeClient = () => (
    <ScrollView className="bg-gray-50 flex-1" contentContainerStyle={{paddingBottom: 100}}>
      <View className="bg-white p-6 pb-4 rounded-b-3xl shadow-sm mb-6 pt-12">
         <View className="flex-row justify-between items-center mb-4">
           <View>
             <Text className="text-2xl font-bold text-gray-800">{lang === 'es' ? 'Hola, Alex' : 'Hi, Alex'} 👋</Text>
             <Text className="text-sm text-gray-500">{t.findPro}</Text>
           </View>
           <TouchableOpacity onPress={() => setTab('profile')}>
             <Avatar name="A" imgUrl={userProfilePic} />
           </TouchableOpacity>
         </View>

         <View className="flex-row bg-gray-50 border border-gray-200 rounded-xl items-center px-3 py-3 mb-6">
            <Search size={18} color="#9ca3af" className="mr-2" />
            <TextInput placeholder={lang === 'es' ? "Buscar plomero..." : "Search plumber..."} className="flex-1 text-gray-900" placeholderTextColor="#9ca3af"/>
         </View>

         <TouchableOpacity className="w-full bg-red-500 p-4 rounded-2xl flex-row items-center justify-between shadow-lg shadow-red-200">
           <View className="flex-row items-center">
             <View className="bg-white/20 p-2 rounded-lg mr-3">
               <AlertTriangle color="white" size={24} />
             </View>
             <View>
               <Text className="font-bold text-lg text-white leading-tight">{t.emergency}</Text>
               <Text className="text-xs text-white/90">{t.emergencyDesc}</Text>
             </View>
           </View>
           <ChevronRight color="white" />
         </TouchableOpacity>
      </View>

      <View className="px-6 mb-8">
        <Text className="font-bold text-gray-800 mb-4 text-lg">{t.categories_title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-4">
          {CATEGORIES.map(cat => (
            <View key={cat.id} className="items-center mr-4">
              <View className={`w-16 h-16 ${cat.color} rounded-2xl items-center justify-center shadow-md mb-2`}>
                <cat.icon size={28} color="white" />
              </View>
              <Text className="text-xs font-medium text-gray-600 text-center">{cat.label[lang]}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="px-6 pb-20">
        <Text className="font-bold text-gray-800 mb-4 text-lg">{t.nearYou}</Text>
        {PROS_NEARBY.map(pro => (
          <View key={pro.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row items-center mb-4">
            <Avatar name={pro.name} verified={pro.verified} color={pro.img} />
            <View className="ml-4 flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-gray-900">{pro.name}</Text>
                <View className="flex-row items-center bg-yellow-50 px-1.5 py-0.5 rounded">
                  <Star size={10} color="#eab308" fill="#eab308" className="mr-1" />
                  <Text className="font-bold text-yellow-700 text-xs">{pro.rating}</Text>
                </View>
              </View>
              <Text className="text-xs text-gray-500">{pro.role}</Text>
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
    </ScrollView>
  );

  const SubDashboard = () => (
    <ScrollView className="bg-gray-50 flex-1" contentContainerStyle={{paddingBottom: 100}}>
       <View className="bg-orange-600 p-6 pt-14 pb-6 rounded-b-3xl mb-6 shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-bold text-xl text-white">Hola, Profesional</Text>
              <Text className="text-white/80 text-xs">Nivel: Oro (4.9 Stars)</Text>
            </View>
            <TouchableOpacity onPress={() => setTab('profile')}>
               <Avatar name="P" imgUrl={userProfilePic} />
            </TouchableOpacity>
          </View>
          <View className="flex-row space-x-2 mt-4">
             <View className="bg-black/20 flex-1 p-2 rounded-lg items-center">
               <Text className="text-xs text-white/80">Ganancias</Text>
               <Text className="font-bold text-white">$850.00</Text>
             </View>
             <View className="bg-black/20 flex-1 p-2 rounded-lg items-center">
               <Text className="text-xs text-white/80">Trabajos</Text>
               <Text className="font-bold text-white">5 Activos</Text>
             </View>
          </View>
       </View>
       
       <View className="px-6 mb-8">
          <Text className="font-bold text-gray-800 mb-4">{t.tools.title}</Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              {id: 'log', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', label: t.tools.log},
              {id: 'calc', icon: Calculator, color: 'text-orange-600', bg: 'bg-orange-100', label: t.tools.calc},
              {id: 'invoices', icon: Receipt, color: 'text-green-600', bg: 'bg-green-100', label: t.tools.invoices},
              {id: 'change_order', icon: FilePen, color: 'text-purple-600', bg: 'bg-purple-100', label: t.tools.change_order}
            ].map((tool) => (
              <TouchableOpacity key={tool.id} onPress={() => setActiveTool(tool.id)} className="w-[23%] bg-white p-2 py-3 rounded-xl border border-gray-100 items-center mb-2 shadow-sm">
                <View className={`${tool.bg} p-2 rounded-full mb-1`}>
                  <tool.icon size={18} color={tool.color === 'text-blue-600' ? '#2563eb' : tool.color === 'text-orange-600' ? '#ea580c' : tool.color === 'text-green-600' ? '#16a34a' : '#9333ea'} />
                </View>
                <Text className="text-[10px] font-bold text-gray-800 text-center">{tool.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
       </View>
    </ScrollView>
  );

  const ChatScreen = () => {
    if (!activeConversation) return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-6 pb-2 border-b border-gray-100 bg-white">
          <Text className="text-2xl font-bold text-gray-900">Mensajes</Text>
        </View>
        <ScrollView>
          {CHATS_DATA.map(chat => (
            <TouchableOpacity 
              key={chat.id} 
              onPress={() => setActiveConversation(chat)}
              className="flex-row items-center p-4 border-b border-gray-50 bg-white"
            >
              <Avatar name={chat.name} size="w-14 h-14" color={chat.role === 'Homeowner' ? 'bg-blue-600' : 'bg-gray-700'} verified={true} />
              <View className="ml-4 flex-1">
                <View className="flex-row justify-between items-baseline mb-1">
                  <Text className="font-bold text-gray-900 text-sm">{chat.name}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{chat.time}</Text>
                </View>
                <Text className="text-xs text-gray-500" numberOfLines={1}>{chat.lastMsg}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{height: 80}} />
      </SafeAreaView>
    );

    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-white p-3 shadow-sm border-b flex-row items-center justify-between z-10">
           <View className="flex-row items-center">
             <TouchableOpacity onPress={() => setActiveConversation(null)} className="mr-2">
               <ChevronRight className="rotate-180" size={24} color="#4b5563"/>
             </TouchableOpacity>
             <Avatar name={activeConversation.name} verified={true} size="w-10 h-10" />
             <View className="ml-3">
               <Text className="font-bold text-gray-900 text-sm">{activeConversation.name}</Text>
               <Text className="text-[10px] text-green-500 font-bold">Online</Text>
             </View>
           </View>
        </View>

        <ScrollView ref={scrollViewRef} className="flex-1 p-4" contentContainerStyle={{paddingBottom: 20}}>
          {messages.map((msg) => (
             <View key={msg.id} className={`flex-row mb-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
               <View className={`max-w-[75%] rounded-2xl p-3 ${msg.sender === 'me' ? 'bg-blue-600 rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                 {msg.type === 'image' ? (
                   <Image source={{ uri: msg.image }} style={{width: 200, height: 150, borderRadius: 8}} resizeMode="cover" />
                 ) : (
                   <Text className={msg.sender === 'me' ? 'text-white' : 'text-gray-800'}>{msg.text}</Text>
                 )}
                 <Text className={`text-[9px] text-right mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</Text>
               </View>
             </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
          <View className="bg-white p-3 border-t border-gray-100 flex-row items-center pb-8">
            <TouchableOpacity onPress={startCamera} className="p-2 mr-2 bg-gray-100 rounded-full"><Camera size={20} color="#6b7280" /></TouchableOpacity>
            <TouchableOpacity onPress={pickChatImage} className="p-2 mr-2 bg-gray-100 rounded-full"><ImageIcon size={20} color="#6b7280" /></TouchableOpacity>
            <TextInput 
              value={inputText}
              onChangeText={setInputText}
              placeholder={t.chat.placeholder}
              className="flex-1 bg-gray-100 text-sm rounded-full py-2 px-4 text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={handleSendMessage} className="ml-2 p-2 rounded-full bg-blue-600">
              <Send size={18} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal visible={isCameraOpen} animationType="slide">
          <View className="flex-1 bg-black">
            <CameraView style={{ flex: 1 }} ref={cameraRef}>
               <View className="flex-1 bg-transparent justify-end pb-10 px-6">
                 <View className="flex-row justify-between items-center">
                   <TouchableOpacity onPress={() => setIsCameraOpen(false)}><X size={30} color="white"/></TouchableOpacity>
                   {capturedImage ? (
                      <TouchableOpacity onPress={sendPhoto} className="bg-blue-600 p-4 rounded-xl"><Text className="text-white font-bold">Enviar</Text></TouchableOpacity>
                   ) : (
                      <TouchableOpacity onPress={takePicture} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300" />
                   )}
                 </View>
               </View>
            </CameraView>
            {capturedImage && (
               <View className="absolute top-10 right-4 w-24 h-32 border-2 border-white bg-black">
                 <Image source={{uri: capturedImage}} style={{width: '100%', height: '100%'}} />
               </View>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    );
  };

  const ProfileView = () => (
    <ScrollView className="bg-gray-50 flex-1" contentContainerStyle={{paddingBottom: 100}}>
       <View className="bg-white p-6 pt-12 rounded-b-3xl shadow-sm mb-6">
          <View className="items-center">
            <TouchableOpacity onPress={pickImage} className="relative w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden items-center justify-center">
               {userProfilePic ? <Image source={{ uri: userProfilePic }} className="w-full h-full" /> : <User size={48} color="#9ca3af" />}
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900 mt-4">Usuario Demo</Text>
            <Text className="text-gray-500 text-sm">{t.profile.member_since}</Text>
            <View className="flex-row mt-3 space-x-2">
               <View className="bg-blue-100 px-3 py-1 rounded-full"><Text className="text-blue-700 text-xs font-bold uppercase">{role}</Text></View>
               {isSubscribed && <View className="bg-green-100 px-3 py-1 rounded-full"><Text className="text-green-700 text-xs font-bold uppercase">Premium</Text></View>}
            </View>
          </View>
       </View>

       <View className="px-6 space-y-4">
         <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <Text className="font-bold text-gray-800 mb-2">{t.profile.subscription}</Text>
             <View className="bg-gray-50 p-4 rounded-xl mb-4">
                <Text className="font-bold text-gray-900">{role === 'sub' ? t.subs.sub_tier : 'Free Plan'}</Text>
                <Text className="text-xs text-gray-500">{isSubscribed ? `${t.profile.next_billing}: Nov 28` : 'Canceled'}</Text>
             </View>
             {isSubscribed && (
               <TouchableOpacity onPress={() => setIsSubscribed(false)} className="border border-red-200 py-3 rounded-xl items-center">
                 <Text className="text-red-500 font-bold text-sm">{t.profile.cancel_sub}</Text>
               </TouchableOpacity>
             )}
         </View>

         <TouchableOpacity onPress={handleLogout} className="bg-gray-200 py-4 rounded-2xl items-center">
            <Text className="text-gray-600 font-bold">{t.profile.logout}</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={handleDeleteAccount} className="border border-red-100 bg-red-50 py-3 rounded-xl items-center mt-4 mb-8">
            <Text className="text-red-600 font-bold text-sm">{t.profile.delete_account}</Text>
         </TouchableOpacity>
       </View>
    </ScrollView>
  );

  const NavBar = () => (
    <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 h-20 flex-row justify-around items-center pb-2 z-50">
       <TouchableOpacity onPress={() => setTab('home')} className="items-center w-16">
          <Home size={24} color={tab==='home' ? '#2563eb' : '#d1d5db'} />
          <Text className={`text-[10px] font-bold mt-1 ${tab==='home' ? 'text-blue-600' : 'text-gray-300'}`}>{t.tabs.home}</Text>
       </TouchableOpacity>
       <View className="-mt-8">
         <TouchableOpacity 
           onPress={() => { if(role === 'client') { setActiveConversation({id: 101, name: "Carlos M.", online: true}); setTab('chat'); }}}
           className={`w-14 h-14 rounded-full items-center justify-center shadow-lg ${role === 'sub' ? 'bg-orange-500' : 'bg-blue-600'}`}
         >
           <Plus size={28} color="white" />
         </TouchableOpacity>
       </View>
       <TouchableOpacity onPress={() => setTab('chat')} className="items-center w-16">
          <MessageSquare size={24} color={tab==='chat' ? '#2563eb' : '#d1d5db'} />
          <Text className={`text-[10px] font-bold mt-1 ${tab==='chat' ? 'text-blue-600' : 'text-gray-300'}`}>{t.tabs.chat}</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => setTab('profile')} className="items-center w-16">
          <User size={24} color={tab==='profile' ? '#2563eb' : '#d1d5db'} />
          <Text className={`text-[10px] font-bold mt-1 ${tab==='profile' ? 'text-blue-600' : 'text-gray-300'}`}>{t.tabs.profile}</Text>
       </TouchableOpacity>
    </View>
  );

  const LoadingScreen = () => (
    <View className="flex-1 bg-blue-600 items-center justify-center">
      <Home size={100} color="white" />
      <Text className="text-4xl font-extrabold text-white mt-4">ContractorConnect</Text>
    </View>
  );

  const Onboarding = () => (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6 justify-center">
        <View className="flex-row justify-between items-center mb-6">
           <View className="bg-white p-3 rounded-2xl shadow-sm">
             <Home size={32} color="#2563eb" />
           </View>
           <TouchableOpacity onPress={() => setLang(l => l === 'es' ? 'en' : 'es')} className="bg-white px-3 py-1 rounded-full shadow-sm">
             <Text className="text-xs font-bold">{lang.toUpperCase()}</Text>
           </TouchableOpacity>
        </View>
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">{t.welcome}</Text>
        <Text className="text-gray-500 mb-8">{t.tagline}</Text>

        <RoleCard icon={Home} color="bg-blue-500" title={t.roles.client.title} desc={t.roles.client.desc} onClick={() => { setRole('client'); setView('auth'); }} />
        <View className="h-px bg-gray-200 my-4" />
        <RoleCard icon={User} color="bg-orange-500" title={t.roles.sub.title} desc={t.roles.sub.desc} onClick={() => { setRole('sub'); setView('auth'); }} />
        <RoleCard icon={Leaf} color="bg-green-600" title={t.roles.labor.title} desc={t.roles.labor.desc} onClick={() => { setRole('labor'); setView('auth'); }} />
      </View>
    </SafeAreaView>
  );

  if (loading) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-gray-50">
      <RNStatusBar style="auto" />
      {view === 'onboarding' && <Onboarding />}
      {view === 'auth' && <AuthScreen />}
      {view === 'skills' && <SkillsSelection />}
      {view === 'pricing' && <Pricing />}
      {view === 'app' && (
        <View className="flex-1">
          {tab === 'home' && role === 'sub' && <SubDashboard />}
          {tab === 'home' && role === 'client' && <HomeClient />}
          {tab === 'chat' && <ChatScreen />}
          {tab === 'profile' && <ProfileView />}
          <NavBar />
        </View>
      )}
      
      {/* Tools Modal (Calculadora, etc) - Simplificado para demo */}
      <Modal visible={activeTool !== null} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl p-6">
             <View className="flex-row justify-between items-center mb-4">
               <Text className="text-xl font-bold">Herramienta: {activeTool}</Text>
               <TouchableOpacity onPress={() => setActiveTool(null)}><X size={24} color="gray"/></TouchableOpacity>
             </View>
             <Text className="text-gray-500 mb-4">Aquí iría la lógica de la herramienta seleccionada.</Text>
             <TouchableOpacity onPress={() => setActiveTool(null)} className="bg-black py-3 rounded-xl items-center"><Text className="text-white font-bold">Cerrar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Legal Modal */}
      <Modal visible={showLegal !== null} animationType="slide" presentationStyle="pageSheet">
         <View className="p-6 flex-1">
            <Text className="text-xl font-bold mb-4">{showLegal === 'terms' ? t.profile.terms : t.profile.privacy}</Text>
            <Text className="text-gray-600">{showLegal === 'terms' ? LEGAL_TEXTS.terms[lang] : LEGAL_TEXTS.privacy[lang]}</Text>
            <TouchableOpacity onPress={() => setShowLegal(null)} className="mt-8 bg-blue-600 py-3 rounded-xl items-center">
              <Text className="text-white font-bold">Aceptar</Text>
            </TouchableOpacity>
         </View>
      </Modal>
    </View>
  );
}