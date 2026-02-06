import { getAllArticles } from "@/lib/cms";
import ResearchHubClient from "./ResearchHubClient";

export const metadata = {
  title: "Research Academy | DeFi Sentinel",
  description: "In-depth analysis, tutorials, and insights from our research team",
};

export default function ResearchHubPage() {
  const articles = getAllArticles();

  return <ResearchHubClient initialArticles={articles} />;
}
