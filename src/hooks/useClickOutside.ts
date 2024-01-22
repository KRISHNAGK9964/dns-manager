import React, { useEffect, useRef, useState } from 'react'

const useClickOutside = (handler :any) => {
  let domNode = useRef() as any;
  
  useEffect(() => {
    let maybehandler = (event: any) => {
      if (!domNode.current?.contains(event.target as any)) {
        handler();
      }
    };
    document.addEventListener("mousedown", maybehandler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return domNode;
}

export default useClickOutside;