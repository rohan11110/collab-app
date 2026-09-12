import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Helmet } from "react-helmet";
import LoginForm from "./components/LoginForm";
import TrustSignals from "./components/TrustSignals";
import ThemeToggle from "../../components/ThemeToggle";

const LoginScreen = () => (
  <>
    <Helmet>
      <title>Sign in · CollabDocs</title>
      <meta name="description" content="Sign in to your CollabDocs workspace." />
    </Helmet>
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 soft-grid opacity-40" />
      <div className="absolute -left-20 -top-28 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-16 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[30px] border border-border/70 bg-card/75 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative hidden min-h-[650px] overflow-hidden bg-gradient-to-br from-primary via-indigo-600 to-violet-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 0, transparent 35%), radial-gradient(circle at 80% 80%, white 0, transparent 25%)" }} />
            <div className="relative">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><FileText size={20}/></span><span className="text-lg font-bold">CollabDocs</span></div>
              <div className="mt-24 max-w-md">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/15"><Sparkles size={12}/> Built for teams that move fast</div>
                <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-.04em]">Write together. Ship ideas faster.</h1>
                <p className="mt-5 text-sm leading-6 text-white/75">A focused workspace for documents, comments, sharing, and live collaboration — without losing the simplicity of a blank page.</p>
              </div>
            </div>
            <div className="relative grid grid-cols-3 gap-3">
              {[{ icon: Users, label: "Live teamwork" }, { icon: ShieldCheck, label: "Private by design" }, { icon: FileText, label: "Smart workspace" }].map(({ icon: Icon, label }) => <div key={label} className="rounded-2xl bg-white/8 p-3 ring-1 ring-white/10"><Icon size={16}/><p className="mt-2 text-[11px] font-semibold text-white/80">{label}</p></div>)}
            </div>
          </div>
          <div className="relative flex min-h-[650px] flex-col justify-center p-6 sm:p-10">
            <div className="absolute right-5 top-5"><ThemeToggle /></div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
              <div className="mb-8 lg:hidden"><div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white"><FileText size={18}/></span><span className="font-bold">CollabDocs</span></div></div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Welcome back</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-.035em]">Sign in to your workspace</h2>
              <p className="mt-2 text-sm text-muted-foreground">Continue where your team left off.</p>
              <div className="mt-8"><LoginForm /></div>
              <div className="mt-5"><TrustSignals /></div>
              <p className="mt-8 text-center text-[11px] text-muted-foreground">© {new Date().getFullYear()} CollabDocs · Secure collaborative documents</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LoginScreen;
