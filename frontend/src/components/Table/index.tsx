import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TableProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standardized Table component for the WeGoViral design system.
 * Optimized for luxury spacing, readability, and consistent row styling.
 */
export const Table = ({ children, className }: TableProps) => {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border/50 bg-card", className)}>
      <table className="w-full text-start border-collapse">
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

const TableHeader = ({ children, className }: TableHeaderProps) => (
  <thead className={cn("bg-muted/30 border-b border-border/50", className)}>
    <tr>{children}</tr>
  </thead>
);

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

const TableHead = ({ children, className, align = "left" }: TableHeadProps) => {
  const alignMap = {
    left: "text-start",
    right: "text-end",
    center: "text-center",
  };

  return (
    <th 
      className={cn(
        "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground",
        alignMap[align],
        className
      )}
    >
      {children}
    </th>
  );
};

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

const TableBody = ({ children, className }: TableBodyProps) => (
  <tbody className={cn("divide-y divide-border/30", className)}>
    {children}
  </tbody>
);

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const TableRow = ({ children, className, onClick, hover = true }: TableRowProps) => (
  <tr 
    onClick={onClick}
    className={cn(
      "transition-colors duration-200",
      hover && "hover:bg-muted/10",
      onClick && "cursor-pointer",
      className
    )}
  >
    {children}
  </tr>
);

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

const TableCell = ({ children, className, align = "left" }: TableCellProps) => {
  const alignMap = {
    left: "text-start",
    right: "text-end",
    center: "text-center",
  };

  return (
    <td 
      className={cn(
        "px-8 py-5 text-sm",
        alignMap[align],
        className
      )}
    >
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
