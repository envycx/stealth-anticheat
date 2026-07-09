'use client';

import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => void;
}

/**
 * Copies text to the clipboard and provides a `copied` flag that resets after
 * 2 seconds, useful for showing transient "copied!" feedback in the UI.
 */
export function useClipboard(resetDelay = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string) => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) return;

      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      });
    },
    [resetDelay]
  );

  return { copied, copy };
}
