"use client";

import { useState } from "react";
import { IconMail, IconAlertCircle, IconCheckCircle, IconX } from "./icons";

const MAX_CORREO = 60;

const RecoveryModal = ({ onClose }) => {
    const [correo,  setCorreo]  = useState("");
    const [error,   setError]   = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const validar = () => {
        if (!correo.trim()) {
            setError("El correo no puede estar vacío.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            setError("Ingresá un correo electrónico válido.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        if (!validar()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/recovery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correo.trim().toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Ocurrió un error. Intentá más tarde.");
                return;
            }

            setSuccess(data.message);
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") onClose();
    };

    const overlay = {
        position: "fixed",
        inset: 0,
        background: "rgba(2, 6, 23, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const card = {
        width: "380px",
        padding: "36px 30px",
        borderRadius: "20px",
        background: "linear-gradient(180deg, #0b1220, #020617)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        color: "white",
        position: "relative",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    };

    return (
        <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={card}>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    style={{
                        position: "absolute", top: "16px", right: "16px",
                        background: "none", border: "none", color: "#9ca3af",
                        cursor: "pointer", lineHeight: 1,
                        padding: "4px", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    <IconX size={18} />
                </button>

                <div style={{
                    width: "48px", height: "48px",
                    background: "linear-gradient(135deg, #4f7cff, #6d5cff)",
                    borderRadius: "13px", display: "flex",
                    justifyContent: "center", alignItems: "center",
                    margin: "0 auto 18px", fontWeight: "bold", fontSize: "20px",
                }}>
                    T
                </div>

                <h2 style={{ textAlign: "center", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>
                    Recuperar <span style={{ color: "#6d5cff" }}>contraseña</span>
                </h2>

                <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginBottom: "24px" }}>
                    Ingresá tu correo y te enviaremos tus credenciales.
                </p>

                <label style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>
                    CORREO ELECTRÓNICO
                </label>
                <div style={{ position: "relative", marginBottom: error ? "6px" : "20px" }}>
                    <span style={{
                        position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                        opacity: 0.6, display: "flex", alignItems: "center", color: "#fff",
                    }}>
                        <IconMail />
                    </span>
                    <input
                        type="email"
                        placeholder="Ingresá tu correo"
                        value={correo}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CORREO) {
                                setCorreo(e.target.value);
                                if (error) setError("");
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        maxLength={MAX_CORREO}
                        style={{
                            width: "100%", padding: "12px 40px",
                            borderRadius: "10px",
                            border: `1px solid ${error ? "#ff4d4d" : "rgba(255,255,255,0.1)"}`,
                            background: "rgba(255,255,255,0.03)",
                            color: "white", outline: "none",
                            fontSize: "14px", boxSizing: "border-box",
                        }}
                        autoFocus
                    />
                </div>

                {error && (
                    <p style={{
                        color: "#ff4d4d", fontSize: "11px", marginBottom: "14px", paddingLeft: "2px",
                        display: "flex", alignItems: "center", gap: "6px",
                    }}>
                        <IconAlertCircle size={14} />
                        <span>{error}</span>
                    </p>
                )}

                {success && (
                    <div style={{
                        color: "#22c55e", fontSize: "12px",
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        borderRadius: "8px", padding: "9px 14px", marginBottom: "12px",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        gap: "8px", flexWrap: "wrap", textAlign: "center",
                    }}>
                        <span style={{ display: "flex", flexShrink: 0, color: "#22c55e" }}>
                            <IconCheckCircle size={16} />
                        </span>
                        <span>{success}</span>
                    </div>
                )}

                {!success && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: "100%", padding: "13px",
                            borderRadius: "12px", border: "none",
                            background: "linear-gradient(90deg, #4f7cff, #6d5cff)",
                            color: "white", fontWeight: 600, fontSize: "14px",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1, marginBottom: "12px",
                        }}
                    >
                        {loading ? "Enviando..." : "Enviar credenciales →"}
                    </button>
                )}

                {success && (
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            width: "100%", padding: "13px",
                            borderRadius: "12px", border: "none",
                            background: "linear-gradient(90deg, #1f2937, #111827)",
                            color: "#9ca3af", fontWeight: 600, fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        Volver al login
                    </button>
                )}

                <div style={{
                    marginTop: "16px", fontSize: "11px", color: "#6b7280",
                    display: "flex", alignItems: "center", gap: "6px",
                }}>
                    <div style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%" }} />
                    Sistema activo · TOTEM Management Platform
                </div>

            </div>
        </div>
    );
};

export default RecoveryModal;
