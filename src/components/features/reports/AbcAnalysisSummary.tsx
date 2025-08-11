// src/components/features/reports/AbcAnalysisSummary.tsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LuCrown, LuStar, LuArchive } from "react-icons/lu";
import { type AbcAnalysisRow } from "../../../api/types/domain";

interface AbcAnalysisSummaryProps {
  data: AbcAnalysisRow[];
  isLoading: boolean;
}

const SummaryBox: React.FC<{
  icon: React.ElementType;
  title: string;
  count: number;
  description: string;
  colorClass: string;
}> = ({ icon: Icon, title, count, description, colorClass }) => (
  <div className="flex-1 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-start gap-4">
    <Icon className={`h-8 w-8 flex-shrink-0 ${colorClass}`} />
    <div>
      <h4 className="font-semibold text-text-primary dark:text-gray-200">
        {title}
      </h4>
      <p className="text-sm font-bold text-text-primary dark:text-gray-200">
        {count}
      </p>
      <p className="text-xs text-text-secondary mt-1">{description}</p>
    </div>
  </div>
);

const AbcAnalysisSummary: React.FC<AbcAnalysisSummaryProps> = ({
  data,
  isLoading,
}) => {
  const { t } = useTranslation();

  const classCounts = useMemo(() => {
    if (isLoading || !data) return { A: 0, B: 0, C: 0 };
    return data.reduce(
      (acc, row) => {
        acc[row.abcClass]++;
        return acc;
      },
      { A: 0, B: 0, C: 0 }
    );
  }, [data, isLoading]);

  if (isLoading) return null;

  const summaryItems = [
    {
      icon: LuCrown,
      title: t(
        "reports.abc.summary.classA_title",
        "Classe A: Seus Produtos Vitais"
      ),
      count: classCounts.A,
      description: t(
        "reports.abc.summary.classA_desc",
        "Poucos itens, mas são os que geram a maior parte da sua receita (80%). Monitore o estoque deles de perto!"
      ),
      colorClass: "text-emerald-500",
    },
    {
      icon: LuStar,
      title: t(
        "reports.abc.summary.classB_title",
        "Classe B: Seus Produtos Importantes"
      ),
      count: classCounts.B,
      description: t(
        "reports.abc.summary.classB_desc",
        "Relevância intermediária para a receita (15%). Boas oportunidades de promoção para se tornarem Classe A."
      ),
      colorClass: "text-sky-500",
    },
    {
      icon: LuArchive,
      title: t("reports.abc.summary.classC_title", "Classe C: A Longa Cauda"),
      count: classCounts.C,
      description: t(
        "reports.abc.summary.classC_desc",
        "Muitos produtos que vendem pouco individualmente (5% da receita). Revise-os: são novos, de nicho, ou apenas ocupam espaço?"
      ),
      colorClass: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
      {summaryItems.map((item) => (
        <SummaryBox key={item.title} {...item} />
      ))}
    </div>
  );
};

export default AbcAnalysisSummary;
