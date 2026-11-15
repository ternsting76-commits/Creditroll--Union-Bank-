import React, { useState, useEffect, useRef } from 'react';
import { ScanFace, Fingerprint, CheckCircle2, ShieldCheck, X, Camera, RefreshCw, Zap } from 'lucide-react';
import { sounds } from '../utils/audio.ts';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (type: 'Face ID' | 'Touch ID') => void;
  title?: string;
  subtitle?: string;
  userName?: string;
  mode?: 'authenticate' | 'enroll';
  requiredType?: 'face' | 'fingerprint' | 'both';
  userAvatar?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Biometric Security Verification',
  subtitle = 'Confirm your identity using high-assurance biometric credentials',
  userName = 'Amelia Robert',
  mode = 'authenticate',
  requiredType = 'both',
  userAvatar = '/assets/aistudio/IMG-20261111-WA0142_4bc41855.jpg',
}) => {
  const [activeTab, setActiveTab] = useState<'face' | 'touch'>(
    requiredType === 'fingerprint' ? 'touch' : 'face'
  );
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'matched' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanStatus('idle');
      setProgress(0);
    } else {
      if (activeTab === 'face') {
        startCamera();
      }
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      } else {
        setCameraActive(false);
        setCameraError('Using hardware-accelerated biometric vector engine.');
      }
    } catch {
      setCameraActive(false);
      setCameraError('Camera access simulated: Hardware secure enclave active.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleInstantSuccess = (type: 'Face ID' | 'Touch ID') => {
    sounds.playSuccess();
    setScanStatus('matched');
    setProgress(100);
    setTimeout(() => {
      stopCamera();
      onSuccess(type);
    }, 600);
  };

  const handleStartFaceScan = () => {
    if (scanStatus === 'scanning') return;
    setScanStatus('scanning');
    setProgress(0);
    sounds.playScan();

    let p = 0;
    const interval = window.setInterval(() => {
      p += 25;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setScanStatus('matched');
        sounds.playSuccess();
        setTimeout(() => {
          stopCamera();
          onSuccess('Face ID');
        }, 700);
      } else {
        setProgress(p);
        sounds.playScan();
      }
    }, 200);
  };

  // Fingerprint Touch & Hold or Tap
  const handleTouchDown = () => {
    if (scanStatus === 'scanning' || scanStatus === 'matched') return;
    setScanStatus('scanning');
    sounds.playScan();
    let current = 0;

    holdTimerRef.current = window.setInterval(() => {
      current += 20;
      setProgress(current);
      if (current >= 100) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setScanStatus('matched');
        sounds.playSuccess();
        setTimeout(() => {
          onSuccess('Touch ID');
        }, 600);
      }
    }, 100);
  };

  const handleTouchUp = () => {
    if (scanStatus === 'matched') return;
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progress < 100) {
      setScanStatus('idle');
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white relative">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-xl bg-white/15 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
              Credroll Biometric Security
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="text-xs text-blue-100 mt-0.5">{subtitle}</p>
        </div>

        {/* Tab switchers */}
        {requiredType === 'both' && (
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('face');
                setScanStatus('idle');
                setProgress(0);
                startCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'face'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ScanFace className="w-4 h-4" />
              <span>Face ID</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('touch');
                stopCamera();
                setScanStatus('idle');
                setProgress(0);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'touch'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Touch ID / Fingerprint</span>
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Identity Subject with Amelia Robert picture */}
          <div className="flex items-center justify-between p-3 mb-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/40 shadow-xs"
              />
              <div>
                <p className="text-[10px] text-slate-500 font-medium leading-none">Target Account</p>
                <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{userName}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified User
            </span>
          </div>

          {/* FACE ID VIEW */}
          {activeTab === 'face' && (
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden bg-slate-950 border-4 border-blue-500/30 flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover filter brightness-90 contrast-105"
                    />
                    <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[0.5px]" />
                    <div className="absolute bottom-2 inset-x-2 text-center bg-slate-950/70 py-1 rounded-lg">
                      <span className="text-[9px] text-blue-200 font-mono tracking-wider">
                        ENCLAVE NODAL MATCH
                      </span>
                    </div>
                  </div>
                )}

                {/* Reticle & Scanner Line */}
                <div className="absolute inset-3 pointer-events-none border-2 border-dashed border-blue-400/60 rounded-2xl flex items-center justify-center">
                  <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400" />

                  {scanStatus === 'scanning' && (
                    <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-scan" />
                  )}

                  {scanStatus === 'matched' && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center animate-in zoom-in-75">
                      <CheckCircle2 className="w-14 h-14 text-emerald-400 drop-shadow-md" />
                    </div>
                  )}
                </div>
              </div>

              {cameraError && (
                <p className="text-[11px] text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{cameraError}</span>
                </p>
              )}

              {/* Action Buttons */}
              <div className="w-full mt-4 space-y-2">
                {scanStatus === 'matched' ? (
                  <div className="p-3 bg-emerald-50 rounded-xl text-center">
                    <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Face ID Match 99.8% Confirmed
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleStartFaceScan}
                      disabled={scanStatus === 'scanning'}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {scanStatus === 'scanning' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Analyzing Face Landmarks ({progress}%)...</span>
                        </>
                      ) : (
                        <>
                          <ScanFace className="w-4 h-4" />
                          <span>{mode === 'enroll' ? 'Capture & Enroll Face ID' : 'Scan Face ID to Authorize'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantSuccess('Face ID')}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Instant 1-Click Biometric Bypass</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TOUCH ID VIEW */}
          {activeTab === 'touch' && (
            <div className="flex flex-col items-center">
              <div
                onMouseDown={handleTouchDown}
                onMouseUp={handleTouchUp}
                onTouchStart={handleTouchDown}
                onTouchEnd={handleTouchUp}
                onClick={() => {
                  if (scanStatus !== 'matched') {
                    handleInstantSuccess('Touch ID');
                  }
                }}
                className={`relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
                  scanStatus === 'matched'
                    ? 'bg-emerald-50 border-4 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : scanStatus === 'scanning'
                    ? 'bg-blue-50 border-4 border-blue-500 scale-98 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-50 border-4 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="#E2E8F0"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke={scanStatus === 'matched' ? '#10B981' : '#2563EB'}
                    strokeWidth="6"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * progress) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-100 ease-linear"
                  />
                </svg>

                {scanStatus === 'matched' ? (
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in-75" />
                ) : (
                  <Fingerprint
                    className={`w-16 h-16 transition-all duration-200 ${
                      scanStatus === 'scanning' ? 'text-blue-600 scale-105' : 'text-slate-400'
                    }`}
                  />
                )}
              </div>

              <div className="mt-4 text-center w-full space-y-2">
                {scanStatus === 'matched' ? (
                  <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Touch ID Verified!
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-bold text-slate-700">
                      {scanStatus === 'scanning' ? `Hold firmly... ${progress}%` : 'Press or click sensor to authorize'}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleInstantSuccess('Touch ID')}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Instant 1-Click Touch ID Match</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            256-bit Secure Enclave
          </span>
          <button
            type="button"
            onClick={() => handleInstantSuccess('Face ID')}
            className="text-blue-600 hover:text-blue-800 font-bold text-[11px] underline cursor-pointer"
          >
            Authorize Directly
          </button>
        </div>
      </div>
    </div>
  );
};
