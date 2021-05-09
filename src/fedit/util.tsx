import { useEffect, useRef, Ref } from 'react';

export const useEventListener = (
  eventName: string,
  handler: Ref<any>,
  element = window,
) => {
  const savedHandler = useRef<any>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: any) => {
      savedHandler.current(event);
    };

    element.addEventListener(eventName, eventListener);

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};
