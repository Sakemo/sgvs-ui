import { Dialog, Transition } from "@headlessui/react";
import type React from "react";
import { Fragment } from "react";
import Button from "./ui/Button";
import { LuX } from "react-icons/lu";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen, onClose, title, children, className
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-card bg-card-light dark:bg-card-dark text-left align-middle shadow-xl transition-all ${className}`}>
                                <header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-text-primary dark:text-white">
                                        {title}
                                    </Dialog.Title>
                                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close Modal">
                                        <LuX className="h-5 w-5" />
                                    </Button>

                                    <main>
                                        {children}
                                    </main>
                                </header>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export default Modal;