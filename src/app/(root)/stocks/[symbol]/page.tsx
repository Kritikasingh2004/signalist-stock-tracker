import TradingViewWidget from "@/components/TradingViewWidget";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/contants";
import WatchListBtn from "@/components/WatchListBtn";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            scriptUrl={`${scriptUrl}symbol-info.js`}
            height={170}
          />

          <TradingViewWidget
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            config={BASELINE_WIDGET_CONFIG(symbol)}
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchListBtn
              symbol={symbol.toUpperCase()}
              company={symbol.toUpperCase()}
              isInWatchlist={false}
            />
          </div>
          <TradingViewWidget
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            scriptUrl={`${scriptUrl}financials.js`}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
