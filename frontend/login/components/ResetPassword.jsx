"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ResetPassword = () => {
  const params = useParams();
  const router = useRouter();
  const token = typeof params.token === "string" ? params.token : "";

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setMensaje("");

    if (!nuevaContrasena || !confirmar) {
      setError("Debes completar ambos campos.");
      return;
    }

    if (nuevaContrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaContrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/recovery/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevaContrasena }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo actualizar la contraseña.");
        return;
      }

      setMensaje(data.message || "Contraseña actualizada correctamente.");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "380px",
      padding: "36px 30px",
      borderRadius: "20px",
      background: "linear-gradient(180deg, #0b1220, #020617)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 0 40px rgba(0,0,0,0.6)",
      color: "white",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        background: "linear-gradient(135deg, #4f7cff, #6d5cff)",
        borderRadius: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto 18px",
        fontWeight: "bold",
        fontSize: "20px"
      }}>
        T
      </div>

      <h2 style={{ textAlign: "center", fontSize: "18px", marginBottom: "6px" }}>
        Restablecer <span style={{ color: "#6d5cff" }}>contraseña</span>
      </h2>

      <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginBottom: "24px" }}>
        Ingresa tu nueva contraseña de acceso.
      </p>

      <label style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>
        NUEVA CONTRASEÑA
      </label>

      <input
        type="password"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        style={inputStyle}
      />

      <label style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px", display: "block", marginTop: "14px" }}>
        CONFIRMAR CONTRASEÑA
      </label>

      <input
        type="password"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="Repite la contraseña"
        style={inputStyle}
      />

      {error && (
        <p style={{ color: "#ff4d4d", fontSize: "12px", marginTop: "12px" }}>
          {error}
        </p>
      )}

      {mensaje && (
        <p style={{ color: "#22c55e", fontSize: "12px", marginTop: "12px" }}>
          {mensaje}
        </p>
      )}

      {!mensaje ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Actualizando..." : "Guardar nueva contraseña"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => router.replace("/login")}
          style={buttonStyle}
        >
          Volver al login
        </button>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.03)",
  color: "white",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(90deg, #4f7cff, #6d5cff)",
  color: "white",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "20px"
};

export default ResetPassword;
