import { Dialog, Transition } from '@headlessui/react';
import type { Payer } from '@prisma/client';
import { ComponentProps, ComponentType, Fragment } from 'react';

import Button from '~/components/ui/Button';
import type { ExtractProps } from '~/types/utils';

export type MyDialogProps = ExtractProps<typeof Dialog> & { title?: string };

const MyDialog = ({ open, title, children, ...dialogProps }: MyDialogProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" {...dialogProps}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-40" onClick={() => dialogProps.onClose(false)} />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <Dialog.Panel className="fixed inset-0 flex items-center justify-center p-8 rounded z-50">
            <div className="bg-white rounded-12 p-24 ">
              <>
                {title && (
                  <Dialog.Title className="font-bold text-title text-black text-center mb-8">{title}</Dialog.Title>
                )}
                {children}
              </>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
export default MyDialog;
