"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type DrawerContent = { title: string; subtitle?: ReactNode; body: ReactNode } | null;

type DrawerState = {
  content: DrawerContent;
  open: (title: string, subtitle: ReactNode, body: ReactNode) => void;
  close: () => void;
};

const Ctx = createContext<DrawerState | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<DrawerContent>(null);
  const open = (title: string, subtitle: ReactNode, body: ReactNode) => setContent({ title, subtitle, body });
  const close = () => setContent(null);
  return <Ctx.Provider value={{ content, open, close }}>{children}</Ctx.Provider>;
}

export function useDrawer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDrawer must be used within DrawerProvider");
  return c;
}

export function DrawerHost() {
  const { content, close } = useDrawer();
  const isOpen = !!content;
  return (
    <>
      <div className={`drawer-bg${isOpen ? " open" : ""}`} onClick={close} />
      <div className={`drawer${isOpen ? " open" : ""}`}>
        {content && (
          <>
            <div className="dh">
              <div>
                <h3>{content.title}</h3>
                {content.subtitle && <div className="mt6">{content.subtitle}</div>}
              </div>
              <div className="x" onClick={close}>×</div>
            </div>
            <div className="db">{content.body}</div>
          </>
        )}
      </div>
    </>
  );
}
