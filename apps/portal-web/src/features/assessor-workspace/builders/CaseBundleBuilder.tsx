"use client";

import React from "react";
import { Icons } from "@seek/ui";

interface CaseBundleBuilderProps {
  parentId?: string | null;
}

/**
 * CaseBundleBuilder - Кэйс даалгаврын эх материал холбох логик ба мэдээлэл харуулах компонент.
 */
export function CaseBundleBuilder({
  parentId,
}: CaseBundleBuilderProps) {
  return (
    <div className="rounded-seek-lg border border-primary/20 bg-primary/5 p-seek-4 space-y-seek-3">
      <div className="flex items-center gap-seek-2">
        <Icons.CaseBundle className="h-5 w-5 text-primary stroke-[1.8]" />
        <span className="font-bold text-sm text-slate-800">Кэйс даалгаврын эх бичвэр ба дэд асуултууд</span>
      </div>
      <p className="text-xs text-slate-500">
        Энэхүү асуултын их бие (Stem) хэсэгт кэйс, өгөгдөл, нийтлэл эсвэл дагалдах материалыг оруулна. Үүний дараа асуултын сангаас бусад даалгавруудыг энэхүү эх кэйс рүү <code>parentId</code> холбоосоор холбон дэд асуулт болгож ашиглана.
      </p>
      {parentId && (
        <div className="inline-flex items-center gap-2 bg-white border border-border rounded-seek-md px-3 py-1.5 text-xs font-semibold text-slate-700">
          <span>Эх кэйсийн ID:</span>
          <code className="text-primary font-mono">{parentId}</code>
        </div>
      )}
    </div>
  );
}
