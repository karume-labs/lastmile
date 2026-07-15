// Local, dependency-free id helpers. Good enough for client-generated
// identifiers that only need to be unique within one device's queue.

export const generateLocalId = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}${random}`;
};

/** Human-facing reference shown to registrars and printed on receipts, e.g. LM-K3F9A2. */
export const generateReferenceId = () => `LM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
