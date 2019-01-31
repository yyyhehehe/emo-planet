import React, { createContext, ReactNode, useState } from "react";

import { Snackbar } from "@material-ui/core";

interface Value {
  toast(message: string): void;
}

const overlayContext = createContext<Value>({} as any);

export default overlayContext;
export const Provider = ({ children }: { children: ReactNode }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    return (
      <overlayContext.Provider
        value={{
          toast: (message: string) => {
            setToastMessage(message);
          },
        }}>
        {children}
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={Boolean(toastMessage)}
          autoHideDuration={2500}
          onClose={() => setToastMessage(null)}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{toastMessage}</span>}
        />
      </overlayContext.Provider>
    );
  };
