import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
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
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[4px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto z-[41]">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="transform overflow-hidden bg-white text-left align-middle shadow-100 transition-all p-8 rounded-8">
                <div className="bg-white rounded-12 p-24 ">
                  <>
                    {title && (
                      <Dialog.Title className="font-bold text-title text-black text-center mb-8">
                        {title}
                      </Dialog.Title>
                    )}
                    {children}
                  </>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default MyDialog;
