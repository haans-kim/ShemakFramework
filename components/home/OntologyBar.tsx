"use client";

import { motion } from "framer-motion";
import { Database } from "lucide-react";

const ontologies = [
  { name: "의식DB", count: "24.8M" },
  { name: "기능DB", count: "1.2K" },
  { name: "업무DB", count: "60K" },
  { name: "직무DB", count: "15K" },
  { name: "SkillDB", count: "100K" },
  { name: "평가DB", count: "6K" },
  { name: "역량DB", count: "8.5K" },
];

export function OntologyBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="mt-4"
    >
      <div className="bg-gray-200 rounded-xl border-2 border-gray-400 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-800">
              IG Foundation Ontologies
            </h3>
          </div>
          <span className="text-xs text-gray-400">
            InsightGroup 데이터 기반
          </span>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {ontologies.map((onto, i) => (
            <motion.div
              key={onto.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.1 + i * 0.04 }}
              className="text-center p-2.5 rounded-lg bg-white border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="text-[11px] text-gray-500 mb-0.5">{onto.name}</div>
              <div className="text-sm font-bold text-gray-900">{onto.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
