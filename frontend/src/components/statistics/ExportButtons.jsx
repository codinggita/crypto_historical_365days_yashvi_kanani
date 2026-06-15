import React from 'react';
import { FiDownload, FiFileText, FiCode } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

function ExportButtons({ stats, distributions, monthly = [], yearly = [] }) {
  const exportToJSON = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        executiveSummary: {
          totalCoins: stats?.coinCount,
          totalMarketCap: stats?.totalMarketCap,
          averagePrice: stats?.averagePrice,
          averageVolume: stats?.averageVolume,
          highestMarketCapCoin: stats?.highestMarketCap,
          highestVolumeCoin: stats?.highestVolume,
          topGainer: stats?.topGainer,
          topLoser: stats?.topLoser,
        },
        distributions: {
          rank: distributions?.rank,
          price: distributions?.price,
          volatility: distributions?.volatility,
        },
        monthlyTrends: monthly,
        yearlyTrends: yearly,
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(payload, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', 'cryptoversex_market_statistics.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Statistics exported as JSON successfully!');
    } catch (error) {
      toast.error('Failed to export statistics as JSON');
    }
  };

  const exportToCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';

      // 1. Executive Summary Table
      csvContent += 'EXECUTIVE SUMMARY\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Coins,${stats?.coinCount || '—'}\n`;
      csvContent += `Total Market Cap,${stats?.totalMarketCap || '—'}\n`;
      csvContent += `Average Price,${stats?.averagePrice || '—'}\n`;
      csvContent += `Average Volume,${stats?.averageVolume || '—'}\n`;
      csvContent += `Highest Market Cap Asset,${stats?.highestMarketCap?.name || '—'}\n`;
      csvContent += `Highest Volume Asset,${stats?.highestVolume?.name || '—'}\n\n`;

      // 2. Monthly Trend Aggregates
      csvContent += 'MONTHLY MARKET TRENDS\n';
      csvContent += 'Period,Average Price,Total Volume,Data Points\n';
      if (monthly && monthly.length > 0) {
        monthly.forEach((m) => {
          csvContent += `"${m._id.year}-${m._id.month}",${m.averagePrice},${m.totalVolume},${m.count}\n`;
        });
      } else {
        csvContent += 'No data,,\n';
      }
      csvContent += '\n';

      // 3. Yearly Trend Aggregates
      csvContent += 'YEARLY MARKET TRENDS\n';
      csvContent += 'Year,Average Price,Total Volume,Data Points\n';
      if (yearly && yearly.length > 0) {
        yearly.forEach((y) => {
          csvContent += `"${y._id.year}",${y.averagePrice},${y.totalVolume},${y.count}\n`;
        });
      } else {
        csvContent += 'No data,,\n';
      }

      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodedUri);
      downloadAnchor.setAttribute('download', 'cryptoversex_market_statistics_report.csv');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Statistics report exported as CSV successfully!');
    } catch (error) {
      toast.error('Failed to export statistics report as CSV');
    }
  };

  return (
    <div className="statistics-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiDownload className="section-title-icon" />
          Export Reports
        </h2>
        <p className="statistics-section-subtitle">
          Download structured CSV spreadsheet reports or raw JSON datasets for offline analysis
        </p>
      </div>

      <div className="export-buttons-wrapper">
        <button className="export-action-btn csv-btn" onClick={exportToCSV}>
          <FiFileText size={18} />
          <span>Export Executive CSV Report</span>
        </button>
        <button className="export-action-btn json-btn" onClick={exportToJSON}>
          <FiCode size={18} />
          <span>Export Full JSON Dataset</span>
        </button>
      </div>
    </div>
  );
}

export default ExportButtons;
