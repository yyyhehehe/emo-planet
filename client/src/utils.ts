import React, { Dispatch, SetStateAction } from "react";

// TODO: rename
export function onChange(setState: Dispatch<SetStateAction<string>>)
  : React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  return (e) => setState(e.target.value);
}
