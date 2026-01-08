import { useState } from "react";
import { Calculator, TrendingUp, Info } from "lucide-react";

export default function TaxCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [taxBreakdown, setTaxBreakdown] = useState(null);

  // Nigeria 2025 Tax Rates and Reliefs
  const calculateTax = () => {
    const monthly = parseFloat(monthlyIncome);
    if (isNaN(monthly) || monthly <= 0) {
      alert("Please enter a valid monthly income");
      return;
    }

    const annualIncome = monthly * 12;
    const exemptionLimit = 800000; // ₦800,000 annual exemption

    // If income is below exemption limit, no tax
    if (annualIncome <= exemptionLimit) {
      setTaxBreakdown({
        monthlyIncome: monthly,
        annualIncome: annualIncome,
        taxableIncome: 0,
        totalTax: 0,
        monthlyTax: 0,
        netMonthlyIncome: monthly,
        netAnnualIncome: annualIncome,
        effectiveRate: 0,
        breakdown: [],
        reliefs: {
          rentRelief: 0,
          pensionDeduction: 0,
        },
      });
      return;
    }

    // Calculate reliefs
    const rentRelief = Math.min(monthly * 0.2, 500000 / 12); // 20% of rent, capped at ₦500k annually
    const pensionDeduction = monthly * 0.08; // 8% pension contribution (assumed)

    // Total deductions
    const monthlyDeductions = rentRelief + pensionDeduction;
    const annualDeductions = monthlyDeductions * 12;
    const taxableIncome = Math.max(
      annualIncome - exemptionLimit - annualDeductions,
      0
    );

    // Nigeria 2025 Tax Brackets (Progressive)
    const brackets = [
      { min: 0, max: 800000, rate: 0.0 }, // First ₦800k: 0%
      { min: 800001, max: 3000000, rate: 0.15 }, // Next ₦2.2M: 15%
      { min: 3000001, max: 12000000, rate: 0.18 }, // Next ₦9M: 18%
      { min: 12000001, max: 25000000, rate: 0.21 }, // Next ₦13M: 21%
      { min: 25000001, max: 50000000, rate: 0.23 }, // Next ₦25M: 23%
      { min: 50000001, max: Infinity, rate: 0.25 }, // Above ₦50M: 25%
    ];

    let totalTax = 0;
    let remainingIncome = taxableIncome;
    const breakdown = [];

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;

      const bracketSize = bracket.max - bracket.min;
      const taxableInBracket = Math.min(remainingIncome, bracketSize);
      const taxForBracket = taxableInBracket * bracket.rate;

      if (taxableInBracket > 0) {
        breakdown.push({
          range: `₦${bracket.min.toLocaleString()} - ₦${
            bracket.max === Infinity ? "∞" : bracket.max.toLocaleString()
          }`,
          rate: (bracket.rate * 100).toFixed(0) + "%",
          taxableAmount: taxableInBracket,
          tax: taxForBracket,
        });
        totalTax += taxForBracket;
      }

      remainingIncome -= taxableInBracket;
    }

    const monthlyTax = totalTax / 12;
    const netAnnualIncome = annualIncome - totalTax;
    const netMonthlyIncome = monthly - monthlyTax;
    const effectiveRate = (totalTax / annualIncome) * 100;

    setTaxBreakdown({
      monthlyIncome: monthly,
      annualIncome: annualIncome,
      taxableIncome: taxableIncome,
      totalTax: totalTax,
      monthlyTax: monthlyTax,
      netMonthlyIncome: netMonthlyIncome,
      netAnnualIncome: netAnnualIncome,
      effectiveRate: effectiveRate,
      breakdown: breakdown,
      reliefs: {
        rentRelief: rentRelief * 12,
        pensionDeduction: pensionDeduction * 12,
      },
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      calculateTax();
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-2xl mb-3 sm:mb-4">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-4">
            Nigeria Tax Calculator 2025
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Calculate your income tax based on the new 2025 tax reforms
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Income (₦)
            </label>
            <div className="relative">
              <p className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                (₦)
              </p>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your monthly income"
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateTax}
            className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Calculate Tax
          </button>
        </div>

        {/* Tax Exemption Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-blue-900">
            <p className="font-semibold mb-1">Tax-Free Threshold</p>
            <p>
              Annual income of ₦800,000 or less (₦66,667/month) is exempt from
              income tax under the 2025 reforms.
            </p>
          </div>
        </div>

        {/* Results */}
        {taxBreakdown && (
          <div className="space-y-4 sm:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Annual Tax
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {formatCurrency(taxBreakdown.totalTax)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(taxBreakdown.monthlyTax)}/month
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Net Income
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {formatCurrency(taxBreakdown.netAnnualIncome)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(taxBreakdown.netMonthlyIncome)}/month
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Effective Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {taxBreakdown.effectiveRate.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Of gross income</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Income Breakdown
              </h3>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                  <span className="text-gray-600">Gross Annual Income</span>
                  <span className="font-semibold">
                    {formatCurrency(taxBreakdown.annualIncome)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                  <span className="text-gray-600">Tax-Free Allowance</span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(800000)}
                  </span>
                </div>

                {taxBreakdown.reliefs.rentRelief > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">
                      Rent Relief (20%, max ₦500k)
                    </span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(taxBreakdown.reliefs.rentRelief)}
                    </span>
                  </div>
                )}

                {taxBreakdown.reliefs.pensionDeduction > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm sm:text-base">
                    <span className="text-gray-600">
                      Pension Contribution (8%)
                    </span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(taxBreakdown.reliefs.pensionDeduction)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b-2 border-gray-300 text-sm sm:text-base">
                  <span className="text-gray-900 font-semibold">
                    Taxable Income
                  </span>
                  <span className="font-bold">
                    {formatCurrency(taxBreakdown.taxableIncome)}
                  </span>
                </div>
              </div>

              {taxBreakdown.breakdown.length > 0 && (
                <>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6">
                    Tax Calculation by Bracket
                  </h3>
                  <div className="space-y-2">
                    {taxBreakdown.breakdown.map((bracket, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs sm:text-sm font-semibold text-gray-700">
                            {bracket.range}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-green-600">
                            {bracket.rate}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Taxable: {formatCurrency(bracket.taxableAmount)}
                          </span>
                          <span className="font-semibold text-red-600">
                            Tax: {formatCurrency(bracket.tax)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between py-3 sm:py-4 mt-3 sm:mt-4 border-t-2 border-gray-300">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      Total Annual Tax
                    </span>
                    <span className="text-base sm:text-lg font-bold text-red-600">
                      {formatCurrency(taxBreakdown.totalTax)}
                    </span>
                  </div>
                </>
              )}

              {taxBreakdown.totalTax === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-green-800 font-semibold text-sm sm:text-base">
                    🎉 You pay no income tax!
                  </p>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">
                    Your income is below the ₦800,000 exemption threshold.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
