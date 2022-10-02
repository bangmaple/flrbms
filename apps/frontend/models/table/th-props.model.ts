import React, { CSSProperties } from "react";

export interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  style?: CSSProperties;
  onSort(): void;
};
