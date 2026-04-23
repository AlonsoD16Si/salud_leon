"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import rules from "@/data/chatbot-rules.json";

type Rule = {
  keywords: string[];
  response: string;
};

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const FALLBACK_RESPONSE =
  "Hmm, no encontré información específica sobre eso 🤔 Te recomiendo explorar las secciones del menú o contactar directamente a tu módulo de atención más cercano. ¿Puedo ayudarte con algo más?";

const GREETING =
  "¡Hola! Soy LeonBot 👋 Estoy aquí para ayudarte con información de salud en León. ¿En qué puedo orientarte?";

export function LeonBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greeting", sender: "bot", text: GREETING },
  ]);

  const orderedRules = useMemo(() => rules as Rule[], []);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    const lower = trimmed.toLowerCase();
    const match = orderedRules.find((rule) =>
      rule.keywords.some((keyword) => lower.includes(keyword.toLowerCase())),
    );
    const reply = match?.response ?? FALLBACK_RESPONSE;

    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          sender: "bot",
          text: reply,
        },
      ]);
    }, 800);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Abrir LeonBot"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-emerald-600 p-3.5 text-white shadow-[0_12px_35px_-10px_rgba(16,185,129,0.75)] transition hover:scale-105 sm:bottom-5 sm:right-5 sm:p-4"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
        <span className="relative">
          <Image
            src="/logo_chatbot.png"
            alt="Logo LeonBot"
            width={500}
            height={500}
            className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-20 left-3 right-3 z-50 flex h-[min(68svh,520px)] flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/85 shadow-2xl backdrop-blur-xl sm:bottom-24 sm:left-auto sm:right-5 sm:w-[380px]"
          >
            <header className="bg-blue-800 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-widest text-blue-100">Asistente virtual</p>
              <div className="mt-1 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, -8, 8, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                >
                  🤖
                </motion.span>
                <h2 className="text-sm font-semibold">LeonBot - Asistente de Salud</h2>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4">
              {messages.map((message) => (
                <motion.article
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm ${
                    message.sender === "bot"
                      ? "mr-auto border-l-4 border-emerald-500 bg-emerald-50 text-slate-700"
                      : "ml-auto border-r-4 border-blue-500 bg-blue-50 text-slate-800"
                  }`}
                >
                  {message.text}
                </motion.article>
              ))}
              {typing ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-auto rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 px-3 py-2 text-sm text-slate-600"
                >
                  LeonBot está escribiendo...
                </motion.p>
              ) : null}
            </div>

            <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-2.5 sm:p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-teal-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
                >
                  Enviar
                </button>
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
