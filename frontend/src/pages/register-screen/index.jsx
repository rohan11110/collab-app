import React from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Users } from "lucide-react";
import { Helmet } from "react-helmet";
import RegistrationForm from "./components/RegistrationForm";
import ThemeToggle from "../../components/ThemeToggle";

const RegisterScreen = () => (
  <>
    <Helmet><title>Create account · CollabDocs</title><meta name="description" content="Create your CollabDocs account." /></Helmet>
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 soft-grid opacity-40" />
      <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-xl items-center px-4 py-8 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative w-full rounded-[30px] border border-border/70 bg-card/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="absolute right-5 top-5"><ThemeToggle /></div>
          <div className="mb-8 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg"><FileText size={19}/></span><div><p className="text-sm font-extrabold tracking-tight">CollabDocs</p><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Collaborative workspace</p></div></div>
          <div className="mb-8"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-primary"><Sparkles size={11}/> Create your workspace</div><h1 className="text-3xl font-extrabold tracking-[-.04em]">Start collaborating in minutes.</h1><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Create an account, invite your team, and turn a blank page into shared work.</p></div>
          <RegistrationForm />
          <div className="mt-6 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-muted/60 p-3"><Users size={15} className="text-primary"/><p className="mt-2 text-[11px] font-semibold">Invite teammates</p></div><div className="rounded-2xl bg-muted/60 p-3"><FileText size={15} className="text-primary"/><p className="mt-2 text-[11px] font-semibold">Edit in real time</p></div></div>
        </motion.div>
      </div>
    </div>
  </>
);

export default RegisterScreen;
