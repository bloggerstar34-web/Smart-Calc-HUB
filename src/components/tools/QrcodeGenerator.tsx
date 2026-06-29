import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, Download, Copy, RotateCcw, Share2, Wifi, Mail, Phone, MessageSquare, 
  User, Type, Settings, Sparkles, Info, HelpCircle, Check, FileText, ExternalLink, 
  Eye, Palette, CheckCircle, Sliders, ShieldCheck, Heart, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../common/ToastContainer';
import QRCode from 'qrcode';

interface QrcodeGeneratorProps {
  id?: string;
  onNavigate?: (page: 'tool-detail', category: any, toolId: string) => void;
}

type QRType = 'url' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard';

export const QrcodeGenerator: React.FC<QrcodeGeneratorProps> = ({ id, onNavigate }) => {
  // Navigation tab for the QR content type
  const [activeType, setActiveType] = useState<QRType>('url');

  // Input states
  const [url, setUrl] = useState('https://smartcalchub.com');
  const [text, setText] = useState('');
  
  // WiFi states
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email states
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone state
  const [phone, setPhone] = useState('');

  // SMS states
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // vCard states
  const [vcardName, setVcardName] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const [vcardTitle, setVcardTitle] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardAddress, setVcardAddress] = useState('');
  const [vcardUrl, setVcardUrl] = useState('');

  // Customization options
  const [qrSize, setQrSize] = useState<number>(350);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [margin, setMargin] = useState<number>(4);
  const [centerLogo, setCenterLogo] = useState<'none' | 'icon' | 'emoji'>('none');
  const [centerEmoji, setCenterEmoji] = useState('⭐');

  // App & Render states
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [rawSvg, setRawSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate dynamic payload based on selected QR Code content type
  const getPayload = (): string => {
    switch (activeType) {
      case 'url':
        if (!url) throw new Error('Please enter a valid URL or text payload.');
        return url;
      case 'wifi':
        if (!wifiSsid) throw new Error('SSID / Network Name is required for Wi-Fi QR Codes.');
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        if (!emailTo) throw new Error('Recipient email address is required.');
        const emailParams = [];
        if (emailSubject) emailParams.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) emailParams.push(`body=${encodeURIComponent(emailBody)}`);
        const query = emailParams.length > 0 ? `?${emailParams.join('&')}` : '';
        return `mailto:${emailTo}${query}`;
      case 'phone':
        if (!phone) throw new Error('Phone number is required.');
        return `tel:${phone}`;
      case 'sms':
        if (!smsPhone) throw new Error('Recipient phone number is required.');
        return `SMSTO:${smsPhone}:${smsMessage}`;
      case 'vcard':
        if (!vcardName) throw new Error('Name is required to generate a complete vCard.');
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${vcardName}`,
          vcardOrg ? `ORG:${vcardOrg}` : '',
          vcardTitle ? `TITLE:${vcardTitle}` : '',
          vcardPhone ? `TEL:${vcardPhone}` : '',
          vcardEmail ? `EMAIL:${vcardEmail}` : '',
          vcardAddress ? `ADR:${vcardAddress}` : '',
          vcardUrl ? `URL:${vcardUrl}` : '',
          'END:VCARD'
        ].filter(Boolean).join('\n');
      default:
        return '';
    }
  };

  // Triggers QR generation whenever configuration changes
  const generateQrCode = async () => {
    setError('');
    setIsGenerating(true);
    try {
      const payload = getPayload();
      
      // 1. Generate PNG Data URL using the Canvas ref
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, payload, {
          width: qrSize,
          margin: margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        });

        // If a center emoji/logo is chosen, draw it onto the canvas
        if (centerLogo !== 'none' && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const size = canvasRef.current.width;
            const logoSize = size * 0.18; // 18% of the QR Code size
            const center = size / 2;

            // Draw a rounded white (or background colored) container for the logo
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(center - logoSize / 2 - 4, center - logoSize / 2 - 4, logoSize + 8, logoSize + 8, 8);
            ctx.fill();

            if (centerLogo === 'emoji') {
              ctx.font = `${logoSize * 0.75}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(centerEmoji, center, center + 2);
            } else {
              // Draw a premium default star icon overlay
              ctx.fillStyle = fgColor;
              ctx.font = `${logoSize * 0.7}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('⚡', center, center + 1);
            }
          }
        }

        // Get final data URL
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setQrCodeUrl(dataUrl);
      }

      // 2. Generate clean SVG raw text
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        width: qrSize,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });
      setRawSvg(svgString);

    } catch (err: any) {
      setError(err.message || 'An error occurred during QR code generation.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run generation on mounting and state change
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQrCode();
    }, 200);
    return () => clearTimeout(timer);
  }, [
    activeType, url, text, wifiSsid, wifiPassword, wifiEncryption, wifiHidden,
    emailTo, emailSubject, emailBody, phone, smsPhone, smsMessage,
    vcardName, vcardOrg, vcardTitle, vcardPhone, vcardEmail, vcardAddress, vcardUrl,
    qrSize, fgColor, bgColor, errorCorrection, margin, centerLogo, centerEmoji
  ]);

  // Handle PNG Image Download
  const handleDownloadPng = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `smartcalc-qrcode-${activeType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Downloaded high-resolution QR Code (PNG)', 'success');
  };

  // Handle SVG Image Download
  const handleDownloadSvg = () => {
    if (!rawSvg) return;
    const blob = new Blob([rawSvg], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `smartcalc-qrcode-${activeType}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    toast('Downloaded clean vector QR Code (SVG)', 'success');
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        toast('QR Code image copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 3000);
      });
    } catch (err) {
      toast('Failed to copy. Try downloading the PNG instead.', 'error');
    }
  };

  // Native Web Share API integration
  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Custom QR Code',
            text: 'Scanned from SmartCalc Hub premium QR generator.',
          });
          setShared(true);
          setTimeout(() => setShared(false), 3000);
        } else {
          // Fallback: Copy raw payload string
          await navigator.clipboard.writeText(getPayload());
          toast('Copied raw QR payload text to clipboard!', 'success');
        }
      });
    } catch (err) {
      toast('Failed to share QR code.', 'error');
    }
  };

  // Resets the current tab inputs to default values
  const handleReset = () => {
    setUrl('https://smartcalchub.com');
    setWifiSsid('');
    setWifiPassword('');
    setWifiEncryption('WPA');
    setWifiHidden(false);
    setEmailTo('');
    setEmailSubject('');
    setEmailBody('');
    setPhone('');
    setSmsPhone('');
    setSmsMessage('');
    setVcardName('');
    setVcardOrg('');
    setVcardTitle('');
    setVcardPhone('');
    setVcardEmail('');
    setVcardAddress('');
    setVcardUrl('');

    // Customization resets
    setFgColor('#000000');
    setBgColor('#ffffff');
    setQrSize(350);
    setErrorCorrection('H');
    setMargin(4);
    setCenterLogo('none');
    toast('Inputs reset successfully', 'info');
  };

  // Inject JSON-LD Schema on mount for dynamic SEO validation
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "SmartCalc Hub Premium QR Code Generator",
      "description": "Generate custom high-resolution SVG and PNG QR codes offline and completely free. Standardize for Wifi, Contact Cards, SMS, and URLs.",
      "applicationCategory": "BusinessApplication, Utility",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5 Canvas.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "High resolution SVG vector downloads",
        "PNG raster image generation",
        "Custom foreground & background colors",
        "Center logo branding and emojis",
        "No tracking or server storage - 100% private"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'qrcode-schema-markup';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('qrcode-schema-markup');
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <div className="space-y-10" id={id}>
      
      {/* Breadcrumb Section */}
      <nav className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
        <button onClick={() => onNavigate && onNavigate('tool-detail', 'utility', 'password-generator')} className="hover:text-blue-600 transition-colors">Utility</button>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-bold">QR Code Generator</span>
      </nav>

      {/* Hero Badge & Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Offline Vector Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
          Premium QR Code Generator
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
          Create instantly scannable, beautiful QR codes for URLs, WiFi networks, emails, phone numbers, and contacts. Customize branding colors, design sizes, error margins, and add custom center logos.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand Options and Controls - Span 7 */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Select Input Type */}
          <div className="bg-white/60 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm backdrop-blur-xl overflow-hidden">
            
            {/* Quick-switching Tab list */}
            <div className="flex border-b border-gray-100 dark:border-slate-800 overflow-x-auto scrollbar-hide">
              {[
                { type: 'url', name: 'URL / Text', icon: Type },
                { type: 'wifi', name: 'Wi-Fi', icon: Wifi },
                { type: 'email', name: 'Email', icon: Mail },
                { type: 'phone', name: 'Phone Call', icon: Phone },
                { type: 'sms', name: 'SMS Msg', icon: MessageSquare },
                { type: 'vcard', name: 'Contact Card', icon: User },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.type}
                    onClick={() => setActiveType(tab.type as QRType)}
                    className={`flex items-center gap-2 px-5 py-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 ${
                      activeType === tab.type
                        ? 'border-blue-600 text-blue-600 bg-blue-50/20 dark:bg-blue-950/10'
                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Tab Inputs Panel */}
            <div className="p-6 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  
                  {/* URL Content Tab */}
                  {activeType === 'url' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                        Target Link or Plain Text
                      </label>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com or scan message..."
                        className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-400">Enter full URLs including http:// or https:// for direct mobile web-page opening.</p>
                    </div>
                  )}

                  {/* WiFi Content Tab */}
                  {activeType === 'wifi' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Network Name (SSID)
                        </label>
                        <input
                          type="text"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="Home_WiFi_2.4G..."
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Password
                        </label>
                        <input
                          type="password"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={wifiEncryption === 'nopass'}
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Encryption Protocol
                        </label>
                        <select
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value as any)}
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        >
                          <option value="WPA">WPA / WPA2 (Recommended)</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">No Encryption / Open</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="wifiHidden"
                          checked={wifiHidden}
                          onChange={(e) => setWifiHidden(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="wifiHidden" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          This is a hidden network (SSID broadcast disabled)
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Email Content Tab */}
                  {activeType === 'email' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          placeholder="recipient@example.com"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Feedback on Project..."
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Predefined Email Body
                        </label>
                        <textarea
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Type your preformatted email body..."
                          rows={3}
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone Call Content Tab */}
                  {activeType === 'phone' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-400">Include country dialing codes (e.g., +1, +44) for reliable cross-border calling.</p>
                    </div>
                  )}

                  {/* SMS Content Tab */}
                  {activeType === 'sms' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Recipient Phone Number
                        </label>
                        <input
                          type="tel"
                          value={smsPhone}
                          onChange={(e) => setSmsPhone(e.target.value)}
                          placeholder="+1555000000"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Predefined Message text
                        </label>
                        <textarea
                          value={smsMessage}
                          onChange={(e) => setSmsMessage(e.target.value)}
                          placeholder="Hey! Please check out this message..."
                          rows={3}
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Contact Card (vCard) Content Tab */}
                  {activeType === 'vcard' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={vcardName}
                          onChange={(e) => setVcardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Organization / Company
                        </label>
                        <input
                          type="text"
                          value={vcardOrg}
                          onChange={(e) => setVcardOrg(e.target.value)}
                          placeholder="SmartCalc Inc."
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={vcardTitle}
                          onChange={(e) => setVcardTitle(e.target.value)}
                          placeholder="Lead Software Engineer"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={vcardPhone}
                          onChange={(e) => setVcardPhone(e.target.value)}
                          placeholder="+15550199"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={vcardEmail}
                          onChange={(e) => setVcardEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Website (URL)
                        </label>
                        <input
                          type="text"
                          value={vcardUrl}
                          onChange={(e) => setVcardUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          Mailing Address
                        </label>
                        <input
                          type="text"
                          value={vcardAddress}
                          onChange={(e) => setVcardAddress(e.target.value)}
                          placeholder="123 Creative Suite, San Francisco, CA"
                          className="w-full px-4 py-3 text-sm bg-gray-50/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Input validation or error display */}
              {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 text-xs">
                  <Info className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Reset button inside input panel */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 rounded-xl transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Form
                </button>
              </div>

            </div>

          </div>

          {/* Card: Fine Tuning / Styling Customizer */}
          <div className="bg-white/60 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Custom Styling & Brand Settings</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* QR Foreground Color */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    QR Blocks (Dark)
                  </label>
                  <span className="text-xs font-mono text-gray-400">{fgColor}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 rounded-xl border border-gray-200 dark:border-slate-800 cursor-pointer overflow-hidden bg-transparent"
                  />
                  <div className="flex gap-1 items-center flex-1 overflow-x-auto">
                    {['#000000', '#1E40AF', '#065F46', '#9D174D', '#111827'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setFgColor(c)}
                        className="w-6 h-6 rounded-full border border-white dark:border-slate-900 cursor-pointer transition-transform hover:scale-110 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Background Color */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    Background Color
                  </label>
                  <span className="text-xs font-mono text-gray-400">{bgColor}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 rounded-xl border border-gray-200 dark:border-slate-800 cursor-pointer overflow-hidden bg-transparent"
                  />
                  <div className="flex gap-1 items-center flex-1 overflow-x-auto">
                    {['#ffffff', '#f8fafc', '#f1f5f9', '#eff6ff', '#fdf2f8'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setBgColor(c)}
                        className="w-6 h-6 rounded-full border border-white dark:border-slate-900 cursor-pointer transition-transform hover:scale-110 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Margin & Density Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span className="uppercase tracking-wider">Padding Margin</span>
                  <span>{margin} blocks</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Image Resolution sizes */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider block">
                  Export Dimension Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Standard', val: 250 },
                    { label: 'Medium', val: 350 },
                    { label: 'Ultra HD', val: 500 }
                  ].map((sz) => (
                    <button
                      key={sz.val}
                      onClick={() => setQrSize(sz.val)}
                      className={`py-2 text-xs font-bold border rounded-xl transition-all ${
                        qrSize === sz.val
                          ? 'border-blue-600 text-blue-600 bg-blue-50/20 dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {sz.label} ({sz.val}px)
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Correction standard */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider block">
                  Redundancy Level (Error Correction)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'L (7%)', val: 'L' },
                    { label: 'M (15%)', val: 'M' },
                    { label: 'Q (25%)', val: 'Q' },
                    { label: 'H (30%)', val: 'H' }
                  ].map((ec) => (
                    <button
                      key={ec.val}
                      onClick={() => setErrorCorrection(ec.val as any)}
                      title="Higher levels withstand damage/logos better"
                      className={`py-2 text-xs font-bold border rounded-xl transition-all ${
                        errorCorrection === ec.val
                          ? 'border-blue-600 text-blue-600 bg-blue-50/20 dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {ec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Center Logo / Branding Overlay */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider block">
                  Center Logo Branding
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'None', val: 'none' },
                    { label: 'Premium ⚡', val: 'icon' },
                    { label: 'Custom Emoji', val: 'emoji' }
                  ].map((logo) => (
                    <button
                      key={logo.val}
                      onClick={() => setCenterLogo(logo.val as any)}
                      className={`py-2 text-xs font-bold border rounded-xl transition-all ${
                        centerLogo === logo.val
                          ? 'border-blue-600 text-blue-600 bg-blue-50/20 dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {logo.label}
                    </button>
                  ))}
                </div>
                {centerLogo === 'emoji' && (
                  <div className="pt-2 flex gap-1.5 items-center">
                    <span className="text-xs text-gray-400">Select Emoji:</span>
                    {['⭐', '🔥', '💡', '🚀', '🎁', '🔐', '📅', '🛒'].map((em) => (
                      <button
                        key={em}
                        onClick={() => setCenterEmoji(em)}
                        className={`p-1 text-base rounded-lg border transition-transform hover:scale-125 ${
                          centerEmoji === em ? 'border-blue-500 bg-blue-50/20' : 'border-transparent'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Right Hand Output Box Visualizer - Span 5 */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          
          {/* Card: High Quality live preview */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            
            {/* Background design accents */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-xl"></div>

            <div className="relative space-y-6">
              
              {/* Card Header details */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold uppercase tracking-widest bg-white/25 px-2.5 py-1 rounded-full text-white">
                  Real-time Preview
                </span>
                <span className="text-xs text-white/80 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Secure & Client-Side
                </span>
              </div>

              {/* Actual hidden Canvas used for generating PNG and drawing customizations */}
              <div className="hidden">
                <canvas ref={canvasRef} />
              </div>

              {/* Centered QR Display */}
              <div className="flex justify-center py-4">
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-white/10 transition-transform duration-300 hover:scale-105">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Generated Premium QR Code"
                      referrerPolicy="no-referrer"
                      className="w-56 h-56 rounded-lg select-none"
                    />
                  ) : (
                    <div className="w-56 h-56 flex flex-col items-center justify-center bg-gray-100 rounded-lg text-gray-400 space-y-2">
                      <QrCode className="w-12 h-12 animate-pulse" />
                      <span className="text-xs font-bold text-gray-500">Awaiting Valid Payload</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and summary of the QR code */}
              <div className="text-center space-y-1">
                <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">
                  Configured QR Code Type
                </p>
                <p className="text-lg font-extrabold capitalize text-white tracking-tight">
                  {activeType} QR Payload
                </p>
              </div>

              {/* Download and Action Button Grid */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={!qrCodeUrl || isGenerating}
                  onClick={handleDownloadPng}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-indigo-900 font-bold text-sm rounded-2xl shadow-md hover:bg-indigo-50 transition-all cursor-pointer select-none disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  Download PNG (High-Res Image)
                </button>

                <button
                  type="button"
                  disabled={!rawSvg || isGenerating}
                  onClick={handleDownloadSvg}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white/15 text-white font-bold text-xs rounded-2xl border border-white/20 hover:bg-white/25 transition-all cursor-pointer select-none disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-white/95" />
                  Download SVG (Scalable Vector)
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={!qrCodeUrl}
                    onClick={handleCopyImage}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Image'}
                  </button>

                  <button
                    type="button"
                    disabled={!qrCodeUrl}
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Code
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Quick tips about error tolerance */}
          <div className="p-5 rounded-2xl border border-gray-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 text-xs text-gray-500 dark:text-gray-400 space-y-2">
            <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-bold">
              <Info className="w-4 h-4 text-blue-500" />
              Pro Tip: Center Logo Redundancy
            </div>
            <p className="leading-relaxed">
              When adding center emojis or custom graphics, we automatically set error correction to <b>H (30% Redundancy)</b>. This guarantees that your QR Code remains perfectly scannable even if 30% of its data grid is physically obscured.
            </p>
          </div>

        </div>

      </div>

      {/* SEO Section: How to Use */}
      <div className="pt-8 border-t border-gray-100 dark:border-slate-800/80 space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          How to Generate custom QR Codes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Choose QR Type',
              desc: 'Select from standard categories like Website URLs, Home Wi-Fi credentials, Predefined Emails, Phone calls, or vCard address books.'
            },
            {
              step: '2',
              title: 'Configure Inputs',
              desc: 'Enter accurate records such as encryption parameters, phone headers, or company metadata inside the reactive validation fields.'
            },
            {
              step: '3',
              title: 'Style Branding',
              desc: 'Fine-tune color values, margin widths, size grids, and place beautiful emojis or logo icons at the dead center of your QR matrix.'
            },
            {
              step: '4',
              title: 'Instant Export',
              desc: 'Download your high-resolution PNG image for print flyers or high-fidelity SVG code vectors for digital web layouts.'
            }
          ].map((item) => (
            <div key={item.step} className="bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm space-y-2 relative">
              <span className="absolute right-4 top-4 text-3xl font-extrabold text-blue-600/10 dark:text-blue-400/5 select-none">{item.step}</span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">{item.step}</span>
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Section: Benefits */}
      <div className="pt-8 border-t border-gray-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Benefits of using QR Codes
          </h2>
          <ul className="space-y-3.5 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span><b>Zero Friction Scanning</b>: Connect users directly to menus, websites, or contact numbers with a single scan, bypassing manual typing entirely.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span><b>Instant Wi-Fi Logins</b>: Eliminate typing complex WPA passwords. Visitors simply scan the QR card to auto-connect to the internet.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span><b>Print Ready Vectors (SVG)</b>: Vectors scale infinitely without loss of resolution. Perfect for restaurant tables, business flyers, and t-shirts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span><b>Offline Privacy Guaranteed</b>: Our code executes entirely in your browser memory. We never transmit your inputs or personal details to any server database.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Frequently Asked Questions (FAQs)
          </h2>
          <div className="space-y-3.5">
            {[
              {
                q: 'Are these QR codes permanent or will they expire?',
                a: 'These are completely static QR codes. They embed the physical data (like a URL or wifi password) directly into the pixel grid. They will never expire and do not require internet access to function.'
              },
              {
                q: 'Can I change the target URL after generating the QR Code?',
                a: 'Because static QR codes contain the literal text inside the grid, you cannot edit the destination after printing. If you change your URL, you will need to generate a new QR Code.'
              },
              {
                q: 'Why isn\'t my styled QR Code scanning properly?',
                a: 'Always ensure high contrast between your foreground block color and background color. Low-contrast color pairings (e.g. yellow on white) are difficult for older smartphone camera lenses to process.'
              }
            ].map((faq, index) => (
              <div key={index} className="space-y-1 bg-gray-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-gray-100 dark:border-slate-800/40">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{faq.q}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dynamic Related Tools section */}
      {onNavigate && (
        <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Related Calculation Tools</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'password-generator',
                name: 'Password Generator',
                category: 'utility',
                desc: 'Generate secure cryptographically random passwords.',
                emoji: '🔐'
              },
              {
                id: 'unix-timestamp-converter',
                name: 'Epoch Time Converter',
                category: 'utility',
                desc: 'Convert epoch seconds and dates to standard format.',
                emoji: '⏰'
              },
              {
                id: 'json-formatter',
                name: 'JSON Formatter',
                category: 'developer',
                desc: 'Parse, validate, format and beautify complex JSON streams.',
                emoji: '📦'
              },
              {
                id: 'regex-tester',
                name: 'Regex Playground',
                category: 'developer',
                desc: 'Test regex formulations and capture group structures.',
                emoji: '🔬'
              }
            ].map((related) => (
              <div
                key={related.id}
                onClick={() => onNavigate('tool-detail', related.category as any, related.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{related.emoji}</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      {related.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal line-clamp-2">
                      {related.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
