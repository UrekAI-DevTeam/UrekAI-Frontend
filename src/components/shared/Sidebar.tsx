"use client";

import React, { useState, createContext, useContext } from "react";
import Link, { LinkProps } from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col bg-background-surface border-r border-border flex-shrink-0 shadow-sm",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
        paddingLeft: animate ? (open ? "16px" : "8px") : "16px",
        paddingRight: animate ? (open ? "16px" : "8px") : "16px",
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut"
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background-surface border-b border-border w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-text-primary cursor-pointer hover:text-primary transition-colors"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-background-surface border-r border-border p-10 z-[100] flex flex-col justify-between shadow-lg",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-text-primary cursor-pointer hover:text-primary transition-colors"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate, setOpen } = useSidebar();
  
  const handleClick = () => {
    // Close sidebar on mobile after navigation
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <Link
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center group/sidebar py-2 px-3 rounded-lg transition-all duration-200 hover:bg-interactive-hover hover:shadow-sm",
        "text-text-secondary hover:text-text-primary",
        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-sm",
        // Center icons when collapsed, left-align when expanded
        animate && !open ? "justify-center" : "justify-start gap-2",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 text-text-muted group-hover/sidebar:text-primary transition-colors duration-200">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        className="text-text-secondary text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};